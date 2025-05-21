import { Navigate } from "react-router-dom";
import "../style/profile.css";
import BottomNavbar from "./bottomNavbar";
import { useNavigate } from "react-router-dom";
import { logoutCustomer, fetchGetDataCustomer } from "../actions/get";
import { loginCustomerSlice } from "../reducers/reducers";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {SpinnerRelative} from "../helper/spinner";
import { OrderTypeInvalidAlert } from "./alert";

export default function Profile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const name = 'Raihan Malay';
    const nameParts = name.trim().split(" ")
    const [spinner, setSpinner] = useState(false)
    const [orderTypeInvalid, setOrderTypeInvalid] = useState(false)
  

    // Take the first letter from the first two words (first name and last name)
    const initials = nameParts.length > 1 
      ? nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase()
      : nameParts[0].charAt(0).toUpperCase();


    // handle logout
    const {message, loadingLogout} = useSelector((state) => state.logoutCustomerState) 
    const handleLogout =  async () => {
        await dispatch(logoutCustomer())
        window.location.href = "/"
    }
    useEffect (() => {
        setSpinner(loadingLogout)
    }, [loadingLogout])


    // data customer
    const {data, loading} = useSelector((state) => state.persisted.dataCustomer)
    console.log("data customer:", data)
    useEffect(() => {
        if (!data || Object.keys(data).length === 0) {
          dispatch(fetchGetDataCustomer())
        }
      }, [data]);
    useEffect(() => {
        setSpinner(loading)
    }, [loading])


    // alert invalid order type 
    const {tableId, orderTakeAway} = useSelector((state) => state.persisted.orderType)
    useEffect(() => {
        if (tableId === null && orderTakeAway === false) {
            setOrderTypeInvalid(true)
            return
        }
    }, [tableId, orderTakeAway])
    
    return (
        <div className="container-profile" >
            { orderTypeInvalid && (
                <OrderTypeInvalidAlert onClose={() => setOrderTypeInvalid(false)}/>
            )}

                { !spinner ? (
                    <div>
                        <div className="header-profile">
                            <div className="circle-profile">
                            {initials}
                            </div>
                            <div className="header-data">
                                <p class="title">James Grey</p>
                                <p class="article">Nama digunakan saat pemesanan</p>
                            </div>
                        </div>
                        <div className="body-profile">
                            <div className="fill-body-profile">
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#b1aeae" class="bi bi-envelope-fill" viewBox="0 0 16 16">
                                <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z"/>
                                </svg>
                                <span style={{color: '#b1aeae'}}>{data.email}</span>
                            </div>
                            { !data.password ? (
                                <div onClick={() => navigate("/setpassword")} className="fill-body-profile pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-shield-lock-fill" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.8 11.8 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7 7 0 0 0 1.048-.625 11.8 11.8 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.54 1.54 0 0 0-1.044-1.263 63 63 0 0 0-2.887-.87C9.843.266 8.69 0 8 0m0 5a1.5 1.5 0 0 1 .5 2.915l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99A1.5 1.5 0 0 1 8 5"/>
                                    </svg>
                                    <span>Set Password</span>
                                </div>
                            ) : (
                                <div onClick={() => navigate("/changepassword")} className="fill-body-profile pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-key" viewBox="0 0 16 16">
                                    <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8m4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5"/>
                                    <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                                    </svg>
                                    <span>Ganti Password</span>
                                </div>
                            )}
                            
                            <div onClick={() => handleLogout()} className="fill-body-profile pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-box-arrow-left" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
                                <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
                                </svg>
                                <span>Keluar</span>
                            </div>
                        </div>
                    </div>
                ): (
                    <SpinnerRelative h="h-[90vh]"/>
                )}
            
            <div style={{maxWidth: '30rem', width: '100%', position: 'relative'}}>
                <BottomNavbar />
            </div>

        </div>
    )
}
