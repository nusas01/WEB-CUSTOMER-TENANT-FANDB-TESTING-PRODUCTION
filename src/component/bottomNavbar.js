import "../style/bottomNavbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function BottomNavbar() {
    const cartItems = useSelector((state) => state.persisted.cart.items);
    const navigate = useNavigate();
    const location = useLocation();

    const { loggedIn } = useSelector((state) => state.persisted.loginStatusCustomer)

    const handleActivity = () => {
        loggedIn ? navigate('/activity') : navigate('/access')
    }

    const handleProfile = () => {
        loggedIn ? navigate('/profile') : navigate('/access')
    }

    return (
        <div className="bottom-navbar">
            <div 
             className={`icon ${location.pathname === "/" ? "active flex flex-col items-center" : "flex flex-col items-center"}`}
            onClick={() => navigate("/")}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" class="bi bi-house-fill" viewBox="0 0 16 16">
                <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z"/>
                <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z"/>
                </svg>
                <p className="size-font">Home</p>
            </div>
            <div 
            className={`icon ${location.pathname === "/cart" ? "active flex flex-col items-center" : "flex flex-col items-center"}`}
            onClick={() => navigate("/cart")} style={{position: 'relative'}}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" class="bi bi-bag" viewBox="0 0 16 16">
                <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/>
                </svg>
                { cartItems.length > 0 && (
                    <span className="cart-badge-profile">
                        {cartItems.reduce((total, item) => total + item.quantity, 0)}
                    </span>
                )}
                <p className="size-font">Keranjang</p>
            </div>
            <div 
            className={`icon ${location.pathname === "/activity" ? "active flex flex-col items-center" : "flex flex-col items-center"}`}
            onClick={() => handleActivity()}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" class="bi bi-card-heading" viewBox="0 0 16 16">
                <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/>
                <path d="M3 8.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m0-5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5z"/>
                </svg>
                <p className="size-font">Aktivitas</p>
            </div>
            <div 
            className={`icon ${location.pathname === "/profile" ? "active flex flex-col items-center" : "flex flex-col items-center"}`} 
            onClick={() => handleProfile()}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                </svg>
                <p className="size-font">Profile</p>
            </div>
        </div>
    )
}