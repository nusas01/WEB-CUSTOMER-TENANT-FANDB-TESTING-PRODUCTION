const handleDownloadQR = async (tableNumber = null, imageUrl = '') => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const image = new Image();
  image.crossOrigin = 'anonymous'; // penting jika gambar dari server luar
  image.src = `../image/${imageUrl}`; // Ganti sesuai path image kamu

  image.onload = () => {
    const width = 300;
    const padding = 20;
    const qrHeight = 300;
    const textLineHeight = 24;
    const usageText = "Scan QR ini untuk memesan dari meja ini.";

    const totalHeight = qrHeight + padding + textLineHeight * 2;

    canvas.width = width;
    canvas.height = totalHeight;

    // Putih sebagai latar belakang
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, totalHeight);

    // Gambar QR
    ctx.drawImage(image, (width - qrHeight) / 2, 0, qrHeight, qrHeight);

    // Teks nomor meja
    ctx.fillStyle = "#000000";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`Table ${tableNumber}`, width / 2, qrHeight + textLineHeight);

    // Teks tatacara penggunaan
    ctx.font = "14px Arial";
    ctx.fillText(usageText, width / 2, qrHeight + textLineHeight * 2);

    // Download sebagai PNG
    const link = document.createElement('a');
    link.download = `table-${tableNumber}-qr.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };
};

export default handleDownloadQR;
