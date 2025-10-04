import { createSlice } from "@reduxjs/toolkit"
import { 
    fetchTransactionHistory,
    fetchOrdersFinishedInternal,
    fetchSearchOrderInternal,
    fetchGeneralJournalByEventPerDayInternal,
    fetchGeneralJournalVoidInternal,
    fetchSearchTransactionInternal,
 } from "../actions/get";

const initialOrderTypeState = {
    orderTakeAway: null,
    tableId: null,
    isClose: false,
}
export const orderTypeSlice = createSlice({
    name: 'orderType',
    initialState: initialOrderTypeState,
    reducers: {
        setOrderTypeContext: (state, action) => {
            state.orderTakeAway = action.payload.orderTakeAway
            state.tableId = action.payload.tableId
        },
        setIsClose: (state, action) => {
            state.isClose = action.payload
        },
    }
})
export const { setOrderTypeContext, setIsClose } = orderTypeSlice.actions;

const initialStoreInfoCustomerState = {
    statusStoreInfo: false
}
export const storeInfoCustomerSlice = createSlice({
    name: "storeInfoCustomer",
    initialState: initialStoreInfoCustomerState,
    reducers: {
        setStoreInfoCustomer: (state, action) => {
            state.statusStoreInfo = action.payload 
        }
    }
})


const initialButtonActivityCustomerState = {
    buttonActive: "on going"
}
export const buttonActivityCustomerSlice = createSlice({
    name: "buttonActivity",
    initialState: initialButtonActivityCustomerState,
    reducers: {
        setButtonActivity: (state, action) => {
            state.buttonActive = action.payload
        }
    }
})

const initialFilterGeneralJournalInternalState = {
    startDate: null,
    endDate: null,
    statusFilter: 'FINALIZE',
    eventFilter: 'Agregasi', 
    searchTerm: null,
}
export const filterGeneralJournalInternalSlice = createSlice({
    name: "filterGeneralJournal",
    initialState: initialFilterGeneralJournalInternalState,
    reducers: {
        setStartDate: (state, action) => {
            state.startDate = action.payload
        },
        setEndDate: (state, action) => {
            state.endDate = action.payload
        },
        setStatusFilter: (state, action) => {
            state.statusFilter = action.payload
        },
        setEventFilter: (state, action) => {
            state.eventFilter = action.payload
        },
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload
        },
        resetFilterGeneralJournal: (state) => {
            state.startDate = null
            state.endDate = null
            state.statusFilter = 'FINALIZE'
            state.eventFilter = 'Agregasi'
            state.searchTerm = null            
        }
    }
})


const today = new Date();
const lastMonth = new Date();
lastMonth.setMonth(today.getMonth() - 1);

// Format ke yyyy-mm-dd
const formatDate = (date) => date.toISOString().split("T")[0];

const initialFilterDateLabaRugiInternalState = {
    startDate: formatDate(lastMonth), // 1 bulan ke belakang
    endDate: formatDate(today),       // hari ini
};
export const filterDateLabaRugiInternalSlice = createSlice({
    name: "filterDateLabaRugi",
    initialState: initialFilterDateLabaRugiInternalState,
    reducers: {
        setStartDate: (state, action) => {
            state.startDate = action.payload
        }, 
        setEndDate: (state, action) => {
            state.endDate = action.payload
        }
    }
})


const initialFilterDateNeracaInternalState = {
    startDate: formatDate(lastMonth), // 1 bulan ke belakang
    endDate: formatDate(today),       // hari ini
};
export const filterDateNeracaInternalSlice = createSlice({
    name: "filterDateNeraca",
    initialState: initialFilterDateNeracaInternalState,
    reducers: {
        setStartDate: (state, action) => {
            state.startDate = action.payload
        }, 
        setEndDate: (state, action) => {
            state.endDate = action.payload
        }
    }
})


const initialDataDrafToVoidInternalState = {
    dataDrafToVoid: {},
};
export const dataDrafToVoidInternalSlice = createSlice({
    name: "dataDrafToVoid",
    initialState: initialDataDrafToVoidInternalState,
    reducers: {
        setDataDrafToVoid: (state, action) => {
            state.dataDrafToVoid = action.payload
        }, 
        resetDataDrafToVoid: (state) => {
            state.dataDrafToVoid = {}
        }
    }
})


const initialFilterOrderInternalState = {
    startDate: '',
    endDate: '',
    statusFilter: 'PROCESS',
}
export const filterOrderInternalSlice = createSlice({
    name: "filterOrderInternal",
    initialState: initialFilterOrderInternalState,
    reducers: {
        setStartDate: (state, action) => {
            state.startDate = action.payload
        },
        setEndDate: (state, action) => {
            state.endDate = action.payload
        },
        setStatusFilter: (state, action) => {
            state.statusFilter = action.payload
        },
        resetFilterGeneralJournal: (state) => {
            state.startDate = ''
            state.endDate = ''
            state.statusFilter = 'PROCESS'       
        }
    }
})

export const loadMoreTransactionHistory = () => {
    return async (dispatch, getState) => {
        const state = getState().persisted;
        const { transactionHistoryInternal } = state;
        const { dataFilteringTransactionHistoryState } = state;
        
        // Cek apakah masih bisa load more
        if (!transactionHistoryInternal.hasMore || 
            transactionHistoryInternal.isLoadingMore ||
            transactionHistoryInternal.loadingTransactionHistoryInternal) {
            return;
        }

        const nextPage = transactionHistoryInternal.page + 1;
        
        const data = {
            method: dataFilteringTransactionHistoryState.method,
            status: dataFilteringTransactionHistoryState.status,
            startDate: dataFilteringTransactionHistoryState.startDate,
            endDate: dataFilteringTransactionHistoryState.endDate,
            startTime: dataFilteringTransactionHistoryState.startTime,
            endTime: dataFilteringTransactionHistoryState.endTime,
            page: nextPage
        };

        return dispatch(fetchTransactionHistory(data, true));
    }
}

export const loadMoreOrderFinished = () => {
  return async (dispatch, getState) => {
    const state = getState().persisted;
    const { dataOrdersFinishedInternal } = state; // Pastikan nama state sesuai
    const { filterOrderInternal } = state;
    
    // Cek apakah masih bisa load more
    if (!dataOrdersFinishedInternal?.hasMore || 
        dataOrdersFinishedInternal?.isLoadMore ||
        dataOrdersFinishedInternal?.loadingOrdersFinishedInternal) {
      return;
    }
    
    const nextPage = dataOrdersFinishedInternal?.page + 1;
    
    return dispatch(fetchOrdersFinishedInternal(
      filterOrderInternal.startDate,
      filterOrderInternal.endDate,
      nextPage,
      true // isLoadMore = true
    ));
  }
}

export const loadMoreSearchOrderInternal = (keyword) => {
    return async (dispatch, getState) => {
        const state = getState();
        const { searchOrderInternalState } = state;

        // Cek apakah masih bisa load more
        if (!searchOrderInternalState.hasMore || 
            searchOrderInternalState.isLoadMore ||
            searchOrderInternalState.loadingSearchOrder) {
            return;
        }

        const nextPage = searchOrderInternalState.page + 1;

        return dispatch(fetchSearchOrderInternal(keyword, nextPage, true));
    }
}

export const loadMoreGeneralJournalNonAgregasi = () => {
    return async (dispatch, getState) => {
        const state = getState().persisted
        const { getGeneralJournalByEventPerDayInternal } = state 
        const { filterGeneralJournalInternal } = state 
        
        if (!getGeneralJournalByEventPerDayInternal?.hasMore || 
            getGeneralJournalByEventPerDayInternal?.isLoadMore ||
            getGeneralJournalByEventPerDayInternal?.loadingGeneralJournalByEventPerDayInternal) {
            return;
        }
        
        const nextPage = (getGeneralJournalByEventPerDayInternal?.page || 1) + 1;
        
        return dispatch(fetchGeneralJournalByEventPerDayInternal(
            filterGeneralJournalInternal.startDate,
            filterGeneralJournalInternal.endDate,
            nextPage,
            true // isLoadMore
        ))
    }
}

export const loadMoreGeneralJournalVoidInternal = () => {
  return async (dispatch, getState) => {
    const state = getState().persisted;
    const { getGeneralJournalVoidInternal, filterGeneralJournalInternal } = state;

    if (
      !getGeneralJournalVoidInternal?.hasMore ||
      getGeneralJournalVoidInternal?.isLoadMore ||
      getGeneralJournalVoidInternal?.loadingGeneralJournalVoidInternal
    ) {
      return;
    }

    const nextPage = (getGeneralJournalVoidInternal?.page || 1) + 1;

    return dispatch(
      fetchGeneralJournalVoidInternal(
        filterGeneralJournalInternal.startDate,
        filterGeneralJournalInternal.endDate,
        nextPage,
        true // isLoadMore
      )
    );
  };
};


export const navbarInternalSlice = createSlice({
  name: "navbarInternal",
  initialState: {
    isOpen: false,
    isMobileDeviceType: false,
  },
  reducers: {
    setIsOpen: (state, action) => {
      state.isOpen = action.payload;
    },
    setIsMobileDeviceType: (state, action) => {
       state.isMobileDeviceType = action.payload;
    }
  },
});


export const headerHiddenInternalSlice = createSlice({
  name: "headerHidderInternal",
  initialState: {
    isHidden: false,
  },
  reducers: {
    setHeaderHidden: (state, action) => {
      state.isOpen = action.payload;
    }
  },
});

export const loadMoreSearchTransactionInternal = (keyword) => {
    return async (dispatch, getState) => {
        const state = getState()
        const { getSearchTransactionInternalState } = state;
        
        if (!getSearchTransactionInternalState.hasMore || 
            getSearchTransactionInternalState.isLoadMore ||
            getSearchTransactionInternalState.loadingSearchTransactionInternal
        ) {
            return 
        }

        const nextPage = getSearchTransactionInternalState.page + 1 

        return dispatch(fetchSearchTransactionInternal(keyword, nextPage, true))
    }
}
