import { useState, useEffect } from "react";

export const UseResponsiveClass = () => {
    const [containerClass, setContainerClass] = useState('container-main-cart');
    
      // Effect untuk mendeteksi perubahan ukuran layar
      useEffect(() => {
        const handleResize = () => {
          if (window.innerWidth < 600) {
            setContainerClass('container-main-cart-mobile');
          } else {
            setContainerClass('container-main-cart');
          }
        };
    
        // Jalankan pada saat komponen pertama kali di-render
        handleResize();
    
        // Tambahkan event listener untuk resize
        window.addEventListener('resize', handleResize);
    
        // Bersihkan event listener saat komponen di-unmount
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);

      return containerClass
}