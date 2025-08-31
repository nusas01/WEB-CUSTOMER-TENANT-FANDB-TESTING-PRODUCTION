import { createSlice } from "@reduxjs/toolkit"

const initialGetProductsCustomerState = {
    datas: [],
    loading: false,
    error: null,
    errorStatusCode: null,
    hasFetched: false,
}
export const getProductsCustomerSlice = createSlice({
    name: "products",
    initialState: initialGetProductsCustomerState,
    reducers: {
        setLoadingProducts: (state, action) => {
            state.loading = action.payload
        },
        successFetchProducts: (state, action) => {
            state.datas = action.payload
            state.error = null
        },
        errorFetchProducts: (state, action) => {
            state.error = action.payload.message
            state.errorStatusCode = action.payload.statusCode
        }
    }
})


const initialGetDataCustomer = {
    data: {},
    error: null,
    statusCode: null,
    loading: false,
}
export const getDataCustomerSlice = createSlice({
    name: "dataCustomer",
    initialState: initialGetDataCustomer,
    reducers: {
        setLoadingGetDataCustomer: (state, action) => {
            state.loading = action.payload;
        },
        fetchSuccessGetDataCustomer: (state, action) => {
            state.data = action.payload;
            state.statusCode =  200;
            state.loading = false;
        },
        fetchErrorGetDataCustomer: (state, action) => {
            state.error = action.payload.error;
            state.statusCode = action.payload.statusCode;
            state.loading = false;
        },
        resetGetDataCustomer: (state) => {
            state.data = {};
        }
    }
})


const initialGetTransactionsOnGoingCustomer = {
    dataTransactionOnGoing: [],
    lengthTransactionOnGoing: 0,
    error: null,
    statusCode: null,
    loading: false,
}
export const getTransactionOnGoingCustomerSlice = createSlice({
    name: "transactionsOnGoing",
    initialState: initialGetTransactionsOnGoingCustomer,
    reducers: {
        setLoadingGetTransactionOnGoingCustomer: (state, action) => {
            state.loading = action.payload
        },
        fetchSuccessGetTransactionOnGoingCustomer: (state, action) => {
            state.dataTransactionOnGoing = action.payload
            state.lengthTransactionOnGoing = action.payload.length
            state.statusCode = 200
            state.loading = false
        },
        fetchErrorGetTransactionOnGoingCustomer: (state, action) => {
            state.error = action.payload.error
            state.statusCode = action.payload.statusCode
            state.loading = false
        },
        removeTransactionOnGoingById: (state, action) => {
            state.dataTransactionOnGoing = state.dataTransactionOnGoing.filter(
                (item) => item.id !== action.payload
            )
            state.lengthTransactionOnGoing = state.dataTransactionOnGoing.length;
        },
        updateTransactionOnGoingStatusById: (state, action) => {
            const updated = state.dataTransactionOnGoing.map(item => {
                if (String(item.id) === String(action.payload.id)) {
                    return {
                        ...item,
                        order_status: action.payload.order_status,
                        status_transaction: action.payload.status_transaction,
                    }
                }
                return item
            })
            state.dataTransactionOnGoing = updated
        }        
    }
})


const initialTransactionsHistoryCustomer = {
    dataTransactionHistory: null,
    error: null,
    statusCode: null,
    lengthTransactionProses: 0,
    loadingHistory: false,
}
export const getTransactionsHistoryCustomerSlice = createSlice({
    name: "transactionHistory",
    initialState: initialTransactionsHistoryCustomer,
    reducers: {
        setLoadingGetTransactionHistoryCustomer: (state, action) => {
            state.loadingHistory = action.payload
        },
        fetchSuccessGetTransactionHistoryCustomer: (state, action) => {
            state.dataTransactionHistory = action.payload;
        },
        fetchErrorGetTransactionHistoryCustomer: (state, action) => {
            state.error = action.payload.error
            state.statusCode = action.payload.statusCode
        }
    }
})


const initialDetailTransactionsHistoryCustomer = {
    dataDetailTransactionHistory: null,
    error: null,
    statusCode: null,
    lengthTransactionProses: 0,
    loadingHistory: false,
}
export const getDetailTransactionsHistoryCustomerSlice = createSlice({
    name: "detailTransactionHistory",
    initialState: initialDetailTransactionsHistoryCustomer,
    reducers: {
        setLoadingDetailTransactionHistoryCustomer: (state, action) => {
            state.loadingHistory = action.payload
        },
        fetchSuccessDetailTransactionHistoryCustomer: (state, action) => {
            state.dataDetailTransactionHistory = action.payload;
        },
        fetchErrorDetailTransactionHistoryCustomer: (state, action) => {
            state.error = action.payload.error
            state.statusCode = action.payload.statusCode
        },
        resetError: (state) => {
            state.error = null
        }
    }
})


const initialGetPaymentMethodsCustomer = {
    dataPaymentMethodCustomer: [],
    taxRate: 0,
    paymentMethodCash: null,
    errorPaymentMethodsCustomer: null,
    statusCodePaymentMethodsCustomer: null,
    loadingPaymentMethodsCustomer: false,
}
export const getPaymentMethodsCustomerSlice = createSlice({
    name: "dataPaymentMethod",
    initialState: initialGetPaymentMethodsCustomer,
    reducers: {
        setLoadingGetPaymentMethodsCustomer: (state, action) => {
            state.loadingPaymentMethodsCustomer = action.payload
        },
        fetchSuccessGetPaymentMethodsCustomer: (state, action) => {
            state.dataPaymentMethodCustomer = action.payload?.payment_methods || []
            state.taxRate = action.payload?.tax_rate || 0
            state.paymentMethodCash = action.payload?.payment_method_cash || null
            state.statusCodePaymentMethodsCustomer = 200
            state.errorPaymentMethodsCustomer = null
        },
        fetchErrorGetPaymentMethodsCustomer: (state, action) => {
            state.errorPaymentMethodsCustomer = action.payload.error
            state.statusCodePaymentMethodsCustomer = action.payload.statusCode
        }
    }
})

const initialLogoutCustomerState = {
    message: null, 
    error: null,
    loadingLogout: false,
}
export const logoutCustomerSlice = createSlice({
    name: 'logout',
    initialState: initialLogoutCustomerState,
    reducers: {
        logoutSuccessCustomer: (state, action) => {
            state.message = action.payload;
        },
        logoutErrorCustomer: (state, action) => {
            state.error = action.payload;
        },
        setLoadingLogoutCustomer: (state, action) => {
            state.loadingLogout = action.payload;
        }
    }
})


const initialLoginStatusCustomer = {
    loggedIn: false,
}
export const loginStatusCustomerSlice = createSlice({
    name: 'loginStatusCustomerSlice',
    initialState: initialLoginStatusCustomer,
    reducers: {
        setLoginStatusCustomer: (state, action) => {
            state.loggedIn = action.payload
        },
    }
})

const initialLoginStatusInternal = {
    loggedIn: false,
}
export const loginStatusInternalSlice = createSlice({
    name: 'loginStatusInternalSlice',
    initialState: initialLoginStatusInternal,
    reducers: {
        setLoginStatusInternal: (state, action) => {
            state.loggedIn = action.payload;
        }
    }
})


const initialLogoutInternalState = {
    message: null, 
    error: null,
    loadingLogout: false,
}
export const logoutInternalSlice = createSlice({
    name: 'logout',
    initialState: initialLogoutInternalState,
    reducers: {
        logoutSuccessInternal: (state, action) => {
            state.message = action.payload
            state.error = null
        },
        logoutErrorInternal: (state, action) => {
            state.error = action.payload
            state.message = null
        },
        setLoadingLogoutInternal: (state, action) => {
            state.loadingLogout = action.payload
        }, 
        resetLogoutInternal: (state) => {
            state.message = null
            state.error = null
        }
    }
})

const initialTransactionCashOnGoingInternalState = {
    dataTransactionCashInternal: [],
    errorTransactionCashInternal: null,
    loadingTransactionCashInternal: false,
}
export const transactionCashOnGoingInternalSlice = createSlice({
    name: 'transactionCashOnGoingInternal',
    initialState: initialTransactionCashOnGoingInternalState,
    reducers: {
        setLoadingTransactionCashInternal: (state, action) => {
            state.loadingTransactionCashInternal = action.payload
        },
        fetchSuccessTransactionCashInternal: (state, action) => {
            state.dataTransactionCashInternal = action.payload
            state.errorTransactionCashInternal = null
        },
        fetchErrorTransactionCashInternal: (state, action) => {
            state.errorTransactionCashInternal = action.payload
            state.dataTransactionCashInternal = []
        }, 
        removeTransactionCashOnGoingInternalById: (state, action) => {
            state.dataTransactionCashInternal = state.dataTransactionCashInternal.filter(
                (item) => item.id !== action.payload
            )
        },
        updateStatusTransactionCashOnGoingInternalById: (state, action) => {
            const updated = state.dataTransactionCashInternal.map(item => {
                if (String(item.id) === String(action.payload.id)) {
                    return {
                        ...item,
                        status_transaction: action.payload.status_transaction,
                    }
                }
                return item
            })
            state.dataTransactionCashInternal = updated
        },
        addTransactionCashOnGoingInternal: (state, action) => {
            state.dataTransactionCashInternal.push(action.payload)
        }
    }
})


const initialTransactionNonCashOnGoingInternalState = {
    dataTransactionNonCashInternal: [],
    errorTransactionNonCashInternal: null,
    loadingTransactionNonCashInternal: false,
}
export const transactionNonCashOnGoingInternalSlice  = createSlice({
    name: 'transactionNonCashOnGoingInternal',
    initialState: initialTransactionNonCashOnGoingInternalState,
    reducers: {
        setLoadingTransactionNonCashInternal: (state, action) => {
            state.loadingTransactionNonCashInternal = action.payload
        },
        fetchSuccessTransactionNonCashInternal: (state, action) => {
            state.dataTransactionNonCashInternal = action.payload
            state.errorTransactionNonCashInternal = null
        },
        fetchErrorTransactionNonCashInternal: (state, action) => {
            state.errorTransactionNonCashInternal = action.payload
            state.dataTransactionNonCashInternal = []
        },
        removeTransactionNonCashOnGoingInternalById: (state, action) => {
            state.dataTransactionNonCashInternal = state.dataTransactionNonCashInternal.filter(
                (item) => item.id !== action.payload
            )
        },
        updateStatusTransactionNonCashOnGoingInternalById: (state, action) => {
            const updated = state.dataTransactionNonCashInternal.map(item => {
                if (String(item.id) === String(action.payload.id)) {
                    return {
                        ...item,
                        status_transaction: action.payload.status_transaction,
                    }
                }
                return item
            })
            state.dataTransactionNonCashInternal = updated
        }, 
        addTransactionNonCashOnGoingInternal: (state, action) => {
            state.dataTransactionNonCashInternal.push(action.payload)
        }
    }
})

const dataFilteringTransactionHistoryState = {
    method: null,
    status: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    page: 0,
} 
export const dataFilteringTransactionHistorySlice = createSlice({
    name: "dataFilteringHistory",  
    initialState: dataFilteringTransactionHistoryState,
    reducers: {
        setData: (state, action) => {
            state.method = action.payload.method
            state.status = action.payload.status
            state.startDate = action.payload.startDate
            state.endDate = action.payload.endDate
            state.startTime = action.payload.startTime
            state.endTime = action.payload.endTime
            state.page = action.payload.page
        }, 
        setIncrementPage: (state) => {
            state.page += 1
        },
        resetData : (state) => {
            state.method = null
            state.status = ''
            state.startDate = ''
            state.endDate = ''
            state.startTime = ''
            state.endTime = ''
            state.page = 0
        }
    }
})

const intitalTransactionHistoryState = {
    dataTransactionHistoryInternal: [],
    page: 1,
    hasMore: true,
    errorTransactionHistoryInternal: null,
    statusCodeTransactionHistoryInternal: null,
    loadingTransactionHistoryInternal: false,
    isLoadingMore: false,
    totalCount: 0,
    totalRevenue: 0,
}
export const transactionHistoryInternalSlice = createSlice({
    name: 'transactionHistoryInternal',
    initialState: intitalTransactionHistoryState,
    reducers: {
        setLoadingTransactionHistoryInternal: (state, action) => {
            if (state.page === 1 && !action.payload.isLoadMore) {
                state.loadingTransactionHistoryInternal = action.payload.loading;
            } else {
                state.hasMore = action.payload.loading;
            }
        },
        fetchSuccessTransactionHistoryInternal: (state, action) => {
            const { data, hasMore, totalCount, totalRevenue, page } = action.payload;
            
            if (page === 1) {
                state.dataTransactionHistoryInternal = data
            } else {
                state.dataTransactionHistoryInternal = [
                    ...state.dataTransactionHistoryInternal,
                    ...data
                ]
            }
            
            state.hasMore = hasMore
            state.totalCount = totalCount || state.dataTransactionHistoryInternal.length
            state.page = page
            state.totalRevenue = totalRevenue
            state.statusCodeTransactionHistoryInternal = 200
            state.errorTransactionHistoryInternal = null
            state.loadingTransactionHistoryInternal = false
            state.isLoadingMore = false
        },
        fetchErrorTransactionHistoryInternal: (state, action) => {
            state.errorTransactionHistoryInternal = action.payload.error
            state.statusCodeTransactionHistoryInternal = action.payload.statusCode
            state.loadingTransactionHistoryInternal = false
            state.isLoadingMore = false
        },
        resetTransactionHitoryInternal: (state) => {  
            state.errorTransactionHistoryInternal = null
            state.dataTransactionHistoryInternal = []
            state.loadingTransactionHistoryInternal = false
            state.page = 1
            state.hasMore = true
            state.totalCount = 0
            state.isLoadingMore = false
            state.totalRevenue = 0
        },
        incrementPage: (state) => {
            state.page += 1
        }
    }
})


const initialCheckTransactionNonCashInternalState = {
    checkTransactionNonCashId: null,
    statusCheckTransactionNonCash: null, 
    errorCheckTransactionNonCash: null,
    loadingCheckTransactionNonCash: false,
}
export const checkTransactionNonCashInternalSlice = createSlice({
    name: 'checkTransactionNonCashInternal',
    initialState: initialCheckTransactionNonCashInternalState,
    reducers: {
        checkTransactionNonCashSuccess: (state, action) => {
            state.checkTransactionNonCashId = action.payload.transaction_id
            state.statusCheckTransactionNonCash = action.payload.status_payment_gateway
            state.errorCheckTransactionNonCash = null
        },
        checkTransactionNonCashError: (state, action) => {
            state.errorCheckTransactionNonCash = action.payload
            state.statusCheckTransactionNonCash = null
            state.checkTransactionNonCashId = null
        },
        setLoadingCheckTransactionNonCash: (state, action) => {
            state.loadingCheckTransactionNonCash = action.payload
        },
        resetCheckTransactionNonCash: (state) => {
            state.checkTransactionNonCashId = null
            state.statusCheckTransactionNonCash = null
            state.errorCheckTransactionNonCash = null
        }
    }
})

// get all transaction pending yang di buat oleh kasir 
const initialGetAllCreateTransactionInternal = {
    dataGetAllCreateTransactionInternal: [], 
    errorGetAllCreateTransactionInternal: null,
    loadingGetAllCreateTransactionInternal: false, 
} 
export const getAllCreateTransactionInternalSlice = createSlice({
    name: 'getAllCreateTransactionInternal', 
    initialState: initialGetAllCreateTransactionInternal, 
    reducers: {
        fetchSuccessGetAllCreateTransactionInternal: (state, action) => {
            state.dataGetAllCreateTransactionInternal = action.payload
            state.errorGetAllCreateTransactionInternal = null 
        },
        fetchErrorGetAllCreateTransactionInternal: (state, action) => {
            state.errorGetAllCreateTransactionInternal = action.payload
            state.dataGetAllCreateTransactionInternal = []
        },
        setLoadingFetchGetAllCreateTransactionInternal: (state, action) => {
            state.loadingGetAllCreateTransactionInternal = action.payload
        },
        addGetAllCreateTransactionInternal: (state, action) => {
            if (!Array.isArray(state.dataGetAllCreateTransactionInternal)) {
                state.dataGetAllCreateTransactionInternal = []
            }
            state.dataGetAllCreateTransactionInternal.push(action.payload)
        }, 
        removeGetAllCreateTransactionById: (state, action) => {
            console.log("apakah ini tidak dijalankan: ", action.payload)
            state.dataGetAllCreateTransactionInternal = state.dataGetAllCreateTransactionInternal.filter(
                (item) => {
                    console.log("Item ID:", item.transaction_id, "==>", item.transaction_id === action.payload)
                    return item.transaction_id !== action.payload;
                }
            )
        },
    }
})


const initialSearchTransactionInternalState = {
    dataSearchTransactionInternal: [],
    errorSearchTransactionInternal: null,
    loadingSearchTransactionInternal: false
}
export const getSearchTransactionInternalSlice = createSlice({
    name: "searchTransactionInternal",
    initialState: initialSearchTransactionInternalState,
    reducers: {
        setLoadingSearchTransactionInternal: (state, action) => {
            state.loadingSearchTransactionInternal = action.payload
        },
        fetchSuccessSearchTransactionInternal: (state, action) => {
            state.dataSearchTransactionInternal = [action.payload]
            state.errorSearchTransactionInternal = null
        },
        fetchErrorSearchTransactionInternal: (state, action) => {
            state.errorSearchTransactionInternal = action.payload
        },
        resetSearchTransactionInternal: (state) => {
            state.dataSearchTransactionInternal = []
            state.errorSearchTransactionInternal = null
        }
    }
})


const initialGetPaymentMethodsInternalState = {
    dataPaymentMethodInternal: [],
    taxRateInternal: 0,
    paymentMethodCash: null,
    errorPaymentMethodsInternal: null,
    loadingPaymentMethodsInternal: false,
}
export const getPaymentMethodsInternalSlice = createSlice({
    name: "dataPaymentMethodInternal",
    initialState: initialGetPaymentMethodsInternalState,
    reducers: {
        setLoadingGetPaymentMethodsInternal: (state, action) => {
            state.loadingPaymentMethodsInternal = action.payload
        },
        fetchSuccessGetPaymentMethodsInternal: (state, action) => {
            state.dataPaymentMethodInternal = action.payload?.payment_methods || []
            state.taxRateInternal = action.payload?.tax_rate || 0
            state.paymentMethodCash = action.payload?.payment_method_cash || null
            state.errorPaymentMethodsInternal = null
        },
        fetchErrorGetPaymentMethodsInternal: (state, action) => {
            state.errorPaymentMethodsInternal = action.payload.error
        },
    }
})


// const initialAllDataOrderInternalState = {
//     dataOrderIntenal: [],
//     errorDataOrderIntenal: null,
//     loadingDataOrderInternal: false
// } 
// export const getAllDataOrderInternalSlice = createSlice({
//     name: "dataOrderInternal",
//     initialState: initialAllDataOrderInternalState,
//     reducers: {
//         setLoadingGetAllDataOrderInternal: (state, action) => {
//             state.loadingDataOrderInternal = action.payload
//         },
//         fetchSuccessGetAllDataOrderInternal: (state, action) => {
//             state.dataOrderIntenal = action.payload
//             state.errorDataOrderIntenal = null
//         },
//         fetchErrorGetAllDataOrderInternal: (state, action) => {
//             state.errorDataOrderIntenal = action.payload.error
//             state.dataOrderIntenal = []
//         }, 
//         removeDataOrderInternalById: (state, action) => {
//             const idToRemove = action.payload
//             state.dataOrderIntenal = state.dataOrderIntenal.filter(item => item.id !== idToRemove)
//         },
//         addDataOrderInternal: (state, action) => {
//             state.dataOrderIntenal.push(action.payload);
//         }
//     }
// })


const initialCategorytInternalState = {
    dataCategory: [],
    errorCategoyIntenal: null,
    loadingCategoryInternal: false
} 
export const getCategoryInternalSlice = createSlice({
    name: "dataCategory",
    initialState: initialCategorytInternalState,
    reducers: {
        setLoadingCategoryInternal: (state, action) => {
            state.loadingCategoryInternal= action.payload
        },
        fetchSuccessCategoryInternal: (state, action) => {
            state.dataCategory = action.payload
            state.errorCategoyIntenal = null
        },
        fetchErrorCategoryInternal: (state, action) => {
            state.errorCategoyIntenal = action.payload
            state.dataCategory = []
        },
        deleteCategoryById: (state, action) => {
            const idToDelete = action.payload;
            state.dataCategory = state.dataCategory.filter(category => category.id !== idToDelete);
        },
    }
})


const initialCategoryAndProductInternalState = {
    amountCategory: 0,
    amountProduct: 0,
    dataCategoryAndProduct: [],
    errorCategoyAndProductIntenal: null,
    loadingCategoryAndProductInternal: false,
    filteredProduct: [],
} 
export const getCategoryAndProductInternalSlice = createSlice({
    name: "dataCategoryAndProduct",
    initialState: initialCategoryAndProductInternalState,
    reducers: {
        setLoadingCategoryAndProductInternal: (state, action) => {
            state.loadingCategoryAndProductInternal= action.payload
        },
        fetchSuccessCategoryAndProductInternal: (state, action) => {
            state.dataCategoryAndProduct = action.payload.data
            state.amountCategory = action.payload.amountCategory
            state.amountProduct = action.payload.amountProduct
            state.errorCategoyAndProductIntenal = null
            state.filteredProduct = []
        },
        fetchErrorCategoryAndProductInternal: (state, action) => {
            state.errorCategoyAndProductIntenal = action.payload
            state.amountCategory = 0
            state.amountProduct = 0
            state.dataCategoryAndProduct = []
            state.filteredProduct = []
        },
        updateProductInCategory: (state, action) => {
            console.log("Reducer dijalankan", action.payload);
            const { categoryId, productId, updatedProduct } = action.payload;

            for (let i = 0; i < state.dataCategoryAndProduct.length; i++) {
                const productIndex = state.dataCategoryAndProduct[i].product.findIndex(
                (prod) => prod.id === productId
                );
                if (productIndex !== -1) {
                state.dataCategoryAndProduct[i].product.splice(productIndex, 1);
                break;
                }
            }

            const newCategoryIndex = state.dataCategoryAndProduct.findIndex(
                (cat) => cat.id === categoryId
            );

            if (newCategoryIndex !== -1) {
                state.dataCategoryAndProduct[newCategoryIndex].product.push(updatedProduct);
            }
        },
        toggleProductAvailability: (state, action) => {
            const productId = action.payload;

            // Ubah di data utama
            for (const category of state.dataCategoryAndProduct) {
                const product = category.product.find((p) => p.id === productId);
                if (product) {
                product.available = !product.available;
                break;
                }
            }

            // Ubah juga di filteredProduct jika sedang aktif
            for (const category of state.filteredProduct) {
                const product = category.product.find((p) => p.id === productId);
                if (product) {
                product.available = !product.available;
                break;
                }
            }
        },
        deleteProductById: (state, action) => {
            const productId = action.payload;
            console.log("Reducer deleteProductById dijalankan dengan id:", productId);

            for (let i = 0; i < state.dataCategoryAndProduct.length; i++) {
                const category = state.dataCategoryAndProduct[i];
                const products = category.product;

                const productIndex = products.findIndex((prod) => prod.id === productId);

                if (productIndex !== -1) {
                    products.splice(productIndex, 1);
                    state.amountProduct--; // update jumlah produk

                    // Jika produk dalam kategori ini kosong setelah penghapusan, hapus kategorinya
                    if (products.length === 0) {
                        state.dataCategoryAndProduct.splice(i, 1);
                        state.amountCategory--; // update jumlah kategori
                    }
                    break;
                }
            }

            // Jika `filteredProduct` aktif juga, update di sana
            for (let i = 0; i < state.filteredProduct.length; i++) {
                const category = state.filteredProduct[i];
                const products = category.product;
                const productIndex = products.findIndex((prod) => prod.id === productId);

                if (productIndex !== -1) {
                    products.splice(productIndex, 1);

                    // Jika setelah dihapus kategori jadi kosong, hapus dari filteredProduct juga
                    if (products.length === 0) {
                        state.filteredProduct.splice(i, 1);
                    }
                    break;
                }
            }
        },
        searchProductByName: (state, action) => {
            const keyword = action.payload.toLowerCase();

            state.filteredProduct = []

            state.dataCategoryAndProduct.forEach((category) => {
                const matchingProducts = []

                category.product.forEach((product) => {
                    if (product.name && product.name.toLowerCase().includes(keyword)) {
                        matchingProducts.push(product)
                    }
                })

                if (matchingProducts.length > 0) {
                    state.filteredProduct.push({
                        id: category.id,
                        name: category.name,
                        product: matchingProducts, 
                    })
                }
            })
        }
    }
})

const initialLabaRugiInternalState = {
    dataLabaRugiInternal: [],
    errorLabaRugiIntenal: null,
    loadingLabaRugiInternal: false,
} 
export const getLabaRugiInternalSlice = createSlice({
    name: "dataLabaRugi",
    initialState: initialLabaRugiInternalState,
    reducers: {
        setLoadingLabaRugiInternal: (state, action) => {
            state.loadingLabaRugiInternal = action.payload
        },
        fetchSuccessLabaRugiInternal: (state, action) => {
            state.dataLabaRugiInternal = action.payload || []
            state.errorLabaRugiIntenal = null
        },
        fetchErrorLabaRugiInternal: (state, action) => {
           state.errorLabaRugiIntenal = action.payload
           state.dataLabaRugiInternal = []
        },
        resetErrorLabaRugiInternal: (state) => {
            state.errorLabaRugiIntenal = null
        }
    }
})


const initialNeracaInternalState = {
    dataNeracaInternal: [],
    errorNeracaIntenal: null,
    loadingNeracaInternal: false,
} 
export const getNeracaInternalSlice = createSlice({
    name: "dataNeraca",
    initialState: initialNeracaInternalState,
    reducers: {
        setLoadingNeracaInternal: (state, action) => {
            state.loadingNeracaInternal = action.payload
        },
        fetchSuccessNeracaInternal: (state, action) => {
            state.dataNeracaInternal = action.payload || []
            state.errorNeracaIntenal = null
        },
        fetchErrorNeracaInternal: (state, action) => {
           state.errorNeracaIntenal = action.payload
           state.dataNeracaInternal = []
        },
        resetErrorNeracaInternal: (state) => {
            state.errorNeracaIntenal = null
        }
    }
})

const initialGeneralJournalByEventAllInternalState = {
    dataGeneralJournalByEventAllInternal: [],
    errorGeneralJournalByEventAllIntenal: null,
    loadingGeneralJournalByEventAllInternal: false,
} 
export const getGeneralJournalByEventAllInternalSlice = createSlice({
    name: "dataGeneralJournalByEventAll",
    initialState: initialGeneralJournalByEventAllInternalState,
    reducers: {
        setLoadingGeneralJournalByEventAllInternal: (state, action) => {
            state.loadingGeneralJournalByEventAllInternal= action.payload
        },
        fetchSuccessGeneralJournalByEventAllInternal: (state, action) => {
            state.dataGeneralJournalByEventAllInternal = action.payload || []
            state.errorGeneralJournalByEventAllIntenal = null
        },
        fetchErrorGeneralJournalByEventAllInternal: (state, action) => {
           state.errorGeneralJournalByEventAllIntenal = action.payload
           state.dataGeneralJournalByEventAllInternal = []
        },
    }
})

const initialGeneralJournalByEventPerDayInternalState = {
    dataGeneralJournalByEventPerDayInternal: [],
    errorGeneralJournalByEventPerDayIntenal: null,
    loadingGeneralJournalByEventPerDayInternal: false,
    hasMore: true,
    isLoadMore: false,
    page: 1,
    totalEntry: 0,
    totalKredit: 0,
    totalDebet: 0,
} 
export const getGeneralJournalByEventPerDayInternalSlice = createSlice({
    name: "dataGeneralJournalByEventPerDay",
    initialState: initialGeneralJournalByEventPerDayInternalState,
    reducers: {
        setLoadingGeneralJournalByEventPerDayInternal: (state, action) => {
            // ✅ Fix: Periksa apakah ini load more atau loading awal
            if (action.payload.isLoadMore) {
                state.isLoadMore = action.payload.loading
            } else {
                state.loadingGeneralJournalByEventPerDayInternal = action.payload.loading
            }
        },
        fetchSuccessGeneralJournalByEventPerDayInternal: (state, action) => {
            const { data, hasMore, totalEntry, totalKredit, totalDebet, isLoadMore, page } = action.payload

            if (isLoadMore && page > 1) {
                state.dataGeneralJournalByEventPerDayInternal = [
                    ...state.dataGeneralJournalByEventPerDayInternal,
                    ...(data || [])
                ]
            } else {
                state.dataGeneralJournalByEventPerDayInternal = data || []
                state.totalKredit = totalKredit
                state.totalDebet = totalDebet
                state.totalEntry = totalEntry
            }
            
            state.page = page
            state.hasMore = hasMore
            state.errorGeneralJournalByEventPerDayIntenal = null
            state.loadingGeneralJournalByEventPerDayInternal = false
            state.isLoadMore = false
        },
        fetchErrorGeneralJournalByEventPerDayInternal: (state, action) => {
           state.errorGeneralJournalByEventPerDayIntenal = action.payload
           state.loadingGeneralJournalByEventPerDayInternal = false
           state.isLoadMore = false
        },
        resetGeneralJournalEventPerDayPagination: (state) => {
            state.dataGeneralJournalByEventPerDayInternal = []
            state.page = 1
            state.hasMore = true
            state.isLoadMore = false
            state.errorGeneralJournalByEventPerDayIntenal = null
            state.totalDebet = 0
            state.totalKredit = 0
            state.totalEntry = 0
            state.loadingGeneralJournalByEventPerDayInternal = false
        }
    }
})

const initialGeneralJournalVoidInternalState = {
  dataGeneralJournalVoidInternal: [],
  errorGeneralJournalVoidIntenal: null,
  loadingGeneralJournalVoidInternal: false,
  page: 1,
  hasMore: true,
  isLoadMore: false,
};

export const getGeneralJournalVoidInternalSlice = createSlice({
  name: "dataGeneralJournalVoid",
  initialState: initialGeneralJournalVoidInternalState,
  reducers: {
    setLoadingGeneralJournalVoidInternal: (state, action) => {
      if (state.page === 1 && !action.payload.isLoadMore) {
        state.loadingGeneralJournalVoidInternal = action.payload.loading;
      } else {
        state.isLoadMore = action.payload.loading;
      }
    },
    fetchSuccessGeneralJournalVoidInternal: (state, action) => {
      const { data, page, hasMore } = action.payload;

      if (page === 1) {
        state.dataGeneralJournalVoidInternal = data || [];
      } else {
        state.dataGeneralJournalVoidInternal = [
          ...state.dataGeneralJournalVoidInternal,
          ...(data || []),
        ];
      }

      state.page = page;
      state.hasMore = hasMore;
      state.loadingGeneralJournalVoidInternal = false;
      state.isLoadMore = false;
      state.errorGeneralJournalVoidIntenal = null;
    },
    fetchErrorGeneralJournalVoidInternal: (state, action) => {
      state.errorGeneralJournalVoidIntenal = action.payload;
      state.loadingGeneralJournalVoidInternal = false;
      state.isLoadMore = false;
    },
    resetGeneralJournalVoidInternal: (state) => {
      state.dataGeneralJournalVoidInternal = [];
      state.errorGeneralJournalVoidIntenal = null;
      state.loadingGeneralJournalVoidInternal = false;
      state.page = 1;
      state.hasMore = true;
      state.isLoadMore = false;
    },
  },
});


const initialGeneralJournalDrafInternalState = {
    dataGeneralJournalDrafInternal: [],
    errorGeneralJournalDrafIntenal: null,
    loadingGeneralJournalDrafInternal: false,
} 
export const getGeneralJournalDrafInternalSlice = createSlice({
    name: "dataGeneralJournalDraf",
    initialState: initialGeneralJournalDrafInternalState,
    reducers: {
        setLoadingGeneralJournalDrafInternal: (state, action) => {
            state.loadingGeneralJournalDrafInternal = action.payload
        },
        fetchSuccessGeneralJournalDrafInternal: (state, action) => {
            state.dataGeneralJournalDrafInternal = action.payload || []
            state.errorGeneralJournalDrafIntenal = null
        },
        fetchErrorGeneralJournalDrafInternal: (state, action) => {
           state.errorGeneralJournalDrafIntenal = action.payload
           state.dataGeneralJournalDrafInternal = []
        },
        // removeGeneralJournalDrafInternalByDataObject: (state, action) => {
        //     const targetDataObjStr = JSON.stringify(action.payload)

        //     state.dataGeneralJournalDrafInternal = state.dataGeneralJournalDrafInternal.filter(
        //         (item) => JSON.stringify(item.detail?.data_general_journal) !== targetDataObjStr
        //     )
        // },
        removeGeneralJournalDrafInternalByAccountId: (state, action) => {
            const targetIds = Object.values(action.payload.detail.data_general_journal)
            console.log("reducers draf data: ", state.dataGeneralJournalDrafInternal)
            console.log("reducers payload draf data: ", action.payload)
            state.dataGeneralJournalDrafInternal = state.dataGeneralJournalDrafInternal.filter((entry) => {
                // Cek apakah semua id dalam `accounts` tidak ada di targetIds
                const hasMatchingAccount = entry.accounts.some(account => targetIds.includes(account.id))
                return !hasMatchingAccount // Hapus jika ada salah satu akun yang cocok
            })
        }
    }
})


const initialAssetsStoreInternalState = {
    dataAssetsStoreInternal: [],
    errorAssetsStoreIntenal: null,
    loadingAssetsStoreInternal: false,
} 
export const getAssetsStoreInternalSlice = createSlice({
    name: "dataAssetsStore",
    initialState: initialAssetsStoreInternalState,
    reducers: {
        setLoadingAssetsStoreInternal: (state, action) => {
            state.loadingAssetsStoreInternal = action.payload 
        },
        fetchSuccessAssetsStoreInternal: (state, action) => {
            state.dataAssetsStoreInternal = action.payload || []
            state.errorAssetsStoreIntenal = null
        },
        fetchErrorAssetsStoreInternal: (state, action) => {
           state.errorAssetsStoreIntenal = action.payload
           state.dataAssetsStoreInternal = []
        },
    }
})


const initialOrdersInternalState = {
    dataOrdersInternal: [],
    errorOrdersInternal: null,
    loadingOrdersInternal: false,
} 
export const getOrdersInternalSlice = createSlice({
    name: "dataOrdersInternal",
    initialState: initialOrdersInternalState,
    reducers: {
        setLoadingOrdersInternal: (state, action) => {
            state.loadingOrdersInternal = action.payload
        },
        fetchSuccessOrdersInternal: (state, action) => {
            state.dataOrdersInternal = action.payload || []
            state.errorOrdersInternal = null
        },
        fetchErrorOrdersInternal: (state, action) => {
           state.errorOrdersInternal = action.payload
           state.dataOrdersInternal = []
        },
        resetErrorOrdersInternal: (state) => {
            state.errorOrdersInternal = null
        },
        deleteOrderById: (state, action) => {
            const idToDelete = action.payload
            state.dataOrdersInternal = state.dataOrdersInternal.filter(item => item.id !== idToDelete)
        },
        appendOrdersInternal: (state, action) => {
            const newOrders = Array.isArray(action.payload) ? action.payload : [action.payload];

            newOrders.forEach((order) => {
                const existing = state.dataOrdersInternal.find(item => item.id === order.id);

                if (existing) {
                // Update order_status (bisa ditambah update field lain jika perlu)
                if (order.order_status !== undefined) {
                    existing.order_status = order.order_status;
                }
                } else {
                // Order belum ada, langsung push
                state.dataOrdersInternal.push(order);
                }
            });
        },
        deleteOrdersExceptToday: (state) => {
            const now = new Date();

            const todayString = now.toISOString().split("T")[0]; // Contoh: "2025-07-16"

            state.dataOrdersInternal = state.dataOrdersInternal.filter(order => {
                const orderDate = new Date(order.created_at).toISOString().split("T")[0];
                return orderDate === todayString;
            });
        }

    }
})

const initialSearchOrderInternalState = {
  dataSearchOrder: [],
  loadingSearchOrder: false,
  errorSearchOrder: null,
  page: 1,
  hasMore: true,
  isLoadMore: false,
  totalCount: 0,
  totalRevenue: 0,
};
export const searchOrderInternalSlice = createSlice({
  name: "searchOrder",
  initialState: initialSearchOrderInternalState,
  reducers: {
    setLoadingSearchOrder: (state, action) => {
        if (state.page === 1 && !action.payload.isLoadMore) {
        state.loadingSearchOrder = action.payload.loading;
        } else {
        state.isLoadMore = action.payload.loading;
        }
    },
    fetchSuccessSearchOrder: (state, action) => {
        const { data, page, hasMore, totalCount, totalRevenue } = action.payload;

        if (page === 1) {
            state.dataSearchOrder = data;
            state.totalCount = totalCount;
            state.totalRevenue = totalRevenue;
        } else {
            state.dataSearchOrder = [...state.dataSearchOrder, ...data];
        }

        state.page = page;
        state.hasMore = hasMore;
        state.errorSearchOrder = null;
        state.loadingSearchOrder = false;
        state.isLoadMore = false;
    },
    fetchErrorSearchOrder: (state, action) => {
      state.errorSearchOrder = action.payload;
      state.loadingSearchOrder = false;
      state.isLoadMore = false;
    },
    resetSearchOrder: (state) => {
      state.dataSearchOrder = [];
      state.page = 1;
      state.errorSearchOrder = null;
      state.hasMore = true;
      state.isLoadMore = false;
      state.totalCount = 0;
      state.loadingSearchOrder = false;
      state.totalRevenue = 0;
    },
  },
});

const initialOrdersFinishedInternalState = {
  dataOrdersFinished: [],
  errorOrdersFinishedInternal: null,
  loadingOrdersFinishedInternal: false,
  page: 1,
  hasMore: true,
  isLoadMore: false,
  totalCount: 0,
  totalRevenue: 0,
}

export const getOrdersFinishedInternalSlice = createSlice({
  name: "dataOrdersFinishedInternal",
  initialState: initialOrdersFinishedInternalState,
  reducers: {
    setLoadingOrdersFinishedInternal: (state, action) => {
      if (state.page === 1 && !action.payload.isLoadMore) {
        state.loadingOrdersFinishedInternal = action.payload.loading
      } else {
        state.isLoadMore = action.payload.loading
      }
    },
    fetchSuccessOrdersFinishedInternal: (state, action) => {
      const { data, hasMore, totalCount, totalRevenue, isLoadMore } = action.payload
     
      // Untuk load more, append data. Untuk initial load, replace data
      state.dataOrdersFinished = [...state.dataOrdersFinished, ...(data || [])]
      state.hasMore = hasMore
      state.totalCount = totalCount
      state.totalRevenue = totalRevenue
      state.errorOrdersFinishedInternal = null
      state.loadingOrdersFinishedInternal = false
      state.isLoadMore = false
    },
    fetchErrorOrdersFinishedInternal: (state, action) => {
      state.errorOrdersFinishedInternal = action.payload
      state.isLoadMore = false
      state.loadingOrdersFinishedInternal = false
    },
    resetErrorOrdersFinishedInternal: (state) => {
      state.errorOrdersFinishedInternal = null
    },
    incrementPage: (state) => {
      state.page = state.page + 1
    },
    resetFinishedOrdersPagination: (state) => {
      state.dataOrdersFinished = []
      state.page = 1
      state.hasMore = true
      state.isLoadMore = false
      state.errorOrdersFinishedInternal = null
      state.totalRevenue = 0
      state.totalCount = 0
      state.loadingOrdersFinishedInternal = false
    }
  }
})

const initialTablesInternalState = {
    orderTypeTakeAway: '',
    dataTablesInternal: [],
    errorTablesInternal: null,
    loadingTablesInternal: false,
} 
export const getTablesInternalSlice = createSlice({
    name: "dataTablesInternal",
    initialState: initialTablesInternalState,
    reducers: {
        setLoadingTablesInternal: (state, action) => {
            state.loadingTablesInternal = action.payload
        },
        fetchSuccessTablesInternal: (state, action) => {
            state.dataTablesInternal = action.payload.tables || []
            state.orderTypeTakeAway = action.payload.orderTypeTakeAway || ''
            state.errorTablesInternal = null
        },
        fetchErrorTablesInternal: (state, action) => {
           state.errorTablesInternal = action.payload
        },
        resetErrorTablesInternal: (state) => {
            state.errorTablesInternal = null
        },
        addTableInternal: (state, action) => {
            state.dataTablesInternal.push(action.payload);
        },
        updateOrderTypeTakeAway: (state, action) => {
            state.orderTypeTakeAway = action.payload;
        },
        deleteTableInternalByNumber: (state) => {
            if (state.dataTablesInternal.length === 0) return;

            const maxNumber = Math.max(...state.dataTablesInternal.map(table => table.number_table));

            state.dataTablesInternal = state.dataTablesInternal.filter(
                table => table.number_table !== maxNumber
            );
        },
    }
})


const initialDataEmployeeInternalState = {
    dataEmployeeInternal: null,
    errorDataEmployeeInternal: null,
    loadingDataEmployeeInternal: false,
    updateStatus: false,
    imageUpdateEmployee: null,
} 
export const getDataEmployeeInternalSlice = createSlice({
    name: "dataEmployeeInternal",
    initialState: initialDataEmployeeInternalState,
    reducers: {
        setLoadingDataEmployeeInternal: (state, action) => {
            state.loadingDataEmployeeInternal = action.payload
        },
        fetchSuccessDataEmployeeInternal: (state, action) => {
            state.dataEmployeeInternal = action.payload
            state.errorDataEmployeeInternal = null
        },
        fetchErrorDataEmployeeInternal: (state, action) => {
           state.errorDataEmployeeInternal = action.payload
           state.dataEmployeeInternal = null
        },
        resetErrorDataEmployeeInternal: (state) => {
            state.errorDataEmployeeInternal = null
        },
        updateEmployeeInternalFields: (state, action) => {
            const updates = action.payload;
            const allowedFields = ["image", "name", "phone_number", "date_of_birth"];

            allowedFields.forEach((field) => {
                if (updates[field] !== undefined) {
                    state.dataEmployeeInternal[field] = updates[field];
                }
            });
        },
       updateEmployeeImage: (state, action) => {
            state.dataEmployeeInternal.image = action.payload.baseStr;
            state.imageUpdateEmployee = action.payload.file; 
        },
        setUpdateStatusImage: (state, action) => {
            state.updateStatus = action.payload
        }
    }
})

const initialGetEmployeesState = {
  employees: [],
  loadingGetEmployees: false,
  errorGetEmployees: null,
}
export const getEmployeesSlice = createSlice({
  name: 'getEmployees',
  initialState: initialGetEmployeesState,
  reducers: {
    setEmployees: (state, action) => {
      state.employees = action.payload || []
    },
    setLoadingGetEmployees: (state, action) => {
      state.loadingGetEmployees = action.payload
    },
    setErrorGetEmployees: (state, action) => {
      state.errorGetEmployees = action.payload || null
    },
    resetErrorGetEmployees: (state) => {
      state.errorGetEmployees = null
    },
  },
})






