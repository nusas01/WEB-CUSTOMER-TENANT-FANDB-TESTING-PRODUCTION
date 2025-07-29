import "../style/add.css"
import { useState } from 'react';
import { useDispatch } from "react-redux";
import { addItem, addItemCashier } from "../reducers/cartSlice";

// type CUSTOMER, INTERNAL
export const AddProductToCart = ({ onClose, id, name, desc, harga, image, type }) => {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const amountPrice = quantity * harga

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const dispatch = useDispatch();

  const handleAddItem = (name, harga, image, amountPrice, quantity) => {
      const newItem = {id, name, harga, image, notes, amountPrice, quantity}
      if (type === "CUSTOMER") {
        dispatch(addItem(newItem))
      }
      if (type === "INTERNAL") {
        dispatch(addItemCashier(newItem))
      }
      onClose()
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value === '0') {
      setQuantity(1)
      return
    }
    setQuantity(value === '' ? '' : Number(value));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-20">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-2xl font-bold text-gray-800">Tambah ke Keranjang</h3>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-3">
          {/* Product Info */}
          <div className="flex items-center space-x-4">
            <img 
              src={`/image/${image}`} 
              alt="Product" 
              className="w-full h-48 rounded-xl object-cover"
            />
            
          </div>
            
          <div style={{display: 'flex', flexDirection: 'column'}}>
              <h4 className="text-lg font-semibold text-gray-800">{name}</h4>
              <p className="text-gray-600 mb-4">{desc}</p>
              <p className="text-gray-600">Rp {(harga).toLocaleString('id-ID')}</p>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Jumlah</label>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleDecrement}
                className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                className="wq-20 text-center border-0 text-lg font-medium focus:ring-0"
                min="1"
              />
              <button 
                onClick={handleIncrement}
                className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Catatan</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional"
              className="w-full p-3 border rounded-lg text-sm focus:ring-2 h-[50px] focus:ring-blue-500 focus:border-transparent"
              rows="3"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 text-sm py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Batal
          </button>
          <button
            className={`px-6 text-sm py-2 text-white rounded-lg ${type === "CUSTOMER" ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-900'} transition-colors`}
            onClick={() => handleAddItem(name, harga, image, amountPrice, quantity)}
            style={{padding: '10px 15px'}}
          >
            Tambah ke Keranjang - Rp {(amountPrice).toLocaleString('id-ID')}
          </button>
        </div>
      </div>
    </div>
  );
};