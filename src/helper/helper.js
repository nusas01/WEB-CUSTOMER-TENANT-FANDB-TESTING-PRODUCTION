import {Box, Database, RefreshCw} from 'lucide-react'
import React, { useEffect, useState, useRef, useCallback, useLayoutEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { useDispatch } from 'react-redux';
import { navbarInternalSlice } from '../reducers/reducers'
import { useLocation } from 'react-router-dom';
import {
  Utensils,
  Pizza,
  Cookie,
  IceCream,
  Soup,
  Sandwich,
  Salad,
  Cake,
  Drumstick,
  Droplets,
  Wine,
  Beer,
  Martini,
  Milk,
  Coffee,
  CircleHelp,
  CupSoda,
  GlassWater,
  ChefHat,
} from 'lucide-react'

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

export const EmptyState = ({ title, description, onRetry }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
      <Database className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-500 max-w-md mb-6">{description}</p>

    {onRetry && (
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
      >
        <RefreshCw className="w-4 h-4" />
        Coba Lagi
      </button>
    )}
  </div>
);

export const useInfiniteScroll = ({ 
  hasMore, 
  loading, 
  loadMore, 
  threshold = 0.1,
  rootMargin = '100px' 
}) => {
  const { ref, inView } = useInView({
    threshold,
    rootMargin,
  });

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMore();
    }
  }, [inView, hasMore, loading, loadMore]);

  return { ref, inView };
};

export const useFullscreen = (targetRef) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const enterFullScreen = useCallback(() => {
    const element = targetRef.current;
    if (element?.requestFullscreen) {
      element.requestFullscreen();
    } else if (element?.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element?.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element?.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }, [targetRef]);

  const exitFullScreen = useCallback(() => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }, []);

  const toggleFullScreen = useCallback(() => {
    if (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    ) {
      exitFullScreen();
    } else {
      enterFullScreen();
    }
  }, [enterFullScreen, exitFullScreen]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      const isFs =
        !!document.fullscreenElement ||
        !!document.webkitFullscreenElement ||
        !!document.mozFullScreenElement ||
        !!document.msFullscreenElement;
      setIsFullScreen(isFs);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
    document.addEventListener('mozfullscreenchange', handleFullScreenChange);
    document.addEventListener('MSFullscreenChange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullScreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullScreenChange);
    };
  }, []);

  return { isFullScreen, toggleFullScreen };
};

export function useElementHeight() {
  const elementRef = useRef(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    if (!elementRef.current) return;

    const updateHeight = () => {
      setHeight(elementRef.current.offsetHeight || 0);
    };

    updateHeight(); // Set awal

    const observer = new ResizeObserver(updateHeight);
    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, []);

  return { ref: elementRef, height };
}

export const useDeviceDetection = () => {
  const dispatch = useDispatch();
  const { setIsMobileDeviceType } = navbarInternalSlice.actions;

  useEffect(() => {
    let timeoutId;

    const detectDevice = () => {
      // Clear timeout sebelumnya
      clearTimeout(timeoutId);
      
      // Debounce untuk mengurangi dispatch saat resize
      timeoutId = setTimeout(() => {
        const width = window.innerWidth;
        dispatch(setIsMobileDeviceType(width < 1280));
      }, 100); // Delay 100ms
    };

    detectDevice(); // Deteksi saat pertama mount
    window.addEventListener('resize', detectDevice);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', detectDevice);
    };
  }, [dispatch, setIsMobileDeviceType]);
};

export const useOutsideClick = ({ref, callback, isActive = true}) => {
    useEffect(() => {
        if (!isActive) return;

        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        }

        function handleTouchOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        }

        // Delay untuk mencegah immediate trigger
        const timeoutId = setTimeout(() => {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleTouchOutside, { passive: true });
        }, 100);

        return () => {
            clearTimeout(timeoutId);
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleTouchOutside);
        };
    }, [ref, callback, isActive]);
}

export const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // atau behavior: "auto"
  }, [pathname]);

  return null;
}

export const getPhoneWithoutPrefix = (phoneNumber) => {
  if (!phoneNumber) return '';
  const phone = phoneNumber.toString();
  if (phone.startsWith('+62')) {
      return phone.substring(3);
  }
  return phone;
};

export function useSingleTab() {
  useEffect(() => {
    const bc = new BroadcastChannel("only_one_tab");

    let isMaster = false;

    // dengarkan pesan dari tab lain
    bc.onmessage = (e) => {
      if (e.data === "who_is_master") {
        // kalau ada tab baru nanya, jawab "saya master"
        if (isMaster) {
          bc.postMessage("master_here");
        }
      }

      if (e.data === "master_here") {
        // berarti tab lain sudah master → tab ini harus keluar
        alert("Aplikasi sudah dibuka di tab lain!");
        window.location.href = "/error"; // lebih aman daripada window.close()
      }
    };

    // saat tab ini dibuka, cek apakah sudah ada master
    bc.postMessage("who_is_master");

    // kasih delay sedikit untuk menunggu jawaban
    const timer = setTimeout(() => {
      // kalau tidak ada tab lain yang jawab → tab ini jadi master
      isMaster = true;
    }, 500);

    return () => {
      clearTimeout(timer);
      bc.close();
    };
  }, []);
}

export const getIconByCategory = (categoryName) => {
  if (!categoryName) return CircleHelp;
  
  const name = categoryName.toLowerCase();
  
  // Makanan
  if (name.includes('makanan') || name.includes('food')) return Utensils;
  if (name.includes('pizza')) return Pizza;
  if (name.includes('cemilan') || name.includes('snack')) return Cookie;
  if (name.includes('dessert') || name.includes('manis')) return IceCream;
  if (name.includes('soup') || name.includes('sop')) return Soup;
  if (name.includes('sandwich') || name.includes('burger')) return Sandwich;
  if (name.includes('salad') || name.includes('sayur')) return Salad;
  if (name.includes('cake') || name.includes('kue')) return Cake;
  if (name.includes('ayam') || name.includes('chicken')) return Drumstick;
  
  // Minuman
  if (name.includes('minuman') || name.includes('drink') || name.includes('beverage')) return Coffee;
  if (name.includes('kopi') || name.includes('coffee')) return Coffee;
  if (name.includes('teh') || name.includes('tea')) return Coffee;
  if (name.includes('jus') || name.includes('juice') || name.includes('segar')) return Droplets;
  if (name.includes('alkohol') || name.includes('alcohol') || name.includes('wine')) return Wine;
  if (name.includes('bir') || name.includes('beer')) return Beer;
  if (name.includes('cocktail') || name.includes('martini')) return Martini;
  if (name.includes('susu') || name.includes('milk')) return Milk;
  if (name.includes('soda') || name.includes('soft drink')) return CupSoda;
  if (name.includes('air') || name.includes('water')) return GlassWater;
  
  // Default fallback
  return ChefHat;
};