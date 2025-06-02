import Sidebar from "../component/sidebar"
import { useState } from "react"
import {Plus, Search} from "lucide-react"


export default function Cashier() {
    const [activeMenu, setActiveMenu] = useState("Cashier")

    return (
        <div className="flex">
            <div className="w-1/10 min-w-[250px]">
                <Sidebar activeMenu={activeMenu}/>
            </div>

            <div className="flex-1">
                {/* header  */}
                <div className="w-full shadow-lg items-center py-5 z-5 bg-white">
                    <p className="font-semibold mx-4 text-lg">Cashier</p>
                </div>

            <div className="p-5">
                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="p-4 cursor-pointer bg-white rounded-lg shadow-md">
                        <CartCashier/>
                    </div>
                    <div className="p-4 cursor-pointer bg-white rounded-lg shadow-md">

                    </div>
                </div>
            </div>
            </div>
        </div>
    )
} 

const products1 = [
    {
        id: 1,
        name: "Product 1",
        image: "https://via.placeholder.com/150",
        quantity: 1,
        price: 1000,
        amount: 1000,
    },
    {
        id: 2,
        name: "Product 2",
        image: "https://via.placeholder.com/150",
        quantity: 2,
        price: 2000,
        amount: 4000,
    },
    {
        id: 3,
        name: "Product 3",
        image: "https://via.placeholder.com/150",
        quantity: 3,
        price: 3000,
        amount: 9000,
    },
]

const CartCashier = ({data}) => {
    const [addProduct, setAddProduct] = useState(false);
    
    return (
        <div>
            {/* add product */}
            <div className="mb-10">
                <div onClick={() => setAddProduct(true)} className="rounded-lg px-5 flex space-x-2 py-1 cursor-pointer bg-gray-800 hover:bg-gray-900 text-white">
                    <Plus/>
                    <p>Product</p>
                </div>
            </div>

            <div className="flex justify-between items-center">
                {/* Order Type Dropdown */}
                <div className="relative group">
                    <button className="flex items-center justify-between w-48 px-2 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500">
                    <span>Choose Order Type</span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    </button>
                    
                    <div className="absolute z-10 hidden w-48 mt-1 bg-white rounded-md shadow-lg group-hover:block">
                        <div className="py-1">
                            <button className="flex items-center w-full px-4 py-3 text-sm text-left text-gray-700 hover:bg-gray-100">
                            <div className="w-2 h-2 mr-2 bg-blue-500 rounded-full"></div>
                            Dine In
                            </button>
                            <button className="flex items-center w-full px-4 py-3 text-sm text-left text-gray-700 hover:bg-gray-100">
                            <div className="w-2 h-2 mr-2 bg-green-500 rounded-full"></div>
                            Takeaway
                            </button>
                        </div>
                    </div>
                </div>

                {/* Payment Method Dropdown */}
                <div className="relative group">
                    <button className="flex items-center justify-between w-56 px-2 py-1 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500">
                    <span>Choose Payment Method</span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    </button>
                    
                    <div className="absolute right-0 z-10 hidden w-64 mt-1 bg-white rounded-md shadow-lg group-hover:block">
                        <div className="py-1">
                            {['CASH', 'BCA', 'BNI', 'BRI', 'Mandiri', 'BJB', 'Permata', 'QRIS'].map((method) => (
                            <button 
                                key={method} 
                                className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                            >
                                <div className="flex items-center justify-center w-8 h-8 mr-3 bg-gray-200 rounded-full">
                                {method === 'QRIS' ? (
                                    <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v2H8V8zm0 4h8v2H8v-2zm0 4h5v2H8v-2z"/>
                                    </svg>
                                ) : (
                                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                                )}
                                </div>
                                {method}
                            </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden mt-5">
                <table className="w-full text-left">
                    <thead className="rounded-lg bg-gray-100">
                        <tr>
                        {["Image", "Product", "Quantity", "Price", "Cost"].map((header) => (
                            <th key={header} className="py-3 px-4 font-medium text-sm">{header}</th>
                        ))}
                        </tr>
                    </thead>
                    <tbody>
                        {products1.map((t, index) => (
                            <tr key={index} className="bg-white text-black border-gray-700 hover:bg-gray-100 transition">
                            <td className="py-3 px-4 ]"><img src={require("../image/443acfe1-aaf4-4c06-9858-74a80fb5c6fa.jpg")} className="w-[55px] h-[55px]"/></td>
                            <td className="py-3 px-4">{t.name}</td>
                            <td className="py-3 px-4">{t.quantity}</td>
                            <td className="py-3 px-4">{t.price}</td>
                            <td className="py-3 px-4">{t.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="border-t border-gray-700 border-b">
                            <td colSpan="4" className="py-3 px-4 font-medium">Subtotal</td>
                            <td className="font-medium">IDR 20000</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div className="flex justify-between mt-5">
                <p>Fulfillment Cost</p>
                <div className="bg-blue-100 rounded-lg p-5">
                    <div className="flex space-x-80 justify-between">
                        <p>Subtotal</p>
                        <p>150.000</p>
                    </div>
                    <div className="flex justify-between">
                        <p>Payment Fee</p>
                        <p>2.000</p>
                    </div>
                    <div className="flex justify-between">
                        <p>pajak</p>
                        <p>5.000</p>
                    </div>
                    <div className="flex text-lg font-semibold justify-between">
                        <p>Total</p>
                        <p>IDR 157.000</p>
                    </div>
                </div>
            </div>

            <div className="rounded-lg justify-center px-5 flex space-x-2 py-1 cursor-pointer mt-5 bg-gray-800 hover:bg-gray-900 text-white">
                <p>Buy</p>
            </div>


            {/* add product */}
                {addProduct && <AddProduct onClose={() => setAddProduct(false)}/>}
        </div>
    )
}


const products = [
    {
      category: 'Makanan',
      items: [
        {
          name: 'Sate Ayam merah maranggi',
          harga: 45000,
          image: 'sate-ayam.png',
          description: 'Sate ayam dengan bumbu kacang.'
        },
        {
          name: 'Nasi Goreng',
          harga: 30000,
          image: 'nasi-goreng.png',
          description: 'Nasi goreng spesial dengan telur dan ayam.'
        },
        {
          name: 'Mie Goreng',
          harga: 25000,
          image: 'mie-goreng.png',
          description: 'Mie goreng dengan sayuran segar dan bumbu rempah.'
        },
        {
          name: 'Mie Aceh',
          harga: 25000,
          image: 'mie-goreng.png',
          description: 'Mie goreng dengan sayuran segar dan bumbu rempah.'
        },
        {
          name: 'Nasi Padang',
          harga: 25000,
          image: 'mie-goreng.png',
          description: 'Mie goreng dengan sayuran segar dan bumbu rempah.'
        },
        {
          name: 'Nasi Padang',
          harga: 25000,
          image: 'mie-goreng.png',
          description: 'Mie goreng dengan sayuran segar dan bumbu rempah.'
        }
      ]
    },
    {
      category: 'Minuman',
      items: [
        {
          name: 'Es Teh Manis',
          harga: 5000,
          image: 'es-teh-manis.png',
          description: 'Es teh manis dingin yang segar.'
        },
        {
          name: 'Kopi Susu',
          harga: 12000,
          image: 'kopi-susu.png',
          description: 'Kopi susu hangat yang nikmat.'
        },
        {
          name: 'Jus Jeruk',
          harga: 8000,
          image: 'jus-jeruk.png',
          description: 'Jus jeruk segar dengan rasa alami.'
        }
      ]
    },
    {
      category: 'Tambahan',
      items: [
        {
          name: 'Kerupuk',
          harga: 3000,
          image: 'kerupuk.png',
          description: 'Kerupuk renyah pendamping makan.'
        },
        {
          name: 'Sambal',
          harga: 2000,
          image: 'sambal.png',
          description: 'Sambal pedas dengan rasa khas.'
        },
        {
          name: 'Pencok',
          harga: 4000,
          image: 'pencok.png',
          description: 'Pencok, sambal kacang dengan tempe goreng.'
        }
      ]
    }
  ]; 

function AddProduct({onClose}) {
    const handleOutsideClick = (event) => {
        if (event.target.id === "modal-background") {
            onClose();
        }
    };
    return (
       <div 
            id="modal-background"
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-20"
            onClick={handleOutsideClick} 
        >
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-screen overflow-y-auto">
                
                {/* Input Search */}
                <div className="relative w-full flex items-center mb-6">
                <Search className="absolute left-3 text-gray-600" size={20} />
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
                />
                </div>

                {/* Produk */}
                <div>
                {products.map((item, index) => (
                    <div id={item.category} className="mb-8" key={item.category}>  
                    <p className="text-2xl font-bold text-gray-700 mb-4">{item.category}</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {item.items.map((item, idx) => (
                        <div key={idx} className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white">
                            <img
                            className="h-32 w-40 object-cover rounded-md mb-3"
                            src={require(`../image/foto1.jpg`)}
                            alt="Product"
                            />
                            <div className="text-center">
                            <p className="text-md font-semibold text-gray-800 line-clamp-2">{item.name}</p>
                            <p className="text-sm text-gray-700">Rp {(item.harga).toLocaleString("id-ID")}</p>
                            </div>
                        </div>
                        ))}
                    </div>
                    </div>
                ))}
                </div>

            </div>
        </div>
    )
}

