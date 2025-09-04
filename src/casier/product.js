import Sidebar from "../component/sidebar"
import { useEffect, useState, forwardRef, useRef } from "react"
import { 
  Pencil, 
  Trash, 
  FolderPlus, 
  X, 
  List, 
  Trash2, 
  Search, 
  Plus, 
  Box, 
  Menu, 
  Settings, 
  Package, 
  Tag, 
  Maximize, 
  Upload,
  ImageIcon,
  ChevronDown,
  FileText,
  Minimize,
  DollarSign,
} from "lucide-react"
import { 
  DeleteConfirmationModal,
  Toast,
  ToastPortal
} from "../component/alert"
import { useSelector, useDispatch } from "react-redux"
import { SpinnerRelative, SpinnerFixed } from "../helper/spinner"
import { useFullscreen, useElementHeight } from "../helper/helper"
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
  navbarInternalSlice,
  headerHiddenInternalSlice,
} from "../reducers/reducers"
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
import {deleteCategoryInternal} from "../actions/delete"
import {
  deleteCategoryInternalSlice, 
} from "../reducers/delete"
import { AccessDeniedModal } from "../component/model"

export default function KasirProducts() {
    const dispatch = useDispatch()
    const [activeMenu, setActiveMenu] = useState("Product")
    const [toast, setToast] = useState(null);    

    // handle response add product
    const { resetCreateProductInternal } = createProductInternalSlice.actions
    const { successCreateProductInternal, errorCreateProductInternal } = useSelector((state) => state.createProductInternalState)
    useEffect(() => {
        if (successCreateProductInternal) {
            setToast({
                message: "Berhasil menambahkan product baru",
                type: 'success'
            });
            
            const timeout = setTimeout(() => {
                dispatch(resetCreateProductInternal())
            }, 2000)
    
            return () => clearTimeout(timeout)
        }
    }, [successCreateProductInternal])

    // handle error get category and product 
    const { errorCategoyAndProductIntenal } = useSelector((state) => state.persisted.getCategoryAndProductInternal)

    // handle response create category
    const { resetCreateCategoryInternal } = createCategoryInternalSlice.actions
    const { successCreateCategoryInternal, errorFieldCreateCategoryInternal, errorCreateCategoryInternal } = useSelector((state) => state.createCategoryInternalState)
    useEffect(() => {
        if (successCreateCategoryInternal) {
            setToast({
                message: "Berhasil Menambahkan Category Baru",
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

    // handle response delete product
    const { resetDeleteProductInternal } = deleteProductInternalSlice.actions
    const { errorDeleteProductInternal, successDeleteProductInternal } = useSelector((state) => state.deleteProductInternalState)
    useEffect(() => {
        if (successDeleteProductInternal) {
           setToast({
                message: "Berhasil Menghapus Produk",
                type: 'success'
            });
            
            const timeout = setTimeout(() => {
                dispatch(resetDeleteProductInternal())
            }, 2000)

            return () => clearTimeout(timeout)
        }
    }, [successDeleteProductInternal])

    // handle response delete category
    const { resetDeleteCategoryInternal } = deleteCategoryInternalSlice.actions
    const { successDeleteCategory, errorDeleteCategory, errorHasProductDeleteCategory } = useSelector((state) => state.deleteCategoryInternalState) 
    useEffect(() => {
        if (successDeleteCategory) {
            setToast({
                message: "Berhasil menghapus category",
                type: 'success'
            });
            
            const timeout = setTimeout(() => {
                dispatch(resetDeleteCategoryInternal())
            }, 2000)

            return () => clearTimeout(timeout)
        }
    }, [successDeleteCategory])

    useEffect(() => {
      if (errorHasProductDeleteCategory) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setToast({
            message: errorHasProductDeleteCategory,
            type: 'error'
        });

        const timeOut = setTimeout(() => {
          dispatch(resetDeleteCategoryInternal())
        }, 4000)

        return () => clearTimeout(timeOut)
      }
    }, [errorHasProductDeleteCategory])

    useEffect(() => {
        if (errorDeleteProductInternal || errorDeleteCategory || errorAvailableProduct || errorUpdateProductInternal || errorCreateCategoryInternal || errorCategoyAndProductIntenal || errorCreateProductInternal) {
            setToast({
                message: "there was an error on our server, we are fixing it",
                type: 'error'
            });
            
            const timeout = setTimeout(() => {
                dispatch(resetDeleteProductInternal())
                dispatch(resetDeleteCategoryInternal())
                dispatch(resetAvailableProduct())
                dispatch(resetDataTempUpdateProduct())
                dispatch(resetUpdateProductInternal())
                dispatch(resetCreateCategoryInternal())
                dispatch(resetCreateProductInternal())
            }, 2000)

            return () => clearTimeout(timeout)
        }   
    }, [errorDeleteProductInternal, errorDeleteCategory, errorAvailableProduct, errorUpdateProductInternal, errorCreateCategoryInternal, errorCategoyAndProductIntenal, errorCreateProductInternal])

    // handle full screen
    // maxsimaz minimaz layar
    const contentRef = useRef(null);
    const { isFullScreen, toggleFullScreen } = useFullscreen(contentRef);

    // handle navbar ketika ukuran table dan hp
    const { isOpen, isMobileDeviceType } = useSelector((state) => state.persisted.navbarInternal)

    return (
        <div className="flex relative bg-gray-50">
            {/* Toast Notification */}
            {toast && (
                <ToastPortal> 
                  <div className='fixed top-20 left-1/2 transform -translate-x-1/2 z-100'>
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
            {(!isFullScreen && (!isMobileDeviceType || (isOpen && isMobileDeviceType))) && (
              <div className="w-1/10 z-50 min-w-[290px]">
                  <Sidebar 
                  activeMenu={activeMenu}
                  />
              </div>
            )}

             <div
              ref={contentRef}
              className={`flex-1 bg-gray-50 ${isFullScreen ? 'w-full h-screen overflow-y-auto' : ''}`}
            >
                <ProductsTable
                isFullScreen={isFullScreen}
                fullscreenchange={toggleFullScreen}
                />
            </div>
        </div>
    )
}

function ProductsTable({isFullScreen, fullscreenchange}) {
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
    const [showAccessDenied, setShowAccessDenied] = useState(false);

    const dispatch = useDispatch()

    // handle data employee internal
    const {dataEmployeeInternal} = useSelector((state) => state.persisted.getDataEmployeeInternal)
  

     // handle hidden header
    const {setHeaderHidden} = headerHiddenInternalSlice.actions
    const {isHidden} = useSelector((state) => state.headerHiddenInternalState)

     useEffect(() => {
        function handleClickOutside(event) {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
            setAddProduct(false)  
            dispatch(setHeaderHidden(false))
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
      dispatch(setHeaderHidden(loadingCreateProductInternal))
    }, [loadingCreateProductInternal])


    // handle create category
    const { loadingCreateCategoryInternal } = useSelector((state) => state.createCategoryInternalState)
    useEffect(() => {
      setSpinnerFixed(loadingCreateCategoryInternal)
      dispatch(setHeaderHidden(loadingCreateCategoryInternal))
    }, [loadingCreateCategoryInternal])


    console.log(dataCategoryAndProduct)
    // handle loading update product
    const {loadingUpdateProductInternal} = useSelector((state) => state.updateInternalState)
    useEffect(() => {
      setSpinnerFixed(loadingUpdateProductInternal)
      dispatch(setHeaderHidden(loadingUpdateProductInternal))
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
    dispatch(setHeaderHidden(false))
    setProductIdDelete(null)
  }

  // handle search product
  const { searchProductByName } = getCategoryAndProductInternalSlice.actions
  useEffect(() => {
    dispatch(searchProductByName(search))
  }, [search, dispatch])

  // handle sidebar and elemant header yang responsice
  const { ref: headerRef, height: headerHeight } = useElementHeight();
  const { setIsOpen } = navbarInternalSlice.actions
  const { isOpen, isMobileDeviceType } = useSelector((state) => state.persisted.navbarInternal)

  // handle delete category
  const { dataCategory } = useSelector((state) => state.persisted.getCategoryInternal)
  useEffect(() => {
    if (dataCategory.length === 0) {
      dispatch(fetchCategoryInternal())
    }
  }, [])

  console.log("data category ini adalah: ", dataCategory)

  const { loadingDeleteCategory } = useSelector((state) => state.deleteCategoryInternalState)
  const handleDeleteCategory = (id) => {
    dispatch(deleteCategoryInternal(id))
  }

  useEffect(() => {
    setSpinnerFixed(loadingDeleteCategory)
    dispatch(setHeaderHidden(loadingDeleteCategory))
  }, [loadingDeleteCategory])

    return (
        <div className="relative">
            { spinnerFixed && (
              <SpinnerFixed colors={'fill-gray-900'}/>
            )}

            {/* Header */}
             <div
                ref={headerRef}
                className={`fixed top-0 z-10 bg-white border-b border-gray-200 ${(isOpen && isMobileDeviceType) || (isHidden && !isMobileDeviceType) || spinnerFixed ? 'hidden' : ''}`}
                style={{
                  left: (isFullScreen || isMobileDeviceType) ? '0' : '288px',
                  width: isMobileDeviceType ? '100%' : (isFullScreen ? '100%' : 'calc(100% - 288px)'),
                  height: '64px'
                }}
              >
              <div className="h-full mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
                <div className="flex items-center justify-between h-full gap-2 sm:gap-4">
                    <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                          <Box className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                          <h1 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-gray-800 truncate">Products Management</h1>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0">
                      <button 
                      onClick={() => fullscreenchange()} 
                      className="p-1.5 sm:p-2 hover:bg-gray-100 hover:scale-105 rounded-md sm:rounded-lg transition-all touch-manipulation"
                      aria-label={isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
                      >
                        {isFullScreen ? ( 
                          <Minimize className="w-5 h-5 sm:w-5 sm:h-5 text-gray-600" />
                        ) : ( 
                          <Maximize className="w-5 h-5 sm:w-5 sm:h-5 text-gray-600" />
                        )}
                      </button>

                      <button 
                      className="p-1.5 sm:p-2 lg:p-3 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-105 touch-manipulation" 
                      onClick={() => navigate('/internal/admin/settings')}
                      aria-label="Settings"
                      >
                          <Settings className="w-5 h-5 sm:w-5 sm:h-5 text-gray-600" />
                      </button>
                      { isMobileDeviceType && !isFullScreen && (
                        <button 
                          onClick={() => dispatch(setIsOpen(true))}
                          className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-md sm:rounded-lg transition-colors touch-manipulation"
                          aria-label="Open menu"
                        >
                          <Menu className="w-5 h-5 sm:w-5 sm:h-5 text-gray-600" />
                        </button>
                      )}
                    </div>
                </div>
                </div>
            </div>

            { modelConfirmDeleteProduct && (
              <div className="fixed">
                <DeleteConfirmationModal 
                onConfirm={handleDeleteProduct}
                onCancel={() => {
                  setProductIdDelete(null)
                  setModelConfirmDeleteProduct(false)
                  dispatch(setHeaderHidden(false))
                }} 
                colorsType={"internal"}/>
              </div>
            )}

            <AccessDeniedModal
              isOpen={showAccessDenied}
              onClose={() => setShowAccessDenied(false)}
              title="Akses Ditolak"
              message="Role anda tidak memiliki izin untuk mengakses fitur ini."
              buttonText="Mengerti"
            />

            <div className="p-6 max-w-7xl mx-auto" style={{marginTop: headerHeight}}>
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
                      onClick={() => {
                        if (dataEmployeeInternal?.position === "Manager") {
                          setAddCategory(true);
                          dispatch(setHeaderHidden(true));
                        } else {
                          setShowAccessDenied(true); 
                        }
                      }}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 shadow-lg hover:shadow-xl"
                    >
                      <Plus size={18} />
                      Add Category
                    </button>
                    
                    <button
                      onClick={() => {
                        if (dataEmployeeInternal?.position === "Manager") {
                          setAddProduct(true);
                          dispatch(setHeaderHidden(true));
                        } else {
                          setShowAccessDenied(true); 
                        }
                      }}

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
              <div className="bg-white border-b border-gray-200 rounded-md  min-h-[70vh] shadow-lg p-6">
                { !spinnerProduct ? (
                  <>
                    {dataCategoryAndProduct && dataCategoryAndProduct.length > 0 ? (
                      (Array.isArray(filteredProduct) && filteredProduct.length > 0 ? filteredProduct : dataCategoryAndProduct).map((category) => (
                        <div key={category.id} className="mb-4">
                          {/* Nama Kategori */}
                          <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
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
                                        : `https://nusas-bucket.oss-ap-southeast-5.aliyuncs.com/${product.image}`         
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
                                    onClick={() => { 
                                      setSelectedProduct({ 
                                      id: product.id,
                                      category_id: category.id, 
                                      category_name: category.name,
                                      name: product.name,
                                      price: product.price,
                                      desc: product.desc,
                                      hpp: product.hpp,
                                      image: product.image,
                                      available: product.available,
                                    })
                                    dispatch(setHeaderHidden(true))
                                  }}
                                    className="flex justify-center space-x-2 items-center py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
                                  >
                                    <Pencil width={15} height={15}/>
                                    <p>Edit</p>
                                  </div>
                                </div>
                                
                                <div
                                  onClick={() => {
                                    if (dataEmployeeInternal?.position === "Manager") {
                                      setProductIdDelete(product.id);
                                      setModelConfirmDeleteProduct(true);
                                      dispatch(setHeaderHidden(true));
                                    } else {
                                      setShowAccessDenied(true); 
                                    }
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
                              
                              <button onClick={() => { 
                                setAddProduct(true) 
                                dispatch(setHeaderHidden(true))}
                              }  className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full font-medium transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 shadow-lg hover:shadow-xl">
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
              <div className="fixed">
                <AddProductModal 
                dataCategory={dataCategory}
                onClose={() => {
                  setAddProduct(false)
                  dispatch(setHeaderHidden(false))
                }}
                onSubmit={(formData) => handleCreateProduct(formData)}
                panelRef={panelRef}
                />  
              </div>
            )}

            {/* pop up category model */}
            { addCategory && (
              <div className="fixed"> 
                <AddCategoryModal 
                dataCategory={dataCategory}
                handleDeleteCategory={handleDeleteCategory}
                onClose={() => { 
                  setAddCategory(false)
                  dispatch(setHeaderHidden(false))
                }}
                onSubmit={(data) => dispatch(createCategoryInternal(data))}
                />
              </div>
            )}

            {/* pop up update product model */}
            {selectedProduct?.id && (
              <div className="fixed">
                <EditProductModal 
                initialData={selectedProduct} 
                onClose={() => {
                  setSelectedProduct(null)
                  dispatch(setHeaderHidden(false))
                }}/>
              </div>
            )}

        </div>
    )
}

const AddProductModal = ({ 
  dataCategory = [],
  onClose,
  onSubmit,
  title = "Tambah Produk Baru",
  submitText = "Simpan Produk",
}) => {
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
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)
  const [errors, setErrors] = useState({})

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        previewImage: URL.createObjectURL(file),
      }))
      // Clear image error when file is selected
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: '' }))
      }
    }
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleChangeMoneyReceved = (e) => {
    const raw = e.target.value.replace(/\./g, '');

    if (!/^\d*$/.test(raw)) return;

    const numericValue = parseInt(raw, 10) || 0;

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: numericValue,
    }));

    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }))
    }
  };

  const handleChangeCategory = (id, name) => {
    setCategory({
      id: id, 
      name: name,
    })
    setFormData((prev) => ({
      ...prev, 
      category_id: id,
    }))
    // Clear category error when selected
    if (errors.category_id) {
      setErrors(prev => ({ ...prev, category_id: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nama produk harus diisi'
    }

    if (!formData.category_id) {
      newErrors.category_id = 'Kategori harus dipilih'
    }

    if (!formData.price || formData.price === 0) {
      newErrors.price = 'Harga jual harus diisi'
    }

    if (!formData.hpp || formData.hpp === 0) {
      newErrors.hpp = 'Harga pokok (HPP) harus diisi'
    }

    if (!formData.desc.trim()) {
      newErrors.desc = 'Deskripsi produk harus diisi'
    }

    if (!formData.image) {
      newErrors.image = 'Gambar produk harus diupload'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onClose()
      onSubmit(formData)
    }
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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div ref={modalContentRef} className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Package className="w-7 h-7 text-gray-600" />
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
          >
            <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Upload Gambar */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Gambar Produk <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center justify-center">
                <label className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed ${errors.image ? 'border-red-300' : 'border-gray-300'} rounded-xl cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all group`}>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  {formData.previewImage ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={formData.previewImage} 
                        alt="Preview" 
                        className="w-full h-full object-cover rounded-xl" 
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                        <Upload className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <ImageIcon className="w-12 h-12 mb-3 text-gray-400" />
                      <span className="text-sm font-medium">Upload Gambar Produk</span>
                      <span className="text-xs text-gray-400 mt-1">PNG, JPG hingga 10MB</span>
                    </div>
                  )}
                </label>
              </div>
              {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
            </div>

            {/* Nama Produk */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Nama Produk <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.name}
                  maxLength={50}
                  className={`w-full px-4 py-3 border-2 ${errors.name ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all placeholder-gray-400`}
                  placeholder="Masukkan nama produk..."
                  required
                  onChange={(e) => handleChange("name", e.target.value)}
                />
                <Package className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Harga Jual */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Harga Jual <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  Rp
                </span>
                <input
                  type="text"
                  value={formData.price.toLocaleString("id-ID")}
                  name="price"
                  className={`w-full pl-10 pr-12 py-3 border-2 ${errors.price ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all placeholder-gray-400`}
                  placeholder="0"
                  step="0.01"
                  required
                  onChange={handleChangeMoneyReceved}
                />
                <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>

            {/* HPP */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Harga Pokok (HPP) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  Rp
                </span>
                <input
                  type="text"
                  value={formData.hpp.toLocaleString("id-ID")}
                  name="hpp"
                  className={`w-full pl-10 pr-12 py-3 border-2 ${errors.hpp ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all placeholder-gray-400`}
                  placeholder="0"
                  step="0.01"
                  required
                  onChange={handleChangeMoneyReceved}
                />
                <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {errors.hpp && <p className="text-red-500 text-xs mt-1">{errors.hpp}</p>}
            </div>

            {/* Kategori Dropdown */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Kategori <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className={`w-full px-4 py-3 bg-gray-50 ${errors.category_id ? 'border-red-300' : ''} border-gray-200 rounded-xl text-left flex justify-between items-center hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all`}
                >
                  <span className={category.name ? "text-gray-900" : "text-gray-400"}>
                    {category.name || "Pilih Kategori"}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isCategoryDropdownOpen && (
                  <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl">
                    {spinneCategory ? (
                      <div className="p-4 text-center text-gray-500">Loading...</div>
                    ) : (
                      <div className="py-2 max-h-48 overflow-y-auto">
                        {dataCategory.map((kategori) => (
                          <button
                            key={kategori.id}
                            type="button"
                            onClick={() => {
                              handleChangeCategory(kategori.id, kategori.name)
                              setIsCategoryDropdownOpen(false)
                            }}
                            className={`w-full px-4 py-3 text-sm text-left hover:bg-gray-50 transition-colors ${
                              category.id === kategori.id ? "bg-gray-100 font-semibold text-gray-900" : "text-gray-700"
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
              {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
            </div>

            {/* Deskripsi */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Deskripsi Produk <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  value={formData.desc}
                  className={`w-full px-4 py-3 border-2 ${errors.desc ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all placeholder-gray-400 resize-none`}
                  placeholder="Masukkan deskripsi produk..."
                  required
                  maxLength={100}
                  rows={4}
                  onChange={(e) => handleChange("desc", e.target.value)}
                />
                <FileText className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
              </div>
              {errors.desc && <p className="text-red-500 text-xs mt-1">{errors.desc}</p>}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all font-medium shadow-lg hover:shadow-xl"
            >
              {submitText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const AddCategoryModal = ({ dataCategory = [], handleDeleteCategory, onClose, onSubmit, onDelete }) => {
  const [categoryName, setCategoryName] = useState('')
  const [activeTab, setActiveTab] = useState('add') // 'add' or 'manage'

  const handleSubmit = () => {
    if (categoryName.trim()) {
      onSubmit({ category_name: categoryName.trim() })
      setCategoryName('')
      onClose()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
 
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <FolderPlus className="w-7 h-7 text-gray-600" />
            Kelola Kategori
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
          >
            <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('add')}
            className={`flex-1 py-4 px-6 text-sm font-medium transition-colors relative ${
              activeTab === 'add'
                ? 'text-gray-600 bg-gray-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              Tambah Kategori
            </div>
            {activeTab === 'add' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-600"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`flex-1 py-4 px-6 text-sm font-medium transition-colors relative ${
              activeTab === 'manage'
                ? 'text-gray-600 bg-gray-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <List className="w-4 h-4" />
              Kelola Kategori ({dataCategory.length})
            </div>
            {activeTab === 'manage' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-600"></div>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'add' ? (
            /* Add Category Form */
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Nama Kategori Baru
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={30}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
                    placeholder="Masukkan nama kategori..."
                    value={categoryName}
                    required
                    onChange={(e) => setCategoryName(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <FolderPlus className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!categoryName.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Simpan Kategori
                </button>
              </div>
            </div>
          ) : (
            /* Manage Categories */
            <div className="space-y-4">
              {dataCategory.length === 0 ? (
                <div className="text-center py-12">
                  <FolderPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Belum ada kategori</p>
                  <p className="text-gray-400 text-sm">Tambah kategori pertama Anda</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {dataCategory.map((category, index) => (
                    <div
                      key={category.id || index}
                      className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FolderPlus className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {category.category_name || category.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            ID: {category.id || index}
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Hapus kategori"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={onClose}
                  className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
        </div>
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
  const [spinnerCategory, setSpinnerCategory] = useState(false)

  const [formData, setFormData] = useState({
    id: null,
    name: '',
    category_id: null,
    price: '',
    desc: '',
    hpp: '',
    image: null,
    available: initialData?.available || true,
    previewImage: null,
  })

  const [category, setCategory] = useState({
    id: null,
    name: '',
  })

  const [errors, setErrors] = useState({})

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
      })

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
      // Clear image error when file is selected
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: '' }))
      }
    }
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleChangeCategory = (id, name) => {
    setCategory({ id, name })
    setFormData((prev) => ({ ...prev, category_id: id }))
  }

  const handleChangeMoneyReceived = (e) => {
    const raw = e.target.value.replace(/\./g, '');

    if (!/^\d*$/.test(raw)) return;

    const numericValue = parseInt(raw, 10) || 0;

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: numericValue,
    }));

    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }))
    }
  };

  const { dataCategory, loadingCategoryInternal } = useSelector((state) => state.persisted.getCategoryInternal);

  useEffect(() => {
    if (!dataCategory || dataCategory.length <= 0) {
      dispatch(fetchCategoryInternal())
    }
  }, [])

  useEffect(() => {
    setSpinnerCategory(loadingCategoryInternal)
  }, [loadingCategoryInternal])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nama produk harus diisi'
    }

    if (!formData.price || formData.price === 0) {
      newErrors.price = 'Harga jual harus diisi'
    }

    if (!formData.hpp || formData.hpp === 0) {
      newErrors.hpp = 'Harga pokok (HPP) harus diisi'
    }

    if (!formData.desc.trim()) {
      newErrors.desc = 'Deskripsi produk harus diisi'
    }

    if (!formData.image) {
      newErrors.image = 'Gambar produk harus ada'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // handle Update product
  const {addDataTempUpdateProduct} = dataTempUpdateProductSlice.actions
 
  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      dispatch(UpdateProductInternal(formData))
      dispatch(addDataTempUpdateProduct(formData))
      onClose()
    }
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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div ref={modalContentRef} className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Package className="w-7 h-7 text-gray-600" />
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
          >
            <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Upload Gambar */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Gambar Produk <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center justify-center">
                <label className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed ${errors.image ? 'border-red-300' : 'border-gray-300'} rounded-xl cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all group`}>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                  />
                  <div className="relative w-full h-full">
                    <img 
                      src={
                        formData.image instanceof File
                          ? URL.createObjectURL(formData.image) 
                          : `https://nusas-bucket.oss-ap-southeast-5.aliyuncs.com/${formData.image}`         
                      }
                      alt="Preview" 
                      className="w-full h-full object-cover rounded-xl" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </label>
              </div>
              {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
            </div>

            {/* Nama Produk */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Nama Produk <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.name}
                  maxLength={50}
                  className={`w-full px-4 py-3 border-2 ${errors.name ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all`}
                  required
                  onChange={(e) => handleChange("name", e.target.value)}
                />
                <Package className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Harga Jual */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Harga Jual <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  Rp
                </span>
                <input
                  type="text"
                  value={formData.price.toLocaleString("id-ID")}
                  name="price"
                  className={`w-full pl-10 pr-12 py-3 border-2 ${errors.price ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all`}
                  step="0.01"
                  required
                  onChange={handleChangeMoneyReceived}
                />
                <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>

            {/* HPP */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Harga Pokok (HPP) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  Rp
                </span>
                <input
                  type="text"
                  name="hpp"
                  value={formData.hpp.toLocaleString("id-ID")}
                  className={`w-full pl-10 pr-12 py-3 border-2 ${errors.hpp ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all`}
                  step="0.01"
                  required
                  onChange={handleChangeMoneyReceived}
                />
                <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {errors.hpp && <p className="text-red-500 text-xs mt-1">{errors.hpp}</p>}
            </div>

            {/* Kategori Dropdown */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Kategori <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  disabled
                  className={`w-full cursor-not-allowed bg-gray-50 px-4 py-3 border-2 ${errors.category_id ? 'border-red-300' : 'border-gray-200'} rounded-xl text-left flex justify-between items-center hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all`}
                >
                  <span className={category.name ? 'text-gray-900' : 'text-gray-500'}>
                    {category.name || "Pilih Kategori"}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400`} />
                </button>
              </div>
              {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
            </div>

            {/* Deskripsi */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Deskripsi Produk <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  value={formData.desc}
                  className={`w-full px-4 py-3 border-2 ${errors.desc ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all resize-none`}
                  required
                  rows={4}
                  maxLength={100}
                  onChange={(e) => handleChange("desc", e.target.value)}
                />
                <FileText className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
              </div>
              {errors.desc && <p className="text-red-500 text-xs mt-1">{errors.desc}</p>}
            </div>

            {/* Footer */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all font-medium shadow-lg hover:shadow-xl"
              >
                {submitText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}