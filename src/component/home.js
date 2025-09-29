import "../App.css"
import Footer from "./footer"
import Navbar from "./navbar"
import { AddProductToCart } from "./add"
import { useState, useEffect, useRef } from "react"
import Cart from "./cart"
import { UseResponsiveClass } from "../helper/presentationalLayer"
import { data, useLocation, useNavigate } from "react-router-dom"
import BottomNavbar from "./bottomNavbar"
import { useDispatch, useSelector } from "react-redux"
import { setOrderTypeContext, setIsClose } from "../reducers/reducers"
import {SpinnerFixed} from "../helper/spinner"
import {OrderTypeInvalidAlert} from "./alert"
import {
  fetchGetDataCustomer
} from "../actions/get"
import {
  X, 
  ShoppingBag, 
  Plus,
  ChevronLeft, 
  ChevronRight,
} from "lucide-react"

function Home() {
  const dispatch = useDispatch()
  const [spinner, setSpinner] = useState(false)
  const { orderTakeAway, tableId, isClose } = useSelector((state) => state.persisted.orderType)
  const [activeCategory, setActiveCategory] = useState()
  const [clickedCategory, setClickedCategory] = useState(null);
  const categoryRefs = useRef({});
  const categoryScrollRef = useRef(null);
  const clickedCategoryRef = useRef(clickedCategory);
  const [showModelAddProduct, setShowModelAddProduct] = useState(false);
  const [showModelCart, setShowModelCart] = useState(false);
  const [productData, setProductData] = useState(null);
  const containerClass = UseResponsiveClass()
  const navigate = useNavigate()
  const lastActiveCategoryRef = useRef(null);
  const headerOffset = 100;

  const { loggedIn } = useSelector((state) => state.persisted.loginStatusCustomer);
  const {data} = useSelector((state) => state.persisted.dataCustomer)
    useEffect(() => {
        if ((!data || Object.keys(data).length === 0) && loggedIn) {
        dispatch(fetchGetDataCustomer())
    }
  }, [])

  // get data  products
  const { datas, loading, error, errorStatusCode } = useSelector((state) => state.persisted.productsCustomer)
  useEffect(() => {
    setSpinner(loading)
  }, [loading])

  useEffect(() => {
    if (datas.length > 0) {
      setActiveCategory(datas[0].category_name)
    }
  }, [datas, window.location.pathname])

  // get table id or order_tye_take_away = true from query
  const location = useLocation();
  if (orderTakeAway === null && tableId === null) {
    const q = new URLSearchParams(location.search);
    const orderTakeAways = q.get("order_type_take_away") === "true";
    const tableIds = q.get("table_id");

    dispatch(setOrderTypeContext({ orderTakeAway: orderTakeAways, tableId: tableIds }));
  }
  

  const handleShowModal = (show, product) => {
    setShowModelAddProduct(show);
    setProductData(product);
  };

  // Sync ref dengan state clickedCategory
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isManualClick, setIsManualClick] = useState(false);

  // Debounce function untuk menghindari update yang terlalu sering
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Function untuk mendeteksi kategori yang paling terlihat
  const getMostVisibleCategory = () => {
    let mostVisible = null;
    let maxVisibility = 0;

    Object.entries(categoryRefs.current).forEach(([categoryName, element]) => {
      if (element) {
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Hitung area yang terlihat
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(viewportHeight, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        
        // Hitung persentase visibility
        const elementHeight = rect.height;
        const visibilityPercentage = elementHeight > 0 ? visibleHeight / elementHeight : 0;
        
        // Prioritaskan elemen yang berada di area atas viewport
        const topBonus = rect.top < viewportHeight * 0.3 ? 0.2 : 0;
        const totalScore = visibilityPercentage + topBonus;
        
        if (totalScore > maxVisibility && visibilityPercentage > 0.1) {
          maxVisibility = totalScore;
          mostVisible = categoryName;
        }
      }
    });

    return mostVisible;
  };

  // Debounced scroll handler
  const handleScrollDebounced = debounce(() => {
    if (!isManualClick) {
      const visibleCategory = getMostVisibleCategory();
      if (visibleCategory && visibleCategory !== activeCategory) {
        setActiveCategory(visibleCategory);
        lastActiveCategoryRef.current = visibleCategory;
      }
    }
  }, 150);

  // Function untuk menghitung kategori aktif berdasarkan scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!isManualClick) {
        handleScrollDebounced();
      }
    };

    // Tambahkan event listener dengan passive: true untuk performa
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isManualClick, activeCategory]);

  // Alternative intersection observer dengan threshold yang lebih baik
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!isManualClick) {
          // Cari entry dengan intersection ratio tertinggi
          let mostVisible = null;
          let maxRatio = 0;

          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
              const category = Object.keys(categoryRefs.current).find(
                (key) => categoryRefs.current[key] === entry.target
              );
              
              if (category) {
                maxRatio = entry.intersectionRatio;
                mostVisible = category;
              }
            }
          });

          // Update kategori aktif hanya jika ada yang terlihat signifikan
          if (mostVisible && maxRatio > 0.3) {
            setActiveCategory(mostVisible);
            lastActiveCategoryRef.current = mostVisible;
          }
        }
      },
      {
        rootMargin: "-20% 0px -30% 0px", // Area trigger yang lebih fokus
        threshold: [0.1, 0.3, 0.5, 0.7], // Multiple threshold untuk deteksi yang lebih akurat
      }
    );

    // Mulai mengamati setiap kategori
    Object.values(categoryRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isManualClick]);

  const checkScrollArrows = () => {
    const container = categoryScrollRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollToActiveButton = (activeCategory) => {
    const container = categoryScrollRef.current;
    if (!container || !activeCategory || isScrolling) return;

    const activeButton = container.querySelector(`[data-category="${activeCategory}"]`);
    if (!activeButton) return;

    const containerRect = container.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();
    
    // Hitung posisi relatif button terhadap container
    const buttonLeft = buttonRect.left - containerRect.left + container.scrollLeft;
    const buttonRight = buttonLeft + buttonRect.width;
    const buttonCenter = buttonLeft + (buttonRect.width / 2);
    
    // Tentukan apakah button perlu di-scroll
    const visibleLeft = container.scrollLeft;
    const visibleRight = container.scrollLeft + container.clientWidth;
    const containerCenter = container.clientWidth / 2;
    
    let targetScrollLeft = container.scrollLeft;
    const margin = 60; // Margin yang lebih besar untuk memastikan button tidak di pojok
    
    // Jika button terpotong di kiri atau terlalu dekat dengan sisi kiri
    if (buttonLeft < visibleLeft + margin) {
      // Scroll sehingga button berada di tengah atau setidaknya tidak di pojok
      targetScrollLeft = Math.max(0, buttonCenter - containerCenter);
    }
    // Jika button terpotong di kanan atau terlalu dekat dengan sisi kanan
    else if (buttonRight > visibleRight - margin) {
      // Scroll sehingga button berada di tengah atau setidaknya tidak di pojok
      targetScrollLeft = Math.min(
        container.scrollWidth - container.clientWidth,
        buttonCenter - containerCenter
      );
    }
    // Jika button sudah terlihat tapi masih terlalu di pojok, center-kan
    else {
      const buttonLeftFromCenter = Math.abs(buttonCenter - (visibleLeft + containerCenter));
      // Jika jarak dari center terlalu jauh, center-kan button
      if (buttonLeftFromCenter > containerCenter * 0.7) {
        targetScrollLeft = Math.max(0, Math.min(
          container.scrollWidth - container.clientWidth,
          buttonCenter - containerCenter
        ));
      }
    }
    
    // Smooth scroll ke posisi target hanya jika perlu
    if (Math.abs(targetScrollLeft - container.scrollLeft) > 10) {
      setIsScrolling(true);
      container.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth'
      });
      
      // Reset flag setelah animasi selesai
      setTimeout(() => {
        setIsScrolling(false);
      }, 500);
    }
  };

  // Function untuk scroll manual dengan arrow
  const scrollCategory = (direction) => {
    const container = categoryScrollRef.current;
    if (!container) return;
    
    const scrollAmount = container.clientWidth * 0.7;
    const currentScroll = container.scrollLeft;
    const targetScroll = direction === 'left' 
      ? Math.max(0, currentScroll - scrollAmount)
      : Math.min(container.scrollWidth - container.clientWidth, currentScroll + scrollAmount);
    
    setIsScrolling(true);
    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
    
    setTimeout(() => {
      setIsScrolling(false);
    }, 500);
  };

  // Effect untuk auto-scroll ketika activeCategory berubah
  useEffect(() => {
    if (!isManualClick) {
      scrollToActiveButton(activeCategory);
    }
  }, [activeCategory, isManualClick]);

  // Effect untuk setup scroll listeners pada category container
  useEffect(() => {
    const container = categoryScrollRef.current;
    if (!container) return;

    // Initial check
    checkScrollArrows();
    
    // Setup scroll listener
    const handleScroll = () => {
      checkScrollArrows();
    };
    
    // Setup resize listener
    const handleResize = () => {
      setTimeout(checkScrollArrows, 100);
    };
    
    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Fungsi untuk mengubah kategori saat klik - DIPERBAIKI
  const scrollToCategory = (category) => {
    // Set flag manual click
    setIsManualClick(true);
    setClickedCategory(category);
    setActiveCategory(category);
    clickedCategoryRef.current = category;

    // Scroll ke kategori yang diklik
    requestAnimationFrame(() => {
      const element = categoryRefs.current[category];
      if (element) {
        // Cari elemen heading (h2) di dalam kategori section
        const categoryHeading = element.querySelector('h2');
        
        if (categoryHeading) {
          // Jika ada heading, scroll ke posisi heading
          const headingPosition = categoryHeading.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: headingPosition - headerOffset, // Tambah margin 20px untuk spacing
            behavior: "smooth",
          });
        } else {
          // Fallback ke posisi element jika tidak ada heading
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: elementPosition - headerOffset,
            behavior: "smooth",
          });
        }

        // Reset manual click flag setelah scroll selesai
        setTimeout(() => {
          setIsManualClick(false);
          clickedCategoryRef.current = null;
          setClickedCategory(null);
        }, 1000); // Diperpanjang untuk memastikan scroll selesai
      }
    });
  };

  const [orderTypeInvalid, setOrderTypeInvalid] = useState(false)
  useEffect(() => {
      if (tableId === null && orderTakeAway === false && !isClose) {
        setOrderTypeInvalid(true)
        return
    }
  }, [tableId, orderTakeAway, isClose])


  return (
    <div style={{position: 'relative'}}>
      <div className={"w-full z-10 bg-white relative"}>        
        {/* Modern Category Button Container */}
        <div className={`relative mx-auto ${"container-button-category-mobile"}`}>
          {/* Left Arrow */}
          <div className={`absolute left-0 top-0 bottom-0 z-20 flex items-center transition-all duration-300 ${
            showLeftArrow ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}>
            <div className="bg-gradient-to-r from-white via-white to-transparent pl-2 pr-6 h-full flex items-center">
              <button
                onClick={() => scrollCategory('left')}
                className="group p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 hover:shadow-xl hover:bg-white transition-all duration-200 hover:scale-105 active:scale-95"
                aria-label="Scroll ke kiri"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600 group-hover:text-gray-800 transition-colors" />
              </button>
            </div>
          </div>

          {/* Right Arrow */}
          <div className={`absolute right-0 top-0 bottom-0 z-20 flex items-center transition-all duration-300 ${
            showRightArrow ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}>
            <div className="bg-gradient-to-l from-white via-white to-transparent pr-2 pl-6 h-full flex items-center">
              <button
                onClick={() => scrollCategory('right')}
                className="group p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 hover:shadow-xl hover:bg-white transition-all duration-200 hover:scale-105 active:scale-95"
                aria-label="Scroll ke kanan"
              >
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-800 transition-colors" />
              </button>
            </div>
          </div>

          {/* Scrollable Button Container */}
          <div 
            ref={categoryScrollRef}
            className="overflow-x-auto no-scrollbar scroll-smooth"
            style={{ 
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitScrollbar: { display: 'none' }
            }}
          >
            <div className="inline-flex px-4 gap-3 py-3 min-w-full">
              {/* Left Padding Spacer */}
              <div className={`flex-shrink-0 transition-all duration-300 ${showLeftArrow ? 'w-8' : 'w-0'}`} />
              
              {datas.map((item, index) => (
                <button
                  key={item.category}
                  data-category={item.category_name}
                  className={`group relative flex-shrink-0 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    activeCategory === item.category_name
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-600'
                      : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-green-300 hover:text-green-600 hover:shadow-md hover:bg-green-50'
                  }`}
                  onClick={() => scrollToCategory(item.category_name)}
                >
                  {/* Background Animation */}
                  <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                    activeCategory === item.category_name
                      ? 'bg-white/20 scale-100'
                      : 'bg-green-500/0 scale-95 group-hover:bg-green-500/10 group-hover:scale-100'
                  }`} />
                  
                  {/* Text */}
                  <span className="relative z-10 whitespace-nowrap">
                    {item.category_name}
                  </span>
                  
                  {/* Active Indicator */}
                  {activeCategory === item.category_name && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-white rounded-full shadow-sm" />
                  )}
                  
                  {/* Hover Glow Effect */}
                  <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                    activeCategory === item.category_name
                      ? 'shadow-lg shadow-green-500/25'
                      : 'shadow-none group-hover:shadow-md group-hover:shadow-green-500/20'
                  }`} />
                </button>
              ))}
              
              {/* Right Padding Spacer */}
              <div className={`flex-shrink-0 transition-all duration-300 ${showRightArrow ? 'w-8' : 'w-0'}`} />
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300 rounded-full"
              style={{
                width: `${((categoryScrollRef.current?.scrollLeft || 0) / 
                  Math.max(1, (categoryScrollRef.current?.scrollWidth || 1) - (categoryScrollRef.current?.clientWidth || 0))) * 100}%`
              }}
            />
          </div>
        </div>
      </div>

      {showModelCart && containerClass === "container-main-cart" && (
        <div class="container-cart">
          <Cart closeCart={() => setShowModelCart(false)}/>
        </div>
      )}

      { orderTypeInvalid && (
            <OrderTypeInvalidAlert onClose={() => { 
              setOrderTypeInvalid(false)
              dispatch(setIsClose(true))
            }}/>
        )}

      <div className="container-bg">
        <div className={containerClass === "container-main-cart" ? "container-home" : `container-home-mobile`}>
          {datas.map((item, categoryIndex) => (
            <div
              id={item.category}
              className="mb-[30px]"
              key={item.category}
              ref={(el) => (categoryRefs.current[item.category_name] = el)}
            >

              {/* Category Title */}
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center md:text-left">
                  {item.category_name}
                </h2>
                <p className="text-gray-600 text-sm md:text-base text-center md:text-left">
                  Pilihan terbaik untuk kategori {item.category_name.toLowerCase()}
                </p>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
                {item.products.map((product, index) => {
                  const isAvailable = product.available;

                  return (
                    <div
                      className={`group bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 relative ${
                        isAvailable
                          ? 'hover:shadow-2xl hover:border-green-200 cursor-pointer transform hover:-translate-y-2 hover:scale-[1.0]'
                          : 'cursor-not-allowed opacity-80'
                      }`}
                      key={index}
                      onClick={() => {
                        if (isAvailable) {
                          handleShowModal(true, {
                            id: product.product_id,
                            name: product.name,
                            harga: product.price,
                            image: product.image,
                            desc: product.desc
                          });
                        }
                      }}
                    >
                      {/* UNAVAILABLE OVERLAY */}
                      {!isAvailable && (
                        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex items-center justify-center">
                          <div className="text-center p-3">
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                              <X className="w-6 h-6 md:w-7 md:h-7 text-red-500" />
                            </div>
                            <p className="text-sm md:text-base font-semibold text-gray-800 mb-1">Tidak Tersedia</p>
                            <p className="text-xs md:text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                              Sementara habis
                            </p>
                          </div>
                        </div>
                      )}

                      {/* AVAILABILITY BADGE */}
                      {isAvailable && (
                        <div className="absolute top-3 left-3 z-10">
                          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                            Tersedia
                          </div>
                        </div>
                      )}

                      {/* CATEGORY BADGE */}
                      <div className="absolute top-3 right-3 z-10">
                        <div className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded-full shadow-sm border border-gray-200">
                          {item.category_name}
                        </div>
                      </div>

                      {/* IMAGE SECTION */}
                      <div className="relative h-36 md:h-44 lg:h-52 w-full overflow-hidden">
                        <img
                          className={`w-full h-full object-cover transition-all duration-500 ${
                            isAvailable
                              ? 'group-hover:scale-110'
                              : 'grayscale brightness-75 contrast-75'
                          }`}
                          src={`https://nusas-bucket.oss-ap-southeast-5.aliyuncs.com/${product.image}`}
                          alt={product.name}
                        />
                        <div className={`absolute inset-0 transition-all duration-300 ${
                          isAvailable 
                            ? 'bg-gradient-to-t from-black/30 via-transparent to-transparent group-hover:from-black/40' 
                            : 'bg-gradient-to-t from-black/50 to-black/20'
                        }`} />
                        
                        {/* Quick Add Button Overlay */}
                        {isAvailable && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <button
                              className="bg-white/90 backdrop-blur-sm text-green-600 p-3 rounded-full shadow-xl transform scale-75 group-hover:scale-100 transition-all duration-200 hover:bg-white hover:shadow-2xl"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShowModal(true, {
                                  id: product.product_id,
                                  name: product.name,
                                  harga: product.price,
                                  image: product.image,
                                  desc: product.desc
                                });
                              }}
                            >
                              <ShoppingBag className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* CONTENT SECTION */}
                      <div className="p-4 md:p-5 space-y-3">
                        <div className="space-y-2">
                          <h3 className={`text-base md:text-lg font-bold line-clamp-2 leading-tight transition-colors ${
                            isAvailable ? 'text-gray-800 group-hover:text-green-700' : 'text-gray-500'
                          }`}>
                            {product.name}
                          </h3>
                          <p className={`text-sm line-clamp-2 leading-relaxed ${
                            isAvailable ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                            {product.desc || 'Deskripsi tidak tersedia'}
                          </p>
                        </div>

                        {/* PRICE AND ACTION SECTION */}
                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500 mb-1">Harga</span>
                            <p className={`text-lg md:text-xl font-bold transition-colors ${
                              isAvailable ? 'text-gray-800' : 'text-gray-400'
                            }`}>
                              Rp {product.price.toLocaleString("id-ID")}
                            </p>
                          </div>

                          {isAvailable ? (
                            <button
                              className="group/btn relative p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShowModal(true, {
                                  id: product.product_id,
                                  name: product.name,
                                  harga: product.price,
                                  image: product.image,
                                  desc: product.desc
                                });
                              }}
                            >
                              <Plus className="h-5 w-5 md:h-6 md:w-6 text-white transition-transform group-hover/btn:rotate-90" />
                              
                              {/* Ripple effect */}
                              <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover/btn:opacity-20 group-active/btn:opacity-30 transition-opacity"></div>
                            </button>
                          ) : (
                            <div className="p-3 bg-gradient-to-r from-gray-300 to-gray-400 rounded-xl shadow-inner">
                              <Plus className="h-5 w-5 md:h-6 md:w-6 text-gray-500" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Category Statistics */}
              <div className="mt-6 flex justify-center md:justify-start">
                <div className="flex items-center space-x-6 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-full">
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{item.products.filter(p => p.available).length} Tersedia</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>{item.products.filter(p => !p.available).length} Habis</span>
                  </span>
                  <span className="text-gray-500">Total: {item.products.length} item</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      
      {showModelAddProduct && (
          <AddProductToCart 
            onClose={() => setShowModelAddProduct(false)} 
            id={productData.id}
            name={productData.name} 
            desc={productData.desc}
            harga={productData.harga} 
            image={productData.image} 
            type={"CUSTOMER"}
          />
        )}

       { containerClass === "container-main-cart-mobile" && (
        <BottomNavbar/>
       )}      

       { spinner && (
        <SpinnerFixed colors={'fill-green-500'}/>
       )}
      
    </div>
  );
}


export default Home;