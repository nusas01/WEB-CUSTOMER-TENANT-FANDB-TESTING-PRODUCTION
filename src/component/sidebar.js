import { useState } from "react";
import { ScanBarcode, Ticket, Box, Settings, LogOut, ChartNoAxesCombined, ChevronRight, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({activeMenu}) => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = (value) => {
    navigate(value)
  }

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
        <nav className="flex-1 px-3 pt-2">
          <ul className="space-y-2">
            <div onClick={() => handleNavigate('/internal/admin/kasir/transaction')} className="flex items-center justify-between w-full rounded-lg hover:bg-gray-200 cursor-pointer" style={activeMenu === 'Transaction' ? {backgroundColor: '#6B7280'}: {}}>
                <NavItem Icon={ScanBarcode} title="Transactions" />
                <ChevronRight/>
            </div>
            <div onClick={() => handleNavigate('/internal/admin/kasir/orders')} className="flex items-center justify-between w-full rounded-lg hover:bg-gray-200 cursor-pointer" style={activeMenu === 'Orders' ? {backgroundColor: '#6B7280'} : {}}>
                <NavItem Icon={Ticket} title="Orders" />
                <ChevronRight/>
            </div>
            <div onClick={() => handleNavigate('/internal/admin/kasir/products')} className="flex items-center justify-between w-full rounded-lg hover:bg-gray-200 cursor-pointer" style={activeMenu === "Product" ? {backgroundColor: '#6B7280'} : {}}>
                <NavItem Icon={Box} title="Products" />
                <ChevronRight/>
            </div>
            <div onClick={() => handleNavigate('/internal/admin/kasir/tables')} className="flex py-3 justify-between items-center cursor-pointer hover:bg-gray-200 rounded-lg" style={activeMenu === "table" ? {backgroundColor: '#6B7280'} : {}}>
                <div className="flex items-center ml-3 space-x-2">
                  <svg  xmlns="http://www.w3.org/2000/svg"  width="26"  height="26"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-brand-databricks"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 17l9 5l9 -5v-3l-9 5l-9 -5v-3l9 5l9 -5v-3l-9 5l-9 -5l9 -5l5.418 3.01" /></svg>
                  <p>Tables</p>
                </div>
                <ChevronRight/>
            </div>
            <div onClick={() => handleNavigate('/internal/admin/kasir/statistiks')} className="flex justify-between items-center cursor-pointer hover:bg-gray-200 rounded-lg" style={activeMenu === "statistik" ? {backgroundColor: '#6B7280'} : {}}>
                <NavItem Icon={ChartNoAxesCombined} title="Statistiks" />
                <ChevronRight/>
            </div>
            <div onClick={() => handleNavigate('/internal/admin/kasir/settings')} className="flex justify-between items-center cursor-pointer hover:bg-gray-200 rounded-lg" style={activeMenu === "settings" ? {backgroundColor: '#6B7280'} : {}}>
                <NavItem Icon={Settings} title="Settings" />
                <ChevronRight/>
            </div>
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t space-y-2">
            <div className="rounded-lg bg-gray-900 hover:bg-gray-500 text-white">
                <NavItem Icon={LogOut} title="Logout" />
            </div>
        </div>
      </div>

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
