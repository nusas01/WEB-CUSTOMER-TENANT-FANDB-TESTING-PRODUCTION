import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Filter, 
  Search, 
  Eye, 
  Edit3, 
  Trash2, 
  Plus,
  FileText,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import Sidebar from '../../component/sidebar';
import {FormatIndoDate} from '../../helper/formatdate'

export default function GeneralJournalDashboard() {
    const [activeMenu, setActiveMenu] = useState("General Journals")

    return (
        <div className="flex">
            <div className="w-1/10 min-w-[250px]">
                <Sidebar activeMenu={activeMenu}/>
            </div>

            <div className="flex-1">
                <JournalDashboard/>
            </div>
        </div>
    )
}

const JournalDashboard = () => {
  // Sample data dengan berbagai status
  const [journalData] = useState([
    {
      "date": "2024-12-01",
      "event": "penjualan",
      "transaction_id": "TX123456789",
      "accounts": [
        {
          "account_name": "Kas",
          "type": "DEBIT",
          "amount": 150000.0,
          "action": "FINALIZE",
          "account_code": "1001",
          "keterangan": ""
        },
        {
          "account_name": "Pendapatan",
          "type": "KREDIT",
          "amount": 150000.0,
          "action": "FINALIZE",
          "account_code": "4001",
          "keterangan": ""
        }
      ]
    },
    {
      "date": "2024-12-01",
      "event": "pembelian",
      "transaction_id": "",
      "accounts": [
        {
          "account_name": "Persediaan Bahan Baku",
          "type": "DEBIT",
          "amount": 200000.0,
          "action": "DRAFT",
          "account_code": "1201",
          "keterangan": ""
        },
        {
          "account_name": "Kas",
          "type": "KREDIT",
          "amount": 200000.0,
          "action": "DRAFT",
          "account_code": "1001",
          "keterangan": ""
        }
      ]
    },
    {
      "date": "2024-12-01",
      "event": "retur_penjualan",
      "transaction_id": "TX123456790",
      "accounts": [
        {
          "account_name": "Retur Penjualan",
          "type": "DEBIT",
          "amount": 50000.0,
          "action": "VOID",
          "account_code": "4002",
          "keterangan": ""
        },
        {
          "account_name": "Kas",
          "type": "KREDIT",
          "amount": 50000.0,
          "action": "VOID",
          "account_code": "1001",
          "keterangan": ""
        }
      ]
    },
    {
      "date": "2024-11-30",
      "event": "penjualan",
      "transaction_id": "TX123456788",
      "accounts": [
        {
          "account_name": "Kas",
          "type": "DEBIT",
          "amount": 300000.0,
          "action": "FINALIZE",
          "account_code": "1001",
          "keterangan": ""
        },
        {
          "account_name": "Pendapatan",
          "type": "KREDIT",
          "amount": 300000.0,
          "action": "FINALIZE",
          "account_code": "4001",
          "keterangan": ""
        }
      ]
    }
  ]);

  // Filter states
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [statusFilter, setStatusFilter] = useState('FINALIZE');
  const [eventFilter, setEventFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Get status icon and color
  const getStatusConfig = (status) => {
    switch (status) {
      case 'FINALIZE':
        return { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100', label: 'Finalized' };
      case 'DRAFT':
        return { icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-100', label: 'Draft' };
      case 'VOID':
        return { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100', label: 'Void' };
      default:
        return { icon: AlertTriangle, color: 'text-gray-600', bgColor: 'bg-gray-100', label: 'Unknown' };
    }
  };

  // Filter data
  const filteredData = useMemo(() => {
    return journalData.filter(entry => {
      const entryDate = new Date(entry.date).toISOString().split('T')[0];
      const matchDate =
        (!startDate || entryDate >= startDate) &&
        (!endDate || entryDate <= endDate);
  
      const matchStatus = !statusFilter || entry.accounts.some(acc => acc.action === statusFilter);
      const matchEvent = !eventFilter || entry.event === eventFilter;
      const matchSearch = !searchTerm || 
        entry.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.accounts.some(acc => 
          acc.account_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          acc.account_code.includes(searchTerm)
        );
      
      return matchDate && matchStatus && matchEvent && matchSearch;
    });
  }, [journalData, startDate, endDate, statusFilter, eventFilter, searchTerm]);
  
  // Group by event
  const groupedData = useMemo(() => {
    const grouped = {};
    filteredData.forEach(entry => {
      if (!grouped[entry.event]) {
        grouped[entry.event] = [];
      }
      grouped[entry.event].push(entry);
    });
    return grouped;
  }, [filteredData]);

  // Calculate totals
  const totals = useMemo(() => {
    let totalDebit = 0;
    let totalKredit = 0;
    
    filteredData.forEach(entry => {
      entry.accounts.forEach(acc => {
        if (acc.type === 'DEBIT') {
          totalDebit += acc.amount;
        } else {
          totalKredit += acc.amount;
        }
      });
    });
    
    return { totalDebit, totalKredit };
  }, [filteredData]);

  // Get unique events for filter
  const uniqueEvents = [...new Set(journalData.map(entry => entry.event))];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-gray-800 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Journal Umum</h1>
                <p className="text-gray-600">Kelola catatan jurnal akuntansi</p>
              </div>
            </div>
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Plus className="h-4 w-4" />
              <span>Tambah Entry</span>
            </button>
          </div>
        </div>

        {/* Filters & Stats Combined */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          {/* Filter Section */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Date Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Tanggal</label>
                <div className="relative">
                    <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-3 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent w-30"
                    />
                </div>
                <span className="text-sm text-gray-500">s/d</span>
                <div className="relative">
                    <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-3 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent w-30"
                    />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent w-32"
                >
                  <option value="">Semua</option>
                  <option value="FINALIZE">Finalized</option>
                  <option value="DRAFT">Draft</option>
                  <option value="VOID">Void</option>
                </select>
              </div>

              {/* Event Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Event</label>
                <select
                  value={eventFilter}
                  onChange={(e) => setEventFilter(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent w-36"
                >
                  <option value="">Semua Event</option>
                  {uniqueEvents.map(event => (
                    <option key={event} value={event}>{event.replace('_', ' ').toUpperCase()}</option>
                  ))}
                </select>
              </div>

              {/* Search */}
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari berdasarkan event, transaction ID, atau akun..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
                <div>
                  <p className="text-sm font-medium text-green-700">Total Debit</p>
                  <p className="text-xl font-bold text-green-800">{formatCurrency(totals.totalDebit)}</p>
                </div>
                <div className="bg-green-200 p-2 rounded-full">
                  <TrendingUp className="h-5 w-5 text-green-700" />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total Kredit</p>
                  <p className="text-xl font-bold text-blue-800">{formatCurrency(totals.totalKredit)}</p>
                </div>
                <div className="bg-blue-200 p-2 rounded-full">
                  <DollarSign className="h-5 w-5 text-blue-700" />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-100">
                <div>
                  <p className="text-sm font-medium text-purple-700">Total Entries</p>
                  <p className="text-xl font-bold text-purple-800">{filteredData.length}</p>
                </div>
                <div className="bg-purple-200 p-2 rounded-full">
                  <FileText className="h-5 w-5 text-purple-700" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {startDate === today && endDate === today && (
        <div className="text-sm text-red-800 rounded mb-1">
            Menampilkan data untuk <strong>hari ini</strong> {FormatIndoDate(today)}
        </div>
        )}


        {/* Journal Entries */}
        <div className="space-y-6">
          {Object.keys(groupedData).length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <FileText className="h-10 w-10 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {startDate === endDate && startDate === new Date().toISOString().split('T')[0]
                    ? "Belum Ada Jurnal Hari Ini"
                    : "Tidak Ada Data Jurnal"}
                </h3>
                <div className="max-w-md mx-auto space-y-2">
                <p className="text-gray-600 leading-relaxed">
                    {startDate === endDate && startDate === new Date().toISOString().split('T')[0]
                    ? "Anda belum memiliki catatan jurnal untuk hari ini. Mulai dengan membuat entry jurnal pertama Anda."
                    : statusFilter 
                        ? `Tidak ada entry journal dengan status "${statusFilter}" yang sesuai dengan filter yang dipilih.`
                        : "Tidak ada entry journal yang sesuai dengan kriteria pencarian Anda."}
                </p>
            
                {startDate === endDate && startDate === new Date().toISOString().split('T')[0] && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <div className="flex items-start space-x-3">
                        <div className="bg-blue-100 rounded-full p-1">
                        <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="text-left">
                        <p className="text-sm font-medium text-blue-800">Tips Jurnal Harian</p>
                        <p className="text-sm text-blue-700 mt-1">
                            Catat setiap transaksi bisnis Anda secara real-time untuk laporan keuangan yang akurat.
                        </p>
                        </div>
                    </div>
                    </div>
                )}
                </div>
                <button className="mt-6 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto transition-colors shadow-sm">
                <Plus className="h-4 w-4" />
                <span>Buat Entry Pertama</span>
                </button>
            </div>
          ) : (
            Object.entries(groupedData).map(([event, entries]) => (

              <div key={event} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gray-800 px-6 py-4">
                  <h3 className="text-lg font-semibold text-white capitalize">
                    {event.replace('_', ' ')} ({entries.length} entries)
                  </h3>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {entries.map((entry, entryIndex) => {
                    const status = entry.accounts[0]?.action || 'UNKNOWN';
                    const statusConfig = getStatusConfig(status);
                    const StatusIcon = statusConfig.icon;
                    
                    // Sort accounts: DEBIT first, then KREDIT
                    const sortedAccounts = [...entry.accounts].sort((a, b) => {
                      if (a.type === 'DEBIT' && b.type === 'KREDIT') return -1;
                      if (a.type === 'KREDIT' && b.type === 'DEBIT') return 1;
                      return 0;
                    });
                    
                    return (
                      <div key={entryIndex} className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`${statusConfig.bgColor} p-2 rounded-full`}>
                              <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900">{entry.date}</span>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig.bgColor} ${statusConfig.color}`}>
                                  {statusConfig.label}
                                </span>
                              </div>
                              {entry.transaction_id && (
                                <p className="text-sm text-gray-600">ID: {entry.transaction_id}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Kode Akun</th>
                                <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Nama Akun</th>
                                <th className="text-right py-2 px-3 text-sm font-medium text-gray-700">Debit</th>
                                <th className="text-right py-2 px-3 text-sm font-medium text-gray-700">Kredit</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sortedAccounts.map((account, accIndex) => (
                                <tr key={accIndex} className="border-b border-gray-100 last:border-b-0">
                                  <td className="py-3 px-3 text-sm font-mono text-gray-600">{account.account_code}</td>
                                  <td className="py-3 px-3 text-sm text-gray-900">{account.account_name}</td>
                                  <td className="py-3 px-3 text-sm text-right font-medium">
                                    {account.type === 'DEBIT' ? (
                                      <span className="text-green-600">{formatCurrency(account.amount)}</span>
                                    ) : (
                                      <span className="text-gray-400">-</span>
                                    )}
                                  </td>
                                  <td className="py-3 px-3 text-sm text-right font-medium">
                                    {account.type === 'KREDIT' ? (
                                      <span className="text-blue-600">{formatCurrency(account.amount)}</span>
                                    ) : (
                                      <span className="text-gray-400">-</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};