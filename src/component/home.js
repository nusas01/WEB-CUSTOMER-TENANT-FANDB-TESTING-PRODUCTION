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
              className="container-category min-h-[72vh]"
              key={item.category}
              ref={(el) => (categoryRefs.current[item.category_name] = el)}
            >  
              <h2 className="title-category">{item.category}</h2>
              <div className="flex grid grid-cols-1 pb-10 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                  {item.products.map((item, index) => (
                    <div 
                      className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                      key={index}
                      onClick={() => handleShowModal(true, { id: item.product_id, name: item.name, harga: item.price, image: item.image, description: item.description })}
                    >
                      <div className="relative h-36 w-full overflow-hidden">
                        <img 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                          src={`/image/${item.image}`} 
                          alt={item.name}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                      
                      <div className="p-4 space-y-3">
                        <h3 className="text-md font-semibold text-gray-800 line-clamp-2">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {item.description}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <p className="text-md font-bold text-gray-900">
                            Rp {item.price.toLocaleString("id-ID")}
                          </p>
                          <button className="p-1 bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors">
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-6 w-6 text-white" 
                              viewBox="0 0 16 16"
                            >
                              <path fill="currentColor" d="M10.5 3.5a2.5 2.5 0 1 0-5 0V4h5zm1 0V4H15v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4h3.5v-.5a3.5 3.5 0 1 1 7 0M8.5 8a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V12a.5.5 0 0 0 1 0v-1.5H10a.5.5 0 0 0 0-1H8.5z"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
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