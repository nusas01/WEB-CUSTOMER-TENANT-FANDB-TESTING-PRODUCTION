import { createSlice } from "@reduxjs/toolkit"
import { 
    fetchTransactionHistory,
    fetchOrdersFinishedInternal,
    fetchSearchOrderInternal,
    fetchGeneralJournalByEventPerDayInternal,
    fetchGeneralJournalVoidInternal,
 } from "../actions/get";

const initialOrderTypeState = {
    orderTakeAway: null,
    tableId: null,
}
export const orderTypeSlice = createSlice({
    name: 'orderType',
    initialState: initialOrderTypeState,
    reducers: {
        setOrderTypeContext: (state, action) => {
            console.log('Dispatching setOrderTypeContext with:', action.payload);
            state.orderTakeAway = action.payload.orderTakeAway
            state.tableId = action.payload.tableId
        }
    }
})
export const { setOrderTypeContext } = orderTypeSlice.actions;


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

        console.log("Loading more data for page:", nextPage);
        
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
      console.log("Cannot load more - conditions not met");
      return;
    }
    
    const nextPage = (dataOrdersFinishedInternal?.page || 1) + 1;
    console.log("Loading more data for page:", nextPage);
    
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
            searchOrderInternalState.loadingSearchOrderInternal) {
            return;
        }

        const nextPage = (searchOrderInternalState.page || 1) + 1;
        console.log("Loading more data for page:", nextPage);

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
            console.log("Cannot load more - conditions not met", {
                hasMore: getGeneralJournalByEventPerDayInternal?.hasMore,
                isLoadMore: getGeneralJournalByEventPerDayInternal?.isLoadMore,
                loading: getGeneralJournalByEventPerDayInternal?.loadingGeneralJournalByEventPerDayInternal
            });
            return;
        }
        
        const nextPage = (getGeneralJournalByEventPerDayInternal?.page || 1) + 1;
        console.log("Loading more data for page:", nextPage);
        
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
      console.log("Cannot load more - conditions not met", {
        hasMore: getGeneralJournalVoidInternal?.hasMore,
        isLoadMore: getGeneralJournalVoidInternal?.isLoadMore,
        loading: getGeneralJournalVoidInternal?.loadingGeneralJournalVoidInternal,
      });
      return;
    }

    const nextPage = (getGeneralJournalVoidInternal?.page || 1) + 1;
    console.log("Loading more data (Void) for page:", nextPage);

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





