import Sidebar from "../component/sidebar"
import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { 
  Clock, 
  CheckCircle, 
  Coffee, 
  Filter, 
  Calendar,
  MapPin,
  User,
  Mail,
  DollarSign,
  AlertCircle,
  RefreshCw,
  Search,
  TrendingUp,
  Eye,
  MoreHorizontal,
  Bell,
  Settings,
  Ticket,
  Plus,
  RotateCcw
} from 'lucide-react';
import { 
  fetchOrdersInternal,
  fetchOrdersFinishedInternal, 
  fetchSearchOrderInternal,
 } from "../actions/get.js"
import { useDispatch, useSelector } from "react-redux"
import { SpinnerRelative, SpinnerFixed } from "../helper/spinner.js";
import { Toast, ToastPortal } from "../component/alert";
import { 
  getOrdersInternalSlice,
  getOrdersFinishedInternalSlice, 
  searchOrderInternalSlice,
 } from "../reducers/get.js";
 import {
  toProgressOrderInternalSlice,
  toFinishedOrderInternalSlice,
} from "../reducers/patch.js";
import { da, se } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import {formatCurrency, useInfiniteScroll} from "../helper/helper.js";
import { 
  toProgressOrderInternal, 
  toFinishedOrderInternal,
 } from "../actions/patch.js";
 import {
  filterOrderInternalSlice,
  loadMoreOrderFinished,
  loadMoreSearchOrderInternal,
 } from "../reducers/reducers.js"
import {DateFilterComponent} from '../helper/formatdate.js'
import { set } from "date-fns";

export default function KasirOrders() {
  const dispatch = useDispatch();
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const [activeMenu, setActiveMenu] = useState("Orders");

  // handle response error when fetching orders
  const { resetErrorOrdersInternal } = getOrdersInternalSlice.actions
  const { errorOrdersInternal } = useSelector((state) => state.persisted.dataOrdersInternal)

  useEffect(() => {
    if (errorOrdersInternal) {
      setToast({
        show: true,
        type: 'error',
        message: 'Terjadi kesalahan saat memuat data pesanan. Kami sudah menerima laporan ini dan sedang memperbaikinya.'
      });

      const timer = setTimeout(() => {
        setToast({ show: false, type: '', message: '' });
        dispatch(resetErrorOrdersInternal());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorOrdersInternal])

  // handle response loading when fetching orders finished
  const { resetErrorOrdersFinishedInternal } = getOrdersFinishedInternalSlice.actions
  const { errorOrdersFinishedInternal } = useSelector((state) => state.persisted.dataOrdersFinishedInternal)

  useEffect(() => {
    if (errorOrdersFinishedInternal) {
      setToast({
        show: true,
        type: 'error',
        message: 'Terjadi kesalahan saat memuat data pesanan yang sudah selesai. Kami sudah menerima laporan ini dan sedang memperbaikinya.'
      });

      const timer = setTimeout(() => {
        setToast({ show: false, type: '', message: '' });
        dispatch(resetErrorOrdersFinishedInternal());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorOrdersFinishedInternal])

  // handle response change status to progress order
  const { resetToProgressOrder } = toProgressOrderInternalSlice.actions
  const { errorToProgressOrder, successToProgressOrder } = useSelector((state) => state.toProgressOrderInternalState)

  useEffect(() => {
    if (errorToProgressOrder) {
      setToast({
        show: true,
        type: 'error',
        message: 'Gagal memperbarui status pesanan menjadi Received. Silakan coba lagi atau hubungi admin jika masalah terus berlanjut.'
      });

      const timer = setTimeout(() => {
        setToast({ show: false, type: '', message: '' });
        dispatch(resetToProgressOrder());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorToProgressOrder])

  useEffect(() => {
    if (successToProgressOrder) {
      setToast({
        show: true,
        type: 'success',
        message: 'Status pesanan berhasil diperbarui menjadi sedang diproses.'
      });

      const timer = setTimeout(() => {
        setToast({ show: false, type: '', message: '' });
        dispatch(resetToProgressOrder());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successToProgressOrder])

  // handle response change status to finished order
  const { resetToFinishedOrder } = toFinishedOrderInternalSlice.actions
  const { successToFinishedOrder, errorToFinishedOrder } = useSelector((state) => state.toFinishedOrderInternalState)

  useEffect(() => {
    if (errorToFinishedOrder) {
      setToast({
        show: true,
        type: 'error',
        message: 'Gagal menyelesaikan pesanan. Silakan coba kembali atau laporkan ke admin jika masalah masih terjadi.'
      });

      const timer = setTimeout(() => {
        setToast({ show: false, type: '', message: '' });
        dispatch(resetToFinishedOrder());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorToFinishedOrder])

  useEffect(() => {
    if (successToFinishedOrder) {
      setToast({
        show: true,
        type: 'success',
        message: 'Pesanan berhasil diselesaikan.'
      });

      const timer = setTimeout(() => {
        setToast({ show: false, type: '', message: '' });
        dispatch(resetToFinishedOrder());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successToFinishedOrder])

  // Handle toast close
  const handleToastClose = () => {
    setToast({ show: false, type: '', message: '' });
    // Reset all possible actions when manually closing
    dispatch(resetErrorOrdersInternal());
    dispatch(resetErrorOrdersFinishedInternal());
    dispatch(resetToProgressOrder());
    dispatch(resetToFinishedOrder());
  }

  return (
    <div className="flex">
      {/* Toast Portal */}
      {toast.show && (
        <ToastPortal>
          <div className='fixed top-4 right-4 z-50'>
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={handleToastClose}
              duration={3000}
            />
          </div>
        </ToastPortal>
      )}

      {/* Sidebar - Fixed width */}
      <div className="w-1/10 min-w-[250px]">
        <Sidebar activeMenu={activeMenu} />
      </div>

      <div className="flex-1">
        <OrderDashboard />
      </div>
    </div>
  )
}


const OrderDashboard = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([]);
  const [hasInitializedSearch, setHasInitializedSearch] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    progress: 0,
    received: 0,
    finished: 0,
    totalRevenue: 0
  });
  const dispatch = useDispatch();
  const [spinnerRelative, setSpinnerRelative] = useState(false);
  const [spinnerFixed, setSpinnerFixed] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Filter state
  const { setStartDate, setEndDate, setStatusFilter, resetFilterGeneralJournal } = filterOrderInternalSlice.actions
  const { startDate, endDate, statusFilter } = useSelector((state) => state.persisted.filterOrderInternal)

  // integrasi dengan data state dan api 
  // Order process and progress
  // const { deleteOrdersExceptToday } = getOrdersInternalSlice.actions
  const { dataOrdersInternal, loadingOrdersInternal } = useSelector((state) => state.persisted.dataOrdersInternal)
  console.log("data orders: ", dataOrdersInternal)
  
  useEffect(() => {
    if (!dataOrdersInternal || dataOrdersInternal.length === 0) {
      dispatch(fetchOrdersInternal())
    }
  }, [])

  useEffect(() => {
    setSpinnerRelative(loadingOrdersInternal)
  }, [loadingOrdersInternal])

  const handleRefreshOrders = () => {
    dispatch(fetchOrdersInternal())
  }
  
  // Finished orders state - pastikan selector sesuai dengan struktur Redux
  // const { resetFinishedOrdersPagination } = getOrdersFinishedInternalSlice.actions
  const finishedOrdersState = useSelector((state) => state.persisted.dataOrdersFinishedInternal)
  
  // Destructure dengan default values untuk mencegah undefined
  const { 
    dataOrdersFinished = [],
    loadingOrdersFinishedInternal = false, 
    page: pageOrderFinished = 1, 
    hasMore: hasMoreOrderFinished = false,
    isLoadMore: isLoadMoreOrderFinished = false,
    totalCount: totalCountOrderFinished = 0,
    totalRevenue: totalRevenueOrderFinished = 0,
  } = finishedOrdersState || {}

  console.log("Finished orders state:", {
    dataOrdersFinished,
    hasMoreOrderFinished,
    isLoadMoreOrderFinished,
    pageOrderFinished
  });

  // Get finished orders
  const dataOrdersFinishedInternal = useMemo(() => {
    if (statusFilter === 'FINISHED') {
      return dataOrdersFinished || []
    }
    return []
  }, [dataOrdersFinished, statusFilter])

  // useEffect(() => {
  //   if (statusFilter !== 'FINISHED') {
  //     dispatch(resetFinishedOrdersPagination())
  //     dispatch(setStartDate(''))
  //     dispatch(setEndDate(''))
  //   }
  // }, [statusFilter])

  // Initial fetch effect
  // useEffect(() => {
  //   const shouldFetch = (
  //     statusFilter === 'FINISHED' && 
  //     startDate !== '' && 
  //     endDate !== '' && 
  //     dataOrdersFinished.length === 0 &&
  //     !loadingOrdersFinishedInternal &&
  //     !hasInitialized
  //   );
    
  //   console.log("Initial fetch effect:", {
  //     statusFilter,
  //     startDate,
  //     endDate,
  //     shouldFetch,
  //     hasInitialized,
  //     loading: loadingOrdersFinishedInternal
  //   });
    
  //   if (shouldFetch) {
  //     setHasInitialized(true);
  //     // dispatch(resetFinishedOrdersPagination());
  //     dispatch(fetchOrdersFinishedInternal(startDate, endDate, 1, false));
  //   }
  // }, [statusFilter, startDate, endDate, dispatch, loadingOrdersFinishedInternal, hasInitialized])
  const handleFilterOrderFinished = () => {
    if (startDate === '' || endDate === '') {
      return
    }
    dispatch(fetchOrdersFinishedInternal(startDate, endDate, 1, false));
  }

  useEffect(() => {
    if (dataOrdersFinishedInternal.length > 0 && !hasInitializedSearch) {
      setStats(prevStats => ({
        ...prevStats,
        total: totalCountOrderFinished,
        progress: 0,
        received: 0,
        totalRevenue: totalRevenueOrderFinished,
        finished: totalCountOrderFinished,
      }));
    }
  }, [dataOrdersFinishedInternal, hasInitializedSearch])


  // Reset initialization when filter changes
  // useEffect(() => {
  //   if (statusFilter !== 'FINISHED') {
  //     setHasInitialized(false);
  //   }
  // }, [statusFilter, startDate, endDate])


  // Loading states
  useEffect(() => {
    setSpinnerRelative(loadingOrdersFinishedInternal && pageOrderFinished === 1)
  }, [loadingOrdersFinishedInternal, pageOrderFinished])


  // Load more callback - diperbaiki
  const loadMoreFinishedOrdersCallback = useCallback(() => {
    console.log("Load more callback triggered:", {
      statusFilter,
      hasMoreOrderFinished,
      isLoadMoreOrderFinished
    });
    
    if (statusFilter === 'FINISHED' && hasMoreOrderFinished && !isLoadMoreOrderFinished) {
      console.log("Dispatching loadMoreOrderFinished");
      dispatch(loadMoreOrderFinished());
    }
  }, [statusFilter, hasMoreOrderFinished, isLoadMoreOrderFinished, dispatch])

  // Infinite scroll hook
  const { ref: loadMoreFinishedRef } = useInfiniteScroll({
    hasMore: hasMoreOrderFinished,
    loading: isLoadMoreOrderFinished,
    loadMore: loadMoreFinishedOrdersCallback,
    threshold: 1.0,
    rootMargin: '100px',
  })

  // handle reset filter
  const { resetSearchOrder } = searchOrderInternalSlice.actions
  const handleResetFilter = () => {
    dispatch(resetFilterGeneralJournal())
    dispatch(resetSearchOrder())
    setSearchQuery('')
  }

  // handle status to progress order
  const { loadingToProgressOrder } = useSelector((state) => state.toProgressOrderInternalState)

  useEffect(() => {
    setSpinnerFixed(loadingToProgressOrder)
  }, [loadingToProgressOrder])

  const handleReceiveOrder = (orderId) => {
    const data = {
      transaction_id: orderId,
    }
    dispatch(toProgressOrderInternal(data))
  };

  // handle status to finished order
  const { loadingToFinishedOrder } = useSelector((state) => state.toFinishedOrderInternalState)
  
  const handleFinishOrder = (data) => {
    console.log("data finished order: ", data)
    dispatch(toFinishedOrderInternal(data))
  };

  useEffect(() => {
    setSpinnerFixed(loadingToFinishedOrder)
  }, [loadingToFinishedOrder])

  const getStatusColor = (status) => {
    switch (status) {
      case 'PROCESS': return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white';
      case 'PROGRESS': return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white';
      case 'FINISHED': return 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PROCESS': return <Clock className="w-4 h-4" />;
      case 'PROGRESS': return <RefreshCw className="w-4 h-4" />;
      case 'FINISHED': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // handle search to api 
  const { 
    dataSearchOrder, 
    loadingSearchOrder, 
    page: pageSearchOrder, 
    hasMore: hasMoreSearchOrder,
    isLoadMore: isLoadMoreSearchOrder,
    totalCount: totalCountSearchOrder, 
    totalRevenue: totalRevenueSearchOrder,
  } = useSelector((state) => state.searchOrderInternalState)

  // get search order 
  const dataSearchOrderInternal = useMemo(() => {})

  useEffect(() => {
    if (dataSearchOrder.length > 0) {
      setStats({
          total: totalCountSearchOrder,
          progress: 0,
          received: 0,
          finished: 0,
          totalRevenue: totalRevenueSearchOrder,
        });
    }
  }, [dataSearchOrder])

  useEffect(() => {
    if (searchQuery === '') {
      dispatch(resetSearchOrder())
      setHasInitializedSearch(false)
    }
  }, [searchQuery])

  // Handle search dengan reset page
  const handleSearch = () => {
    console.log("key nya apa kawan: ", searchQuery)
    setHasInitializedSearch(true);
    dispatch(resetSearchOrder());
    dispatch(fetchSearchOrderInternal(searchQuery, pageSearchOrder, false));
  };

  const loadMoreSearchOrderCallback = useCallback(() => {
    if (searchQuery !== '' && hasMoreSearchOrder && !isLoadMoreSearchOrder) {
      console.log("Dispatching loadMoreSearchOrderInternal");
      dispatch(loadMoreSearchOrderInternal(searchQuery));
    }
  }, [searchQuery, hasMoreSearchOrder, isLoadMoreSearchOrder])

  const { ref: loadMoreSearchOrderRef } = useInfiniteScroll({
    hasMore: hasMoreSearchOrder,
    loading: isLoadMoreSearchOrder,
    loadMore: loadMoreSearchOrderCallback,
    threshold: 1.0,
    rootMargin: '100px',
  })

  useEffect(() => {
    if (dataSearchOrder.length > 0) {
      setFilteredOrders(dataSearchOrder)
    }
  }, [dataSearchOrder])

  useEffect(() => {
    setSpinnerRelative(loadingSearchOrder && dataSearchOrder.length === 0)
  }, [loadingSearchOrder, dataSearchOrder.length])



  // Filter orders effect
  useEffect(() => {
    if (dataOrdersFinishedInternal.length === 0 && !isLoadMoreOrderFinished && !hasInitializedSearch) {
      const allOrders = dataOrdersInternal || [];
      let filtered = [];
      let totalRevenue = 0;
      let progress = 0;
      let received = 0;
      let finished = 0;
      
      allOrders.forEach(order => {
        const status = order.order_status?.toUpperCase() || '';
        
        if (status === 'PROCESS') progress++;
        if (status === 'PROGRESS') received++;
        if (status === 'FINISHED') finished++;
        totalRevenue += order.amount_price || 0;
      });
  
      filtered = allOrders.filter(order => {
        const status = order.order_status?.toUpperCase() || '';
        const username = order.username?.toLowerCase() || '';
        const email = order.email?.toLowerCase() || '';
        const table = order.table?.toString().toLowerCase() || '';
        const id = order.id?.toString().toLowerCase() || '';
        
        const matchStatus = statusFilter === 'ALL' || status === statusFilter.toUpperCase();
        
        return matchStatus;
      });
      
      setFilteredOrders(filtered);
      setStats({
        total: allOrders.length,
        progress,
        received,
        finished,
        totalRevenue
      });
    }
  }, [dataOrdersInternal, hasInitializedSearch, dataSearchOrder, statusFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      { spinnerFixed && (
        <SpinnerFixed colors={'fill-gray-800'}/>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl flex items-center justify-center">
                <Ticket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Order Management</h1>
                <p className="text-gray-600 text-xs">Kelola pesanan masuk dan pantau status pembayaran</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
              onClick={() => handleRefreshOrders()}
              className="bg-gradient-to-r from-gray-800 to-gray-700 text-white px-6 py-2 rounded-xl hover:shadow-sm transition-all duration-300 flex items-center space-x-2 hover:scale-105"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
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

      <div className="max-w-7xl mx-auto p-4">
        {/* total revenue */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  { dataOrdersFinished.length > 0
                    ? `${dataOrdersFinished.length} orders finished by filter`
                    : 'Orders today'
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl flex items-center justify-center">
                <Ticket className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Process</p>
                <p className="text-3xl font-bold text-gray-800">{stats.progress}</p>
                <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3" />
                  Needs attention
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Progress/Received</p>
                <p className="text-3xl font-bold text-gray-800">{stats.received}</p>
                <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                  <RefreshCw className="w-3 h-3" />
                  In preparation
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Finished</p>
                <p className="text-3xl font-bold text-gray-800">{stats.finished}</p>
                <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
                  <CheckCircle className="w-3 h-3" />
                  Completed today
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl flex items-center justify-center">
                <Filter className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Search & Filter Orders</h2>
            </div>
            <button
              onClick={handleResetFilter}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold shadow transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Filters
            </button>
          </div>

          {/* Filter Row */}
          <div className="flex gap-4 justify-between items-end">
            {/* Search Input */}
            <div className="flex gap-2">
              <div className="flex-1 min-w-[300px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search Orders</label>
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute inset-y-0 left-4 my-auto text-gray-400" size={20}/>
                  <input
                    type="text"
                    placeholder="Search by customer, email, table..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              {/* Search Button */}
              <div>
                <label className="invisible block">Search Button</label>
                <button
                  onClick={() => handleSearch()}
                  className="flex items-center gap-2 px-2 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold shadow transition-all"
                >
                  <Search className="w-4 h-4" />
                  Search Orders
                </button>
              </div>
            </div>


            {/* Status Filter */}
            <div className="flex gap-4">
              <div className="min-w-[150px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status Filter</label>
                <select
                  value={statusFilter}
                  onChange={(e) => dispatch(setStatusFilter(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ALL">All Status</option>
                  <option value="PROCESS">Process</option>
                  <option value="PROGRESS">Progress / Received</option>
                  <option value="FINISHED">Finished</option>
                </select>
              </div>

              {/* Start Date and endate */}
              { statusFilter === 'FINISHED' && (
                <div className="flex space-x-2">
                  <DateFilterComponent 
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    maxRangeDays={7}
                  />
                  <div>
                    <p className="invisible">apa ini</p>
                    <button 
                      onClick={handleFilterOrderFinished}
                      className="px-7 mb-1 py-2.5 bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-xl hover:shadow-sm transition-all duration-300 flex items-center justify-center"
                    >
                      <span>Filter</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Orders List */}
        { spinnerRelative && (
          <div className="flex justify-center bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden min-h-[50vh]">
              <SpinnerRelative />
            </div>
        )}

       {!spinnerRelative 
        && ((stats.progress === 0 && statusFilter === 'PROCESS')
        || (stats.finished === 0 && statusFilter === 'FINISHED') 
        || (stats.received === 0 && statusFilter === 'PROGRESS'))
        ? <div><NoOrdersContainer /></div>
        : null}


        {!spinnerRelative && (filteredOrders.length > 0 || dataOrdersFinishedInternal.length > 0) && (

            <>
              {((dataOrdersFinishedInternal.length > 0 && statusFilter === 'FINISHED' && !hasInitializedSearch) ? dataOrdersFinishedInternal : filteredOrders).map((order) => (
                <div key={order.id} className="bg-white mb-2 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="p-4">
                    {/* Order Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                      <div className="flex items-center gap-4 mb-4 lg:mb-0">
                        <div className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 ${getStatusColor(order.order_status)}`}>
                          {getStatusIcon(order.order_status)}
                          {order.order_status}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Order</span>
                          <span className="text-sm font-bold text-gray-800">#{order.id}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreHorizontal className="w-4 h-4 text-gray-600" />
                        </button>
                        
                        {order.order_status === 'PROCESS' && (
                          <button
                            onClick={() => handleReceiveOrder(order.id)}
                            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 flex items-center gap-2 font-semibold"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Receive Order
                          </button>
                        )}
                        
                        {order.order_status === 'PROGRESS' && (
                          <button
                            onClick={() => handleFinishOrder(order)}
                            className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 flex items-center gap-2 font-semibold"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Finish Order
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Customer</p>
                          <p className="font-bold text-gray-800">{order.username}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Email</p>
                          <p className="font-bold text-gray-800 text-sm">{order.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Table</p>
                          <p className="font-bold text-gray-800">{order.table}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Order Time</p>
                          <p className="font-bold text-gray-800 text-sm">{formatDate(order.created_at)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-lg">
                        <Coffee className="w-5 h-5" />
                        Order Items
                      </h4>
                      
                      <div className="space-y-3">
                        {order.order.map((item, index) => (
                          <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gray-800`}>
                                <Coffee className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <p className="font-bold text-gray-800">{item.product.name}</p>
                                <p className="text-sm text-gray-600">
                                  <span className="font-semibold">{item.quantity}x</span> {formatCurrency(item.price)}
                                  {item.notes && <span className="ml-2 px-2 py-1 bg-gray-200 rounded-lg text-xs font-semibold">{item.notes}</span>}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-800 text-lg">{formatCurrency(item.amount_price)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Total */}
                    <div className="border-t border-gray-200 pt-6 mt-6">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-xl bg-gray-800 text-white text-sm`}>
                            {order.order_type}
                          </span>
                          <span className="px-3 py-1 rounded-xl text-sm bg-gray-800 text-white">
                            {order.status_transaction}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 font-semibold">Total Amount</p>
                          <p className="text-2xl font-bold text-gray-800">{formatCurrency(order.amount_price)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              { hasInitializedSearch && (
                <div 
                  ref={loadMoreSearchOrderRef} 
                  className="w-full h-10 flex items-center justify-center"
                >
                  {isLoadMoreSearchOrder && (
                    <div className="flex items-center gap-2 py-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-500"></div>
                      <span className="text-sm text-gray-500">Loading more orders...</span>
                    </div>
                  )}
                  {!hasMoreSearchOrder && dataSearchOrder.length > 0 && (
                    <div className="py-2 text-sm text-gray-500">
                      No more orders to load
                    </div>
                  )}
                </div>
              )}

              {statusFilter === 'FINISHED' && !hasInitializedSearch && dataOrdersFinishedInternal.length > 0 && (
                <div 
                  ref={loadMoreFinishedRef} 
                  className="w-full h-10 flex items-center justify-center"
                >
                  {isLoadMoreOrderFinished && (
                    <div className="flex items-center gap-2 py-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-500"></div>
                      <span className="text-sm text-gray-500">Loading more orders...</span>
                    </div>
                  )}
                  {!hasMoreOrderFinished && dataOrdersFinishedInternal.length > 0 && (
                    <div className="py-2 text-sm text-gray-500">
                      No more orders to load
                    </div>
                  )}
                </div>
              )}
            </>
        )}
      </div>
    </div>
  );
};

const NoOrdersContainer = () => {
  return (
    <>
      <div className="relative px-4 py-6 bg-white min-h-[50vh] rounded-lg shadow-xl border border-gray-100 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gray-800 rounded-full translate-x-12 -translate-y-12"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-gray-800 rounded-full -translate-x-8 translate-y-8"></div>
        </div>

        {/* Floating Dots */}
        <div className="absolute top-6 left-6 w-2 h-2 bg-gray-300 rounded-full animate-ping"></div>
        <div className="absolute top-12 right-10 w-1 h-1 bg-gray-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 left-14 w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>

        {/* Main Content */}
        <div className="relative z-10 text-center flex flex-col items-center gap-6">
          {/* Icon */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-lg group hover:shadow-xl transition-all duration-300 hover:scale-105">
            <Ticket className="w-8 h-8 sm:w-10 sm:h-10 text-gray-800 group-hover:text-gray-700 transition-colors duration-300" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-800 rounded-full opacity-20 animate-pulse"></div>

            {/* Decorative Rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 sm:w-28 sm:h-28 border border-gray-200 rounded-full animate-pulse"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 sm:w-36 sm:h-36 border border-gray-100 rounded-full animate-pulse animation-delay-700"></div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            Belum Ada Pesanan
          </h2>

          {/* Description */}
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-md sm:max-w-lg">
            Sepertinya belum ada pesanan yang masuk hari ini. Mulai terima pesanan pertama Anda sekarang!
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:bg-gray-100 transition">
              <TrendingUp className="w-5 h-5 text-gray-700 mx-auto mb-1" />
              <div className="text-xl font-bold text-gray-800">0</div>
              <div className="text-sm text-gray-600">Pesanan Hari Ini</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:bg-gray-100 transition">
              <Ticket className="w-5 h-5 text-gray-700 mx-auto mb-1" />
              <div className="text-xl font-bold text-gray-800">0</div>
              <div className="text-sm text-gray-600">Total Pesanan</div>
            </div>
          </div>

          {/* CTA Button */}
          <button className="group relative bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded-2xl transition duration-300 transform hover:scale-105 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50">
            <div className="flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span>Buat Pesanan Baru</span>
            </div>
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 group-hover:animate-shimmer"></div>
          </button>

          {/* Footer text */}
          <p className="text-sm text-gray-500">
            Atau tunggu pelanggan untuk melakukan pemesanan melalui aplikasi
          </p>
        </div>

        {/* Soft Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/20 via-transparent to-gray-100/20 pointer-events-none"></div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s ease-in-out;
        }
        .animation-delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </>
  );
};
