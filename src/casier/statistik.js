import { useState, useRef } from "react";
import Sidebar from "../component/sidebar";
import { 
  TrendingUp, 
  ShoppingCart, 
  DollarSign, 
  Users, 
  Clock, 
  Star,
  Package,
  Calendar,
  ChartNoAxesCombined,
  Bell,
  Settings,
  BarChart3,
  PieChart,
  Activity,
  UserCheck,
  ChevronDown,
  Filter,
  Download,
  RefreshCw,
  CalendarDays,
  AlertCircle,
  Maximize, 
  Minimize,
  Menu,
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useFullscreen, useElementHeight } from "../helper/helper"
import { navbarInternalSlice } from "../reducers/reducers"
import { useDispatch, useSelector } from "react-redux";

export default function KasirStatistik() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [activeMenu, setActiveMenu] = useState('statistics')
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  const [salesDateRange, setSalesDateRange] = useState({ start: '2024-07-01', end: '2024-07-31' });
  const [channelDateRange, setChannelDateRange] = useState({ start: '2024-07-01', end: '2024-07-31' });
  const [productsDateRange, setProductsDateRange] = useState({ start: '2024-07-01', end: '2024-07-31' });
  const [customerDateRange, setCustomerDateRange] = useState({ start: '2024-07-01', end: '2024-07-31' });
  const [timeStatsDateRange, setTimeStatsDateRange] = useState({ start: '2024-07-01', end: '2024-07-31' });
  const [dailyPerfDateRange, setDailyPerfDateRange] = useState({ start: '2024-07-01', end: '2024-07-31' });

  // maxsimaz minimaz layar
  const contentRef = useRef(null);
  const { isFullScreen, toggleFullScreen } = useFullscreen(contentRef);

  // handle sidebar and elemant header yang responsice
  const { ref: headerRef, height: headerHeight } = useElementHeight();
  const { setIsOpen } = navbarInternalSlice.actions
  const { isOpen, isMobileDeviceType } = useSelector((state) => state.persisted.navbarInternal)

  // Validation function for date range (max 31 days)
  const validateDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 31;
  };

  // Date range handler with validation
  const handleDateRangeChange = (setter, field, value) => {
    setter(prev => {
      const newRange = { ...prev, [field]: value };
      if (validateDateRange(newRange.start, newRange.end)) {
        return newRange;
      }
      return prev;
    });
  };

  // Sample data
  const salesData = {
    daily: { revenue: 15250000, transactions: 156, aov: 97756 },
    weekly: { revenue: 89500000, transactions: 892, aov: 100336 },
    monthly: { revenue: 385000000, transactions: 3847, aov: 100078 }
  };

  const channelData = [
    { name: 'Kasir', revenue: 125000000, percentage: 45, transactions: 1234, color: 'bg-gradient-to-r from-gray-800 to-gray-700' },
    { name: 'Website', revenue: 89000000, percentage: 32, transactions: 876, color: 'bg-gradient-to-r from-blue-600 to-blue-500' },
  ];

  const topProducts = [
    { name: 'Nasi Gudeg Special', sold: 234, revenue: 35100000, growth: 12, category: 'Main Course' },
    { name: 'Ayam Bakar Bumbu', sold: 198, revenue: 29700000, growth: 8, category: 'Main Course' },
    { name: 'Sate Kambing', sold: 167, revenue: 25050000, growth: -3, category: 'Grilled' },
    { name: 'Es Teh Manis', sold: 445, revenue: 13350000, growth: 15, category: 'Beverages' },
    { name: 'Gudeg Jogja', sold: 123, revenue: 18450000, growth: 5, category: 'Traditional' }
  ];

  const customerStats = {
    totalCustomers: 2847,
    registeredCustomers: 1892,
    guestCustomers: 955,
    repeatCustomerRate: 68,
    newCustomersThisMonth: 234
  };

  const topCustomers = [
    { name: 'Ahmad Wijaya', orders: 24, spent: 4850000, lastOrder: '2 hari lalu', level: 'VIP' },
    { name: 'Siti Nurhaliza', orders: 18, spent: 3420000, lastOrder: '1 hari lalu', level: 'Gold' },
    { name: 'Budi Santoso', orders: 15, spent: 2950000, lastOrder: '3 hari lalu', level: 'Silver' },
    { name: 'Dewi Lestari', orders: 12, spent: 2340000, lastOrder: '1 hari lalu', level: 'Silver' }
  ];

  const peakHours = [
    { hour: '06:00', orders: 12 },
    { hour: '07:00', orders: 28 },
    { hour: '08:00', orders: 45 },
    { hour: '09:00', orders: 32 },
    { hour: '10:00', orders: 18 },
    { hour: '11:00', orders: 67 },
    { hour: '12:00', orders: 89 },
    { hour: '13:00', orders: 78 },
    { hour: '14:00', orders: 45 },
    { hour: '15:00', orders: 23 },
    { hour: '16:00', orders: 34 },
    { hour: '17:00', orders: 56 },
    { hour: '18:00', orders: 87 },
    { hour: '19:00', orders: 92 },
    { hour: '20:00', orders: 67 },
    { hour: '21:00', orders: 34 }
  ];

  const weeklyData = [
    { day: 'Senin', orders: 234, revenue: 35600000 },
    { day: 'Selasa', orders: 198, revenue: 29800000 },
    { day: 'Rabu', orders: 267, revenue: 42300000 },
    { day: 'Kamis', orders: 289, revenue: 45600000 },
    { day: 'Jumat', orders: 345, revenue: 56700000 },
    { day: 'Sabtu', orders: 423, revenue: 67800000 },
    { day: 'Minggu', orders: 389, revenue: 62400000 }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const StatCard = ({ title, value, icon: Icon, change, changeType, subtitle }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 hover:scale-20 group">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-3 rounded-xl group-hover:shadow-md transition-shadow">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
        </div>
        {change && (
          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${changeType === 'positive' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">{change}%</span>
          </div>
        )}
      </div>
    </div>
  );

  const DateRangeFilter = ({ dateRange, setDateRange, label }) => (
    <div className="flex items-center space-x-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center space-x-3 mt-4 md:mt-0">
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent shadow-sm"
        >
          <option value="daily">Harian</option>
          <option value="weekly">Mingguan</option>
          <option value="monthly">Bulanan</option>
        </select>
        <button className="bg-gradient-to-r from-gray-800 to-gray-700 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2 hover:scale-105">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
      <CalendarDays className="h-5 w-5 text-gray-600" />
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-700">{label}:</label>
        <input
          type="date"
          value={dateRange.start}
          onChange={(e) => handleDateRangeChange(setDateRange, 'start', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent text-sm"
        />
        <span className="text-gray-500">-</span>
        <input
          type="date"
          value={dateRange.end}
          onChange={(e) => handleDateRangeChange(setDateRange, 'end', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent text-sm"
        />
      </div>
      {!validateDateRange(dateRange.start, dateRange.end) && (
        <div className="flex items-center space-x-1 text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span className="text-xs">Max 31 hari</span>
        </div>
      )}
    </div>
  );

  const maxOrders = Math.max(...peakHours.map(h => h.orders));
  const maxRevenue = Math.max(...weeklyData.map(d => d.revenue));

    return (
      <div className="flex relative">
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
          className={`flex-1 bg-gray-50 ${isFullScreen ? 'w-full h-screen overflow-y-auto' : 'w-full min-h-screen'}`}
        >
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div
              ref={headerRef}
              className={`fixed top-0 z-10 bg-white border-b border-gray-200 ${(isOpen && isMobileDeviceType) ? 'hidden' : ''}`}
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
                          <ChartNoAxesCombined className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                          <h1 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-gray-800 truncate">Statistics</h1>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0">
                      <button 
                      onClick={() => toggleFullScreen()} 
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

            {/* Sales Statistics */}
            <div className="px-4 pt-4" style={{marginTop: headerHeight}}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-2 rounded-xl mr-3">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  Statistik Penjualan
                </h2>
                <DateRangeFilter 
                  dateRange={salesDateRange} 
                  setDateRange={setSalesDateRange} 
                  label="Periode Penjualan"
                />
              </div>
              <div>
                <StatCard
                  title="Total Pendapatan"
                  value={formatCurrency(salesData[selectedPeriod].revenue)}
                  icon={DollarSign}
                  change={12}
                  changeType="positive"
                  subtitle={`Periode ${selectedPeriod}`}
                />
                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3">
                  <StatCard
                    title="Jumlah Transaksi"
                    value={salesData[selectedPeriod].transactions.toLocaleString()}
                    icon={ShoppingCart}
                    change={8}
                    changeType="positive"
                    subtitle={`Orders ${selectedPeriod}`}
                  />
                  <StatCard
                    title="Average Order Value"
                    value={formatCurrency(salesData[selectedPeriod].aov)}
                    icon={TrendingUp}
                    change={5}
                    changeType="positive"
                    subtitle="Per transaksi"
                  />
                  <StatCard
                    title="Growth Rate"
                    value="12.5%"
                    icon={Activity}
                    change={3}
                    changeType="positive"
                    subtitle="Vs periode sebelumnya"
                  />
                </div>
              </div>
            </div>

            {/* Channel Performance */}
            <div className="bg-white mx-4 my-8 rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-2 rounded-xl mr-3">
                    <PieChart className="h-5 w-5 text-white" />
                  </div>
                  Performa Channel
                </h3>
                <DateRangeFilter 
                  dateRange={channelDateRange} 
                  setDateRange={setChannelDateRange} 
                  label="Channel"
                />
              </div>
              <div className="space-y-4">
                {channelData.map((channel, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`w-4 h-4 rounded-full ${channel.color}`}></div>
                      <div>
                        <span className="font-semibold text-gray-900">{channel.name}</span>
                        <p className="text-sm text-gray-600">{channel.transactions} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatCurrency(channel.revenue)}</p>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${channel.color}`}
                            style={{ width: `${channel.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-600">{channel.percentage}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-2xl mb-8 mx-4 shadow-sm border border-gray-100 p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-2 rounded-xl mr-3">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  Top Selling Products
                </h3>
                <DateRangeFilter 
                  dateRange={productsDateRange} 
                  setDateRange={setProductsDateRange} 
                  label="Produk"
                />
              </div>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{product.name}</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{product.sold} terjual</span>
                          <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">{product.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatCurrency(product.revenue)}</p>
                      <div className={`flex items-center space-x-1 ${product.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <TrendingUp className="h-3 w-3" />
                        <span className="text-sm font-medium">{product.growth > 0 ? '+' : ''}{product.growth}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Statistics */}
            <div className="my-8 mx-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-2 rounded-xl mr-3">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  Statistik Customer
                </h2>
                <DateRangeFilter 
                  dateRange={customerDateRange} 
                  setDateRange={setCustomerDateRange} 
                  label="Customer"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-4">
                <StatCard
                  title="Total Customers"
                  value={customerStats.totalCustomers.toLocaleString()}
                  icon={Users}
                  change={15}
                  changeType="positive"
                />
                <StatCard
                  title="Registered"
                  value={customerStats.registeredCustomers.toLocaleString()}
                  icon={UserCheck}
                  subtitle={`${Math.round((customerStats.registeredCustomers / customerStats.totalCustomers) * 100)}% dari total`}
                />
                <StatCard
                  title="Guest Orders"
                  value={customerStats.guestCustomers.toLocaleString()}
                  icon={Users}
                  subtitle={`${Math.round((customerStats.guestCustomers / customerStats.totalCustomers) * 100)}% dari total`}
                />
                <StatCard
                  title="Repeat Rate"
                  value={`${customerStats.repeatCustomerRate}%`}
                  icon={RefreshCw}
                  change={5}
                  changeType="positive"
                />
                <StatCard
                  title="New Customers"
                  value={customerStats.newCustomersThisMonth.toLocaleString()}
                  icon={TrendingUp}
                  subtitle="Bulan ini"
                />
              </div>

              {/* Top Customers */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Top Customers</h3>
                <div className="space-y-4">
                  {topCustomers.map((customer, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-all">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold">{customer.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-semibold text-gray-900">{customer.name}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              customer.level === 'VIP' ? 'bg-yellow-100 text-yellow-800' :
                              customer.level === 'Gold' ? 'bg-yellow-50 text-yellow-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {customer.level}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{customer.orders} orders • {customer.lastOrder}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{formatCurrency(customer.spent)}</p>
                        <p className="text-sm text-gray-600">Total spent</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Time Statistics */}
            <div className="mb-8 px-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-2 rounded-xl mr-3">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  Statistik Waktu
                </h2>
                <DateRangeFilter 
                  dateRange={timeStatsDateRange} 
                  setDateRange={setTimeStatsDateRange} 
                  label="Waktu"
                />
              </div>
              
              <div>
                {/* Peak Hours */}
                <div className="bg-white rounded-2xl shadow-sm mb-4 border border-gray-100 p-4 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Jam Sibuk (Peak Hours)</h3>
                  <div className="space-y-2">
                    {peakHours.map((hour, index) => (
                      <div key={index} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <span className="text-sm font-semibold text-gray-700 w-16">{hour.hour}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-gray-800 to-gray-600 h-3 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${(hour.orders / maxOrders) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-gray-900 w-10">{hour.orders}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weekly Performance */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Performa Harian</h3>
                  </div>
                  <div className="space-y-2">
                    {weeklyData.map((day, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-4 h-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded-full"></div>
                          <span className="font-semibold text-gray-900">{day.day}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{formatCurrency(day.revenue)}</p>
                          <p className="text-sm text-gray-600">{day.orders} orders</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="grid px-4 pb-4 sm:grid-cols-1 lg:grid-cols-2 gap-4">
              <StatCard
                title="Menu Items"
                value="47"
                icon={Package}
                subtitle="Total produk aktif"
              />
              <StatCard
                title="Monthly Growth"
                value="23.5%"
                icon={TrendingUp}
                change={12}
                changeType="positive"
                subtitle="Vs bulan lalu"
              />
            </div>
          </div>
        </div>
      </div>
    )
}