import logo from './logo.svg'
import Cart from './component/cart'
import './App.css'
import Home from './component/home'
import { BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom'
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
import KasirTables from './casier/table'
import CreateTransaction from './casier/createTransaction'
import { loginStatusInternal, loginStatusCustomer, fetchProductsCustomer, fetchGetDataCustomer, fetchTransactionOnGoingCustomer, fetchTransactionHistoryCustomer } from './actions/get'
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
import {statusExpiredTokenSlice} from './reducers/expToken'

function App() {
  const dispatch = useDispatch()

  // check status login customer 
  dispatch(loginStatusCustomer())
  
  // check status login internal
  dispatch(loginStatusInternal())

  const { loggedIn: loggedInCustomer } = useSelector((state) => state.persisted.loginStatusCustomer)
  const { loggedIn: loggedInInternal } = useSelector((state) => state.persisted.loginStatusInternal)

  console.log("SSEContainer rendered", { loggedInCustomer, loggedInInternal })

  
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


  // get data transaction history
  const {dataTransactionHistory} = useSelector((state) => state.persisted.transactionsHistoryCustomer)
  useEffect(() => {
    if (!dataTransactionHistory || Object.keys(dataTransactionHistory).length === 0) {
      dispatch(fetchTransactionHistoryCustomer(1))
  }  
  }, [])


  // handle expired token
  const { clearStatusExpiredToken } = statusExpiredTokenSlice.actions
  const { statusExpiredToken } = useSelector((state) => state.statusExpiredTokenState)

  useEffect(() => {
    if (statusExpiredToken) {
      window.location.href = "/service/renewal";
      dispatch(clearStatusExpiredToken())
    }
  }, [statusExpiredToken])


  return (
    <Router>
      <div> 
        <UsedSSEContainer />
      
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/access' element={<RegisterPage/>}/>
          <Route path='/verification' element={<Verification/>}/>
          <Route path='/service/renewal' element={<ServiceRenewalNotice/>}/>
          <Route element={<PrivateRouteCustomer/>}>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/changepassword' element={<ChangePassword/>}/> 
            <Route path='/setpassword' element={<SetPassword/>}/> 
            <Route path='/activity' element={<Activity/>}/> 
            <Route path='/activity/detail' element={<DetailActivity/>}/> 
            <Route path='/activity/pembayaran' element={<Buy/>}/> 
          </Route>

          <Route path='/internal/access' element={<RegisterPage/>}/>
          <Route element={<PrivateRouteInternal/>}>
            <Route path="/internal/admin/general-journal/form" element={<GeneralJournalForm/>}/>
            <Route path='/internal/admin/general-journal' element={<GeneralJournalDashboard/>}/>
            <Route path='/internal/admin/profit-and-loss' element={<ProfitLossStatement/>}/>
            <Route path='/internal/admin/neraca' element={<NeracaDashboard/>}/>
            <Route path="/internal/admin/orders" element={<KasirOrders/>}/>
            <Route path="/internal/admin/statistics" element={<KasirStatistik/>}/>
            <Route path="/internal/admin/transaction" element={<KasirTransaction/>}/>
            <Route path='/internal/admin/cashier' element={<Cashier/>}/>
            <Route path="/internal/admin/products" element={<KasirProducts/>}/>
            <Route path="/internal/admin/tables" element={<KasirTables/>}/>
            <Route path="/internal/admin/settings" element={<KasirSettings/>}/>
            <Route path="/internal/admin/transaction/create" element={<CreateTransaction/>}/>
            <Route path="/internal/admin/order/details" element={<OrderDetails/>}/>
          </Route>
        </Routes>

        { data.username === "" && statusCode === 200 && (
          <SetUsername/>
        )}

      </div>
    </Router>
  );
}

export default App;
