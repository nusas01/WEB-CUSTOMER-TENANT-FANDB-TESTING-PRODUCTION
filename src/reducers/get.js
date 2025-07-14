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
    dataTransactionHistory: [],
    error: null,
    statusCode: null,
    lengthTransactionProses: 0,
    loadingHistory: false,
    hasMore: false,
    page: 1,
}
export const getTransactionsHistoryCustomerSlice = createSlice({
    name: "transactionHistory",
    initialState: initialTransactionsHistoryCustomer,
    reducers: {
        setLoadingGetTransactionHistoryCustomer: (state, action) => {
            state.loadingHistory = action.payload
        },
        fetchSuccessGetTransactionHistoryCustomer: (state, action) => {
            const { data, hasMore, page, lengthTransactionProses } = action.payload
            if (page === 1) {
                state.dataTransactionHistory = data;
              } else {
                state.dataTransactionHistory = [...state.dataTransactionHistory, ...data]; 
              }
            state.page = page
            state.hasMore = hasMore
            state.lengthTransactionProses = lengthTransactionProses
        },
        fetchErrorGetTransactionHistoryCustomer: (state, action) => {
            state.error = action.payload.error
            state.statusCode = action.payload.statusCode
        }
    }
})


const initialGetPaymentMethodsCustomer = {
    dataPaymentMethodCustomer: [],
    taxRate: 0,
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
            state.dataPaymentMethodCustomer = action.payload?.payment_methods
            state.taxRate = action.payload?.tax_rate
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
    errorTransactionHistoryInternal: null,
    statusCodeTransactionHistoryInternal: null,
    loadingTransactionHistoryInternal: false,
}
export const transactionHistoryInternalSlice = createSlice({
    name: 'transactionHistoryInternal',
    initialState: intitalTransactionHistoryState,
    reducers: {
        setLoadingTransactionHistoryInternal: (state, action) => {
            state.loadingTransactionHistoryInternal = action.payload
        },
        fetchSuccessTransactionHistoryInternal: (state, action) => {
            state.dataTransactionHistoryInternal = action.payload
            state.statusCodeTransactionHistoryInternal = 200
            state.errorTransactionHistoryInternal = null
            state.loadingTransactionHistoryInternal = false
        },
        fetchErrorTransactionHistoryInternal: (state, action) => {
            state.errorTransactionHistoryInternal = action.payload.error
            state.statusCodeTransactionHistoryInternal = action.payload.statusCode
            state.loadingTransactionHistoryInternal = false
        },
        resetTransactionHitoryInternal: (state) => {  
            state.errorTransactionHistoryInternal = null
            state.dataTransactionHistoryInternal = []
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


const initialGetPaymentMethodsInternalState = {
    dataPaymentMethodInternal: [],
    taxRateInternal: 0,
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
            state.dataPaymentMethodInternal = action.payload?.payment_methods
            state.taxRateInternal = action.payload?.tax_rate
            state.errorPaymentMethodsInternal = null
        },
        fetchErrorGetPaymentMethodsInternal: (state, action) => {
            state.errorPaymentMethodsInternal = action.payload.error
        }
    }
})


const initialAllDataOrderInternalState = {
    dataOrderIntenal: [],
    errorDataOrderIntenal: null,
    loadingDataOrderInternal: false
} 
export const getAllDataOrderInternalSlice = createSlice({
    name: "dataOrderInternal",
    initialState: initialAllDataOrderInternalState,
    reducers: {
        setLoadingGetAllDataOrderInternal: (state, action) => {
            state.loadingDataOrderInternal = action.payload
        },
        fetchSuccessGetAllDataOrderInternal: (state, action) => {
            state.dataOrderIntenal = action.payload
            state.errorDataOrderIntenal = null
        },
        fetchErrorGetAllDataOrderInternal: (state, action) => {
            state.errorDataOrderIntenal = action.payload.error
            state.dataOrderIntenal = []
        }, 
        removeDataOrderInternalById: (state, action) => {
            const idToRemove = action.payload
            state.dataOrderIntenal = state.dataOrderIntenal.filter(item => item.id !== idToRemove)
        },
        addDataOrderInternal: (state, action) => {
            state.dataOrderIntenal.push(action.payload);
        }
    }
})


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

            state.dataCategoryAndProduct = state.dataCategoryAndProduct.map((category) => {
                const updatedProducts = category.product.map((prod) => {
                if (prod.id === productId) {
                    return {
                    ...prod,
                    available: !prod.available,
                    };
                }
                return prod;
                });

                return {
                ...category,
                product: updatedProducts,
                };
            });
        },
        deleteProductById: (state, action) => {
            const productId = action.payload;
            console.log("Reducer deleteProductById dijalankan dengan id:", productId);

            for (let i = 0; i < state.dataCategoryAndProduct.length; i++) {
                const products = state.dataCategoryAndProduct[i].product;

                const productIndex = products.findIndex((prod) => prod.id === productId);

                if (productIndex !== -1) {
                    products.splice(productIndex, 1);
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
    dataLabaRugiInternal: null,
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
            state.dataLabaRugiInternal = action.payload
            state.errorLabaRugiIntenal = null
        },
        fetchErrorLabaRugiInternal: (state, action) => {
           state.errorLabaRugiIntenal = action.payload
           state.dataLabaRugiInternal = null
        },
        resetErrorLabaRugiInternal: (state) => {
            state.errorLabaRugiIntenal = null
        }
    }
})


const initialNeracaInternalState = {
    dataNeracaInternal: null,
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
            state.dataNeracaInternal = action.payload
            state.errorNeracaIntenal = null
        },
        fetchErrorNeracaInternal: (state, action) => {
           state.errorNeracaIntenal = action.payload
           state.dataNeracaInternal = null
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
} 
export const getGeneralJournalByEventPerDayInternalSlice = createSlice({
    name: "dataGeneralJournalByEventPerDay",
    initialState: initialGeneralJournalByEventPerDayInternalState,
    reducers: {
        setLoadingGeneralJournalByEventPerDayInternal: (state, action) => {
            state.loadingGeneralJournalByEventPerDayInternal= action.payload
        },
        fetchSuccessGeneralJournalByEventPerDayInternal: (state, action) => {
            state.dataGeneralJournalByEventPerDayInternal = action.payload || []
            state.errorGeneralJournalByEventPerDayIntenal = null
        },
        fetchErrorGeneralJournalByEventPerDayInternal: (state, action) => {
           state.errorGeneralJournalByEventPerDayIntenal = action.payload
           state.dataGeneralJournalByEventPerDayInternal = []
        },
    }
})


const initialGeneralJournalVoidInternalState = {
    dataGeneralJournalVoidInternal: [],
    errorGeneralJournalVoidIntenal: null,
    loadingGeneralJournalVoidInternal: false,
} 
export const getGeneralJournalVoidInternalSlice = createSlice({
    name: "dataGeneralJournalVoid",
    initialState: initialGeneralJournalVoidInternalState,
    reducers: {
        setLoadingGeneralJournalVoidInternal: (state, action) => {
            state.loadingGeneralJournalVoidInternal = action.payload
        },
        fetchSuccessGeneralJournalVoidInternal: (state, action) => {
            state.dataGeneralJournalVoidInternal = action.payload || []
            state.errorGeneralJournalVoidIntenal = null
        },
        fetchErrorGeneralJournalVoidInternal: (state, action) => {
           state.errorGeneralJournalVoidIntenal = action.payload
           state.dataGeneralJournalVoidInternal = []
        },
    }
})


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
            state.dataOrdersInternal = action.payload
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
        updateOrderStatusById: (state, action) => {
            const transaction = state.dataOrdersInternal.find(item => item.id === action.payload.id)
            if (transaction) {
                transaction.order_status = action.payload.order_status
            }
        },
    }
})


const initialOrdersFinishedInternalState = {
    dataOrdersFinishedInternal: [],
    errorOrdersFinishedInternal: null,
    loadingOrdersFinishedInternal: false,
} 
export const getOrdersFinishedInternalSlice = createSlice({
    name: "dataOrdersFinishedInternal",
    initialState: initialOrdersFinishedInternalState,
    reducers: {
        setLoadingOrdersFinishedInternal: (state, action) => {
            state.loadingOrdersFinishedInternal = action.payload
        },
        fetchSuccessOrdersFinishedInternal: (state, action) => {
            state.dataOrdersFinishedInternal = action.payload
            state.errorOrdersFinishedInternal = null
        },
        fetchErrorOrdersFinishedInternal: (state, action) => {
           state.errorOrdersFinishedInternal = action.payload
           state.dataOrdersFinishedInternal = []
        },
        resetErrorOrdersFinishedInternal: (state) => {
            state.errorOrdersFinishedInternal = null
        },
        addOrderFinishedInternal: (state, action) => {
            const newTransaction = {
                ...action.payload,
                order_status: "FINISHED"
            }
            state.dataOrdersFinishedInternal.push(newTransaction)
        }
    }
})

const initialTablesInternalState = {
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
            state.dataTablesInternal = action.payload
            state.errorTablesInternal = null
        },
        fetchErrorTablesInternal: (state, action) => {
           state.errorTablesInternal = action.payload
           state.dataTablesInternal = []
        },
        resetErrorTablesInternal: (state) => {
            state.errorTablesInternal = null
        },
        addTableInternal: (state, action) => {
            state.dataTablesInternal.push(action.payload);
        },
        deleteTableInternalByNumber: (state, action) => {
            state.dataTablesInternal = state.dataTablesInternal.filter(
                table => table.number_table !== action.payload
            );
        },
    }
})


const initialDataEmployeeInternalState = {
    dataEmployeeInternal: null,
    errorDataEmployeeInternal: null,
    loadingDataEmployeeInternal: false,
    updateStatus: false,
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
            state.dataEmployeeInternal.image = action.payload;
            state.dataEmployeeImage = action.payload; 
        },
        setUpdateStatusImage: (state, action) => {
            state.updateStatus = action.payload
        }
    }
})




