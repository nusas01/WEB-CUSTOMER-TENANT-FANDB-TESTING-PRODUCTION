import { useState } from "react"
import { Plus, Search, X } from "lucide-react"

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

export default function CreateTransaction() {
    const [selected, setSelected] = useState("dine-in");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [addProduct, setAddProduct] = useState(false);

    return (
        <div>
            {/* header  */}
            <div className="w-full shadow-lg items-center py-5 z-5 bg-white">
                <p className="font-semibold mx-4 text-lg">Transaction</p>
            </div>

            <div className="w-[80%] flex m-auto h-full my-5">
                <div className="bg-white w-[80%] shadow-lg rounded-lg p-5 self-stretch">
                    <div className="flex justify-between items-center">
                        <p className="text-lg">Products</p>
                        <div onClick={() => setAddProduct(true)} className="rounded-lg px-5 flex space-x-2 py-1 cursor-pointer bg-gray-800 hover:bg-gray-900 text-white">
                            <Plus/>
                            <p>Product</p>
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
                </div>

                <div className="w-[25%] ml-5 self-stretch">
                    <div className="h-[145px] bg-white shadow-lg rounded-lg p-5">
                        <p className="mb-2">Choose Order Type</p>

                        {/* Dine In */}
                        <label
                            className={`cursor-pointer flex items-center gap-3 py-1 rounded-lg transition-all`}
                        >
                            {/* Custom Radio Button */}
                            <div
                            className={`w-5 h-5 flex items-center justify-center border-2 rounded-full transition-all
                                ${selected === "dine-in" ? "border-blue-500" : "border-gray-400"}
                            `}
                            >
                            {selected === "dine-in" && (
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            )}
                            </div>

                            {/* Label + Description */}
                            <div className="flex flex-col tetx-sm">
                                Dine In
                            </div>

                            {/* Hidden Input */}
                            <input
                            type="radio"
                            name="orderType"
                            value="dine-in"
                            checked={selected === "dine-in"}
                            onChange={() => setSelected("dine-in")}
                            className="hidden"
                            />
                        </label>

                        {/* Take Away */}
                        <label
                            className={`cursor-pointer flex items-center gap-3 py-2 rounded-lg transition-all`}
                        >
                            {/* Custom Radio Button */}
                            <div
                            className={`w-5 h-5 flex items-center justify-center border-2 rounded-full transition-all
                                ${selected === "take-away" ? "border-blue-500" : "border-gray-400"}
                            `}
                            >
                            {selected === "take-away" && (
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            )}
                            </div>

                            {/* Label + Description */}
                            <div className="flex flex-col text-sm">
                                Take Away
                            </div>

                            {/* Hidden Input */}
                            <input
                            type="radio"
                            name="orderType"
                            value="take-away"
                            checked={selected === "take-away"}
                            onChange={() => setSelected("take-away")}
                            className="hidden"
                            />
                        </label>
                    </div>

                    <div className="mt-5 bg-white shadow-lg rounded-lg p-5">
                        <p>Choose Payment Method</p>
                        <div className="mt-4 space-y-2">
                            {/* virtual account */}
                            <label
                                className={`cursor-pointer flex items-center gap-3 py-1 rounded-lg transition-all`}
                            >
                                {/* Custom Radio Button */}
                                <div
                                className={`w-5 h-5 flex items-center justify-center border-2 rounded-full transition-all
                                    ${paymentMethod === "va" ? "border-blue-500" : "border-gray-400"}
                                `}
                                >
                                {paymentMethod === "va" && (
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                )}
                                </div>

                                {/* Label + Description */}
                                <div className="flex items-center space-x-5 tetx-sm">
                                    <p>Virtual Account</p>
                                    <img src={require("../image/BCA.png")} alt="BCA" className="w-12 h-10"/>
                                </div>

                                {/* Hidden Input */}
                                <input
                                type="radio"
                                name="orderType"
                                value="va"
                                checked={paymentMethod === "va"}
                                onChange={() => setPaymentMethod("va")}
                                className="hidden"
                                />
                            </label>

                            {/* qris */}
                            <label
                                className={`cursor-pointer flex items-center gap-3 py-1 rounded-lg transition-all`}
                            >
                                {/* Custom Radio Button */}
                                <div
                                className={`w-5 h-5 flex items-center justify-center border-2 rounded-full transition-all
                                    ${paymentMethod === "qr" ? "border-blue-500" : "border-gray-400"}
                                `}
                                >
                                {paymentMethod === "qr" && (
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                )}
                                </div>

                                {/* Label + Description */}
                                <div className="flex items-center space-x-5 tetx-sm">
                                    <p>Qris</p>
                                    <img src={require("../image/QRIS.png")} alt="QRIS" className="w-12 h-10"/>
                                </div>

                                {/* Hidden Input */}
                                <input
                                type="radio"
                                name="orderType"
                                value="qr"
                                checked={paymentMethod === "qr"}
                                onChange={() => setPaymentMethod("qr")}
                                className="hidden"
                                />
                            </label>
                        </div>
                    </div>
                </div>
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
            <div className="bg-white p-5 max-h-screen overflow-y-auto">
                <div className="relative w-full flex items-center max-w-md">
                    {/* Input Search */}
                    <Search className="absolute left-3 transform -translate-y-1/2 text-black" size={20} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-2 border placeholder-black text-black border-black rounded-md focus:outline-none focus:ring-2  focus:border-black-100 transition-all"
                    />
                    {/* Icon Search */}
                </div>
                
                <div>
                    {products.map((item, index) => (
                        <div id={item.category} className="container-category" key={item.category}>  
                            <p className="text-xl font-semibold my-4">{item.category}</p>
                            <div className="grid grid-cols-2 gap-4">
                                {item.items.map((item, index) => (
                                <div className="shadow-md bg-white items-center cursor-pointer flex flex-col" key={index}>
                                    <img className="h-32 w-40" src={require(`../image/foto1.jpg`)} alt="Product"/>
                                    <div className="text-start grid grid-row-3 ml-3 w-[70%]">
                                    <p className="text-md line-clamp-2 font-semibold" style={{color:'black'}}>{item.name}</p>
                                    <div className="spase-bettwen">
                                        <p style={{color: 'black'}}>Rp {(item.harga).toLocaleString("id-ID")}</p>
                                    </div>
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