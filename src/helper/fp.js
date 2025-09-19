import { fetchNonceCustomer, fetchNonceInternal } from "../actions/get";

// helper: convert string <-> ArrayBuffer
function strToBuf(str) {
  return new TextEncoder().encode(str);
}
function bufToBase64(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

// derive key dari nonce (misal pakai sha256 biar 32 byte)
async function deriveKeyFromNonce(nonce) {
  const keyMaterial = await crypto.subtle.digest("SHA-256", strToBuf(nonce));
  return crypto.subtle.importKey(
    "raw",
    keyMaterial,
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );
}

async function encryptWithNonce(nonce, plaintextObj) {
  const key = await deriveKeyFromNonce(nonce);

  // AES-GCM butuh IV (acak)
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const plaintext = JSON.stringify(plaintextObj);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    strToBuf(plaintext)
  );

  return {
    iv: bufToBase64(iv),
    value: bufToBase64(ciphertext),
  };
}


async function getCanvasFingerprintEncrypted(nonce) {
  const canvas = document.createElement("canvas");
  canvas.width = 200;
  canvas.height = 50;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#f0f0f0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = "16px Arial";
  ctx.fillStyle = "#000000";
  const text = "fp";
  ctx.fillText(text, 2, 2);

  const textMetrics = ctx.measureText(text);
  const textWidth = textMetrics.width;

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const pixelSample = [];
  const sampleCoords = [
    [10, 10],
    [50, 25],
    [100, 20],
    [150, 30],
    [190, 45],
  ];
  for (const [x, y] of sampleCoords) {
    const idx = (y * canvas.width + x) * 4;
    pixelSample.push(imgData[idx], imgData[idx + 1], imgData[idx + 2], imgData[idx + 3]);
  }

  const fingerprintData = {
    width: canvas.width,
    height: canvas.height,
    textWidth,
    pixelSample,
  };

  // 🔐 Encrypt fingerprintData pakai nonce
  return await encryptWithNonce(nonce, fingerprintData);
}

export async function customerCollectFingerprintAsync() {
  const { data, error } = await fetchNonceCustomer();
  if (!data || error) throw new Error(error || "failed to fetch nonce");

  const nonce = data.nonce;

  // fingerprint dienkripsi pakai nonce
  const encryptedFp = await getCanvasFingerprintEncrypted(nonce);

  return { nonce, ...encryptedFp }; 
}

export async function internalCollectFingerprintAsync() {
  const { data, error } = await fetchNonceInternal();
  if (!data || error) throw new Error(error || "failed to fetch nonce");

  const nonce = data.nonce;

  // fingerprint dienkripsi pakai nonce
  const encryptedFp = await getCanvasFingerprintEncrypted(nonce);

  return { nonce, ...encryptedFp }; 
}
