import "../App.css"
import Footer from "./footer";
import Navbar from "./navbar"
import { AddProductToCart } from "./add";
import { useState, useEffect, useRef } from "react"
import Cart from "./cart";
import { UseResponsiveClass } from "../helper/presentationalLayer";
import { useNavigate } from "react-router-dom";
import BottomNavbar from "./bottomNavbar";

function Home() {
  const [products, setProducts] = useState([
    {
      category: 'Makanan',
      items: [
        {
          name: 'Sate Ayam merah maranggi',
          harga: 45000,
          image: 'sate-ayam.png',
          description: 'Sate ayam dengan bumbu kacang.'
        },
        {
          name: 'Nasi Goreng',
          harga: 30000,
          image: 'nasi-goreng.png',
          description: 'Nasi goreng spesial dengan telur dan ayam.'
        },
        {
          name: 'Mie Goreng',
          harga: 25000,
          image: 'mie-goreng.png',
          description: 'Mie goreng dengan sayuran segar dan bumbu rempah.'
        },
        {
          name: 'Mie Aceh',
          harga: 25000,
          image: 'mie-goreng.png',
          description: 'Mie goreng dengan sayuran segar dan bumbu rempah.'
        },
        {
          name: 'Nasi Padang',
          harga: 25000,
          image: 'mie-goreng.png',
          description: 'Mie goreng dengan sayuran segar dan bumbu rempah.'
        }
      ]
    },
    {
      category: 'Minuman',
      items: [
        {
          name: 'Es Teh Manis',
          harga: 5000,
          image: 'es-teh-manis.png',
          description: 'Es teh manis dingin yang segar.'
        },
        {
          name: 'Kopi Susu',
          harga: 12000,
          image: 'kopi-susu.png',
          description: 'Kopi susu hangat yang nikmat.'
        },
        {
          name: 'Jus Jeruk',
          harga: 8000,
          image: 'jus-jeruk.png',
          description: 'Jus jeruk segar dengan rasa alami.'
        }
      ]
    },
    {
      category: 'Tambahan',
      items: [
        {
          name: 'Kerupuk',
          harga: 3000,
          image: 'kerupuk.png',
          description: 'Kerupuk renyah pendamping makan.'
        },
        {
          name: 'Sambal',
          harga: 2000,
          image: 'sambal.png',
          description: 'Sambal pedas dengan rasa khas.'
        },
        {
          name: 'Pencok',
          harga: 4000,
          image: 'pencok.png',
          description: 'Pencok, sambal kacang dengan tempe goreng.'
        }
      ]
    }
  ]); 
  const [activeCategory, setActiveCategory] = useState("Makanan");
  const [clickedCategory, setClickedCategory] = useState(null);
  const categoryRefs = useRef({});
  const clickedCategoryRef = useRef(clickedCategory);
  const [showModelAddProduct, setShowModelAddProduct] = useState(false);
  const [showModelCart, setShowModelCart] = useState(false);
  const [productData, setProductData] = useState(null);
  const containerClass = UseResponsiveClass()
  const navigate = useNavigate()

  const handleShowModal = (show, product) => {
    setShowModelAddProduct(show);
    setProductData(product);
  };

  // Sync ref dengan state clickedCategory

useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const category = Object.keys(categoryRefs.current).find(
            (key) => categoryRefs.current[key] === entry.target
          );

          // Update activeCategory jika pengguna tidak sedang melakukan klik manual
          if (category && clickedCategoryRef.current === null) {
            setActiveCategory(category);
          }
        }
      });
    },
    {
      threshold: 0.2, // Set lebih tinggi agar lebih akurat
      rootMargin: "100px 0px 0px 0px", // Sesuaikan dengan navbar
    }
  );

  // Mulai mengamati setiap kategori
  Object.values(categoryRefs.current).forEach((el) => {
    if (el) observer.observe(el);
  });

  return () => observer.disconnect();
}, []);

  

  const scrollToCategory = (category) => {
    setClickedCategory(category);
    setActiveCategory(category);

    requestAnimationFrame(() => {
        const element = categoryRefs.current[category];

        if (element) {
            const headerOffset = 210;
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            
            window.scrollTo({
                top: elementPosition - headerOffset,
                behavior: "smooth"
            });

            setTimeout(() => setClickedCategory(null), 500);
        }
    });
};

  

  return (
    <div style={{position: 'relative'}}>
      <div className="container-navbar">
        <Navbar
        onCart={() => setShowModelCart(true)}
        closeCart={() => setShowModelCart(false)}
        statusCart={showModelCart}
        />
        <div className={containerClass === "container-main-cart" ? "container-button-category" : "container-button-category-mobile"}>
          {products.map((item) => (
            <button
              key={item.category}
              className={`tab ${activeCategory === item.category ? "active" : ""}`}
              onClick={() => scrollToCategory(item.category)}
            >
              {item.category}
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
        <div className={containerClass === "container-main-cart" ? "container-home" : "container-home-mobile"}>
          {products.map((item, index) => (
            <div 
              id={item.category}
              className="container-category"
              key={item.category}
              ref={(el) => (categoryRefs.current[item.category] = el)}
            >  
              <h2 className="title-category">{item.category}</h2>
              <div className="product-grid">
                {item.items.map((item, index) => (
                  <div className="product-card" key={index} onClick={() => handleShowModal(true, { name: item.name, harga: item.harga, image: "foto1.jpg", description: item.description })}>
                    <div>
                      <img src={require(`../image/foto1.jpg`)} alt="Product"/>
                    </div>
                    <div className="product-title">
                      <p className="food-title" style={{color:'black'}}>{item.name}</p>
                      <p>{item.description}</p>
                      <div className="spase-bettwen">
                        <p style={{color:'black'}}>Rp {(item.harga).toLocaleString("id-ID")}</p>
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

          {showModelAddProduct && (
              <AddProductToCart 
                onClose={() => setShowModelAddProduct(false)} 
                name={productData.name} 
                harga={productData.harga} 
                image={productData.image} 
                description={productData.description} 
              />
            )}

        </div>
      </div>    

       { containerClass === "container-main-cart-mobile" && (
        <BottomNavbar/>
       )}      
      
      <Footer />
    </div>
  );
}


export default Home;