const handleDownloadQR = async (
  tableNumber = null,
  takeAway = null,
  imageUrl = '',
  callbacks = {} // { onStart, onSuccess, onError, onFinally }
) => {
  const { onStart, onSuccess, onError, onFinally } = callbacks;

  if (onStart) onStart();

  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();

    image.crossOrigin = 'anonymous';
    image.src = `/image/${imageUrl}`;

    await new Promise((resolve, reject) => {
      image.onload = () => {
        try {
          const width = 400;
          const padding = 30;
          const qrSize = 280;
          const qrX = (width - qrSize) / 2;
          const qrY = padding + 60;

          const isTakeAway = Boolean(takeAway);
          const titleText = isTakeAway ? 'TAKE AWAY QR' : `MEJA ${tableNumber}`;
          
          // Hitung total tinggi canvas
          const totalHeight = 720;

          canvas.width = width;
          canvas.height = totalHeight;

          // === BACKGROUND GRADIENT ===
          const gradient = ctx.createLinearGradient(0, 0, 0, totalHeight);
          gradient.addColorStop(0, '#f8f9fa');
          gradient.addColorStop(1, '#e9ecef');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, width, totalHeight);

          // === HEADER SECTION ===
          ctx.fillStyle = '#1a1a1a';
          ctx.fillRect(0, 0, width, 100);
          
          // Title
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 26px Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(titleText, width / 2, 50);
          
          // Subtitle
          ctx.font = '14px Arial, sans-serif';
          ctx.fillStyle = '#e0e0e0';
          const subtitleText = isTakeAway 
            ? 'Scan untuk pesan Take Away' 
            : 'Scan untuk pesan dari meja ini';
          ctx.fillText(subtitleText, width / 2, 75);

          // === QR CODE CONTAINER WITH SHADOW ===
          // Shadow
          ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
          ctx.shadowBlur = 20;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 8;
          
          // White container
          ctx.fillStyle = '#ffffff';
          const containerPadding = 15;
          ctx.fillRect(
            qrX - containerPadding, 
            qrY - containerPadding, 
            qrSize + (containerPadding * 2), 
            qrSize + (containerPadding * 2)
          );
          
          // Reset shadow
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;

          // QR Code
          ctx.drawImage(image, qrX, qrY, qrSize, qrSize);

          // === SECURITY INFO SECTION ===
          let currentY = qrY + qrSize + 50;
          
          // Security Header
          ctx.fillStyle = '#1a1a1a';
          ctx.font = 'bold 18px Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('⚠️ INFORMASI PENTING', width / 2, currentY);
          currentY += 30;

          // Security box background
          const securityBoxY = currentY;
          const securityBoxHeight = 200;
          
          ctx.fillStyle = '#fff3cd';
          ctx.strokeStyle = '#ffc107';
          ctx.lineWidth = 2;
          const boxPadding = 20;
          ctx.fillRect(boxPadding, securityBoxY, width - (boxPadding * 2), securityBoxHeight);
          ctx.strokeRect(boxPadding, securityBoxY, width - (boxPadding * 2), securityBoxHeight);

          // Security info text
          ctx.fillStyle = '#1a1a1a';
          ctx.font = 'bold 14px Arial, sans-serif';
          ctx.textAlign = 'left';
          currentY += 25;
          
          ctx.fillText('Pastikan sebelum scan:', boxPadding + 15, currentY);
          currentY += 25;

          ctx.font = '13px Arial, sans-serif';
          const securityPoints = [
            '✓ Alamat URL harus:',
            `   https://${window.location.hostname}`,
            '',
            '✓ Browser menampilkan ikon gembok 🔒',
            '',
            '⚠️ Jika browser menampilkan peringatan',
            '   "Situs Tidak Aman" atau URL berbeda,',
            '   JANGAN LANJUTKAN dan segera',
            '   laporkan ke staff kami.'
          ];

          securityPoints.forEach((point, index) => {
            if (point.startsWith('   https://')) {
              ctx.fillStyle = '#0066cc';
              ctx.font = 'bold 12px monospace';
            } else if (point.startsWith('⚠️')) {
              ctx.fillStyle = '#d32f2f';
              ctx.font = 'bold 13px Arial, sans-serif';
            } else if (point.startsWith('   ')) {
              ctx.fillStyle = '#d32f2f';
              ctx.font = '12px Arial, sans-serif';
            } else {
              ctx.fillStyle = '#1a1a1a';
              ctx.font = '13px Arial, sans-serif';
            }
            ctx.fillText(point, boxPadding + 15, currentY);
            currentY += point === '' ? 8 : 20;
          });

          // === FOOTER ===
          currentY = totalHeight - 40;
          ctx.fillStyle = '#6c757d';
          ctx.font = '11px Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Keamanan dan kenyamanan Anda adalah prioritas kami', width / 2, currentY);
          ctx.fillText('Terima kasih telah berkunjung! 😊', width / 2, currentY + 18);

          // Download
          const filename = isTakeAway ? `qr-take-away.png` : `qr-meja-${tableNumber}.png`;

          const link = document.createElement('a');
          link.download = filename;
          link.href = canvas.toDataURL('image/png', 1.0);
          link.click();

          if (onSuccess) onSuccess(filename);

          resolve();
        } catch (error) {
          reject(error);
        }
      };

      image.onerror = () => {
        reject(new Error('Gagal memuat gambar QR'));
      };
    });
  } catch (error) {
    if (onError) onError(error.message);
  } finally {
    if (onFinally) onFinally();
  }
};

export default handleDownloadQR;
