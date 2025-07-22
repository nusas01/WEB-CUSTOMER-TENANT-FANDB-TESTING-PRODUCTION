import Sidebar from "../component/sidebar"
import { useEffect, useState, forwardRef, useRef } from "react"
import { Pencil, Trash, Search, Plus, Box, Bell, Settings, Package, Tag } from "lucide-react"
import { 
  DeleteConfirmationModal,
  Toast,
  ToastPortal
} from "../component/alert"
import { useSelector, useDispatch } from "react-redux"
import { SpinnerRelative, SpinnerFixed } from "../helper/spinner"
import { useNavigate } from "react-router-dom"
import { createProductInternalSlice, createCategoryInternalSlice } from "../reducers/post"
import { updateInternalSlice } from "../reducers/put" 
import {
  getCategoryAndProductInternalSlice
} from "../reducers/get"
import { dataTempUpdateProductSlice } from "../reducers/notif"
import { availbaleProductlSlice } from "../reducers/patch"
import { deleteProductInternalSlice } from "../reducers/post"
import { 
  fetchCategoryAndProductInternal,
  fetchCategoryInternal, 
} from "../actions/get"
import {
  createCategoryInternal,
  createProductInternal,
  DeleteProductInternal,
} from "../actions/post"
import {
  UpdateProductInternal,
} from "../actions/put"
import {
  availableProductInternal
} from "../actions/patch"

export default function KasirProducts() {
   const dispatch = useDispatch()
    const [activeMenu, setActiveMenu] = useState("Product")
    const [spinnerFixed, setSpinnerFixed] = useState(false)
    const [toast, setToast] = useState(null);

    // handle response add product
    const { resetCreateProductInternal } = createProductInternalSlice.actions
    const { successCreateProductInternal, errorCreateProductInternal } = useSelector((state) => state.createProductInternalState)
    useEffect(() => {
        if (successCreateProductInternal) {
            dispatch(resetCreateProductInternal())
        }
    }, [successCreateProductInternal, dispatch])

    useEffect(() => {
        if (errorCreateProductInternal) {
            setToast({
                message: "there was an error on our server, we are fixing it",
                type: 'error'
            });
            
            const timeout = setTimeout(() => {
                dispatch(resetCreateProductInternal())
            }, 3000)

            return () => clearTimeout(timeout)
        }
    }, [errorCreateProductInternal, dispatch])

    // handle error get category and product 
    const { errorCategoyAndProductIntenal } = useSelector((state) => state.persisted.getCategoryAndProductInternal)
    useEffect(() => {
      if (errorCategoyAndProductIntenal) {
        setToast({
            message: "there was an error on our server, we are fixing it",
            type: 'error'
        });
        
        const timeout = setTimeout(() => {
          dispatch(resetCreateProductInternal())
        }, 3000)

        return () => clearTimeout(timeout)
      }
    }, [errorCategoyAndProductIntenal, dispatch])

    // handle response create category
    const { resetCreateCategoryInternal } = createCategoryInternalSlice.actions
    const { successCreateCategoryInternal, errorFieldCreateCategoryInternal, errorCreateCategoryInternal } = useSelector((state) => state.createCategoryInternalState)
    useEffect(() => {
        if (errorCreateCategoryInternal) {
            setToast({
                message: "there was an error on our server, we are fixing it",
                type: 'error'
            });
            
            const timeout = setTimeout(() => {
                dispatch(resetCreateCategoryInternal())
            }, 3000)

            return () => clearTimeout(timeout)
        }
    }, [errorCreateCategoryInternal])

    useEffect(() => {
        if (successCreateCategoryInternal) {
            setToast({
                message: "Berhasil Menambahkan Category",
                type: 'success'
            });
            
            const timeout = setTimeout(() => {
                dispatch(resetCreateCategoryInternal())
            }, 2000)
    
            return () => clearTimeout(timeout)
        }
    }, [successCreateCategoryInternal])
        
    // handle Response update product
    const {resetDataTempUpdateProduct} = dataTempUpdateProductSlice.actions
    const {resetUpdateProductInternal} = updateInternalSlice.actions
    const {errorUpdateProductInternal, successUpdateProductInternal} = useSelector((state) => state.updateInternalState)
    useEffect(() => {
        if (errorUpdateProductInternal) {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setToast({
                message: "there was an error on our server, we are fixing it",
                type: 'error'
            });
            
            const timeout = setTimeout(() => {
                dispatch(resetDataTempUpdateProduct())
                dispatch(resetUpdateProductInternal())
            }, 2000)

            return () => clearTimeout(timeout)
        }
    }, [errorUpdateProductInternal])

    useEffect(() => {
        if (successUpdateProductInternal) {
            setToast({
                message: "Berhasil Mengupdate Produk",
                type: 'success'
            });
            
            const timeout = setTimeout(() => {
                dispatch(resetDataTempUpdateProduct())
                dispatch(resetUpdateProductInternal())
            }, 2000)

            return () => clearTimeout(timeout)
        }
    }, [successUpdateProductInternal])

    // handle response available product 
    const {resetAvailableProduct} = availbaleProductlSlice.actions
    const {successAvailableProduct, errorAvailableProduct} = useSelector((state) => state.availbaleProductState)
    useEffect(() => {
        if (successAvailableProduct) {
            dispatch(resetAvailableProduct())
        }
    }, [successAvailableProduct])

    useEffect(() => {
        if(errorAvailableProduct) {
             window.scrollTo({ top: 0, behavior: 'smooth' })
            setToast({
                message: "there was an error on our server, we are fixing it",
                type: 'error'
            });
            
            const timeout = setTimeout(() => {
                dispatch(resetAvailableProduct())
            }, 2000)

            return () => clearTimeout(timeout)
        }
    }, [errorAvailableProduct])

    // handle response delete product
    const { resetDeleteProductInternal } = deleteProductInternalSlice.actions
    const { errorDeleteProductInternal, successDeleteProductInternal } = useSelector((state) => state.deleteProductInternalState)
    useEffect(() => {
        if (successDeleteProductInternal) {
            dispatch(resetDeleteProductInternal())
        }
    }, [successDeleteProductInternal])

    useEffect(() => {
        if (errorDeleteProductInternal) {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setToast({
                message: "there was an error on our server, we are fixing it",
                type: 'error'
            });
            
            const timeout = setTimeout(() => {
                dispatch(resetDeleteProductInternal())
            }, 2000)

            return () => clearTimeout(timeout)
        }   
    }, [errorDeleteProductInternal])

    return (
        <div className="flex">
            {/* Toast Notification */}
            {toast && (
                <ToastPortal> 
                  <div className='fixed top-8 left-1/2 transform -translate-x-1/2 z-50'>
                    <Toast 
                        message={toast.message} 
                        type={toast.type} 
                        onClose={() => setToast(null)} 
                        duration={3000}
                    />
                  </div>
                </ToastPortal>
            )}

            {/* Sidebar - Fixed width */}
            <div className="w-1/10 min-w-[250px]">
                <Sidebar 
                activeMenu={activeMenu}
                />
            </div>

            <div className="flex-1">
                <ProductsTable/>
            </div>
        </div>
    )
}

function ProductsTable() {
    const navigate = useNavigate()
    const panelRef = useRef()
    const [search, setSearch] = useState("");
    const [addProduct, setAddProduct] = useState(false)
    const [addCategory, setAddCategory] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [spinnerFixed, setSpinnerFixed] = useState(false)
    const [spinnerProduct, setSpinnerProduct ] = useState(false)
    const [modelConfirmDeleteProduct, setModelConfirmDeleteProduct] = useState(false)
    const [productIdDelete, setProductIdDelete] = useState(null)
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

    const {amountCategory, amountProduct, dataCategoryAndProduct, filteredProduct, loadingCategoryAndProductInternal} = useSelector((state) => state.persisted.getCategoryAndProductInternal)

    useEffect(() => {
     if (amountCategory === 0 && amountProduct === 0 && dataCategoryAndProduct.length === 0) {
        dispatch(fetchCategoryAndProductInternal())
      }
    }, [])

    useEffect(() =>  {
      setSpinnerProduct(loadingCategoryAndProductInternal)
    }, [loadingCategoryAndProductInternal])

    // create product
    const { loadingCreateProductInternal } = useSelector((state) => state.createProductInternalState)
    
    const handleCreateProduct = (data) => {
      const form = new FormData()
      form.append("name", data.name)
      form.append("category_id", data.category_id)
      form.append("price", data.price)
      form.append("desc", data.desc)
      form.append("hpp", data.hpp)
      form.append("image", data.image) 
      
      dispatch(createProductInternal(form))

      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    useEffect(() => {
      setSpinnerFixed(loadingCreateProductInternal)
    }, [loadingCreateProductInternal])


    // handle create category
    const { loadingCreateCategoryInternal } = useSelector((state) => state.createCategoryInternalState)
    useEffect(() => {
      setSpinnerFixed(loadingCreateCategoryInternal)
    }, [loadingCreateCategoryInternal])


    console.log(dataCategoryAndProduct)
    // handle loading update product
    const {loadingUpdateProductInternal} = useSelector((state) => state.updateInternalState)
    useEffect(() => {
      setSpinnerFixed(loadingUpdateProductInternal)
    }, [loadingUpdateProductInternal])


    const {resetDataTempUpdateProduct} = dataTempUpdateProductSlice.actions
    const {updateProductInCategory} = getCategoryAndProductInternalSlice.actions
    const {resetUpdateProductInternal} = updateInternalSlice.actions
    const {successUpdateProductInternal} = useSelector((state) => state.updateInternalState)
    const {dataTempUpdateProduct} = useSelector((state) => state.dataTempUpdateProductState)

    useEffect(() => {
      if (successUpdateProductInternal) {
        var image
        const extension = dataTempUpdateProduct.image?.name
        ? image = dataTempUpdateProduct.id + '.' + dataTempUpdateProduct.image.name.split('.').pop().toLowerCase()
        : image = dataTempUpdateProduct.image

        console.log("DISPATCH dipanggil", {
          categoryId: dataTempUpdateProduct.category_id,
          previousCategoryId: dataTempUpdateProduct.previous_category_id,
          productId: dataTempUpdateProduct.id,
        })

        dispatch(updateProductInCategory({
          categoryId: dataTempUpdateProduct.category_id,
          productId: dataTempUpdateProduct.id,
          updatedProduct: {
            available: dataTempUpdateProduct.available,
            id: dataTempUpdateProduct.id,
            name: dataTempUpdateProduct.name,
            price: dataTempUpdateProduct.price,
            desc: dataTempUpdateProduct.desc,
            hpp: dataTempUpdateProduct.hpp,
            image: image
          }
        }))
        dispatch(resetUpdateProductInternal())
        dispatch(resetDataTempUpdateProduct())
      }
  }, [successUpdateProductInternal])


  // handle available product
  const handleAvailableProduct = (data) => {
    dispatch(availableProductInternal(data))
  }

  // handle delete product
  const handleDeleteProduct = () => {
    console.log("oyyy kenapa perr ini: ", productIdDelete)
    dispatch(DeleteProductInternal({id: productIdDelete}))
    setModelConfirmDeleteProduct(false)
    setProductIdDelete(null)
  }


  // handle search product
  const { searchProductByName } = getCategoryAndProductInternalSlice.actions
  useEffect(() => {
    dispatch(searchProductByName(search))
  }, [search, dispatch])

    return (
        <div>
            { spinnerFixed && (
              <SpinnerFixed colors={'fill-gray-900'}/>
            )}

            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl flex items-center justify-center">
                        <Box className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Products Management</h1>
                        <p className="text-gray-600 text-xs">Kelola produk dan pantau status persediaan</p>
                    </div>
                    </div>
                    <div className="flex items-center gap-3">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Bell className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => navigate('/internal/admin/settings')}>
                        <Settings className="w-5 h-5 text-gray-600" />
                    </button>
                    </div>
                </div>
                </div>
            </div>

            { modelConfirmDeleteProduct && (
              <DeleteConfirmationModal 
              onConfirm={handleDeleteProduct}
              onCancel={() => {
                setProductIdDelete(null)
                setModelConfirmDeleteProduct(false)
              }} 
              colorsType={"internal"}/>
            )}

            <div className="p-6 max-w-7xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-8 py-6 border-b border-gray-100">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Stats Cards */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Tag className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Categories</p>
                          <p className="text-2xl font-bold text-gray-900">{amountCategory}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <Package className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Products</p>
                          <p className="text-2xl font-bold text-gray-900">{amountProduct}</p>
                        </div>
                      </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute inset-y-0 left-4 my-auto text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons Section */}
                <div className="px-8 py-4 bg-white">
                  <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                    <button
                      onClick={() => setAddCategory(true)}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 shadow-lg hover:shadow-xl"
                    >
                      <Plus size={18} />
                      Add Category
                    </button>
                    
                    <button
                      onClick={() => setAddProduct(true)}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-[#00A676] hover:bg-[#00825B] text-white rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 shadow-lg hover:shadow-xl z-10 relative"
                    >
                      <Plus size={18} />
                      Add Product
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 max-w-7xl mx-auto">
              <div className="bg-white rounded-md  min-h-[70vh] shadow-lg p-6">
                { !spinnerProduct ? (
                  <>
                    {dataCategoryAndProduct && dataCategoryAndProduct.length > 0 ? (
                      (Array.isArray(filteredProduct) && filteredProduct.length > 0 ? filteredProduct : dataCategoryAndProduct).map((category) => (
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
                                <div className="overflow-hidden rounded-lg mb-3 bg-gray-100">
                                  <img
                                    src={
                                      product.image instanceof File
                                        ? URL.createObjectURL(product.image) 
                                        : `/image/${product.image}`         
                                    }
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
                                    onClick={() => handleAvailableProduct({id: product.id})}
                                    className={`py-2 text-sm rounded-lg ${
                                      product.available
                                        ? "text-green-500 border border-green-500 hover:bg-gray-50"
                                        : "text-red-500 border border-red-500 hover:bg-gray-50"
                                    }`}
                                  >
                                    {product.available ? "Available" : "Unavailable"}
                                  </button>

                                  
                                  <div
                                    onClick={() => setSelectedProduct({ 
                                      id: product.id,
                                      category_id: category.id, 
                                      category_name: category.name,
                                      name: product.name,
                                      price: product.price,
                                      desc: product.desc,
                                      hpp: product.hpp,
                                      image: product.image,
                                      available: product.available,
                                    })}
                                    className="flex justify-center space-x-2 items-center py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
                                  >
                                    <Pencil width={15} height={15}/>
                                    <p>Edit</p>
                                  </div>
                                </div>
                                
                                <div
                                  onClick={() => {
                                    setProductIdDelete(product.id)
                                    setModelConfirmDeleteProduct(true)
                                  }}
                                  className="flex justify-center space-x-2  items-center w-full mt-2 py-2 text-sm bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-red-600"
                                >
                                  <Trash width={17} height={17}/>
                                  <p>Hapus</p>
                                </div>
                              </div>
                              ))}
                            </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-6">
                          {/* Animated Icon Container */}
                          <div className="relative mb-6">
                            {/* Outer glow effect */}
                            <div className="absolute -inset-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                            
                            {/* Middle ring */}
                            <div className="absolute -inset-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full opacity-50"></div>
                            
                            {/* Icon container */}
                            <div className="relative bg-white p-6 rounded-full shadow-2xl border border-gray-100 transform transition-all duration-300 hover:scale-105">
                              <Package className="h-14 w-14 text-gray-400 stroke-1" />
                            </div>
                          </div>

                          {/* Content */}
                          <div className="text-center max-w-lg mx-auto space-y-4">
                            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                              Belum Ada Produk
                            </h2>
                            
                            <p className="text-gray-500 text-lg sm:text-xl leading-relaxed">
                              {search
                                ? `Tidak ada produk yang cocok dengan pencarian "${search}"`
                                : "Dashboard produk masih kosong. Mulai tambahkan produk pertama Anda!"}
                            </p>
                            
                            {/* Action buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                              {search && (
                                <button
                                  onClick={() => setSearch("")}
                                  className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-medium transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 shadow-sm hover:shadow-md"
                                >
                                  Hapus Filter
                                </button>
                              )}
                              
                              <button onClick={() => setAddProduct(true)}  className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full font-medium transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 shadow-lg hover:shadow-xl">
                                + Tambah Produk
                              </button>
                            </div>
                          </div>

                          {/* Decorative elements */}
                          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-200 rounded-full opacity-60 animate-bounce"></div>
                          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-200 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-indigo-200 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '1s' }}></div>
                        </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center min-h-[68vh]">
                    <SpinnerRelative/>
                  </div>
                )}
              </div>
            </div>



            {/* pop up product model */}
            { addProduct && (
                <AddProductModal 
                onClose={() => setAddProduct(false)}
                onSubmit={(formData) => handleCreateProduct(formData)}
                panelRef={panelRef}
                />  
            )}

            {/* pop up category model */}
            { addCategory && (
                <AddCategoryModal 
                onClose={() => setAddCategory(false)}
                onSubmit={(data) => dispatch(createCategoryInternal(data))}
                />
            )}

            {/* pop up update product model */}
            {selectedProduct?.id && (
                <EditProductModal 
                initialData={selectedProduct} onClose={() => setSelectedProduct(null)}/>
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
  console.log("dibawah ini adalah data formData: ", formData)
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

 useEffect(() => {
    function handleClickOutside(event) {
      if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])


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
              className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-600"
            >
              {submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});



const AddCategoryModal = ({ onClose, onSubmit }) => {
    const [categoryName, setCategoryName] = useState('')
  
    const handleSubmit = (e) => {
      e.preventDefault()
      onSubmit({ category_name: categoryName })
      onClose()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  
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
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all"
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
                className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Simpan Kategori
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  const EditProductModal = ({
  onClose,
  onSubmit,
  initialData, 
  title = "Edit Produk",
  submitText = "Update Produk",
}) => {
  const dispatch = useDispatch()
  const modalContentRef = useRef(null)
  const [spinneCategory, setSpinnerCategory] = useState(false)

  const [formData, setFormData] = useState({
    id: null,
    name: '',
    category_id: null,
    price: '',
    desc: '',
    hpp: '',
    image: null,
    available: initialData.available,
    previewImage: null,
  })

  const [category, setCategory] = useState({
    id: null,
    name: '',
  })

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || null,
        name: initialData.name || '',
        category_id: initialData.category_id || null,
        price: initialData.price || '',
        desc: initialData.desc || '',
        hpp: initialData.hpp || '',
        image: initialData.image || null,
        available: initialData.available,
      });

      setCategory({
        id: initialData.category_id || null,
        name: initialData.category_name || '',
      })
    }
  }, [initialData])

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }))
    }
  }
  console.log("oyyyyyyyyyyyyyyyy: ", formData)
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleChangeCategory = (id, name) => {
    setCategory({ id, name })
    setFormData((prev) => ({ ...prev, category_id: id }))
  }

  const { dataCategory, loadingCategoryInternal } = useSelector((state) => state.persisted.getCategoryInternal);

  useEffect(() => {
    if (!dataCategory || dataCategory.length <= 0) {
      dispatch(fetchCategoryInternal())
    }
  }, [])

  useEffect(() => {
    setSpinnerCategory(loadingCategoryInternal)
  }, [loadingCategoryInternal])

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])


  // handle Update product
  const {addDataTempUpdateProduct} = dataTempUpdateProductSlice.actions
 
   const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(UpdateProductInternal(formData))
    dispatch(addDataTempUpdateProduct(formData))
    onClose()
  }


  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div ref={modalContentRef} className="bg-white rounded-xl mt-24 w-full max-w-md p-4 space-y-2 flex flex-col">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>

          <form onSubmit={(e) => handleSubmit(e)} className="space-y-2 pt-2 flex-grow">
            {/* Upload Gambar */}
            <div className="flex flex-col space-y-1">
              <div className="flex items-center justify-center bg-gray-100 py-4 w-full relative">
                <label className="flex flex-col items-center justify-center w-[50%] h-36 border-2 border-dashed border-gray-500 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    <img 
                    src={
                      formData.image instanceof File
                        ? URL.createObjectURL(formData.image) 
                        : `/image/${formData.image}`         
                    }
                    alt="Preview" 
                    className="w-full h-full object-cover rounded-lg" 
                    />
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
                required
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>

            {/* Harga Jual */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Harga Jual</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                <input
                  type="number"
                  value={formData.price}
                  className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  step="0.01"
                  required
                  onChange={(e) => handleChange("price", e.target.value)}
                />
              </div>
            </div>

            {/* HPP */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Harga Pokok (HPP)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                <input
                  type="number"
                  value={formData.hpp}
                  className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  step="0.01"
                  required
                  onChange={(e) => handleChange("hpp", e.target.value)}
                />
              </div>
            </div>

            {/* Kategori */}
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
                <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg">
                  {spinneCategory && <SpinnerRelative />}
                  {!dataCategory || dataCategory.length > 0 && (
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

            {/* Deskripsi */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Deskripsi</label>
              <textarea
                value={formData.desc}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
                rows={3}
                onChange={(e) => handleChange("desc", e.target.value)}
              />
            </div>

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
                type="submit"
                className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-600"
              >
                {submitText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}