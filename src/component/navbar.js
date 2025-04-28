import { useEffect, useState } from "react"
import "../App.css"
import { useSelector } from "react-redux"
import Cart from "./cart"
import { UseResponsiveClass } from "../helper/presentationalLayer"
import { useNavigate } from "react-router-dom"

function Navbar({onCart, closeCart, statusCart}) {
    const navigate = useNavigate()
    const containerClass = UseResponsiveClass()
    const cartItems = useSelector((state) => state.persisted.cart.items)
    const {loggedIn} = useSelector((state) => state.persisted.loginStatusCustomer)
    console.log(loggedIn)
    // const handleShowCart = () => {
    //     if (statusCart) {
    //         closeCart();
    //     } else if(cartItems.length > 0 && containerClass === 'container-main-cart') {
    //         onCart();
    //     } else if (cartItems.length > 0 && containerClass === 'container-main-cart-mobile') {
    //         navigate('/cart');
    //     }
    // };

    // useEffect(() => {
    //     if (containerClass === "container-main-cart-mobile") {
    //         closeCart();
    //     }
    //     if (cartItems.length <= 0) {
    //         closeCart();
    //     }
    // }, [containerClass, cartItems.length]);

    // const handleShowCart = () => {
    //     if (containerClass !== "container-main-cart") {
    //         navigate('/cart')
    //     } else {
    //         setShowModelCart(true)
    //     }
    // }

    return (
        <nav  class={ containerClass ===  "container-main-cart" ? "navbar": "navbar-mobile"}>
            <div class="logo">
                <p className={ containerClass === "container-main-cart" ? "nusas" : "nusas-mobile"} >Nusas</p>
                <p className={ containerClass === "container-main-cart" ? "food bordered" : "food-mobile"}>Food</p>
            </div>
            <div class="navbar-menu">
                {containerClass === "container-main-cart" && (
                    <div className="flex" style={{gap: '20px', marginRight: '10px'}}>
                        <div class="navbar-cart" onClick={() => navigate("/cart")}>
                            <>
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="40"
                                height="35"
                                fill="currentColor"
                                className="bi bi-bag"
                                viewBox="0 0 16 16"
                                >
                                <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
                                </svg>
                                {cartItems.length !== 0 && statusCart !== true && (
                                <span className="cart-badge">
                                    {cartItems.reduce((total, item) => total + item.quantity, 0)}
                                </span>
                                )}
                            </>
                        </div>
                        <div class="icon" onClick={() => navigate("/activity")}>
                            <img src={require('../image/nota.png')} style={{width: '33px', height: '33px'}}/>
                        </div>
                        <div class="icon" onClick={() => navigate("/profile")}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
                            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                            </svg>
                        </div>
                    </div>
                )}
                <div class="auth">
                    { !loggedIn && (
                        <button key={String(loggedIn)} onClick={() => navigate("/access")}>Masuk/Daftar</button>
                    )} 
                </div>
            </div>
        </nav>
    )
}

export default Navbar;