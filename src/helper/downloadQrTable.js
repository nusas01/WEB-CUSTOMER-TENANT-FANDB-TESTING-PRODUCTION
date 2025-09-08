const handleDownloadQR = async (
  tableNumber = null,
  takeAway = null,
  imageUrl = '',
  callbacks = {} // { onStart, onSuccess, onError, onFinally }
) => {
  const { onStart, onSuccess, onError, onFinally } = callbacks;

  // Trigger loading start
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
          const width = 300;
          const padding = 20;
          const qrHeight = 300;
          const textLineHeight = 24;

          const isTakeAway = Boolean(takeAway);
          const titleText = isTakeAway ? 'Take Away QR' : `Table ${tableNumber}`;
          const usageText = isTakeAway 
            ? 'Scan QR ini untuk memesan take away.' 
            : 'Scan QR ini untuk memesan dari meja ini.';
          
          // Tambahan informasi domain
          const currentDomain = window.location.hostname;
          const domainText = `Pastikan alamat URL berada di: ${currentDomain}`;
          
          // Update total height untuk menampung text tambahan
          const totalHeight = qrHeight + padding + textLineHeight * 3;

          canvas.width = width;
          canvas.height = totalHeight;

          // Background putih
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, totalHeight);

          // Gambar QR di tengah
          ctx.drawImage(image, (width - qrHeight) / 2, 0, qrHeight, qrHeight);

          // Title text
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 18px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(titleText, width / 2, qrHeight + textLineHeight);

          // Usage text
          ctx.font = '14px Arial';
          ctx.fillText(usageText, width / 2, qrHeight + textLineHeight * 2);

          // Domain information text
          ctx.font = '12px Arial';
          ctx.fillStyle = '#666666';
          ctx.fillText(domainText, width / 2, qrHeight + textLineHeight * 3);

          const filename = isTakeAway ? `qr-take-away.png` : `table-${tableNumber}-qr.png`;

          const link = document.createElement('a');
          link.download = filename;
          link.href = canvas.toDataURL('image/png');
          link.click();

          // Trigger success callback
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
    console.error('Error downloading QR:', error);
    // Trigger error callback
    if (onError) onError(error.message);
  } finally {
    // Trigger finally callback
    if (onFinally) onFinally();
  }
};

export default handleDownloadQR;
