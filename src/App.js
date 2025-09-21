import Cart from './component/cart'
import './App.css'
import Home from './component/home'
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate} from 'react-router-dom'
import RegisterPage from './component/loginSignup'
import Profile from './component/profile'
import ChangePassword from './component/changePassword'
import SetPassword from './component/setPassword'
import Activity from './component/activity'
import DetailActivity from './component/detailActivity'
import Buy from './component/buy'
import KasirTransaction from './casier/transaction'
import KasirOrders from './casier/order'
import OrderDetails from './casier/orderdetails'
import KasirProducts from './casier/product'
import KasirStatistik from './casier/statistik'
import KasirSettings from './casier/settings'
import ModernKasirDashboard from './casier/table'
import { 
  loginStatusInternal, 
  loginStatusCustomer, 
  fetchProductsCustomer, 
  fetchGetDataCustomer, 
  fetchTransactionOnGoingCustomer, 
  fetchDataEmployeeInternal, 
  fetchAssetsStoreInternal,
} from './actions/get'
import { GeneralJournalForm } from './casier/finance/inputGeneralJournal'
import { useDispatch, useSelector } from 'react-redux'
import { PrivateRouteCustomer, PrivateRouteInternal } from './helper/privateRoute'
import Verification from './component/verification'
import { use, useEffect } from 'react'
import SetUsername from './component/setUsername'
import {UsedSSEContainer} from './actions/sse'
import ServiceRenewalNotice from './component/serviceRenewal'
import Cashier from './casier/cashier'
import GeneralJournalDashboard from './casier/finance/generalJournal'
import ProfitLossStatement from './casier/finance/profitAndLoss'
import NeracaDashboard from './casier/finance/neraca'
import {
  statusExpiredTokenSlice,
  statusExpiredUserTokenSlice,
  statusServiceMaintenanceSlice,
  statusExpiredInternalTokenSlice,
} from './reducers/expToken'
import MaintenanceComponent from './component/maintanance'
import { Outlet } from "react-router-dom";
import {
  loginStatusInternalSlice,
  loginStatusCustomerSlice,
} from './reducers/get'
import EmployeeManagement from './casier/employee'
import CreateEmployee from './casier/createEmployee'
import ForgotPasswordComponent from './component/forgotPassword'

function InternalWrapper() {
  const dispatch = useDispatch();

  // handle fetch data employee internal
  const {dataEmployeeInternal} = useSelector((state) => state.persisted.getDataEmployeeInternal)
  useEffect(() => {
    if (!dataEmployeeInternal) {
      dispatch(fetchDataEmployeeInternal())
    }
  }, [])

  const { loggedIn: loggedInInternal } = useSelector((state) => state.persisted.loginStatusInternal)
  useEffect(() => {
    if (!loggedInInternal) {
      // check status login internal
      dispatch(loginStatusInternal())
    }
  }, [loggedInInternal])

  const {dataAssetsStoreInternal} = useSelector((state) => state.persisted.getAssetsStoreInternal)
  useEffect(() => {
    if (!dataAssetsStoreInternal || Object.keys(dataAssetsStoreInternal).length === 0) {
      dispatch(fetchAssetsStoreInternal())
    }
  }, [])

  return <Outlet />; // render semua child route internal
}

function CustomerWrapper() {
  const dispatch = useDispatch();

  const { loggedIn: loggedInCustomer } = useSelector((state) => state.persisted.loginStatusCustomer)
  useEffect(() => {
    if (!loggedInCustomer) {
      // check status login customer 
      dispatch(loginStatusCustomer())
    }
  }, [loggedInCustomer])

  // get data customer
  // set username jika user sign menggunakan account google
  const {data} = useSelector((state) => state.persisted.dataCustomer)
  useEffect(() => {
    if (!data || Object.keys(data).length === 0) {
      dispatch(fetchGetDataCustomer())
    }
  }, [])

   // get data transaction on going
  const {dataTransactionOnGoing} = useSelector((state) => state.persisted.transactionOnGoingCustomer)
  useEffect(() => {
    if (!dataTransactionOnGoing || Object.keys(dataTransactionOnGoing).length === 0) {
      dispatch(fetchTransactionOnGoingCustomer())
    }
  }, [])

  useEffect(() => {
    const pendingTransaction = localStorage.getItem("pendingTransaction");
    
    if (pendingTransaction) {
      dispatch(fetchTransactionOnGoingCustomer(pendingTransaction))
        .finally(() => {
          localStorage.removeItem("pendingTransaction")
        })
    }
  }, [])

  // return loggedInCustomer ? <Outlet /> : <Navigate to="/access" />
  return <Outlet/>
}

function AppContent() {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  
  const {setLoginStatusCustomer} = loginStatusCustomerSlice.actions
  const {setLoginStatusInternal} = loginStatusInternalSlice.actions

  // get data products 
  const { datas } = useSelector((state) => state.persisted.productsCustomer)
  useEffect(() => {
    if (datas.length === 0 || !datas) {
      dispatch(fetchProductsCustomer())
    }
  }, [])

  // get data customer
  // set username jika user sign menggunakan account google
  const {data, statusCode} = useSelector((state) => state.persisted.dataCustomer)

  // handle expired token
  const { clearStatusExpiredToken } = statusExpiredTokenSlice.actions
  const { statusExpiredToken } = useSelector((state) => state.statusExpiredTokenState)

  useEffect(() => {
    if (statusExpiredToken) {
      navigate("/service/renewal");
      dispatch(clearStatusExpiredToken())
    }
  }, [statusExpiredToken])

  // handle expired user token
  const { clearStatusExpiredUserToken } = statusExpiredUserTokenSlice.actions
  const { statusExpiredUserToken } = useSelector((state) => state.statusExpiredUserTokenState)
  useEffect(() => {
    if (statusExpiredUserToken) {
      navigate("/access");
      dispatch(clearStatusExpiredUserToken())
      dispatch(setLoginStatusCustomer(false))
    }
  }, [statusExpiredUserToken])


  // handle expired internal user token
  const {clearStatusExpiredInternalToken} = statusExpiredInternalTokenSlice.actions
  const { statusExpiredInternalToken } = useSelector((state) => state.statusExpiredInternalTokenState)
  useEffect(() => {
    if (statusExpiredInternalToken) {
      navigate("/internal/access");
      dispatch(clearStatusExpiredInternalToken())
      dispatch(setLoginStatusInternal(false))
    }
  }, [statusExpiredInternalToken])

  // handle expired service on maintanance
  const {clearStatusServiceMaintenance} = statusServiceMaintenanceSlice.actions
  const { statusServiceMaintenance } = useSelector((state) => state.statusServiceMaintenanceState)

  useEffect(() => {
    if (statusServiceMaintenance) {
      navigate("/maintenance");
      dispatch(clearStatusServiceMaintenance())
    }
  }, [statusServiceMaintenance])

  return (
    <div> 
      <UsedSSEContainer />
    
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/access' element={<RegisterPage/>}/>
        <Route path='/forgot/password' element={<ForgotPasswordComponent type={"customer"}/>}/>
        <Route path='/verification' element={<Verification/>}/>
        <Route path='/service/renewal' element={<ServiceRenewalNotice/>}/>
        <Route path='/maintenance' element={<MaintenanceComponent/>}/>
        {/* <Route element={<PrivateRouteCustomer/>}> */}
          <Route element={<CustomerWrapper/>}>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/changepassword' element={<ChangePassword/>}/> 
            <Route path='/setpassword' element={<SetPassword/>}/> 
            <Route path='/activity' element={<Activity/>}/> 
            <Route path='/activity/detail' element={<DetailActivity/>}/> 
            <Route path='/activity/pembayaran' element={<Buy/>}/> 
          </Route>
        {/* </Route> */}

        <Route path='/internal/access' element={<RegisterPage/>}/>
        <Route path='/internal/forgot/password' element={<ForgotPasswordComponent type={"internal"}/>}/>
          <Route element={<InternalWrapper/>}>
            <Route path="/internal/admin/general-journal/form" element={<GeneralJournalForm/>}/>
            <Route path='/internal/admin/general-journal' element={<GeneralJournalDashboard/>}/>
            <Route path='/internal/admin/profit-and-loss' element={<ProfitLossStatement/>}/>
            <Route path='/internal/admin/neraca' element={<NeracaDashboard/>}/>
            <Route path="/internal/admin/orders" element={<KasirOrders/>}/>
            <Route path="/internal/admin/statistics" element={<KasirStatistik/>}/>
            <Route path="/internal/admin/transaction" element={<KasirTransaction/>}/>
            <Route path='/internal/admin/cashier' element={<Cashier/>}/>
            <Route path="/internal/admin/products" element={<KasirProducts/>}/>
            <Route path="/internal/admin/tables" element={<ModernKasirDashboard/>}/>
            <Route path="/internal/admin/settings" element={<KasirSettings/>}/>
            <Route path="/internal/admin/employees" element={<EmployeeManagement/>}/>
            <Route path="/internal/admin/employee/create" element={<CreateEmployee/>}/>
          </Route>
      </Routes>

      { data.username === "" && statusCode === 200 && (
        <SetUsername/>
      )}
    </div>
  );
}

// Main App component dengan Router di level tertinggi
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;