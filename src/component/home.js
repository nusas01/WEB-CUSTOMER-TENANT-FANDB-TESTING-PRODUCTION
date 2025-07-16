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
import { fetchProductsCustomer } from "../actions/get"
import { setOrderTypeContext } from "../reducers/reducers"
import {SpinnerFixed} from "../helper/spinner"
import {OrderTypeInvalidAlert} from "./alert"

function Home() {
  const dispatch = useDispatch()
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
  const navigate = useNavigate()
  const lastActiveCategoryRef = useRef(null);
  const [headerOffset, setHeaderOffset] = useState(140);

  // get data  products
  const { datas, loading, error, errorStatusCode } = useSelector((state) => state.persisted.productsCustomer)
  useEffect(() => {
    setSpinner(loading)
  }, [loading])
  console.log(datas)
  console.log("ioiiiofioeuou: ", error)

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
          {datas.map((item, index) => (
            <div
              id={item.category}
              className="mb-12"
              key={item.category}
              ref={(el) => (categoryRefs.current[item.category_name] = el)}
            >
              {/* Category Title */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 text-center md:text-left">
                  {item.category_name}
                </h2>
                <div className="w-16 h-1 bg-emerald-500 mt-2 mx-auto md:mx-0 rounded-full"></div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6 pb-10">
                {item.products.map((product, index) => {
                  const isAvailable = product.available;

                  return (
                    <div
                      className={`group bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 relative ${
                        isAvailable
                          ? 'hover:shadow-xl cursor-pointer transform hover:-translate-y-1'
                          : 'cursor-not-allowed opacity-75'
                      }`}
                      key={index}
                      onClick={() => {
                        if (isAvailable) {
                          handleShowModal(true, {
                            id: product.product_id,
                            name: product.name,
                            harga: product.price,
                            image: product.image,
                            description: product.description
                          });
                        }
                      }}
                    >
                      {/* UNAVAILABLE OVERLAY */}
                      {!isAvailable && (
                        <div className="absolute inset-0 bg-white/85 backdrop-blur-sm z-20 flex items-center justify-center">
                          <div className="text-center p-2">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                              <svg className="w-4 h-4 md:w-5 md:h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </div>
                            <p className="text-xs md:text-sm font-medium text-gray-700">Tidak Tersedia</p>
                            <p className="text-xs text-gray-500 mt-1">Sementara habis</p>
                          </div>
                        </div>
                      )}

                      {/* IMAGE SECTION */}
                      <div className="relative h-32 md:h-40 lg:h-48 w-full overflow-hidden">
                        <img
                          className={`w-full h-full object-cover transition-transform duration-300 ${
                            isAvailable
                              ? 'group-hover:scale-105'
                              : 'grayscale brightness-75'
                          }`}
                          src={`/image/${product.image}`}
                          alt={product.name}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>

                      {/* CONTENT SECTION */}
                      <div className="p-3 md:p-4 space-y-2 md:space-y-3">
                        <h3 className={`text-sm md:text-base lg:text-lg font-semibold line-clamp-2 leading-tight ${
                          isAvailable ? 'text-gray-800' : 'text-gray-500'
                        }`}>
                          {product.name}
                        </h3>
                        <p className={`text-xs md:text-sm line-clamp-2 leading-relaxed ${
                          isAvailable ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {product.description}
                        </p>

                        {/* PRICE AND ACTION SECTION */}
                        <div className="flex justify-between items-center pt-2">
                          <p className={`text-sm md:text-base lg:text-lg font-bold ${
                            isAvailable ? 'text-gray-900' : 'text-gray-400'
                          }`}>
                            Rp {product.price.toLocaleString("id-ID")}
                          </p>

                          {isAvailable ? (
                            <button
                              className="p-2 bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors flex-shrink-0 ml-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShowModal(true, {
                                  id: product.product_id,
                                  name: product.name,
                                  harga: product.price,
                                  image: product.image,
                                  description: product.description
                                });
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-white" viewBox="0 0 16 16">
                                <path fill="currentColor" d="M10.5 3.5a2.5 2.5 0 1 0-5 0V4h5zm1 0V4H15v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4h3.5v-.5a3.5 3.5 0 1 1 7 0M8.5 8a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V12a.5.5 0 0 0 1 0v-1.5H10a.5.5 0 0 0 0-1H8.5z"/>
                              </svg>
                            </button>
                          ) : (
                            <div className="p-2 bg-gray-300 rounded-lg flex-shrink-0 ml-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-gray-500" viewBox="0 0 16 16">
                                <path fill="currentColor" d="M10.5 3.5a2.5 2.5 0 1 0-5 0V4h5zm1 0V4H15v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4h3.5v-.5a3.5 3.5 0 1 1 7 0M8.5 8a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V12a.5.5 0 0 0 1 0v-1.5H10a.5.5 0 0 0 0-1H8.5z"/>
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
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
            harga={productData.harga} 
            image={productData.image} 
            description={productData.description} 
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