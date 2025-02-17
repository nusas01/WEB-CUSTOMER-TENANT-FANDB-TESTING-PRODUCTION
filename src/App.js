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

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/access' element={<RegisterPage/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/changepassword' element={<ChangePassword/>}/> 
          <Route path='/setpassword' element={<SetPassword/>}/> 
          <Route path='/activity' element={<Activity/>}/> 
          <Route path='/activity/detail' element={<DetailActivity/>}/> 
          <Route path='/activity/pembayaran' element={<Buy/>}/> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
