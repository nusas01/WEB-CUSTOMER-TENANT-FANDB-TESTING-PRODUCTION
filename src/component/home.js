import "../App.css"
import Navbar from "./navbar"
import { AddProductToCart } from "./add"
import { useState, useEffect, useRef } from "react"
import Cart from "./cart"
import { UseResponsiveClass } from "../helper/presentationalLayer"
import { useNavigate } from "react-router-dom"
import BottomNavbar from "./bottomNavbar"
import { useDispatch, useSelector } from "react-redux"
import {SpinnerFixed} from "../helper/spinner"
import {OrderTypeInvalidAlert} from "./alert"
import {X, ShoppingBag, Plus} from "lucide-react"

function Home() {
  const [spinner, setSpinner] = useState(false)
  const { orderTakeAway, tableId } = useSelector((state) => state.persisted.orderType)
  const [activeCategory, setActiveCategory] = useState()
  const [clickedCategory, setClickedCategory] = useState(null);
  const categoryRefs = useRef({});
  const clickedCategoryRef = useRef(clickedCategory);
  const [showModelAddProduct, setShowModelAddProduct] = useState(false);
  const [showModelCart, setShowModelCart] = useState(false);
  const [productData, setProductData] = useState(null);
  const containerClass = UseResponsiveClass()
  const lastActiveCategoryRef = useRef(null);
  const [headerOffset, setHeaderOffset] = useState(140);

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

  
  const handleShowModal = (show, product) => {
    setShowModelAddProduct(show);
    setProductData(product);
  };

  // Sync ref dengan state clickedCategory

  // Function untuk menghitung kategori aktif berdasarkan scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const category = Object.keys(categoryRefs.current).find(
              (key) => categoryRefs.current[key] === entry.target
            );
            
            // Mengupdate kategori aktif hanya jika tidak ada kategori yang di-klik manual
            if (category && clickedCategoryRef.current === null) {
              setActiveCategory(category);
              lastActiveCategoryRef.current = category;
            }
          }
        });
      },
      {
        rootMargin: "0px 0px -20% 0px", // Agar lebih responsif terhadap scroll
        threshold: 0.5, // Kategori dianggap aktif ketika setidaknya 10% terlihat
      }
    );

    // Mulai mengamati setiap kategori
    Object.values(categoryRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Fungsi untuk mengubah kategori saat klik
  const scrollToCategory = (category) => {
    setClickedCategory(category);
    setActiveCategory(category);
    clickedCategoryRef.current = category;

    requestAnimationFrame(() => {
      const element = categoryRefs.current[category];
      if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementPosition - headerOffset,
          behavior: "smooth",
        });

        // Reset setelah scroll selesai
        setTimeout(() => {
          clickedCategoryRef.current = null;
          setClickedCategory(null);
        }, 300);
      }
    });
  };

  // Menyesuaikan headerOffset saat ukuran layar berubah
  useEffect(() => {
    const updateHeaderOffset = () => {
      if (window.innerWidth <= 500) {
        setHeaderOffset(150); // Misalnya untuk perangkat mobile
      } else {
        setHeaderOffset(145); // Untuk perangkat dengan layar lebih besar
      }
    };

    // Panggil saat pertama kali dan pada saat ukuran layar berubah
    window.addEventListener("resize", updateHeaderOffset);
    updateHeaderOffset();

    return () => {
      window.removeEventListener("resize", updateHeaderOffset);
    };
  }, []);


  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsFixed(window.scrollY > 60);
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const [orderTypeInvalid, setOrderTypeInvalid] = useState(false)
  useEffect(() => {
      if (tableId === null && orderTakeAway === false) {
        setOrderTypeInvalid(true)
        return
    }
  }, [tableId, orderTakeAway])
  

  return (
    <div style={{position: 'relative'}}>
      <div className={containerClass === "container-main-cart" ? "fixed h-40 bg-white shadow-md" : "w-full z-10 bg-white relative"}>
        <Navbar
        className={containerClass === "container-main-cart" ? "fixed" : "relative"}
        onCart={() => setShowModelCart(true)}
        closeCart={() => setShowModelCart(false)}
        statusCart={showModelCart}
        />
        <div className={containerClass === "container-main-cart" ? "container-button-category" : `flex justify-center shadow-md ${isFixed && "container-button-category-mobile"}`}>
          {datas.map((item, index) => (
            <button
              key={item.category}
              className={`tab ${activeCategory === item.category_name ? "active" : ""}`}
              onClick={() => scrollToCategory(item.category_name)}
            >
              {item.category_name}
            </button>
          ))}
        </div>
      </div>

      {showModelCart && containerClass === "container-main-cart" && (
        <div class="container-cart">
          <Cart closeCart={() => setShowModelCart(false)}/>
        </div>
      )}

      { orderTypeInvalid && (
            <OrderTypeInvalidAlert onClose={() => setOrderTypeInvalid(false)}/>
        )}

      <div className="container-bg">
        <div className={containerClass === "container-main-cart" ? "container-home" : `container-home-mobile`} style={isFixed ? {marginTop: '50px'} : {}}>
          {datas.map((item, categoryIndex) => (
            <div
              id={item.category}
              className="mb-16"
              key={item.category}
              ref={(el) => (categoryRefs.current[item.category_name] = el)}
            >
              {/* Category Title */}
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center md:text-left mb-2">
                  {item.category_name}
                </h2>
                <div className="w-20 h-1.5 bg-gradient-to-r from-green-500 to-emerald-500 mt-3 mx-auto md:mx-0 rounded-full shadow-sm"></div>
                <p className="text-gray-600 text-sm md:text-base mt-2 text-center md:text-left">
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
                          src={`/image/${product.image}`}
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

                        {/* PRODUCT RATING/POPULARITY INDICATOR */}
                        {isAvailable && (
                          <div className="flex items-center justify-between pt-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <div className="flex items-center space-x-1">
                              {[...Array(3)].map((_, i) => (
                                <div key={i} className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" style={{animationDelay: `${i * 0.2}s`}}></div>
                              ))}
                              <span className="text-xs text-green-600 font-medium ml-2">Populer</span>
                            </div>
                            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              #{index + 1}
                            </div>
                          </div>
                        )}
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