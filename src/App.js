import logo from './logo.svg';
import Cart from './component/cart';
import './App.css';
import Home from './component/home';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import RegisterPage from './component/loginSignup';
import Profile from './component/profile';
import ChangePassword from './component/changePassword';
import SetPassword from './component/setPassword';
import Activity from './component/activity';
import DetailActivity from './component/detailActivity';
import Buy from './component/buy';
import KasirTransaction from './casier/transaction';
import KasirOrders from './casier/order';
import OrderDetails from './casier/orderdetails';
import KasirProducts from './casier/product'
import KasirStatistik from './casier/statistik';
import KasirSettings from './casier/settings';
import KasirTables from './casier/table';
import CreateTransaction from './casier/createTransaction';
import { loginStatusCustomer, fetchProductsCustomer, fetchGetDataCustomer } from './actions/get';
import { useDispatch, useSelector } from 'react-redux';
import PrivateRouteCustomer from './helper/privateRoute';
import Verification from './component/verification';
import { useEffect } from 'react';
import SetUsername from './component/setUsername';

function App() {
  const dispatch = useDispatch()

  // check status login customer 
  dispatch(loginStatusCustomer())

  
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


  return (
    <Router>
      <div>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/access' element={<RegisterPage/>}/>
          <Route path='/verification' element={<Verification/>}/>
          <Route element={<PrivateRouteCustomer/>}>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/changepassword' element={<ChangePassword/>}/> 
            <Route path='/setpassword' element={<SetPassword/>}/> 
            <Route path='/activity' element={<Activity/>}/> 
            <Route path='/activity/detail' element={<DetailActivity/>}/> 
            <Route path='/activity/pembayaran' element={<Buy/>}/> 
          </Route>

          <Route path="/internal/admin/kasir/transaction" element={<KasirTransaction/>}/>
          <Route path="/internal/admin/kasir/transaction/create" element={<CreateTransaction/>}/>
          <Route path="/internal/admin/kasir/orders" element={<KasirOrders/>}/>
          <Route path="/internal/admin/kasir/order/details" element={<OrderDetails/>}/>
          <Route path="/internal/admin/kasir/products" element={<KasirProducts/>}/>
          <Route path="/internal/admin/kasir/tables" element={<KasirTables/>}/>
          <Route path="/internal/admin/kasir/statistiks" element={<KasirStatistik/>}/>
          <Route path="/internal/admin/kasir/settings" element={<KasirSettings/>}/>
        </Routes>

        { data.username === "" && statusCode === 200 && (
          <SetUsername/>
        )}

        
      </div>
    </Router>
  );
}

export default App;
