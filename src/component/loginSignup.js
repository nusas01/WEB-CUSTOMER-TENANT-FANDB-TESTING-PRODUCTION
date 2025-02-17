// import { useForm } from "react-hook-form";
// import { FcGoogle } from "react-icons/fc";
// import { FaApple } from "react-icons/fa";
// import { BsMicrosoft } from "react-icons/bs";
import { useEffect, useState } from "react";
import "../style/loginSignup.css";

export default function RegisterPage() {
    const [signup, setSignup]  = useState(false);

    const handleShowSignup = () => {
        if (signup) {
            setSignup(false);
        } else {
            setSignup(true);
        }
    };

  return (
    <div>
        <div className="container">
        <div className="card">
            { !signup ? <h1 className="title">Welcome back</h1>
            : <h1 className="title">Create an account</h1>
            }
            <form className="form">
                <div style={{position: 'relative'}}>
                    <input type="email" placeholder="" className="input mb-10" />
                    <label className="input-label">{ !signup ? "Email Address Or Username" : "Email"}</label>
                </div>
                { signup && (
                    <div style={{position: 'relative'}}>
                        <input type="text" placeholder="" className="input mb-10" />
                        <label className="input-label">Username</label>
                    </div>
                )}
                <div style={{position: 'relative'}}>
                    <input type="text" placeholder="" className="input mb-10" />
                    <label className="input-label">Password</label>
                </div>
                { signup && (
                    <div style={{position: 'relative'}}>
                        <input type="text" placeholder="" className="input mb-10" />
                        <label className="input-label">Repeat Password</label>
                    </div>
                )}
                <button className="button">Continue</button>
            </form>
            { !signup ? 
                <p className="text">
                    Don’t have an account? <a onClick={() => handleShowSignup()} className="link">Sign Up</a>
                </p> :
                <p className="text">
                    Already have an account? <a onClick={() => handleShowSignup()} className="link">Login</a>
                </p>
            }

            <div className="divider">
            <hr className="line" />
            <span className="or-text">OR</span>
            <hr className="line" />
            </div>
            <div className="social-buttons">
            <button className="social-button">
                <span className="icon"/><img className="icon-img" src={require("../image/google.png")}/> Continue with Google
            </button>
            </div>
        </div>
        </div>
    </div>
  );
}
