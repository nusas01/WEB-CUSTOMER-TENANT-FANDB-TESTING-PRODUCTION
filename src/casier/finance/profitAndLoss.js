import React, { useState } from 'react';
import { Calendar, TrendingUp, TrendingDown, DollarSign, FileText, Filter } from 'lucide-react';
import { formatCurrency } from '../../helper/helper';
import Sidebar from '../../component/sidebar';

const ProfitAndLoss = () => {
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-12-31');

  // Data dummy sesuai struktur yang diminta
  const profitLossData = {
    laba_bersih: 5000000,
    laba_kotor: 7000000,
    total_pendapatan: 10000000,
    total_beban: 2000000,
    pendapatan: [
      {
        account_name: "Pendapatan Penjualan",
        total_kredit: 6000000
      },
      {
        account_name: "Pendapatan Lainnya",
        total_kredit: 4000000
      }
    ],
    hpp: {
      account_name: "HPP",
      total_debet: 3000000
    },
    beban: [
      {
        account_name: "Gaji Karyawan",
        total_debet: 1000000
      },
      {
        account_name: "Listrik & Air",
        total_debet: 1000000
      }
    ]
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
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
                  Laporan Laba Rugi
                </h1>
                <p className="text-gray-500 text-sm">Profit & Loss Statement</p>
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
                <p className="text-gray-500 text-sm font-medium">Total Pendapatan</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(profitLossData.total_pendapatan)}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-sm">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Laba Kotor</p>
                <p className="text-xl font-bold text-blue-600">{formatCurrency(profitLossData.laba_kotor)}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-sm">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Beban</p>
                <p className="text-xl font-bold text-red-600">{formatCurrency(profitLossData.total_beban)}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl shadow-sm">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Laba Bersih</p>
                <p className="text-xl font-bold text-amber-600">{formatCurrency(profitLossData.laba_bersih)}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-sm">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Report */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-white">
                <h2 className="text-xl font-bold text-gray-800">Rincian Laba Rugi</h2>
                <p className="text-gray-600 text-sm mt-1">Detail breakdown laporan keuangan</p>
            </div>
            
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch bg-white">
                {/* Pendapatan */}
                <div className="flex flex-col justify-between bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 h-full">
                    <div>
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                            <TrendingUp className="w-5 h-5" />
                            </div>
                            Pendapatan
                        </h3>
                        <div className="space-y-4">
                            {profitLossData.pendapatan.map((item, index) => (
                            <div key={index} className="flex justify-between items-center p-4 bg-white rounded-xl hover:bg-gray-100">
                                <span className="font-medium">{item.account_name}</span>
                                <span className="font-bold">{formatCurrency(item.total_kredit)}</span>
                            </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex justify-between items-center p-4 bg-gray-800 rounded-xl">
                            <span className="text-white font-bold">Total Pendapatan</span>
                            <span className="text-white font-bold text-lg">{formatCurrency(profitLossData.total_pendapatan)}</span>
                        </div>
                    </div>
                </div>

                {/* HPP */}
                <div className="flex flex-col justify-between bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 h-full">
                    <div>
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                            <div className="p-2 bg-orange-100 text-orange-600  rounded-lg">
                            <DollarSign className="w-5 h-5" />
                            </div>
                            Harga Pokok Penjualan
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-white rounded-xl hover:bg-gray-100">
                            <span className="font-medium">{profitLossData.hpp.account_name}</span>
                            <span className="font-bold">({formatCurrency(profitLossData.hpp.total_debet)})</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex justify-between items-center p-4 bg-gray-800 rounded-xl">
                            <span className="text-white font-bold">Laba Kotor</span>
                            <span className="text-white font-bold text-lg">{formatCurrency(profitLossData.laba_kotor)}</span>
                        </div>
                    </div>
                </div>

                {/* Beban */}
                <div className="flex flex-col justify-between bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 h-full">
                    <div>
                    <h3 className="text-lg font-bold  mb-6 flex items-center gap-3">
                        <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                        <TrendingDown className="w-5 h-5" />
                        </div>
                        Beban Operasional
                    </h3>
                    <div className="space-y-4">
                        {profitLossData.beban.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-4 bg-white rounded-xl hover:bg-gray-100">
                            <span className="font-medium">{item.account_name}</span>
                            <span className="font-bold">({formatCurrency(item.total_debet)})</span>
                        </div>
                        ))}
                    </div>
                    </div>
                    <div className="mt-4">
                    <div className="flex justify-between items-center p-4 bg-gray-800 rounded-xl">
                        <span className="text-white font-bold">Total Beban</span>
                        <span className="text-white font-bold text-lg">({formatCurrency(profitLossData.total_beban)})</span>
                    </div>
                    </div>
                </div>
            </div>

            {/* Laba Bersih */}
            <div className="flex justify-between items-center p-4 bg-white shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gray-800 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-800">Laba Bersih</span>
                </div>
                <span className="text-xl font-bold text-gray-800">{formatCurrency(profitLossData.laba_bersih)}</span>
            </div>
        </div>
        </div>
    </div>
  );
};

export default function ProfitLossStatement() {
    const [activeMenu, setActiveMenu] = useState("profit-and-loss")
    
    return (
      <div className="flex">
          <div className="w-1/10 min-w-[250px]">
              <Sidebar activeMenu={activeMenu}/>
          </div>

          <div className="flex-1">
              <ProfitAndLoss/>
          </div>
        </div>
    )
}
