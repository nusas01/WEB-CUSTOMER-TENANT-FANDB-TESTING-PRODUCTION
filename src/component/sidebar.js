import { useState, useEffect, use } from "react"
import { 
  ScanBarcode, 
  Ticket, 
  Wallet, 
  Monitor, 
  Box, 
  Settings, 
  LogOut, 
  Database, 
  BarChart3, 
  ChevronRight, 
  Menu, 
  X,
  Home,
  ChevronDown,
} from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logoutInternal } from "../actions/get"
import {logoutInternalSlice} from "../reducers/get"
import {SpinnerFixed} from "../helper/spinner"
import {useDeviceDetection} from "../helper/helper"
import {navbarInternalSlice} from "../reducers/reducers"

const menuItems = [
  { Icon: ScanBarcode, title: "Transactions", path: '/internal/admin/transaction', key: 'Transaction' },
  { Icon: Monitor, title: "Cashier", path: '/internal/admin/cashier', key: 'Cashier' },
  { Icon: Ticket, title: "Orders", path: '/internal/admin/orders', key: 'Orders' },
  { Icon: Box, title: "Products", path: '/internal/admin/products', key: 'Product' },
  { Icon: Database, title: "Tables", path: '/internal/admin/tables', key: 'table' },
  { Icon: BarChart3, title: "Statistics", path: '/internal/admin/statistics', key: 'statistics' },
  { Icon: Settings, title: "Settings", path: '/internal/admin/settings', key: 'settings' }
];

const financeSubItems = [
  { title: "General Journal", path: '/internal/admin/general-journal', key: 'general-journal' },
  { title: "Profit And Loss", path: '/internal/admin/profit-and-loss', key: 'profit-and-loss' },
  { title: "Neraca", path: '/internal/admin/neraca', key: 'neraca' }
];

const Sidebar = ({activeMenu}) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [spinner, setSpinner] = useState(false)
  const [showAlertError, setShowAlertError] = useState(false)
  const [openFinance, setOpenFinance] = useState(false);
  const location = useLocation()
  
  useDeviceDetection();
  const { setIsOpen } = navbarInternalSlice.actions
  const {isOpen, isMobileDeviceType} = useSelector((state) => state.persisted.navbarInternal)

  const handleNavigate = (value) => {
    navigate(value)

    if (isMobileDeviceType) {
      dispatch(setIsOpen(false))
    }
  }


  useEffect(() => {
    if (location.pathname.includes('/internal/admin/general-journal')) {
      setOpenFinance(true);
    }

    if (location.pathname.includes('/internal/admin/profit-and-loss')) {
      setOpenFinance(true);
    }

    if (location.pathname.includes('/internal/admin/neraca')) {
      setOpenFinance(true);
    }
  }, [location.pathname])

  
  // handle response logout
  const {resetLogoutInternal} = logoutInternalSlice.actions
  const {message, error, loadingLogout} = useSelector((state) => state.logoutInternalState)
  
  const handleLogout = async () => {
      await dispatch(logoutInternal())
      window.location.href = "/"
  }

  useEffect(() => {
    if (message) {
      dispatch(resetLogoutInternal())
    }
  }, [message])

  useEffect(() => {
    setSpinner(loadingLogout)
  }, [loadingLogout])

  useEffect(() => {
    if (error) {
      setShowAlertError(true)
      setTimeout(() => {
        setShowAlertError(false)
      }, 2000)
    }
  }, [error])

  const handleOverlayClick = () => {
    setIsOpen(false);
  };


   // Render Desktop Sidebar
  const renderDesktopSidebar = () => (
    <div className="flex w-72 flex-col fixed inset-y-0 bg-white border-r border-gray-200 shadow-sm">
      {/* Desktop Header */}
      <div className="flex items-center px-4 py-2 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl flex items-center justify-center shadow-sm">
            <Home className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Kasir</h1>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <div
              key={item.key}
              onClick={() => handleNavigate(item.path)}
              className={`group flex items-center justify-between w-full rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                activeMenu === item.key ? 'bg-gray-100 text-gray-950 shadow-sm' : 'text-gray-700'
              }`}
            >
              <NavItem 
                Icon={item.Icon} 
                title={item.title}
                className="flex-1"
              />
              <ChevronRight className={`w-4 h-4 mr-3 transition-colors ${
                activeMenu === item.key ? 'text-gray-950' : 'text-gray-400 group-hover:text-gray-600'
              }`} />
            </div>
          ))}

          {/* Finance Section */}
          <div className="mt-4">
            <button
              onClick={() => setOpenFinance(!openFinance)}
              className={`group flex items-center justify-between w-full rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                activeMenu === "finances" ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
              }`}
            >
              <NavItem Icon={Wallet} title="Finances" className="flex-1" />
              <div className="mr-3">
                {openFinance ? (
                  <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                )}
              </div>
            </button>

            {openFinance && (
              <div className="ml-8 mt-2 space-y-1">
                {financeSubItems.map((subItem) => (
                  <div
                    key={subItem.key}
                    onClick={() => handleNavigate(subItem.path)}
                    className={`flex items-center cursor-pointer rounded-lg px-4 py-2 text-sm transition-colors ${
                      activeMenu === subItem.key 
                        ? 'bg-gray-100 text-gray-950 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-700'
                    }`}
                  >
                    <span>{subItem.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Desktop Footer */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 py-2 px-4 rounded-xl bg-gray-900 hover:bg-gray-800 text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );

  // Render Mobile/Tablet Header
  const renderMobileHeader = () => (
    <div className="flex justify-between items-center p-4 bg-white shadow-sm border-b border-gray-200 relative z-40">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg flex items-center justify-center">
          <Home className="w-4 h-4 text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">Kasir</h1>
      </div>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>
    </div>
  );

  // Render Mobile/Tablet Sidebar
  const renderMobileSidebar = () => (
    <div
      className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={handleOverlayClick}
      />
      
      {/* Sidebar Content */}
      <div className="relative w-full h-full bg-white flex flex-col">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl flex items-center justify-center shadow-sm">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Kasir</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(setIsOpen(false))}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 px-6 py-6 overflow-y-auto">
          <div className="space-y-3">
            {menuItems.map((item) => (
              <div
                key={item.key}
                onClick={() => handleNavigate(item.path)}
                className={`group flex items-center justify-between w-full rounded-xl cursor-pointer transition-all duration-200 ${
                  activeMenu === item.key 
                    ? 'bg-blue-50 text-blue-700 shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <NavItem 
                  Icon={item.Icon} 
                  title={item.title}
                  className="flex-1 p-4"
                />
                <ChevronRight className={`w-4 h-4 mr-4 transition-colors ${
                  activeMenu === item.key ? 'text-blue-500' : 'text-gray-400'
                }`} />
              </div>
            ))}

            {/* Finance Section Mobile */}
            <div className="mt-6">
              <button
                onClick={() => setOpenFinance(!openFinance)}
                className={`group flex items-center justify-between w-full rounded-xl cursor-pointer transition-all duration-200 ${
                  activeMenu === "finances" 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <NavItem Icon={Wallet} title="Finances" className="flex-1 p-4" />
                <div className="mr-4">
                  {openFinance ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </button>

              {openFinance && (
                <div className="ml-8 mt-3 space-y-2">
                  {financeSubItems.map((subItem) => (
                    <div
                      key={subItem.key}
                      onClick={() => handleNavigate(subItem.path)}
                      className={`flex items-center cursor-pointer rounded-lg px-4 py-3 transition-colors ${
                        activeMenu === subItem.key 
                          ? 'bg-blue-50 text-blue-700 font-medium' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{subItem.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Mobile Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-3 p-4 rounded-xl bg-gray-900 hover:bg-gray-800 text-white transition-colors shadow-sm"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (  
    <>
      {/* Conditional Rendering based on Device Type */}
      {!isMobileDeviceType && renderDesktopSidebar()}
      
      {isMobileDeviceType && (
        <>
          {renderMobileHeader()}
          {renderMobileSidebar()}
        </>
      )}

      {/* Error Alert */}
      {showAlertError && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-red-500 text-white p-4 rounded-xl text-center shadow-lg z-50 animate-bounce">
          <p className="font-medium">Terjadi error di server kami</p>
        </div>
      )}

      {/* Loading Spinner */}
      {spinner && <SpinnerFixed colors="fill-blue-500" />}
    </>
  );
};


const NavItem = ({ Icon, title }) => (
  <div className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition">
    <Icon className="w-5 h-5" />
    <span className="text-sm font-medium">{title}</span>
  </div>
);

export default Sidebar;
