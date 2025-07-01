import React, { useEffect, useState } from 'react';
import { Calendar, FileText, DollarSign, Save, ChevronDown } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { SpinnerRelative } from '../../helper/spinner';
import { fetchAssetsStoreInternal } from '../../actions/get';
import { useLocation } from 'react-router-dom';
import { useHandleDataUpdateGeneralJournal } from './updateGeneralJournal'
export function GeneralJournalForm() {
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [formData, setFormData] = useState({});
  const [spinnerRelatif, setSpinnerRelatif] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();

  const journalData = location.state?.journalData || null;

  const {
    selectedAccount: journalDataSelectedAccount,
    selectedType: journalDataSelectedType,
    formData: journalDataFormData
  } = useHandleDataUpdateGeneralJournal(journalData);
  
  useEffect(() => {
    if (journalData !== null) {
      setSelectedAccount(journalDataSelectedAccount);
      setSelectedType(journalDataSelectedType);
      setFormData(journalDataFormData);
    }
  }, [journalData, journalDataSelectedAccount, journalDataSelectedType, journalDataFormData]);
  
  const accounts = [
    { value: 'Persediaan Bahan Baku', label: 'Persediaan Bahan Baku' },
    { value: 'Piutang Usaha', label: 'Piutang Usaha' },
    { value: 'Aset Tetap', label: 'Aset Tetap' },
    { value: 'Aset Tidak Berwujud', label: 'Aset Tidak Berwujud' },
    { value: 'utang_usaha', label: 'Utang Usaha', disabled: true },
    { value: 'utang_bank', label: 'Utang Bank', disabled: true },
    { value: 'Modal Usaha', label: 'Modal Usaha' },
    { value: 'Modal Disetor', label: 'Modal Disetor' },
    { value: 'Prive', label: 'Prive' },
    { value: 'Beban Gaji', label: 'Beban Gaji' },
    { value: 'Beban Sewa', label: 'Beban Sewa' },
    { value: 'Beban Promosi dan Pemasaran', label: 'Beban Promosi dan Pemasaran' },
    { value: 'Beban Operasional Lainnya', label: 'Beban Operasional Lainnya' }
  ];

  const getTypeOptions = (account) => {
    switch (account) {
      case 'Persediaan Bahan Baku':
        return [
          { value: 'Retur Pembelian Bahan Baku', label: 'Retur Pembelian Bahan Baku' },
          { value: 'Pembelian Bahan Baku', label: 'Pembelian Bahan Baku' }
        ];
      case 'Piutang Usaha':
        return [
          { value: 'Pencatatan Piutang Usaha' , label: 'Pencatatan Piutang Usaha' },
          { value: 'Pelunasan Piutang Usaha', label: 'Pelunasan Piutang Usaha' }
        ];
      case 'Aset Tetap':
        return [
          { value: 'Pencatatan Aset Tetap', label: 'Pencatatan Aset Tetap' },
          { value: 'Penjualan Aset Tetap', label: 'Penjualan Aset Tetap' }
        ];
      case 'Aset Tidak Berwujud':
        return [
          { value: 'Pencatatan Aset Tidak Berwujud', label: 'Pencatatan Aset Tidak Berwujud' }
        ];
      case 'Modal Usaha':
        return [
          { value: 'Pencatatan Modal Usaha', label: 'Pencatatan Modal Awal' }
        ];
      case 'Modal Disetor':
        return [
          { value: 'Pencatatan Modal Disetor', label: 'Pencatatan Modal Disetor' }
        ];
      case "Prive":
        return [
          {values: 'Pencatatan Prive', label: 'Pencatatan Prive'}
        ]
      case "Beban Gaji":
        return [
          {values: 'Pencatatan Beban Gaji', label: 'Pencatatan Beban Gaji'}
        ]
      case "Beban Sewa":
        return [
          {values: 'Pencatatan Beban Sewa', label: 'Pencatatan Beban Sewa'}
        ]
      case "Beban Promosi dan Pemasaran":
        return [
          {values: 'Pencatatan Beban Promosi dan Pemasaran', label: 'Pencatatan Beban Promosi dan Pemasaran'}
        ]
      case "Beban Operasional Lainnya":
        return [
          {values: 'Pencatatan Beban Operasional Lainnya', label: 'Pencatatan Beban Operasional Lainnya'}
        ]
      default:
        return [];
    }
  };

  const handleAccountChange = (account) => {
    setSelectedAccount(account);
    setSelectedType('');
    setFormData({});
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // data call or api call
  const {dataAssetsStoreInternal, loadingAssetsStoreInternal} = useSelector((state) => state.persisted.getAssetsStoreInternal)
  useEffect(() => {
    if (dataAssetsStoreInternal.length > 0 || dataAssetsStoreInternal) {
      dispatch(fetchAssetsStoreInternal())
    }
  })

  useEffect(() => {
    setSpinnerRelatif(loadingAssetsStoreInternal)
  })

  const renderFormFields = () => {
    if (!selectedAccount || !selectedType) return null;

    const commonFields = (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-2" />
              Tanggal
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.date || ""}
              onChange={(e) => handleInputChange('date', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="inline w-4 h-4 mr-2" />
              Jumlah
            </label>
            <input
              type="number"
              value={formData.amount}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => handleInputChange('amount', e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="inline w-4 h-4 mr-2" />
            Keterangan
          </label>
          <input
            type="text"
            maxLength="50"
            value={formData.keterangan}
            placeholder="Maksimal 50 karakter"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => handleInputChange('keterangan', e.target.value)}
          />
        </div>
      </>
    );

    // Persediaan Bahan Baku
    if (selectedAccount === 'Persediaan Bahan Baku') {
      if (selectedType === 'Retur Pembelian Bahan Baku') {
        return (
          <div className="space-y-6">
            {commonFields}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Opsi Return</label>
              <div className="relative flex items-center">
                <select
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  onChange={(e) => handleInputChange('option_return', e.target.value)}
                  value={formData.option_return || ""}
                >
                  <option value="">Pilih Opsi Return</option>
                  <option value="Kredit">Kredit</option>
                  <option value="Tunai">Tunai</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 bottom-3 my-auto h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        );
      } else if (selectedType === 'Pembelian Bahan Baku') {
        return (
          <div className="space-y-6">
            {commonFields}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Opsi Akuisisi</label>
              <div className="relative flex items-center">
                <select
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  onChange={(e) => handleInputChange('option_acquisition', e.target.value)}
                  value={formData.option_acquisition}
                >
                  <option value="">Pilih Opsi Akuisisi</option>
                  <option value="Kredit">Kredit</option>
                  <option value="Tunai">Tunai</option>
                  <option value="Hibah">Hibah</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 bottom-3 my-auto h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        );
      }
    }

    // Piutang Usaha
    if (selectedAccount === 'Piutang Usaha') {
      return (
        <div className="space-y-6">
          {commonFields}
        </div>
      );
    }

    // Aset Tetap
    if (selectedAccount === 'Aset Tetap') {
      if (selectedType === 'Pencatatan Aset Tetap') {
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Aset</label>
              <input
                type="text"
                maxLength="255"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => handleInputChange('name_asset', e.target.value)}
                value={formData.name_asset}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Harga Perolehan</label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => handleInputChange('harga_perolehan', e.target.value)}
                  value={formData.harga_perolehan}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Perolehan</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => handleInputChange('tanggal_perolehan', e.target.value)}
                  value={formData.tanggal_perolehan}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Umur Manfaat (Tahun)</label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => handleInputChange('umur_manfaat_tahun', e.target.value)}
                  value={formData.umur_manfaat_tahun}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nilai Sisa</label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => handleInputChange('nilai_sisa', e.target.value)}
                  value={formData.nilai_sisa}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rate (%)</label>
                <input
                  type="number"
                  max="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => handleInputChange('rate', e.target.value)}
                  value={formData.rate}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Opsi Akuisisi</label>
                <div className="relative flex items-center">
                  <select
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    onChange={(e) => handleInputChange('option_acquisition', e.target.value)}
                    value={formData.option_acquisition}
                  >
                    <option value="">Pilih Opsi</option>
                    <option value="Kredit">Kredit</option>
                    <option value="Tunai">Tunai</option>
                    <option value="Hibah">Hibah</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 bottom-3 my-auto h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Metode Penyusutan</label>
                <div className="relative flex items-center">
                  <select
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    onChange={(e) => handleInputChange('metode_penyusutan', e.target.value)}
                    value={formData.metode_penyusutan}
                  >
                    <option value="">Pilih Metode</option>
                    <option value="garis_lurus">Garis Lurus</option>
                    <option value="saldo_menurun">Saldo Menurun</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 bottom-3 my-auto h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  onChange={(e) => handleInputChange('is_depreciable', e.target.checked)}
                  value={formData.is_depreciable}
                />
                <span className="ml-2 text-sm text-gray-700">Dapat Disusutkan</span>
              </label>
            </div>
            {commonFields}
          </div>
        )
      } else if (selectedType === 'Penjualan Aset Tetap') {
        return (
          <div className="space-y-6">
            <div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Asset</label>
                <div className="relative flex items-center">
                  <select
                    value={formData.id_asset || ""}
                    onChange={(e) => handleInputChange("id_asset", e.target.value)}
                    disabled={journalData !== null}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Pilih Asset</option>
                    {dataAssetsStoreInternal.map((asset) => (
                      <option key={asset.id} value={asset.id}>
                        {asset.name_asset}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Persentase Penjualan (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => handleInputChange('percentage_sale', e.target.value)}
                  value={formData.percentage_sale}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Metode Penjualan</label>
                <div className="relative flex items-center">
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onChange={(e) => handleInputChange('option_method_sale', e.target.value)}
                    value={formData.option_method_sale}
                  >
                    <option value="">Pilih Metode</option>
                    <option value="Kredit">Kredit</option>
                    <option value="Tunai">Tunai</option>
                  </select>
                </div>
                <ChevronDown className="absolute right-3 top-3 bottom-3 my-auto h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-2" />
                  Tanggal
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  value={formData.date}
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline w-4 h-4 mr-2" />
                  Jumlah
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  value={formData.amount}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline w-4 h-4 mr-2" />
                Keterangan
              </label>
              <input
                type="text"
                maxLength="50"
                placeholder="Maksimal 50 karakter"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => handleInputChange('keterangan', e.target.value)}
                value={formData.keterangan}
              />
            </div>
          </div>
        );
      }
    }

    // beban gaji
    if (selectedType === 'Pencatatan Beban Sewa' || selectedType === 'Pencatatan Beban Promosi dan Pemasaran' || selectedType === 'Pencatatan Beban Operasional Lainnya') {
      return (
        <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Opsi Pembayaran</label>
                <div className="relative items-center">    
                  <select
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    onChange={(e) => handleInputChange('payment_option', e.target.value)}
                    value={formData.payment_option}
                  >
                    <option value="">Pilih Opsi Pembayaran</option>
                    <option value="Tunai">Tunai</option>
                    <option value="Kredit">Kredit</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 bottom-3 my-auto h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
            </div>
          {commonFields}
        </div>
      )
    }

    // Aset Tidak Berwujud
    if (selectedType === 'Pencatatan Aset Tidak Berwujud') {
      return (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Aset</label>
            <input
              type="text"
              maxLength="255"
              placeholder="Contoh: Lisensi Adobe"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => handleInputChange('name_asset', e.target.value)}
              value={formData.name_asset}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Harga Perolehan</label>
              <input
                type="number"
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => handleInputChange('harga_perolehan', e.target.value)}
                value={formData.harga_perolehan}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Perolehan</label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => handleInputChange('tanggal_perolehan', e.target.value)}
                value={formData.tanggal_perolehan}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Umur Manfaat (Tahun)</label>
              <input
                type="number"
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => handleInputChange('umur_manfaat_tahun', e.target.value)}
                value={formData.umur_manfaat_tahun}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nilai Sisa</label>
              <input
                type="number"
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => handleInputChange('nilai_sisa', e.target.value)}
                value={formData.nilai_sisa}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rate (%)</label>
              <input
                type="number"
                max="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => handleInputChange('rate', e.target.value)}
                value={formData.rate}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Opsi Akuisisi</label>
              <div className="relative flex items-center">
                <select
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  onChange={(e) => handleInputChange('option_acquisition', e.target.value)}
                  value={formData.option_acquisition}
                >
                  <option value="">Pilih Opsi</option>
                  <option value="Kredit">Kredit</option>
                  <option value="Tunai">Tunai</option>
                  <option value="Hibah">Hibah</option>
                  <option value="dibuat_sendiri">Dibuat Sendiri</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 bottom-3 my-auto h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Metode Amortisasi</label>
              <div className="relative flex items-center">
                <select
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  onChange={(e) => handleInputChange('metode_amortisasi', e.target.value)}
                  value={formData.metode_amortisasi}
                >
                  <option value="">Pilih Metode</option>
                  <option value="garis_lurus">Garis Lurus</option>
                  <option value="saldo_menurun">Saldo Menurun</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 bottom-3 my-auto h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                onChange={(e) => handleInputChange('is_amortizable', e.target.checked)}
                value={formData.is_amortizable}
              />
              <span className="ml-2 text-sm text-gray-700">Dapat Diamortisasi</span>
            </label>
          </div>
          {commonFields}
        </div>
      );
    }

    // Modal Usaha & Modal Disetor
    if ((selectedAccount === 'Modal Usaha' || selectedAccount === 'Modal Disetor') && (selectedType === 'Pencatatan Modal Disetor' || selectedType === 'Pencatatan Modal Usaha')) {
      return (
        <div className="space-y-6">
          {commonFields}
        </div>
      )
    }

    // Prive
    if (selectedAccount === 'Pencatatan Prive' || selectedType === 'Pencatatan Prive' || selectedType === 'Pencatatan Beban Gaji') {
      return (
        <div className="space-y-6">
          {commonFields}
        </div>
      )
    }

    return null;
  };

  const handleSubmit = (action) => {
    const finalData = {
      ...formData,
      action: action
    };
    console.log('Form Data:', finalData);
    // Handle form submission here
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gray-900 px-8 py-6">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <FileText className="mr-3 h-6 w-6" />
              Form Input General Journal
            </h1>
            <p className="text-gray-300 mt-2">Pilih akun dan jenis transaksi untuk melanjutkan</p>
          </div>

          {/* Form */}
          <div className="p-8">
            {/* Account Selection */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Pilih Akun
              </label>
              <div className="relative flex items-center">
                <select
                  value={selectedAccount}
                  onChange={(e) => handleAccountChange(e.target.value)}
                  disabled={journalData !== null}
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Pilih Akun</option>
                  {accounts.map((account) => (
                    <option 
                      key={account.value} 
                      value={account.value}
                      disabled={account.disabled}
                      className={account.disabled ? 'text-gray-400' : ''}
                    >
                      {account.label} {account.disabled ? '(Tidak Tersedia)' : ''}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 bottom-3 my-auto h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            {/* Type Selection */}
            {selectedAccount && getTypeOptions(selectedAccount).length > 0 && (
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Jenis Transaksi
                </label>
                <div className="relative items-center">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    disabled={journalData !== null}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Pilih Jenis Transaksi</option>
                    {getTypeOptions(selectedAccount).map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 bottom-3 my-auto h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Dynamic Form Fields */}
            {renderFormFields()}

            {/* Action Buttons */}
            {selectedAccount && selectedType && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <button
                    onClick={() => handleSubmit('DRAF')}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
                  >
                    Simpan sebagai Draft
                  </button>
                  <button
                    onClick={() => handleSubmit('FINALIZE')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    Finalisasi
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralJournalForm;