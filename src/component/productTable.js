import { Pencil, Trash, Search, Plus, Lock } from "lucide-react";
import { useState, useEffect } from "react";

const products = [
    { id: 1, name: "T-shirt for Men", price: 90, image: 'foto1.jpg' },
    { id: 2, name: "Travel Bag Jeans", price: 19.5, image: 'foto1.jpg' },
    { id: 3, name: "Jeans Shorts", price: 70, image: 'foto1.jpg' },
    { id: 4, name: "Sofa for Interior", price: 375, image: 'foto1.jpg' },
    { id: 5, name: "Leather Wallet", price: 375, image: 'foto1.jpg' },
  ];

export default function ProductsTable() {
    const [search, setSearch] = useState("");
    const [addProduct, setAddProduct] = useState(false);
    const [addCategory, setAddCategory] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    return (
        <div>
            {/* header  */}
            <div className="w-full shadow-lg items-center py-5 z-5 bg-white">
                <p className="font-semibold mx-4 text-lg">Products</p>
            </div>

            <div className="p-6 max-w-7xl mx-auto">
                <div className="p-6 flex justify-between rounded-md items-center shadow-lg bg-white text-black">
                    <div className="flex space-x-10">
                        <p>Category : 10</p>
                        <p>Product :  100</p>
                    </div>
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/4 text-black  transform -translate-y-1/2" size={20} />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-1 placeholder-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex space-x-2">
                        <div onClick={() => setAddCategory(true)} className="flex text-white gap-2 cursor-pointer px-4 py-1 rounded-md bg-gray-900 hover:bg-gray-600">
                            <Plus/>
                            Category
                        </div>
                        <div onClick={() => setAddProduct(true)} className="flex text-white gap-2 cursor-pointer px-4 py-1 rounded-md bg-[#00A676] hover:bg-[#00825B]">
                            <Plus/>
                            Product
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="p-6  max-w-7xl mx-auto">
                <div className="bg-white rounded-md shadow-lg p-6">
                    <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
                        <p className="text-lg font-semibold">Makanan</p>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {products
                        .filter((product) => product.name.toLowerCase().includes(search.toLowerCase()))
                        .map((product) => (
                            <div key={product.id} className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white">
                            <img src={require(`../image/${product.image}`)} alt={product.name} className="w-full h-40 rounded-md" />
                            <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
                            <p className="text-gray-600 font-bold">${product.price.toFixed(2)}</p>
                            <div className="flex justify-between gap-2 my-3">
                                <button className="flex items-center gap-1 px-5 py-1 border rounded-md text-red-600 hover:bg-red-100">
                                    <Lock size={14}/> Habis
                                </button>
                                <button  className="flex items-center gap-1 px-5 py-1 border rounded-md text-gray-700 hover:bg-gray-200"
                                onClick={() => setSelectedProduct({
                                    id: product.id,
                                    name: product.name,
                                    category: "Fashion",
                                    price: 90.00,
                                    image: product.image
                                })}
                                >
                                <Pencil size={14} /> Edit
                                </button>
                            </div>
                            <button className="flex items-center gap-1 px-3 py-1 border w-full justify-center rounded-md text-red-600 hover:bg-red-100">
                              <Trash size={14} /> Delete
                            </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* pop up product model */}
            { addProduct && (
                <AddProductModal onClose={() => setAddProduct(false)}/>  
            )}

            {/* pop up category model */}
            { addCategory && (
                <AddCategoryModal onClose={() => setAddCategory(false)}/>
            )}

            {/* pop up update product model */}
            {selectedProduct?.id && (
                <EditProductModal initialProduct={selectedProduct} onClose={() => setSelectedProduct(null)}/>
            )}

        </div>
    )
}

const AddProductModal = ({
  // State values
  name = '',
  category = '',
  price = '',
  image = null,
  previewImage = null,
  showCategoryDropdown = true,

  // State handlers
  onNameChange,
  onCategoryChange,
  onPriceChange,
  onImageChange,
  
  // Actions
  onClose,
  onSubmit,
  
  // UI configuration
  title = 'Tambah Produk Baru',
  submitText = 'Simpan Produk',
}) => {
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageChange({
        file,
        preview: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name,
      category,
      price,
      image
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">Gambar Produk</label>
            <div className="flex items-center justify-center bg-gray-100 py-4 w-full relative">
              <label className="flex flex-col items-center justify-center w-[50%] h-36 border-2 border-dashed border-gray-500 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <span className="text-gray-500 text-sm">upload image product</span>
                )}
              </label>
            </div>
          </div>

          {/* Product Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Nama Produk</label>
            <input
              type="text"
              value={name}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="T-shirt for Men"
              required
              onChange={(e) => onNameChange(e.target.value)}
            />
          </div>

          {/* Category Dropdown */}
          {showCategoryDropdown && (
            <div className="relative">
              <label className="text-sm font-medium text-gray-700">Kategori</label>
              
              {/* Button Trigger */}
              <button 
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="w-full px-4 py-2 border text-gray-700 rounded-lg text-left focus:ring-2 focus:ring-blue-500 outline-none transition-all flex justify-between items-center hover:bg-gray-50"
              >
                {category || "Pilih Kategori"}
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isCategoryDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                  <div className="py-1">
                    {["Makanan", "Fashion", "Interior", "Aksesoris"].map((kategori) => (
                      <button
                        key={kategori}
                        onClick={() => {
                          onCategoryChange(kategori);
                          setIsCategoryDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-blue-50 ${
                          category === kategori ? "font-medium bg-blue-50" : ""
                        }`}
                      >
                        {kategori}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Price Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Harga</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={price}
                className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="90.00"
                step="0.01"
                required
                onChange={(e) => onPriceChange(e.target.value)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


const AddCategoryModal = ({ onClose, onSubmit }) => {
    const [categoryName, setCategoryName] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit({ name: categoryName });
      onClose();
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Tambah Kategori Baru</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ✕
            </button>
          </div>
  
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input Nama Kategori */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nama Kategori</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Contoh: Fashion"
                value={categoryName}
                required
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>
  
            {/* Tombol Aksi */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Simpan Kategori
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const EditProductModal = ({ initialProduct, onClose, onSubmit }) => {
    const [formData, setFormData] = useState(initialProduct);
    const [imagePreview, setImagePreview] = useState(initialProduct.image || null);
  
    useEffect(() => {
      setFormData(initialProduct);
      setImagePreview(initialProduct.image || null);
    }, [initialProduct]);
  
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setFormData({...formData, image: file});
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
      onClose();
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Edit Produk</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ✕
            </button>
          </div>
  
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Gambar */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-gray-700">Gambar Produk</label>
              <div className="flex items-center justify-center w-full bg-gray-100 py-4 rounded-md">
                <label className="flex flex-col items-center justify-center w-[50%] h-36 border-2 border-dashed border-gray-500 rounded-lg cursor-pointer hover:border-blue-500 transition-colors overflow-hidden">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview ? (
                    <img 
                      src={typeof imagePreview === 'string' ? imagePreview : imagePreview}
                      alt="Preview" 
                      className="w-full h-full"
                    />
                  ) : (
                    <span className="text-gray-500">
                      Klik atau seret gambar ke sini
                    </span>
                  )}
                </label>
              </div>
            </div>
  
            {/* Input Nama Produk */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nama Produk</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={formData.name}
                required
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
  
            {/* Input Kategori */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Kategori</label>
              <select
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={formData.category}
                required
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Makanan">Makanan</option>
                <option value="Fashion">Fashion</option>
                <option value="Interior">Interior</option>
                <option value="Aksesoris">Aksesoris</option>
              </select>
            </div>
  
            {/* Input Harga */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Harga</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={formData.price}
                  step="0.01"
                  required
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>
            </div>
  
            {/* Tombol Aksi */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Produk
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };