import "../App.css"
import Footer from "./footer";
import Navbar from "./navbar"
import { AddProductToCart } from "./add";
import { useState, useEffect, useRef } from "react"
import Cart from "./cart";
import { UseResponsiveClass } from "../helper/presentationalLayer";
import { data, useLocation, useNavigate } from "react-router-dom";
import BottomNavbar from "./bottomNavbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsCustomer } from "../actions/get";
import { setOrderTypeContext } from "../reducers/reducers";
import Spinner from "../helper/spinner";

function Home() {
  const dispatch = useDispatch()
  // const [products, setProducts] = useState([
  //   {
  //     category: 'Makanan',
  //     items: [
  //       {
  //         name: 'Sate Ayam merah maranggi',
  //         harga: 45000,
  //         image: 'sate-ayam.png',
  //         description: 'Sate ayam dengan bumbu kacang.'
  //       },
  //       {
  //         name: 'Nasi Goreng',
  //         harga: 30000,
  //         image: 'nasi-goreng.png',
  //         description: 'Nasi goreng spesial dengan telur dan ayam.'
  //       },
  //       {
  //         name: 'Mie Goreng',
  //         harga: 25000,
  //         image: 'mie-goreng.png',
  //         description: 'Mie goreng dengan sayuran segar dan bumbu rempah.'
  //       },
  //       {
  //         name: 'Mie Aceh',
  //         harga: 25000,
  //         image: 'mie-goreng.png',
  //         description: 'Mie goreng dengan sayuran segar dan bumbu rempah.'
  //       },
  //       {
  //         name: 'Nasi Padang',
  //         harga: 25000,
  //         image: 'mie-goreng.png',
  //         description: 'Mie goreng dengan sayuran segar dan bumbu rempah.'
  //       },
  //       {
  //         name: 'Nasi Padang',
  //         harga: 25000,
  //         image: 'mie-goreng.png',
  //         description: 'Mie goreng dengan sayuran segar dan bumbu rempah.'
  //       }
  //     ]
  //   },
  //   {
  //     category: 'Minuman',
  //     items: [
  //       {
  //         name: 'Es Teh Manis',
  //         harga: 5000,
  //         image: 'es-teh-manis.png',
  //         description: 'Es teh manis dingin yang segar.'
  //       },
  //       {
  //         name: 'Kopi Susu',
  //         harga: 12000,
  //         image: 'kopi-susu.png',
  //         description: 'Kopi susu hangat yang nikmat.'
  //       },
  //       {
  //         name: 'Jus Jeruk',
  //         harga: 8000,
  //         image: 'jus-jeruk.png',
  //         description: 'Jus jeruk segar dengan rasa alami.'
  //       }
  //     ]
  //   },
  //   {
  //     category: 'Tambahan',
  //     items: [
  //       {
  //         name: 'Kerupuk',
  //         harga: 3000,
  //         image: 'kerupuk.png',
  //         description: 'Kerupuk renyah pendamping makan.'
  //       },
  //       {
  //         name: 'Sambal',
  //         harga: 2000,
  //         image: 'sambal.png',
  //         description: 'Sambal pedas dengan rasa khas.'
  //       },
  //       {
  //         name: 'Pencok',
  //         harga: 4000,
  //         image: 'pencok.png',
  //         description: 'Pencok, sambal kacang dengan tempe goreng.'
  //       }
  //     ]
  //   }
  // ]); 
  const [spinner, setSpinner] = useState(false)
  const { orderTakeAway, tableId } = useSelector((state) => state.persisted.orderType)

  console.log(orderTakeAway)
  console.log(tableId)


  // get data  products
  const { datas, loading, error, errorStatusCode } = useSelector((state) => state.persisted.productsCustomer)

  // get table id or order_tye_take_away = true from query
  const location = useLocation();
    if (orderTakeAway === null && tableId === null) {
      const q = new URLSearchParams(location.search);
      const orderTakeAways = q.get("order_type_take_away") === "true";
      const tableIds = q.get("table_id");
  
      console.log("🚀 Order Type:", orderTakeAways);
      console.log("🪑 Table ID:", tableIds);
  
      dispatch(setOrderTypeContext({ orderTakeAway: orderTakeAways, tableId: tableIds }));
    }

  const [activeCategory, setActiveCategory] = useState("Makanan");
  const [clickedCategory, setClickedCategory] = useState(null);
  const categoryRefs = useRef({});
  const clickedCategoryRef = useRef(clickedCategory);
  const [showModelAddProduct, setShowModelAddProduct] = useState(false);
  const [showModelCart, setShowModelCart] = useState(false);
  const [productData, setProductData] = useState(null);
  const containerClass = UseResponsiveClass()
  const navigate = useNavigate()
  console.log(datas)
  const lastActiveCategoryRef = useRef(null);
  const [headerOffset, setHeaderOffset] = useState(140);

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
          {datas.map((item) => (
            <button
              key={item.category}
              className={`tab ${activeCategory === item.category ? "active" : ""}`}
              onClick={() => scrollToCategory(item.category)}
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

      <div className="container-bg">
        <div className={containerClass === "container-main-cart" ? "container-home" : `container-home-mobile`} style={isFixed ? {marginTop: '50px'} : {}}>
          {datas.map((item, index) => (
            <div 
              id={item.category}
              className="container-category"
              key={item.category}
              ref={(el) => (categoryRefs.current[item.category_name] = el)}
            >  
              <h2 className="title-category">{item.category}</h2>
              <div className="product-grid">
                {item.products.map((item, index) => (
                  <div className="product-card shadow-md bg-white" key={index} onClick={() => handleShowModal(true, { id: item.product_id, name: item.name, harga: item.price, image: item.image, description: item.description })}>
                    <div className="w-[30%]">
                      <img className="h-32 w-40" src={`/image/${item.image}`} alt="Product"/>
                    </div>
                    <div className="text-start grid grid-row-3 ml-3 w-[70%]">
                      <p className="text-md line-clamp-2" style={{color:'black'}}>{item.name}</p>
                      <p>{item.description}</p>
                      <div className="spase-bettwen">
                        <p style={{color: 'black'}}>Rp {(item.price).toLocaleString("id-ID")}</p>
                        <button className="add-btn">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bag-plus-fill" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M10.5 3.5a2.5 2.5 0 0 0-5 0V4h5zm1 0V4H15v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4h3.5v-.5a3.5 3.5 0 1 1 7 0M8.5 8a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V12a.5.5 0 0 0 1 0v-1.5H10a.5.5 0 0 0 0-1H8.5z"/>
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
          />
        )}

       { containerClass === "container-main-cart-mobile" && (
        <BottomNavbar/>
       )}      

       { spinner && (
        <Spinner/>
       )}
      
    </div>
  );
}


export default Home;