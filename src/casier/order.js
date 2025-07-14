import Sidebar from "../component/sidebar"
import { useState, useEffect } from "react"
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
} from 'lucide-react';
import { 
  fetchOrdersInternal,
  fetchOrdersFinishedInternal, 
 } from "../actions/get.js"
import { useDispatch, useSelector } from "react-redux"
import { SpinnerRelative, SpinnerFixed } from "../helper/spinner.js";
import { ErrorAlert, SuccessAlert } from "../component/alert";
import { 
  getOrdersInternalSlice,
  getOrdersFinishedInternalSlice, 
 } from "../reducers/get.js";
 import {
  toProgressOrderInternalSlice,
  toFinishedOrderInternalSlice,
} from "../reducers/patch.js";
import { da } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import {formatCurrency} from "../helper/helper.js";
import { 
  toProgressOrderInternal, 
  toFinishedOrderInternal,
 } from "../actions/patch.js";

export default function KasirOrders() {
  const dispatch = useDispatch();
  const [errorAlert, setErrorAlert] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Orders")

  // handle response error when fetching orders
  const { resetErrorOrdersInternal } = getOrdersInternalSlice.actions
  const { errorOrdersInternal } = useSelector((state) => state.persisted.dataOrdersInternal)

  useEffect(() => {
    if (errorOrdersInternal) {
      setErrorAlert(true);

      const timer = setTimeout(() => {
        setErrorAlert(false);
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
      setErrorAlert(true);

      const timer = setTimeout(() => {
        setErrorAlert(false);
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
      setErrorAlert(true);

      const timer = setTimeout(() => {
        setErrorAlert(false);
        dispatch(resetToProgressOrder());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorToProgressOrder])

  useEffect(() => {
    if (successToProgressOrder) {
      setSuccessAlert(true);

      const timer = setTimeout(() => {
        setSuccessAlert(false);
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
      setErrorAlert(true);

      const timer = setTimeout(() => {
        setErrorAlert(false);
        dispatch(resetToFinishedOrder());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorToFinishedOrder])

  useEffect(() => {
    if (successToFinishedOrder) {
      setSuccessAlert(true);

      const timer = setTimeout(() => {
        setSuccessAlert(false);
        dispatch(resetToFinishedOrder());
      }, 3000);
    }
  }, [successToFinishedOrder])


    return (
        <div className="flex">
            {errorAlert && (
              <div className="fixed">
                <ErrorAlert
                    message={
                        errorOrdersFinishedInternal
                            ? "Terjadi kesalahan saat memuat data pesanan yang sudah selesai. Kami sudah menerima laporan ini dan sedang memperbaikinya."
                            : errorToProgressOrder
                            ? "Gagal memperbarui status pesanan menjadi Received. Silakan coba lagi atau hubungi admin jika masalah terus berlanjut."
                            : errorToFinishedOrder
                            ? "Gagal menyelesaikan pesanan. Silakan coba kembali atau laporkan ke admin jika masalah masih terjadi."
                            : ""
                          }
                        onClose={() => setErrorAlert(false)}
                />
              </div>
            )}

            {successAlert && (
              <div className="fixed">
                <SuccessAlert
                  message={
                    successToProgressOrder
                      ? "Status pesanan berhasil diperbarui menjadi sedang diproses."
                      : successToFinishedOrder
                      ? "Pesanan berhasil diselesaikan."
                      : ""
                  }
                  onClose={() => setSuccessAlert(false)}
                />
              </div>
            )}

            {/* Sidebar - Fixed width */}
            <div className="w-1/10 min-w-[250px]">
                <Sidebar 
                activeMenu={activeMenu}
                />
            </div>

            <div className="flex-1">
                <OrderDashboard/>
            </div>
        </div>
    )
} 

const OrderDashboard = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
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


  // integrasi dengan data state dan api 
  // Order process and progress
  const { dataOrdersInternal, loadingOrdersInternal } = useSelector((state) => state.persisted.dataOrdersInternal)
  console.log("data orders: ", dataOrdersInternal)
  useEffect(() => {
    if (!dataOrdersInternal || dataOrdersInternal.length === 0) {
      dispatch(fetchOrdersInternal(startDate, endDate))
    }
  }, [])

  useEffect(() => {
    setSpinnerRelative(loadingOrdersInternal)
  }, [loadingOrdersInternal])


  // order finised
  const { dataOrdersFinishedInternal, loadingOrdersFinishedInternal } = useSelector((state) => state.persisted.dataOrdersFinishedInternal)

  useEffect(() => {
    if (!dataOrdersFinishedInternal || dataOrdersFinishedInternal.length === 0) {
      dispatch(fetchOrdersFinishedInternal(startDate, endDate))
    }
  }, [])

  useEffect(() => {
    setSpinnerRelative(loadingOrdersFinishedInternal)
  }, [loadingOrdersFinishedInternal])


  // handle get data dengan start dan end date 
  useEffect(() => {
    if (startDate !== '' && endDate !== '') {
      if (statusFilter === 'RECEIVED' || statusFilter === 'PROGRESS') {
        dispatch(fetchOrdersInternal(startDate, endDate))
      }

      if (statusFilter === 'FINISHED') {
        dispatch(fetchOrdersFinishedInternal(startDate, endDate))
      }
    }
  }, [startDate, endDate, statusFilter])


  // Generate dummy data based on your structure
  // const generateDummyData = () => {
  //   const products = [
  //     { name: "Iced Coffee", price: 15000, image: "coffee.jpg" },
  //     { name: "Green Tea", price: 20000, image: "tea.png" },
  //     { name: "Cappuccino", price: 25000, image: "cappuccino.jpg" },
  //     { name: "Latte", price: 22000, image: "latte.jpg" },
  //     { name: "Espresso", price: 18000, image: "espresso.jpg" },
  //     { name: "Americano", price: 16000, image: "americano.jpg" },
  //     { name: "Matcha Latte", price: 28000, image: "matcha.jpg" },
  //     { name: "Hot Chocolate", price: 24000, image: "chocolate.jpg" }
  //   ];

  //   const tables = ["A01", "A02", "B12", "B15", "C03", "C07", "D11", "D14"];
  //   const customers = [
  //     { username: "john_doe", email: "john@example.com" },
  //     { username: "jane_smith", email: "jane@example.com" },
  //     { username: "mike_wilson", email: "mike@example.com" },
  //     { username: "sarah_brown", email: "sarah@example.com" },
  //     { username: "david_jones", email: "david@example.com" },
  //     { username: "lisa_taylor", email: "lisa@example.com" }
  //   ];

  //   const orderStatuses = ["PROGRESS", "RECEIVED", "FINISHED"];
  //   const notes = ["No sugar", "Less ice", "Extra hot", "Oat milk", "Decaf", "Double shot"];

  //   return Array.from({ length: 15 }, (_, i) => {
  //     const customer = customers[Math.floor(Math.random() * customers.length)];
  //     const numItems = Math.floor(Math.random() * 3) + 1;
  //     const orderItems = [];
  //     let totalAmount = 0;

  //     for (let j = 0; j < numItems; j++) {
  //       const product = products[Math.floor(Math.random() * products.length)];
  //       const quantity = Math.floor(Math.random() * 3) + 1;
  //       const itemTotal = product.price * quantity;
  //       totalAmount += itemTotal;

  //       orderItems.push({
  //         id: `item-${i}-${j}`,
  //         notes: Math.random() > 0.5 ? notes[Math.floor(Math.random() * notes.length)] : "",
  //         price: product.price,
  //         quantity: quantity,
  //         amount_price: itemTotal,
  //         product: {
  //           name: product.name,
  //           image: product.image
  //         }
  //       });
  //     }

  //     // Generate dates within the last 7 days
  //     const date = new Date();
  //     date.setDate(date.getDate() - Math.floor(Math.random() * 7));

  //     return {
  //       id: `order-${i + 1}`,
  //       created_at: date.toISOString(),
  //       channel_code: "CASHIER",
  //       status_transaction: "PAID",
  //       order_type: Math.random() > 0.3 ? "DINE_IN" : "TAKEAWAY",
  //       order_status: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
  //       order: orderItems,
  //       email: customer.email,
  //       username: customer.username,
  //       amount_price: totalAmount,
  //       table: tables[Math.floor(Math.random() * tables.length)]
  //     };
  //   });
  // };

  useEffect(() => {
    const dummyOrders = (dataOrdersInternal || []).concat(dataOrdersFinishedInternal || []);
    setOrders(dummyOrders);
    setFilteredOrders(dummyOrders);

    const updatedStats = {
        total: dummyOrders.length,
        progress: dummyOrders.filter(order => order.order_status === 'PROCESS').length,
        received: dummyOrders.filter(order => order.order_status === 'PROGRESS').length,
        finished: dummyOrders.filter(order => order.order_status === 'FINISHED').length,
        totalRevenue: dummyOrders.reduce((sum, order) => sum + order.amount_price, 0)
    };

    setStats(updatedStats); 
  }, [dataOrdersInternal]);

  useEffect(() => {
    let filtered = orders;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(order => 
        order.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.table.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by date range
    if (startDate && endDate) {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
      });
    }

    // Filter by status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(order => order.order_status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, statusFilter, searchQuery]);


  // handle status to progress order
  const {loadingToProgressOrder} = useSelector((state) => state.toProgressOrderInternalState)

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
  const {loadingToFinishedOrder} = useSelector((state) => state.toFinishedOrderInternalState)
  
  const handleFinishOrder = (data) => {
    console.log("data finsihed order: ", data)
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
                <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +8% from yesterday
                </p>
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
                  +12% from last week
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

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl flex items-center justify-center">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Search & Filter Orders</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search Orders</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by customer, email, table..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status Filter</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
              >
                <option value="ALL">All Status</option>
                <option value="PROCESS">Process</option>
                <option value="PROGRESS">Progress/Received</option>
                <option value="FINISHED">Finished</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        { spinnerRelative && (
          <div className="flex justify-center bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden min-h-[50vh]">
              <SpinnerRelative />
            </div>
        )}

        { !spinnerRelative && filteredOrders.length === 0 && (
          <div>
              <NoOrdersContainer />
            </div>
        )}
        { !spinnerRelative && filteredOrders.length > 0 && (
          spinnerRelative ? (
            <div className="flex justify-center bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden min-h-[50vh]">
              <SpinnerRelative />
            </div>
          ): (
            <>
              {filteredOrders.map((order) => (
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
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Customer</p>
                          <p className="font-bold text-gray-800">{order.username}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Email</p>
                          <p className="font-bold text-gray-800 text-sm">{order.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Table</p>
                          <p className="font-bold text-gray-800">{order.table}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
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
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                index % 4 === 0 ? 'bg-gradient-to-r from-amber-500 to-yellow-500' :
                                index % 4 === 1 ? 'bg-gradient-to-r from-rose-500 to-pink-500' :
                                index % 4 === 2 ? 'bg-gradient-to-r from-cyan-500 to-blue-500' :
                                'bg-gradient-to-r from-violet-500 to-purple-500'
                              }`}>
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
                          <span className={`px-3 py-1 rounded-xl bg-gray-800 text-white text-sm font-semibold`}>
                            {order.order_type}
                          </span>
                          <span className="px-3 py-1 rounded-xl text-sm font-semibold bg-gray-800 text-white">
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
            </>
          ))}
  

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
