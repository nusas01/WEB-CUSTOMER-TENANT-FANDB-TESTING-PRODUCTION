import React, {useState, useEffect} from 'react';
import { 
  Eye, 
  Edit3, 
  Trash2, 
  FileText, 
  DollarSign, 
  Calendar, 
  Info 
} from 'lucide-react';
import {GeneralJournalForm} from './inputGeneralJournal'
import { data, useNavigate } from 'react-router-dom';

export const DrafVoidDataComponent = ({ 
  drafData = [], 
  typeComponent,
  handleConfirmModelVoid,
  }) => {
    const navigate = useNavigate()
    const handleDrafJournal = (data) => {
      navigate('/internal/admin/general/journal/form', { state: { journalData: data } });
    }

    const handleVoidJournal = () => {
    }

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(amount);
    };
  
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };
  
    const getAccountIcon = (accountName) => {
      switch (accountName) {
        case 'Persedian Bahan Baku':
          return FileText;
        case 'Piutang Usaha':
          return DollarSign;
        case 'Aset tetap':
        case 'Aset Tetap':
          return FileText;
        case 'Aset Tidak Berwujud':
          return FileText;
        case 'Modal Awal':
        case 'Modal Disetor':
          return DollarSign;
        case 'Prive':
          return DollarSign;
        case 'Beban Gaji':
        case 'Beban Sewa':
          return DollarSign;
        default:
          return Info;
      }
    };
  
    const renderDetailFields = (detail, accountName) => {
      const commonFields = (
        <>
          {detail.date && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Tanggal: {formatDate(detail.date)}</span>
            </div>
          )}
          {detail.amount && (
            <div className="text-sm text-gray-900">
              <span className="font-medium">Jumlah: </span>
              {formatCurrency(detail.amount)}
            </div>
          )}
          {detail.keterangan && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Keterangan: </span>
              {detail.keterangan}
            </div>
          )}
        </>
      );
  
      const specificFields = () => {
        switch (detail.type) {
          case 'Pembeliaan Bahan Baku':
          case 'Retur Pembeliaan Bahan Baku':
            return (
              <>
                {detail.option_acquisition && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Jenis Akuisisi: </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      detail.option_acquisition === 'Tunai' ? 'bg-green-100 text-green-800' :
                      detail.option_acquisition === 'Kredit' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {detail.option_acquisition}
                    </span>
                  </div>
                )}
                {detail.option_return && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Opsi Retur: </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      detail.option_return === 'Tunai' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {detail.option_return}
                    </span>
                  </div>
                )}
              </>
            );
          
          case 'Pencatatan Aset Tetap':
            return (
              <>
                {detail.name_asset && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Nama Aset: </span>
                    {detail.name_asset}
                  </div>
                )}
                {detail.harga_perolehan && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Harga Perolehan: </span>
                    {formatCurrency(detail.harga_perolehan)}
                  </div>
                )}
                {detail.umur_manfaat_tahun && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Umur Manfaat: </span>
                    {detail.umur_manfaat_tahun} tahun
                  </div>
                )}
                {detail.metode_penyusutan && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Metode Penyusutan: </span>
                    {detail.metode_penyusutan}
                  </div>
                )}
              </>
            );
          
          case 'Penjualan Aset Tetap':
            return (
              <>
                {detail.asset_name && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Nama Aset: </span>
                    {detail.asset_name}
                  </div>
                )}
                {detail.option_method_salse && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Metode Penjualan: </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      detail.option_method_salse === 'Tunai' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {detail.option_method_salse}
                    </span>
                  </div>
                )}
                {detail.percentage_sale && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Persentase Penjualan: </span>
                    {(detail.percentage_sale * 100).toFixed(2)}%
                  </div>
                )}
              </>
            );
          
          case 'Pencatatan Aset Tidak Berwujud':
            return (
              <>
                {detail.name_asset && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Nama Aset: </span>
                    {detail.name_asset}
                  </div>
                )}
                {detail.harga_perolehan && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Harga Perolehan: </span>
                    {formatCurrency(detail.harga_perolehan)}
                  </div>
                )}
                {detail.metode_amortisasi && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Metode Amortisasi: </span>
                    {detail.metode_amortisasi}
                  </div>
                )}
              </>
            );
          
          case 'Pencatatan Beban Gaji':
          case 'Pencatatan Beban Sewa':
            return (
              <>
                {detail.payment_option && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Opsi Pembayaran: </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      detail.payment_option === 'Tunai' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {detail.payment_option}
                    </span>
                  </div>
                )}
              </>
            );
          
          default:
            return null;
        }
      };
  
      return (
        <div className="space-y-2">
          {commonFields}
          {specificFields()}
        </div>
      );
    };
  
    const renderGeneralJournalAccounts = (dataGeneralJournal) => {
      if (!dataGeneralJournal || Object.keys(dataGeneralJournal).length === 0) {
        return null;
      }
  
      return (
        <div className="mt-4 bg-gray-50 rounded-lg p-4">
          <h5 className="text-sm font-medium text-gray-900 mb-3">Jurnal Umum Terkait:</h5>
          <div className="space-y-2">
            {Object.entries(dataGeneralJournal).map(([accountName, accountId], index) => (
              <div key={index} className="flex justify-between items-center text-xs">
                <span className="text-gray-600">{accountName}</span>
                <span className="font-mono text-gray-500">{accountId}</span>
              </div>
            ))}
          </div>
        </div>
      );
    };
  
    // Group data by account_name
    const groupedDrafData = drafData.reduce((acc, item) => {
      const accountName = item.account_name;
      if (!acc[accountName]) {
        acc[accountName] = [];
      }
      acc[accountName].push(item);
      return acc;
    }, {});
  
    if (drafData.length === 0) {
      return (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada data draf</h3>
          <p className="mt-1 text-sm text-gray-500">Belum ada data draf yang tersedia untuk ditampilkan.</p>
        </div>
      );
    }
  
    return (
      <div className="space-y-6">
        {Object.entries(groupedDrafData).map(([accountName, entries]) => {
          const IconComponent = getAccountIcon(accountName);
          
          return (
            <div key={accountName} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-800 flex justify-between px-6 py-4">
                <div className="flex items-center space-x-3">
                  <IconComponent className="h-5 w-5 text-white" />
                  <h4 className="text-lg font-semibold text-white">{accountName}</h4>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {entries.map((entry, entryIndex) => (
                  <div key={entryIndex} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`${typeComponent === 'DRAF' ? 'bg-yellow-100' : 'bg-red-100'} p-2 rounded-full`}>
                          <FileText className={`h-4 w-4 ${typeComponent === 'DRAF' ? 'text-yellow-500' : 'text-red-500'}`} />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">
                              {entry.detail.date ? formatDate(entry.detail.date) : 'Tanggal tidak tersedia'}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeComponent === 'DRAF' ? 'bg-yellow-500' : 'bg-red-500'} text-white`}>
                              { typeComponent === 'DRAF' ? 'DRAF' : 'VOID'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{entry.detail.type}</p>
                        </div>
                      </div>
                      
                      { typeComponent === 'DRAF' && (
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDrafJournal(entry)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleConfirmModelVoid(entry.account_name)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          {renderDetailFields(entry.detail, entry.account_name)}
                        </div>
                        <div>
                          {entry.detail.data_general_journal && renderGeneralJournalAccounts(entry.detail.data_general_journal)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };