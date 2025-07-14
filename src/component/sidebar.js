import { useState, useEffect, use } from "react"
import { ScanBarcode, Ticket, Wallet, Computer, Box, Settings, LogOut, ChartNoAxesCombined, ChevronDown, ChevronRight, Menu, X } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logoutInternal } from "../actions/get"
import {logoutInternalSlice} from "../reducers/get"
import {SpinnerFixed} from "../helper/spinner"


const Sidebar = ({activeMenu}) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const [spinner, setSpinner] = useState(false)
  const [showAlertError, setShowAlertError] = useState(false)
  const [openFinance, setOpenFinance] = useState(false);
  const location = useLocation()

  const handleNavigate = (value) => {
    navigate(value)
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

  return (  
    <>
      {/* Mobile Navbar */}
      <div className="md:hidden flex justify-between items-center p-4 bg-white shadow-md">
        <h1 className="text-xl text-gray-900 font-bold">Kasir</h1>
        <button onClick={() => setIsOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar (Desktop) & Full-Screen Menu (Mobile) */}
      <div
        className={`fixed sms:relative z-10 top-0 left-0 h-screen bg-white shadow-xl shadow-gray-500/50 text-black  flex flex-col justify-between transition-transform duration-0 ${
          isOpen ? "translate-y-0 md:hidden w-full" : "-translate-y-full  md:translate-y-0 w-64"
        }`}
      >
        {/* Close Button (Mobile) */}
        

        {/* Sidebar Header */}
        <div className={isOpen ? "py-5 px-4 md:hidden flex justify-between items-center border-b" : "px-4  py-3 flex  items-center border-b"}>
            <div className="flex space-x-2 items-center">
                <img src={require("../image/logo_kasir.png")} alt="Logo" className="w-10 h-11 rounded-full"/>
                <h1 className="text-xl font-semibold">Kasir</h1>
            </div>
            {isOpen ? (
                <button onClick={() => setIsOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
            ): ""}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto max-h-screen">
          <ul className="space-y-2">
            <div onClick={() => handleNavigate('/internal/admin/transaction')} className={`flex items-center justify-between w-full rounded-lg hover:bg-gray-200 cursor-pointer ${activeMenu === 'Transaction' && 'bg-gray-200'}`}>
                <NavItem Icon={ScanBarcode} title="Transactions" />
                <ChevronRight/>
            </div>
            <div onClick={() => handleNavigate('/internal/admin/cashier')} className={`flex items-center justify-between w-full rounded-lg hover:bg-gray-200 cursor-pointer ${activeMenu === 'Cashier' && 'bg-gray-200'}`}>
                <NavItem Icon={Computer} title="Cashier" />
                <ChevronRight/>
            </div>
            <div onClick={() => handleNavigate('/internal/admin/orders')} className={`flex items-center justify-between w-full rounded-lg hover:bg-gray-200 cursor-pointer ${activeMenu === 'Orders' && 'bg-gray-200'}`}>
                <NavItem Icon={Ticket} title="Orders" />
                <ChevronRight/>
            </div>
            <div onClick={() => handleNavigate('/internal/admin/products')} className={`flex items-center justify-between w-full rounded-lg hover:bg-gray-200 cursor-pointer ${activeMenu === "Product" && 'bg-gray-200'}`}>
                <NavItem Icon={Box} title="Products" />
                <ChevronRight/>
            </div>
            <div onClick={() => handleNavigate('/internal/admin/tables')} className={`flex py-3 justify-between items-center cursor-pointer hover:bg-gray-200 rounded-lg ${activeMenu === "table" && 'bg-gray-200'}`}>
                <div className="flex items-center ml-3 space-x-2">
                  <svg  xmlns="http://www.w3.org/2000/svg"  width="26"  height="26"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-brand-databricks"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 17l9 5l9 -5v-3l-9 5l-9 -5v-3l9 5l9 -5v-3l-9 5l-9 -5l9 -5l5.418 3.01" /></svg>
                  <p>Tables</p>
                </div>
                  <ChevronRight/>
            </div>
            <div onClick={() => handleNavigate('/internal/admin/statistics')} className={`flex justify-between items-center cursor-pointer hover:bg-gray-200 rounded-lg ${activeMenu === "statistics" && 'bg-gray-200'}`}>
                <NavItem Icon={ChartNoAxesCombined} title="Statistics"/>
                <ChevronRight/>
            </div>
            <div
              onClick={() => setOpenFinance(!openFinance)}
              className={`flex justify-between items-center cursor-pointer hover:bg-gray-200 rounded-lg ${activeMenu === "finances" && 'bg-gray-200'}`}
            >
              <NavItem Icon={Wallet} title="Finances" />
              { openFinance ? (
                <ChevronDown/>
              ) : (
                <ChevronRight/>
              )}
            </div>

            {openFinance && (
              <div className="ml-6 space-y-2 mt-2">
                <div
                  onClick={() => handleNavigate('/internal/admin/general-journal')}
                  className={`flex justify-between items-center cursor-pointer hover:bg-gray-100 rounded-lg px-3 py-2 ${activeMenu === "general-journal" && 'bg-gray-100'}`}
                >
                  <span className="text-sm text-gray-800">General Journal</span>
                </div>
                <div
                  onClick={() => handleNavigate('/internal/admin/profit-and-loss')}
                  className={`flex justify-between items-center cursor-pointer hover:bg-gray-100 rounded-lg px-3 py-2 ${activeMenu === "profit-and-loss" && 'bg-gray-100'}`}
                >
                  <span className="text-sm text-gray-800">Profit And Loss</span>
                </div>
                <div
                  onClick={() => handleNavigate('/internal/admin/neraca')}
                  className={`flex justify-between items-center cursor-pointer hover:bg-gray-100 rounded-lg px-3 py-2 ${activeMenu === "neraca" && 'bg-gray-100'}`}
                >
                  <span className="text-sm text-gray-800">Neraca</span>
                </div>
              </div>
            )}

            <div onClick={() => handleNavigate('/internal/admin/settings')} className={`flex justify-between items-center cursor-pointer hover:bg-gray-200 rounded-lg ${activeMenu === "settings" && 'bg-gray-200'}`}>
                <NavItem Icon={Settings} title="Settings" />
                <ChevronRight/>
            </div>
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t space-y-2">
            <div onClick={() => handleLogout()} className="rounded-lg bg-gray-800 hover:bg-gray-600 text-white">
                <NavItem Icon={LogOut} title="Logout" />
            </div>
        </div>
      </div>

      { showAlertError && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[400px] bg-red-500 text-white p-3 rounded-lg text-center shadow-lg animate-slideDown">
              terjadi error di server kami
          </div>
      )}

      {/* spinner */}
      { spinner && (
        <SpinnerFixed  colors={'fill-green-500'}/>
      )}

      {/* Overlay Background (Mobile) */}
      {isOpen && <div className="fixed inset-0 bg-black/50 md:hidden" onClick={() => setIsOpen(false)} />}
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
