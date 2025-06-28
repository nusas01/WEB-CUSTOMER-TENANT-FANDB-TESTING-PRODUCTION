import Sidebar from "../component/sidebar"
import ProductsTable from "../component/productTable"
import { useEffect, useState } from "react"
import { ErrorAlert, SuccessAlert } from "../component/alert"
import { useSelector, useDispatch } from "react-redux"
import { createProductInternalSlice, createCategoryInternalSlice } from "../reducers/post"
import { SpinnerFixed } from "../helper/spinner"
import { updateInternalSlice } from "../reducers/put" 
import { dataTempUpdateProductSlice } from "../reducers/notif"
import { availbaleProductlSlice } from "../reducers/patch"
import { deleteProductInternalSlice } from "../reducers/post"

export default function KasirProducts() {
    const dispatch = useDispatch()
    const [activeMenu, setActiveMenu] = useState("Product")
    const [error, setError] = useState(false)
    const [modalSuccess, setModalSuccess] = useState(null)
    const [spinnerFixed, setSpinnerFixed] = useState(false)

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
        setError(true)
        const timeout = setTimeout(() => {
            setError(false)
            dispatch(resetCreateProductInternal())
        }, 3000)

        return () => clearTimeout(timeout)
        }
    }, [errorCreateProductInternal, dispatch])


    // handle error get category and product 
    const { errorCategoyAndProductIntenal } = useSelector((state) => state.persisted.getCategoryAndProductInternal)
    useEffect(() => {
      if (errorCategoyAndProductIntenal) {
        setError(true)
        const timeout = setTimeout(() => {
          setError(false)
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
            setError(true)
            const timeout = setTimeout(() => {
            setError(false)
            dispatch(resetCreateCategoryInternal())
            }, 3000)

            return () => clearTimeout(timeout)
        }
    }, [errorCreateCategoryInternal])

    useEffect(() => {
        if (successCreateCategoryInternal) {
            setModalSuccess('Berhasil Menambahkan Category')
            
            const timeout = setTimeout(() => {
                setModalSuccess(null)
                dispatch(resetCreateCategoryInternal())
            }, 2000)
    
            return () => clearTimeout(timeout)
        }
    }, [successCreateCategoryInternal])
        

    // handle Response update product
    const {resetDataTempUpdateProduct} = dataTempUpdateProductSlice.actions
    const {resetUpdateProductInternal} = updateInternalSlice.actions
    const {errorUpdateProductInternal } = useSelector((state) => state.updateInternalState)
    useEffect(() => {
        if (errorUpdateProductInternal) {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setError(true)
            const timeout = setTimeout(() => {
                setError(false)
                dispatch(resetDataTempUpdateProduct())
                dispatch(resetUpdateProductInternal())
            }, 2000)

            return () => clearTimeout(timeout)
        }
    }, [errorUpdateProductInternal])


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
            setError(true)
            const timeout = setTimeout(() => {
                setError(false)
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
            setError(true)
            const timeout = setTimeout(() => {
                setError(false)
                dispatch(resetDeleteProductInternal())
            }, 2000)

            return () => clearTimeout(timeout)
        }   
    }, [errorDeleteProductInternal])

    return (
        <div className="flex">
            { error && (
                <ErrorAlert message={"there was an error on our server, we are fixing it"}/>
            )}

            { modalSuccess && (
            <SuccessAlert message={modalSuccess}/>
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