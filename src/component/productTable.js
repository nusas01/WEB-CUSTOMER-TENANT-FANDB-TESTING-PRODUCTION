import { Pencil, Trash, Search, Plus, Lock } from "lucide-react"
import { useState, useEffect, forwardRef, useRef } from "react"
import { 
  fetchCategoryAndProductInternal,
  fetchCategoryInternal, 
} from "../actions/get"
import {
  UpdateProductInternal,
  createCategoryInternal,
  createProductInternal,
} from "../actions/post"
import {
  createProductInternalSlice
} from "../reducers/post"
import {
  getCategoryAndProductInternalSlice
} from "../reducers/get"
import { useDispatch, useSelector } from "react-redux"
import { SpinnerRelative, SpinnerFixed } from "../helper/spinner"
import { ErrorAlert, SuccessAlert } from "./alert"

const products = [
    { id: 1, name: "T-shirt for Men", price: 90, image: 'foto1.jpg' },
    { id: 2, name: "Travel Bag Jeans", price: 19.5, image: 'foto1.jpg' },
    { id: 3, name: "Jeans Shorts", price: 70, image: 'foto1.jpg' },
    { id: 4, name: "Sofa for Interior", price: 375, image: 'foto1.jpg' },
    { id: 5, name: "Leather Wallet", price: 375, image: 'foto1.jpg' },
  ]

export default function ProductsTable() {
    const panelRef = useRef()
    const [search, setSearch] = useState("");
    const [addProduct, setAddProduct] = useState(false)
    const [addCategory, setAddCategory] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [spinnerFixed, setSpinnerFixed] = useState(false)
    const [spinnerProduct, setSpinnerProduct ] = useState(false)
    const [inputProductSuccess, setInputProductSuccess] = useState(null)
    const [error, setError] = useState(false)
    const dispatch = useDispatch()

     useEffect(() => {
        function handleClickOutside(event) {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
            setAddProduct(false)  
            }
        }

        
        document.addEventListener("mousedown", handleClickOutside)
        

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [addProduct])  

    const {amountCategory, amountProduct, dataCategoryAndProduct, errorCategoyAndProductIntenal, loadingCategoryAndProductInternal} = useSelector((state) => state.persisted.getCategoryAndProductInternal)

    useEffect(() => {
     if ((amountCategory === 0 && amountProduct === 0) && dataCategoryAndProduct.length === 0) {
        dispatch(fetchCategoryAndProductInternal())
      }
    }, [dispatch])

    useEffect(() =>  {
      setSpinnerProduct(loadingCategoryAndProductInternal)
    }, [loadingCategoryAndProductInternal])

    useEffect(() => {
      if (errorCategoyAndProductIntenal) {
        setError(true)
        const timeout = setTimeout(() => {
          setError(false)
          dispatch(resetCreateProductInternal())
        }, 3000)

        return () => clearTimeout(timeout)
      }
    }, [errorCategoyAndProductIntenal])


    // create product
    const { resetCreateProductInternal } = createProductInternalSlice.actions
    const { successCreateProductInternal, errorCreateProductInternal, errorFieldCreateProductInternal, loadingCreateProductInternal } = useSelector((state) => state.createProductInternalState)
    
    const handleCreateProduct = ({data}) => {
      dispatch(createProductInternal(data))
    }

    useEffect(() => {
      if (errorCreateProductInternal) {
        setError(true)
        const timeout = setTimeout(() => {
          setError(false)
          dispatch(resetCreateProductInternal())
        }, 3000)

        return () => clearTimeout(timeout)
      }
    }, [errorCreateProductInternal, dispatch])


    useEffect(() => {
      setInputProductSuccess('Berhasil Memasukkan Product')
      
      const timeout = setTimeout(() => {
        setInputProductSuccess(null)
        dispatch(resetCreateProductInternal())
      }, 3000)

      return () => clearTimeout(timeout)
    }, [successCreateProductInternal, dispatch])

    useEffect(() => {
      setSpinnerFixed(loadingCreateProductInternal)
    }, [loadingCreateProductInternal])

    return (
        <div>
            { spinnerFixed && (
              <SpinnerFixed/>
            )}

            { inputProductSuccess && (
              <SuccessAlert message={inputProductSuccess}/>
            )}

            { error && (
              <ErrorAlert message={"there was an error on our server, we are fixing it"}/>
            )}
            {/* header  */}
            <div className="w-full shadow-lg items-center py-5 z-5 bg-white">
                <p className="font-semibold mx-4 text-lg">Products</p>
            </div>

            <div className="p-6 max-w-7xl mx-auto">
                <div className="p-6 flex justify-between rounded-md items-center shadow-lg bg-white text-black">
                    <div className="flex space-x-10">
                        <p>Category : {amountCategory}</p>
                        <p>Product :  {amountProduct}</p>
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
            
            <div className="p-6 max-w-7xl mx-auto">
              <div className="bg-white rounded-md shadow-lg p-6 mb-8">
                { spinnerProduct && (
                  <SpinnerRelative/>
                )}
                {dataCategoryAndProduct && dataCategoryAndProduct.length > 0 ? (
                  dataCategoryAndProduct.map((category) => (
                    <div key={category.id}>
                      {/* Nama Kategori */}
                       <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
                          <p className="text-lg font-semibold">{category.name}</p>
                        </div>

                        {/* Grid Produk */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                          {(category.product || []).filter(product =>
                            product.name.toLowerCase().includes(search.toLowerCase())
                          ).map((product) => (
                            <div
                            key={product.id}
                            className="border border-gray-200 rounded-xl p-3 bg-white shadow-sm transition-all hover:shadow-md relative"
                          >
                            {!product.available && (
                              <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10 rounded-xl">
                                <span className="text-red-500 font-medium py-1 px-3 rounded-full bg-red-50 text-sm">
                                  Stok Habis
                                </span>
                              </div>
                            )}

                            <div className="overflow-hidden rounded-lg mb-3 bg-gray-100">
                              <img
                                src={`/image/${product.image}`}
                                alt={product.name}
                                className="w-full h-[20vh] object-cover"
                              />
                            </div>

                            <div className="space-y-1 mb-4">
                              <h3 className="font-medium text-gray-900 line-clamp-1">{product.name}</h3>
                              <p className="text-gray-700 font-semibold">Rp {product.price.toLocaleString("id-ID")}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <button
                                className={`py-2 text-sm rounded-lg ${
                                  product.available
                                    ? "text-green-600 bg-green-50 hover:bg-green-100"
                                    : "text-red-600 bg-red-50"
                                }`}
                              >
                                {product.available ? "Tersedia" : "Habis"}
                              </button>
                              
                              <div
                                onClick={() => product.available && setSelectedProduct({ ...product, category: category.name })}
                                className="flex justify-center space-x-2 items-center py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
                              >
                                <Pencil width={15} height={15}/>
                                <p>Edit</p>
                              </div>
                            </div>
                            
                            <div className="flex justify-center space-x-2  items-center w-full mt-2 py-2 text-sm bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-red-600">
                              <Trash width={17} height={17}/>
                              <p>Hapus</p>
                            </div>
                          </div>
                          ))}
                        </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="relative mb-5">
                      <div className="absolute -inset-4 bg-gray-200 rounded-full blur-md opacity-70 animate-pulse"></div>
                      <div className="relative bg-white p-6 rounded-full shadow-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-16 w-16 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-700 mb-2">Tidak Ada Produk Ditemukan</h3>
                    <p className="text-gray-500 max-w-md text-center mb-6">
                      {search
                        ? `Hasil pencarian "${search}" tidak ditemukan`
                        : "Belum ada produk yang tersedia untuk kategori ini"}
                    </p>

                    <button
                      onClick={() => setSearch("")}
                      className="px-6 py-3 bg-gray-800 hover:bg-gray-600 text-white rounded-full shadow-md transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                    >
                      Reset Pencarian
                    </button>
                  </div>
                )}
              </div>
            </div>



            {/* pop up product model */}
            { addProduct && (
                <AddProductModal 
                onClose={() => setAddProduct(false)}
                onSubmit={handleCreateProduct}
                panelRef={panelRef}
                />  
            )}

            {/* pop up category model */}
            { addCategory && (
                <AddCategoryModal 
                onClose={() => setAddCategory(false)}

                />
            )}

            {/* pop up update product model */}
            {selectedProduct?.id && (
                <EditProductModal 
                initialProduct={selectedProduct} onClose={() => setSelectedProduct(null)}/>
            )}

        </div>
    )
}


const AddProductModal = forwardRef(({
  onClose,
  onSubmit,
  title = "Tambah Produk Baru",
  submitText = "Simpan Produk",
}) => {
  const dispatch = useDispatch()
  const modalContentRef = useRef(null)
  const [spinneCategory, setSpinnerCategory] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category_id: null,
    price: '',
    desc: '',
    hpp: '',
    image: null,
    previewImage: null,
  })
  const [category, setCategory] = useState({
    id: null, 
    name: '',
  })

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        previewImage: URL.createObjectURL(file),
      }))
    }
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  const handleChangeCategory = (id, name) => {
    setCategory({
      id: id, 
      name: name,

    })
    setFormData((prev) => ({
      ...prev, 
      category_id: id,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onClose()
    onSubmit(formData)
  }

  // Add the handleClickOutside logic directly within the modal component
  // This is a common pattern for modals to encapsulate their own behavior.
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
        onClose(); // Call the onClose prop to close the modal
      }
    }

    // Attach the event listener to the document
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]); // Dependency array: re-run if onClose changes (though it's usually stable)



  // get category
  const { dataCategory, loadingCategoryInternal } = useSelector((state) => state.persisted.getCategoryInternal)

  useEffect(() => {
    if (!dataCategory || dataCategory.length <= 0) {
      dispatch(fetchCategoryInternal())
    }
  }, [])

  useEffect(() => {
    setSpinnerCategory(loadingCategoryInternal)
  }, [loadingCategoryInternal])


  return (
    // This outer div is the backdrop, it should not have the ref for outside clicks
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto backdrop-blur-sm flex items-center justify-center p-4 z-50">
      {/* Apply the ref to the actual modal content box */}
      <div ref={modalContentRef} className="bg-white rounded-xl mt-24 w-full max-w-md p-4 space-y-2 flex flex-col">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* The form itself will now be the scrollable area */}
        <form onSubmit={handleSubmit} className="space-y-2 pt-2  flex-grow">
          {/* Gambar Produk */}
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-center bg-gray-100 py-4 w-full relative">
              <label className="flex flex-col items-center justify-center w-[50%] h-36 border-2 border-dashed border-gray-500 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {formData.previewImage ? (
                  <img src={formData.previewImage} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <span className="text-gray-500 text-sm">Upload image product</span>
                )}
              </label>
            </div>
          </div>

          {/* Nama Produk */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Nama Produk</label>
            <input
              type="text"
              value={formData.name}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="T-shirt for Men"
              required
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          {/* Deskripsi Produk */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Deskripsi</label>
            <textarea
              value={formData.desc}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Deskripsi produk"
              required
              rows={3}
              onChange={(e) => handleChange("desc", e.target.value)}
            />
          </div>

          {/* Harga Produk */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Harga Jual</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
              <input
                type="number"
                value={formData.price}
                className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="90000"
                step="0.01"
                required
                onChange={(e) => handleChange("price", e.target.value)}
              />
            </div>
          </div>

          {/* Harga Pokok Penjualan */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Harga Pokok (HPP)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
              <input
                type="number"
                value={formData.hpp}
                className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="60000"
                step="0.01"
                required
                onChange={(e) => handleChange("hpp", e.target.value)}
              />
            </div>
          </div>

          {/* Dropdown Kategori */}
          <div className="relative">
            <label className="text-sm font-medium text-gray-700">Kategori</label>
            <button
              type="button"
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              className="w-full px-4 py-2 border text-gray-700 rounded-lg text-left flex justify-between items-center hover:bg-gray-50"
            >
              {category.name || "Pilih Kategori"}
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isCategoryDropdownOpen && (
              <div className="absolute z-50 w-full min-h-10vh mt-1 bg-white border rounded-md shadow-lg">
                { spinneCategory && (
                  <SpinnerRelative/>
                )}
                { !dataCategory || dataCategory.length > 0 && (
                  <div className="py-1">
                    {dataCategory.map((kategori) => (
                      <button
                        key={kategori.id}
                        type="button"
                        onClick={() => {
                          handleChangeCategory(kategori.id, kategori.name);
                          setIsCategoryDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-blue-50 ${
                          category.id === kategori.id ? "font-medium bg-blue-50" : ""
                        }`}
                      >
                        {kategori.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </form>

        {/* Tombol Aksi */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            type="submit" // Ensure this button is inside the form or submits it
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {submitText}
          </button>
        </div>
      </div>
    </div>
  );
});



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