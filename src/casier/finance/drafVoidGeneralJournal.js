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
import { data, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector} from 'react-redux';
import { dataDrafToVoidInternalSlice } from '../../reducers/reducers';
import { getJournalDrafByJsonInternal } from '../../actions/post'

export const DrafVoidDataComponent = ({ 
  drafData = [], 
  typeComponent,
  handleConfirmModelVoid,
  }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    const handleDrafJournal = (data) => {
      navigate('/internal/admin/general-journal/form', { state: { from: location.pathname } })
      dispatch(getJournalDrafByJsonInternal(data))
    }

    console.log("draf data tidak terprint: ", drafData)

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
  
    const getEventIcon = (eventName) => {
      switch (eventName) {
        case 'Pelunasan Piutang Usaha':
          return DollarSign;
        case 'Pencatatan Piutang Usaha':
          return FileText;
        case 'Pembeliaan Bahan Baku':
          return FileText;
        case 'Pencatatan Aset Tetap':
          return FileText;
        case 'Pencatatan Beban Gaji':
        case 'Pencatatan Beban Sewa':
          return DollarSign;
        default:
          return Info;
      }
    };
  
    const renderAccountDetails = (account) => {
      return (
        <div className="bg-white border rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h6 className="font-medium text-gray-900">{account.account_name}</h6>
            <span className={`px-2 py-1 rounded-full text-xs ${
              account.type === 'DEBIT' ? 'bg-green-100 text-green-800' :
              account.type === 'KREDIT' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {account.type}
            </span>
          </div>
          
          {account.amount && (
            <div className="text-sm text-gray-900">
              <span className="font-medium">Jumlah: </span>
              {formatCurrency(account.amount)}
            </div>
          )}
          
          {account.keterangan && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Keterangan: </span>
              {account.keterangan}
            </div>
          )}
          
          {account.account_code && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Kode Akun: </span>
              <span className="font-mono">{account.account_code}</span>
            </div>
          )}
        </div>
      );
    };
  
    const getTotalAmount = (accounts) => {
      return accounts.reduce((total, account) => total + (account.amount || 0), 0);
    };
  
    if (drafData.length === 0) {
      return (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada data draf</h3>
          <p className="mt-1 text-sm text-gray-500">Belum ada data draf yang tersedia untuk ditampilkan.</p>
        </div>
      );
    }

    const {setDataDrafToVoid} = dataDrafToVoidInternalSlice.actions
    const handleNewVoid = (entry) => {
      console.log("Original entry:", entry);
      
      // Validasi entry
      if (!entry || !entry.accounts || !Array.isArray(entry.accounts)) {
        console.error("Invalid entry data:", entry);
        return;
      }
      
      // Buat data_general_journal yang menggabungkan semua account
      const dataGeneralJournal = {};
      
      // Loop semua account dan masukkan ke data_general_journal
      entry.accounts.forEach(account => {
        // Gunakan account_name sebagai key, account_id sebagai value
        dataGeneralJournal[account.account_name] = account.id;
      });
      
      // Tentukan type berdasarkan event name
      let typeValue = "VOID";
      if (entry.event === "Pencatatan Aset Tetap"
          || entry.event === "Pencatatan Aset Tidak Berwujud"  
          || entry.event === "Penjualan Aset Tetap" 
          || entry.event === "Penjualan Aset Tidak Berwujud") {
        typeValue = entry.event; // Ambil type dari account pertama
      }
      
      // Struktur data final - hanya satu objek per event
      const voidData = {
        account_name: "VOID", // String kosong sesuai requirement
        detail: {
          action: "VOID", // Action diubah menjadi VOID
          type: typeValue, // String kosong kecuali untuk event aset
          data_general_journal: dataGeneralJournal // Semua account_id dari event ini
        }
      };

      console.log("Transformed void data:", voidData);

      dispatch(setDataDrafToVoid(voidData))
      handleConfirmModelVoid()
    };

    return (
      <div className="space-y-6">
        {drafData.map((entry, entryIndex) => {
          const IconComponent = getEventIcon(entry.event);
          const totalAmount = getTotalAmount(entry.accounts);
          
          return (
            <div key={entryIndex} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-800 flex justify-between px-6 py-4">
                <div className="flex items-center space-x-3">
                  <IconComponent className="h-5 w-5 text-white" />
                  <h4 className="text-lg font-semibold text-white">{entry.event}</h4>
                </div>
                <div className="text-white text-sm">
                  {formatDate(entry.date)}
                </div>
              </div>


              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`${typeComponent === 'DRAF' ? 'bg-yellow-100' : 'bg-red-100'} p-2 rounded-full`}>
                      <FileText className={`h-4 w-4 ${typeComponent === 'DRAF' ? 'text-yellow-500' : 'text-red-500'}`} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeComponent === 'DRAF' ? 'bg-yellow-500' : 'bg-red-500'} text-white`}>
                          {typeComponent === 'DRAF' ? 'DRAF' : 'VOID'}
                        </span>
                        <span className="text-sm text-gray-600">
                          Total: {formatCurrency(totalAmount)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {entry.accounts.length} akun terlibat
                      </p>
                    </div>
                  </div>
                  
                  {typeComponent === 'DRAF' && (
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDrafJournal(entry)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleNewVoid(entry)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Detail Akun:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {entry.accounts.map((account, accountIndex) => (
                      <div key={accountIndex}>
                        {renderAccountDetails(account)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
