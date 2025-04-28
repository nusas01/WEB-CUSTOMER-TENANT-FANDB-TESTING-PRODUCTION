import { useNavigate } from "react-router-dom"

export default function OrderDetails() {
    const navigate = useNavigate()

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen shadow-lg rounded-xl">
            <h2 className="text-2xl font-bold border-b pb-4 text-gray-800 mb-4">ORDER DETAILS</h2>

            <div className="mb-10 border-b py-4 text-gray-500">
                <div className="flex grid grid-cols-2 space-x-2 mb-1">
                        <p className="w-1/4">Order ID</p>
                        <p>83y92389-373673-218937</p>
                </div>
                <div className="flex grid grid-cols-2 space-x-2 mb-1">
                        <p className="w-1/4">Type</p>
                        <p>Take Away</p>
                </div>
                <div className="flex grid grid-cols-2 space-x-2 mb-1">
                        <p className="w-1/4">UserName</p>
                        <p>RaihanMalay21</p>
                </div>
            </div>
            {/* Table Header */}
            <div className="grid grid-cols-6 text-gray-600 font-semibold border-b pb-2">
            <p>IMG</p>
            <p>ID</p>
            <p className="col-span-2">NAME</p>
            <p>QUANTITY</p>
            <p className="text-right">TOTAL</p>
            </div>
            
            {/* Order Item */}
            <div className="grid grid-cols-6 items-center text-gray-800 py-4 border-b">
            <img/>
            <p className="font-medium">RZ-SN</p>
            <div className="col-span-2">
                <p className="font-semibold">STARRY NIGHT</p>
                <p className="text-sm text-gray-500">Frame Color: Black</p>
            </div>
            <p className="font-medium">x1</p>
            <p className="text-right font-semibold">USD$ 79.95</p>
            </div>
            
            {/* Subtotal & Fees */}
            <div className="py-4 border-b text-gray-700">
            <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span className="font-medium">USD$ 79.95</span>
            </div>
            <div className="flex justify-between text-gray-500">
                <span>Canada Post Express Shipping</span>
                <span>USD$ 8.00</span>
            </div>
            <div className="flex justify-between text-gray-500">
                <span>Sales Tax</span>
                <span>USD$ 4.40</span>
            </div>
            </div>
            
            {/* Grand Total */}
            <div className="flex justify-between items-center mt-8 text-gray-900 text-lg font-bold">
            <span>Grand Total</span>
            <span>USD$ 92.35</span>
            </div>

            <div className="flex justify-center py-8 items-center space-x-10">
                <button onClick={() => navigate('/internal/admin/kasir/orders')} className="px-16 py-2 bg-gray-200 text-black font-semibold rounded-md hover:bg-gray-300 transition">
                    CANCEL
                </button>
                <button className="px-16 py-2 bg-[#00A67620] text-black font-semibold rounded-md hover:bg-[#00A67630] transition">
                    ACCEPT
                </button>
            </div>
      </div>
    )
}