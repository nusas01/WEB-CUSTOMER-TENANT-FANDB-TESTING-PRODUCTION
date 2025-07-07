import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Filter,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import Sidebar from '../../component/sidebar';
import {formatCurrency} from '../../helper/helper';

export default function CashFlowDashboard() {
    const [activeMenu, setActiveMenu] = useState("cash-flow")

    return (
        <div className="flex">
            <div className='w-1/10 min-w-[250px]'>
                <Sidebar activeMenu={activeMenu}/>
            </div>

            <div className='flex-1'>
                <CashFlowComponent />
            </div>
        </div>
    )
}

const CashFlowComponent = () => {
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-12-31');
  const [expandedSections, setExpandedSections] = useState({
    aset: false,
    liabilitas: false,
    ekuitas: false
  });

  // Demo data
  const cashFlowData = {
    "aset": [
      {
        "sub_kategori": "Aset Lancar",
        "data": [
          {
            "nama_akun": "Kas",
            "saldo_akhir": 10000000
          },
          {
            "nama_akun": "Piutang Usaha",
            "saldo_akhir": 5000000
          }
        ]
      },
      {
        "sub_kategori": "Aset Tetap",
        "data": [
          {
            "nama_akun": "Persediaan",
            "saldo_akhir": 3000000
          }
        ]
      }
    ],
    "liabilitas": [
      {
        "sub_kategori": "Hutang Jangka Pendek",
        "data": [
          {
            "nama_akun": "Hutang Usaha",
            "saldo_akhir": 2000000
          }
        ]
      },
      {
        "sub_kategori": "Hutang Jangka Panjang",
        "data": [
          {
            "nama_akun": "Hutang Bank",
            "saldo_akhir": 6500000
          }
        ]
      }
    ],
    "ekuitas": [
      {
        "sub_kategori": "Modal Pemilik",
        "data": [
          {
            "nama_akun": "Modal Awal",
            "saldo_akhir": 8000000
          },
          {
            "nama_akun": "Laba Ditahan",
            "saldo_akhir": 1500000
          }
        ]
      }
    ]
  };


  // Calculate totals
  const totals = useMemo(() => {
    const calculateTotal = (section) => {
      return section.reduce((total, subKategori) => {
        return total + subKategori.data.reduce((subTotal, item) => {
          return subTotal + item.saldo_akhir;
        }, 0);
      }, 0);
    };

    const totalAset = calculateTotal(cashFlowData.aset);
    const totalLiabilitas = calculateTotal(cashFlowData.liabilitas);
    const totalEkuitas = calculateTotal(cashFlowData.ekuitas);

    return {
      totalAset,
      totalLiabilitas,
      totalEkuitas,
      netCashFlow: totalAset - totalLiabilitas
    };
  }, [cashFlowData]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderSection = (title, data, sectionKey, icon, bgColor) => {
    const isExpanded = expandedSections[sectionKey];
    const sectionTotal = data.reduce((total, subKategori) => {
      return total + subKategori.data.reduce((subTotal, item) => {
        return subTotal + item.saldo_akhir;
      }, 0);
    }, 0);

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div 
          className={`${bgColor} px-4 py-3  rounded-t-lg cursor-pointer transition-all duration-200 hover:opacity-90`}
          onClick={() => toggleSection(sectionKey)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {icon}
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-lg font-bold text-gray-800">
                {formatCurrency(sectionTotal)}
              </span>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </div>
          </div>
        </div>
        
        {isExpanded && (
          <div className="p-4">
            {data.map((subKategori, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <h4 className="text-sm font-medium text-gray-7800 border-gray-200 pb-1">
                  {subKategori.sub_kategori}
                </h4>
                <div className="space-y-2">
                  {subKategori.data.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between text-gray-800 font-medium items-center py-2 px-3 bg-gray-50 rounded-md">
                      <span>{item.nama_akun}</span>
                      <span>
                        {formatCurrency(item.saldo_akhir)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
      {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg shadow-lg">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Laporan Arus Kas
                </h1>
                <p className="text-gray-500 text-sm">Cash Flow Statement</p>
              </div>
            </div>
            
            {/* Filter Tanggal */}
            <div className="flex flex-col sm:flex-row gap-3 bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gray-800 rounded-lg">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-700 font-medium">Periode:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-white text-gray-800 px-3 py-2 rounded-lg  focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 font-medium">Sampai:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-white text-gray-800 px-3 py-2 rounded-lg  focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                />
              </div>
              <div
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md font-medium"
              >
                <Filter className="w-4 h-4" />
                Filter
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Aset</p>
                <p className="text-xl font-bold text-blue-800">
                  {formatCurrency(totals.totalAset)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Liabilitas</p>
                <p className="text-xl font-bold text-red-800">
                  {formatCurrency(totals.totalLiabilitas)}
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Ekuitas</p>
                <p className="text-xl font-bold text-green-800">
                  {formatCurrency(totals.totalEkuitas)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Net Cash Flow</p>
                <p className="text-xl font-bold text-purple-800">
                  {formatCurrency(totals.netCashFlow)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Cash Flow Report Container */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Report Header */}
        <div className="bg-white p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Detail Laporan Keuangan</h2>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                totals.totalAset === (totals.totalLiabilitas + totals.totalEkuitas)
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {totals.totalAset === (totals.totalLiabilitas + totals.totalEkuitas) 
                  ? '✓ Balanced' 
                  : '✗ Not Balanced'}
              </div>
            </div>
          </div>
        </div>

        {/* Cash Flow Sections */}
        <div className="divide-y divide-gray-200 px-4 pt-10 pb-4">
          {renderSection(
            "ASET",
            cashFlowData.aset,
            "aset",
            <TrendingUp className="w-6 h-6 text-blue-600" />,
            "bg-blue-50 border-l-4 border-blue-500"
          )}
          
          {renderSection(
            "LIABILITAS",
            cashFlowData.liabilitas,
            "liabilitas",
            <TrendingDown className="w-6 h-6 text-red-600" />,
            "bg-red-50 border-l-4 border-red-500"
          )}
          
          {renderSection(
            "EKUITAS",
            cashFlowData.ekuitas,
            "ekuitas",
            <DollarSign className="w-6 h-6 text-green-600" />,
            "bg-green-50 border-l-4 border-green-500"
          )}
        </div>

        {/* Balance Check Footer */}
        <div className="bg-white p-4 border-t">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">=</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Balance Verification</h3>
                <p className="text-sm text-gray-600">Aset = Liabilitas + Ekuitas</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Calculation</p>
                <p className="text-lg font-bold text-gray-800">
                  {formatCurrency(totals.totalAset)} = {formatCurrency(totals.totalLiabilitas + totals.totalEkuitas)}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                totals.totalAset === (totals.totalLiabilitas + totals.totalEkuitas)
                  ? 'bg-green-100'
                  : 'bg-red-100'
              }`}>
                {totals.totalAset === (totals.totalLiabilitas + totals.totalEkuitas) ? (
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>
    </div>
    </div>
  );
};