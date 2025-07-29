import React, { useEffect, useState } from 'react';
import { Calendar, FileText, DollarSign, Save, ChevronDown } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { SpinnerFixed } from '../../helper/spinner';
import { fetchAssetsStoreInternal } from '../../actions/get';
import { useLocation, useNavigate } from 'react-router-dom';
import { useHandleDataUpdateGeneralJournal } from './updateGeneralJournal'
import { ErrorAlert, Toast, ToastPortal } from '../../component/alert'
import {inputGeneralJournalInternalSlice, getJournalDrafByJsonInternalSlice} from '../../reducers/post'
import {updateGeneralJournalInternalSlice} from '../../reducers/put'
import {inputGeneralJournalInternal, getJournalDrafByJsonInternal} from '../../actions/post'
import {UpdateGeneralJournalInternal} from '../../actions/put'

export function GeneralJournalForm() {
  const navigate = useNavigate()
  const [errorAlert, setErrorAlert] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const location = useLocation();
  const [requiredDate, setRequiredDate] = useState(false)
  const [requiredAmount, setRequiredAmount] = useState(false)
  const [requiredKeterangan, setRequiredKeterangan] = useState(false)
  const [requiredOptionReturn, setRequiredOptionReturn] = useState(false)
  const [requiredOptionAcquisition, setRequiredOptionAcquisition] = useState(false)
  const [requiredNameAsset, setRequiredNameAsset] = useState(false)
  const [requiredTanggalPerolehan, setRequiredTanggalPerolehan] = useState(false)
  const [requiredUmurManfaatTahun, setRequiredUmurManfaatTahun] = useState(false)
  const [requiredNilaiSisa, setRequiredNilaiSisa] = useState(false)
  const [requiredRate, setRequiredRate] = useState(false)
  const [requiredMetodePenyusutan, setRequiredMetodePenyusutan] = useState(false)
  const [requiredHargaPerolehan, setRequiredHargaPerolehan] = useState(false)
  const [requiredPaymentOption, setRequiredPaymentOption] = useState(false)
  const [requiredIdAsset, setRequiredIdAsset] = useState(false) // digunakan untuk penjualan asset tetap
  const [requiredPercentageSale, setRequiredPercentageSale] = useState(false)
  const [requiredOptionMethodSale, setRequiredOptionMethodSale] = useState(false)
  const [requiredMetodeAmortisasi, setRequiredMetodeAmortisasi] = useState(false)
  const [toast, setToast] = useState(null);
  
  const loadStateRequired = () => {
    setRequiredDate(false)
    setRequiredAmount(false)
    setRequiredKeterangan(false)
    setRequiredOptionReturn(false)
    setRequiredOptionAcquisition(false)
    setRequiredNameAsset(false)
    setRequiredTanggalPerolehan(false)
    setRequiredUmurManfaatTahun(false)
    setRequiredNilaiSisa(false)
    setRequiredRate(false)
    setRequiredMetodePenyusutan(false)
    setRequiredHargaPerolehan(false)
    setRequiredPaymentOption(false)
    setRequiredIdAsset(false)
    setRequiredPercentageSale(false)
    setRequiredOptionMethodSale(false)
  }

  useEffect(() => {
    loadStateRequired() 
  }, [selectedAccount, selectedType])

  const previousPath = location.state?.from || "/";
  const isUpdateMode = previousPath === '/internal/admin/general-journal';

  // handle respone get data journal draf from server, jika update data draf 
  const { 
    resetErrorGetJournalByJsonInternal,
    resetGetJournalByJsonInternal,
  } = getJournalDrafByJsonInternalSlice.actions
  const { 
    dataDrafGetJournalByJsonInternal: journalData,
    errorGetJournalByJsonJournal, 
    loadingGetJournalByJson, 
  } = useSelector((state) => state.persisted.getJournalDrafByJsonInternal)

  console.log('data update general journal: ', journalData)
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
  console.log("data selected account: ", selectedAccount)
  console.log("data selected type: ", selectedType)
  console.log("data form date: ", formData)
  
  useEffect(() => {
  
    const updatedData = { ...formData };

    const shouldDeleteDepreciationFields = formData.is_depreciable !== true;
    const shouldDeleteAmortizationFields = formData.is_amortizable !== true;
  
    if (shouldDeleteDepreciationFields && shouldDeleteAmortizationFields) {
      // Kalau keduanya false, hapus semua
      delete updatedData.umur_manfaat_tahun;
      delete updatedData.nilai_sisa;
      delete updatedData.rate;
      delete updatedData.metode_penyusutan;
      delete updatedData.metode_amortisasi;
      setRequiredUmurManfaatTahun(false)
      setRequiredNilaiSisa(false)
      setRequiredRate(false)
      setRequiredMetodePenyusutan(false)
      setRequiredMetodeAmortisasi(false)
    }
    

    setFormData(updatedData);
  }, [formData.is_depreciable, formData.is_amortizable]);
  
  
  const validateCommonFields = () => {
    let isValid = true;
  
    if (formData.date === "" || !formData.date) {
      setRequiredDate(true);
      isValid = false;
    }
  
    if (!formData.amount || formData.amount <= 0) {
      setRequiredAmount(true);
      isValid = false;
    }
  
    if (!formData.keterangan || formData.keterangan.trim() === "") {
      setRequiredKeterangan(true);
      isValid = false;
    }
  
    return isValid;
  };
  

  const validatePencatatanAsetTetap = () => {
    let isValid = true;
  
    if (!formData.name_asset || formData.name_asset === "") {
      setRequiredNameAsset(true);
      isValid = false;
    }
  
    if (!formData.date || formData.date === "") {
      setRequiredDate(true);
      isValid = false;
    }
  
    if (!formData.tanggal_perolehan || formData.tanggal_perolehan === "") {
      setRequiredTanggalPerolehan(true);
      isValid = false;
    }
  
    if (formData.is_depreciable) {
      if (!formData.umur_manfaat_tahun || formData.umur_manfaat_tahun <= 0) {
        setRequiredUmurManfaatTahun(true);
        isValid = false;
      }
  
      if (!formData.nilai_sisa || formData.nilai_sisa <= 0) {
        setRequiredNilaiSisa(true);
        isValid = false;
      }
  
      if (!formData.rate || formData.rate <= 0) {
        setRequiredRate(true);
        isValid = false;
      }
  
      if (!formData.metode_penyusutan || formData.metode_penyusutan === "") {
        setRequiredMetodePenyusutan(true);
        isValid = false;
      }
    } 

    if (!formData.option_acquisition || formData.option_acquisition === "") {
      setRequiredOptionAcquisition(true)
      isValid = false
    }
   
    if (!formData.harga_perolehan || formData.harga_perolehan <= 0) {
      setRequiredHargaPerolehan(true);
      isValid = false;
    }
  
    if (!formData.keterangan || formData.keterangan.trim() === "") {
      setRequiredKeterangan(true);
      isValid = false;
    }
  
    return isValid;
  };

  const validatePenjualanAsetTetap = () => {
    let isValid = true;
  
    if (!formData.id_asset || formData.id_asset === "") {
      setRequiredIdAsset(true);
      isValid = false;
    }
  
    if (!formData.percentage_sale || formData.percentage_sale <= 0 || formData.percentage_sale > 100) {
      setRequiredPercentageSale(true);
      isValid = false;
    }
  
    if (!formData.option_method_sale || formData.option_method_sale === "") {
      setRequiredOptionMethodSale(true);
      isValid = false;
    }
  
    if (!formData.date || formData.date === "") {
      setRequiredDate(true);
      isValid = false;
    }
  
    if (!formData.amount || formData.amount <= 0) {
      setRequiredAmount(true);
      isValid = false;
    }
  
    if (!formData.keterangan || formData.keterangan.trim() === "") {
      setRequiredKeterangan(true);
      isValid = false;
    }
  
    return isValid;
  }


  const validatePencatatanAsetTidakBerwujud = () => {
    let isValid = true;
  
    if (!formData.name_asset || formData.name_asset.trim() === "") {
      setRequiredNameAsset(true);
      isValid = false;
    }
  
    if (!formData.harga_perolehan || formData.harga_perolehan <= 0) {
      setRequiredHargaPerolehan(true);
      isValid = false;
    }
  
    if (!formData.tanggal_perolehan || formData.tanggal_perolehan === "") {
      setRequiredTanggalPerolehan(true);
      isValid = false;
    } 
    
    if (formData.is_amortizable) {
      if (!formData.umur_manfaat_tahun || formData.umur_manfaat_tahun <= 0) {
        setRequiredUmurManfaatTahun(true);
        isValid = false;
      }
    
      if (!formData.nilai_sisa || formData.nilai_sisa <= 0) {
        setRequiredNilaiSisa(true);
        isValid = false;
      }
    
      if (!formData.rate || formData.rate <= 0 || formData.rate > 100) {
        setRequiredRate(true);
        isValid = false;
      }

      if (!formData.metode_amortisasi || formData.metode_amortisasi === "") {
        setRequiredMetodeAmortisasi(true);
        isValid = false;
      } 
    } 

    if (!formData.option_acquisition || formData.option_acquisition === "") {
      setRequiredOptionAcquisition(true)
      isValid = false
    }
  
    // Common Fields
    if (validateCommonFields() === false) {
      isValid = false;
    }
  
    return isValid;
  };

  const validateCommonFieldsAndPaymentOption = () => {
    let isValid = true;

    if (!formData.payment_option || formData.payment_option === "") {
      setRequiredPaymentOption(true);
      isValid = false;
    } 

    if (validateCommonFields() === false) {
      isValid = false;
    }

    return isValid;
  }
  
  const handleInputJournal = (action) => {
    loadStateRequired() 

    switch (selectedType) {
      case 'Retur Pembelian Bahan Baku':
        if (formData.option_return === "" || !formData.option_return) {
          setRequiredOptionReturn(true);
        }
        if (!validateCommonFields()) {
          return;
        }
        break;
  
      case 'Pembelian Bahan Baku':
        if (formData.option_acquisition === "" || !formData.option_acquisition) {
          setRequiredOptionAcquisition(true);
        }

        if (!validateCommonFields()) {
          return;
        }
        break;
  
      case 'Pencatatan Piutang Usaha':
      case 'Pelunasan Piutang Usaha':
      case 'Pencatatan Modal Awal':
      case 'Pencatatan Modal Disetor':
      case 'Pencatatan Prive':
      case 'Pencatatan Beban Gaji':
        if (!validateCommonFields()) {
          return;
        }
        break;
  
      case 'Pencatatan Beban Sewa':
      case 'Pencatatan Beban Promosi dan Pemasaran':
      case 'Pencatatan Beban Operasional Lainnya':
        if (!validateCommonFieldsAndPaymentOption()) {
          return;
        }
        break;
  
      case 'Pencatatan Aset Tetap':
        if (!validatePencatatanAsetTetap()) {
          return;
        }
        break;
  
      case 'Penjualan Aset Tetap':
        if (!validatePenjualanAsetTetap()) {
          return;
        }
        break;
  
      case 'Pencatatan Aset Tidak Berwujud':
        if (!validatePencatatanAsetTidakBerwujud()) {
          return;
        }
        break;
  
      default:
        // Optional: handle default if needed
        break;
    }
  

    handleSubmitJournal(action)
  };
  
  const accounts = [
    { value: 'Persediaan Bahan Baku', label: 'Persediaan Bahan Baku' },
    { value: 'Piutang Usaha', label: 'Piutang Usaha' },
    { value: 'Aset Tetap', label: 'Aset Tetap' },
    { value: 'Aset Tidak Berwujud', label: 'Aset Tidak Berwujud' },
    // { value: 'utang_usaha', label: 'Utang Usaha', disabled: true },
    // { value: 'utang_bank', label: 'Utang Bank', disabled: true },
    { value: 'Modal Awal', label: 'Modal Awal' },
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
      case 'Modal Awal':
        return [
          { value: 'Pencatatan Modal Awal', label: 'Pencatatan Modal Awal' }
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

  useEffect(() => {
    if (selectedType) {
      setFormData((prev) => ({
        ...prev,
        type: selectedType
      }))
    } 
  }, [selectedType])

  const handleAccountChange = (account) => {
    setSelectedAccount(account);
    setSelectedType('');
    setFormData({});
  };

  const handleInputChange = (field, value) => {
    if (field === 'date') {
      value = new Date(value).toISOString().split('T')[0]; // hasil: "2025-07-11"
    }
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };


  ///////// Integration data with state /////////
  // get data assets
  const {dataAssetsStoreInternal} = useSelector((state) => state.persisted.getAssetsStoreInternal)
  useEffect(() => {
    if (!dataAssetsStoreInternal || dataAssetsStoreInternal.length <= 0) {
      dispatch(fetchAssetsStoreInternal())
    }
  }, [])

  console.log("data assets: ", dataAssetsStoreInternal)

  const handleSubmitJournal = (action) => {
    const data = {
      account_name: selectedAccount,
      detail: {...formData, 
        action: action, 
        type: selectedType,
      },
    }

    console.log('kenapa data null:', data)
    if (journalData !== null) {
    // update Journal 
      dispatch(UpdateGeneralJournalInternal(data))
    } else {
      // input journal
      dispatch(inputGeneralJournalInternal(data))
    }

  }

  // handle response update journal 
  const {resetUpdateGeneralJournalInternal} = updateGeneralJournalInternalSlice.actions
  const {successUpdateGeneralJournalInternal, errorUpdateGeneralJournalInternal, loadingUpdateGeneralJournalInternal} = useSelector((state) => state.updateGeneralJournalInternalState)

  useEffect(() => {
    console.log("succesUpdatetGeneralJournal changed: ", successUpdateGeneralJournalInternal)
    if (successUpdateGeneralJournalInternal) {
      navigate("/internal/admin/general-journal")
      dispatch(resetUpdateGeneralJournalInternal())
      dispatch(resetGetJournalByJsonInternal())
    }
  }, [successUpdateGeneralJournalInternal])


  // handle response input journal
  const {resetInputGeneralJournalInternal} = inputGeneralJournalInternalSlice.actions
  const {successInputGeneralJournal, errorInputGeneralJournal, loadingInputGeneralJournal} = useSelector((state) => state.inputGeneralJournalInternalState)

  useEffect(() => {
    console.log("successInputGeneralJournal changed: ", successInputGeneralJournal)
    if (successInputGeneralJournal) {
      navigate("/internal/admin/general-journal")
      dispatch(resetInputGeneralJournalInternal())
    }
  }, [successInputGeneralJournal])


  useEffect(() => {
    if (errorGetJournalByJsonJournal || errorInputGeneralJournal || errorUpdateGeneralJournalInternal) {
      setToast({
        message: "There was an error on the internal server, we are fixing it.",
        type: 'error'
      });
        
      const timer = setTimeout(() => {
        dispatch(resetInputGeneralJournalInternal())
        dispatch(resetErrorGetJournalByJsonInternal())
        dispatch(resetUpdateGeneralJournalInternal())
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [errorGetJournalByJsonJournal, errorInputGeneralJournal, errorUpdateGeneralJournalInternal]);



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
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${requiredDate ? 'border-red-500' : 'border-gray-300'}`}
              value={formData.date || ""}
              onChange={(e) => handleInputChange('date', e.target.value)}
            />
            {requiredDate && <p className="text-red-500 text-xs mt-1">Tanggal transaksi wajib diisi.</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="inline w-4 h-4 mr-2" />
              Jumlah
            </label>
            <input
              type="text"
              value={formData?.amount != null ? formData.amount.toLocaleString("id-ID") : ''}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${requiredAmount ? 'border-red-500' : 'border-gray-300'}`}
              onChange={(e) => {
                const raw = e.target.value.replace(/\./g, '');
                const number = parseInt(raw) || 0;

                handleInputChange('amount', number);
              }}
            />
            {requiredAmount && <p className="text-red-500 text-xs mt-1">Jumlah wajib diisi dan harus lebih dari nol.</p>}
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
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${requiredKeterangan ? 'border-red-500' : 'border-gray-300'}`}
            onChange={(e) => handleInputChange('keterangan', e.target.value)}
          />
          {requiredKeterangan && <p className="text-red-500 text-xs mt-1">Keterangan wajib diisi.</p>}
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
                  className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white ${requiredOptionReturn ? 'border-red-500' : 'border-gray-300'}`}
                  onChange={(e) => handleInputChange('option_return', e.target.value)}
                  value={formData.option_return || ""}
                >
                  <option value="">Pilih Opsi Return</option>
                  <option value="Kredit">Kredit</option>
                  <option value="Tunai">Tunai</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 bottom-3 my-auto h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
              {requiredOptionReturn && <p className="text-red-500 text-xs mt-1">Opsi Return wajib dipilih.</p>}
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
                  className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white ${requiredOptionAcquisition ? 'border-red-500' : 'border-gray-300'}`}
                  onChange={(e) => handleInputChange('option_acquisition', e.target.value)}
                  value={formData.option_acquisition || ""}
                >
                  <option value="">Pilih Opsi Akuisisi</option>
                  <option value="Kredit">Kredit</option>
                  <option value="Tunai">Tunai</option>
                  <option value="Hibah">Hibah</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 bottom-3 my-auto h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
              {requiredOptionAcquisition && <p className="text-red-500 text-xs mt-1">Opsi Akuisisi wajib dipilih.</p>}
            </div>
          </div>
        );
      }
    }

    // Piutang Usaha
    if (selectedType === 'Pencatatan Piutang Usaha' || selectedType === 'Pelunasan Piutang Usaha') {
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${requiredNameAsset ? 'border-red-500' : 'border-gray-300'}`}
                onChange={(e) => handleInputChange('name_asset', e.target.value)}
                value={formData.name_asset}
              />
              {requiredNameAsset && <p className="text-red-500 text-xs mt-1">Nama Aset wajib diisi.</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-2" />
                  Tanggal
                </label>
                <input
                  type="date"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${requiredDate ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.date || ""}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                />
                {requiredDate && <p className="text-red-500 text-xs mt-1">Tanggal transaksi wajib diisi.</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Perolehan</label>
                <input
                  type="date"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${requiredTanggalPerolehan ? 'border-red-500' : 'border-gray-300'}`}
                  onChange={(e) => handleInputChange('tanggal_perolehan', e.target.value)}
                  value={formData.tanggal_perolehan}
                />
                {requiredTanggalPerolehan && <p className="text-red-500 text-xs mt-1">Tanggal Perolehan wajib diisi.</p>}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  onChange={(e) => handleInputChange('is_depreciable', e.target.checked)}
                  checked={formData.is_depreciable} // Use checked for checkboxes
                />
                <span className="ml-2 text-sm text-gray-700">Dapat Disusutkan</span>
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Umur Manfaat */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Umur Manfaat (Tahun)</label>
                <input
                  type="number"
                  min="1"
                  disabled={!formData.is_depreciable}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent
                    ${formData.is_depreciable
                      ? requiredUmurManfaatTahun ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500 bg-white'
                      : 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'}`}
                  onChange={(e) => handleInputChange('umur_manfaat_tahun', Number(e.target.value))}
                  value={formData.umur_manfaat_tahun ?? ''}
                />
                {requiredUmurManfaatTahun && <p className="text-red-500 text-xs mt-1">Umur Manfaat wajib diisi dan harus lebih dari nol.</p>}
              </div>

              {/* Nilai Sisa */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nilai Sisa</label>
                <input
                  type="number"
                  min="0" // Changed min to 0 as Nilai Sisa can be 0
                  disabled={!formData.is_depreciable}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent
                    ${formData.is_depreciable
                      ? requiredNilaiSisa ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500 bg-white'
                      : 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'}`}
                  onChange={(e) => handleInputChange('nilai_sisa', Number(e.target.value))}
                  value={formData.nilai_sisa ?? ''}
                />
                {requiredNilaiSisa && <p className="text-red-500 text-xs mt-1">Nilai Sisa wajib diisi dan tidak boleh negatif.</p>}
              </div>

              {/* Rate (%) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rate (%)</label>
                <input
                  type="number"
                  max="100"
                  disabled={!formData.is_depreciable}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent
                    ${formData.is_depreciable
                      ? requiredRate ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500 bg-white'
                      : 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'}`}
                  onChange={(e) => handleInputChange('rate', Number(e.target.value))}
                  value={formData.rate ?? ''}
                />
                {requiredRate && <p className="text-red-500 text-xs mt-1">Rate wajib diisi antara 1-100%.</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Opsi Akuisisi</label>
                <div className="relative flex items-center">
                  <select
                    className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white ${requiredOptionAcquisition ? 'border-red-500' : 'border-gray-300'}`}
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
                {requiredOptionAcquisition && <p className="text-red-500 text-xs mt-1">Opsi Akuisisi wajib dipilih.</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Metode Penyusutan</label>
                <div className="relative flex items-center">
                  <select
                    disabled={!formData.is_depreciable}
                    className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:border-transparent appearance-none
                      ${formData.is_depreciable
                        ? requiredMetodePenyusutan ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500 bg-white text-black'
                        : 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'}`}
                    onChange={(e) => handleInputChange('metode_penyusutan', e.target.value)}
                    value={formData.metode_penyusutan ?? ''}
                  >
                    <option value="">Pilih Metode</option>
                    <option value="Garis Lurus">Garis Lurus</option>
                    <option value="Saldo Menurun">Saldo Menurun</option>
                  </select>
                  <ChevronDown
                    className={`absolute right-3 top-3 bottom-3 my-auto h-5 w-5
                      ${!formData.is_depreciable ? 'text-gray-300' : 'text-gray-400'} pointer-events-none`}
                  />
                </div>
                {requiredMetodePenyusutan && <p className="text-red-500 text-xs mt-1">Metode Penyusutan wajib dipilih.</p>}
              </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Harga Perolehan</label>
                <input
                  type="number"
                  min="1"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${requiredHargaPerolehan ? 'border-red-500' : 'border-gray-300'}`}
                  onChange={(e) => handleInputChange('harga_perolehan', Number(e.target.value))}
                  value={formData.harga_perolehan}
                />
                {requiredHargaPerolehan && <p className="text-red-500 text-xs mt-1">Harga Perolehan wajib diisi dan harus lebih dari nol.</p>}
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${requiredKeterangan ? 'border-red-500' : 'border-gray-300'}`}
                onChange={(e) => handleInputChange('keterangan', e.target.value)}
              />
              {requiredKeterangan && <p className="text-red-500 text-xs mt-1">Keterangan wajib diisi.</p>}
            </div>
          </div>
        )
      } else if (selectedType === 'Penjualan Aset Tetap') {
        return (
          <div className="space-y-6">
            <div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Pilih Asset</label>
                <div className="relative flex items-center">
                  <select
                    value={formData.id_asset || ""}
                    onChange={(e) => handleInputChange("id_asset", e.target.value)}
                    disabled={isUpdateMode}
                    className={`w-full px-4 py-3 pr-10 border disabled:cursor-not-allowed disabled:opacity-60
                      disabled:hover:border-gray-300 disabled:hover:bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed ${requiredIdAsset ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Pilih Asset</option>
                    {dataAssetsStoreInternal.map((asset) => (
                      <option key={asset.id} value={asset.id}>
                        {asset.nama_asset}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 bottom-3 my-auto h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
                {requiredIdAsset && <p className="text-red-500 text-xs mt-1">Pilih aset yang akan dijual.</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Persentase Penjualan (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${requiredPercentageSale ? 'border-red-500' : 'border-gray-300'}`}
                  onChange={(e) => handleInputChange('percentage_sale', Number(e.target.value))}
                  value={formData.percentage_sale}
                />
                {requiredPercentageSale && <p className="text-red-500 text-xs mt-1">Persentase Penjualan wajib diisi antara 1-100%.</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Metode Penjualan</label>
                <div className="relative flex items-center">
                  <select
                    className={`w-full px-4 py-3 border appearance-none rounded-lg  focus:ring-2 focus:ring-blue-500 focus:border-transparent ${requiredOptionMethodSale ? 'border-red-500' : 'border-gray-300'}`}
                    onChange={(e) => handleInputChange('option_method_sale', e.target.value)}
                    value={formData.option_method_sale}
                  >
                    <option value="">Pilih Metode</option>
                    <option value="Kredit">Kredit</option>
                    <option value="Tunai">Tunai</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 bottom-3 my-auto h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
                {requiredOptionMethodSale && <p className="text-red-500 text-xs mt-1">Metode Penjualan wajib dipilih.</p>}
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${requiredDate ? 'border-red-500' : 'border-gray-300'}`}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  value={formData.date}
                />
                {requiredDate && <p className="text-red-500 text-xs mt-1">Tanggal transaksi wajib diisi.</p>}
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline w-4 h-4 mr-2" />
                  Jumlah
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${requiredAmount ? 'border-red-500' : 'border-gray-300'}`}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\./g, '');
                    const number = parseInt(raw) || 0;

                    handleInputChange('amount', number);
                  }}
                  value={formData?.amount != null ? formData.amount.toLocaleString("id-ID") : ''}
                />
                {requiredAmount && <p className="text-red-500 text-xs mt-1">Jumlah wajib diisi dan harus lebih dari nol.</p>}
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${requiredKeterangan ? 'border-red-500' : 'border-gray-300'}`}
                onChange={(e) => handleInputChange('keterangan', e.target.value)}
                value={formData.keterangan}
              />
              {requiredKeterangan && <p className="text-red-500 text-xs mt-1">Keterangan wajib diisi.</p>}
            </div>
          </div>
        );
      }
    }

    // beban gaji & beban lainnya
    if (selectedType === 'Pencatatan Beban Sewa' || selectedType === 'Pencatatan Beban Promosi dan Pemasaran' || selectedType === 'Pencatatan Beban Operasional Lainnya') {
      return (
        <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Opsi Pembayaran</label>
                <div className="relative items-center">
                  <select
                    className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white ${requiredPaymentOption ? 'border-red-500' : 'border-gray-300'}`}
                    onChange={(e) => handleInputChange('payment_option', e.target.value)}
                    value={formData.payment_option}
                  >
                    <option value="">Pilih Opsi Pembayaran</option>
                    <option value="Tunai">Tunai</option>
                    <option value="Kredit">Kredit</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 bottom-3 my-auto h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
                {requiredPaymentOption && <p className="text-red-500 text-xs mt-1">Opsi Pembayaran wajib dipilih.</p>}
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
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${requiredNameAsset ? 'border-red-500' : 'border-gray-300'}`}
              onChange={(e) => handleInputChange('name_asset', e.target.value)}
              value={formData.name_asset}
            />
            {requiredNameAsset && <p className="text-red-500 text-xs mt-1">Nama Aset wajib diisi.</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Harga Perolehan</label>
              <input
                type="number"
                min="1"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${requiredHargaPerolehan ? 'border-red-500' : 'border-gray-300'}`}
                onChange={(e) => handleInputChange('harga_perolehan', Number(e.target.value))}
                value={formData.harga_perolehan}
              />
              {requiredHargaPerolehan && <p className="text-red-500 text-xs mt-1">Harga Perolehan wajib diisi dan harus lebih dari nol.</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Perolehan</label>
              <input
                type="date"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${requiredTanggalPerolehan ? 'border-red-500' : 'border-gray-300'}`}
                onChange={(e) => handleInputChange('tanggal_perolehan', e.target.value)}
                value={formData.tanggal_perolehan}
              />
              {requiredTanggalPerolehan && <p className="text-red-500 text-xs mt-1">Tanggal Perolehan wajib diisi.</p>}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                onChange={(e) => handleInputChange('is_amortizable', e.target.checked)}
                checked={formData.is_amortizable}
              />
              <span className="ml-2 text-sm text-gray-700">Dapat Diamortisasi</span>
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Umur Manfaat (Tahun)
              </label>
              <input
                type="number"
                min="1"
                disabled={!formData.is_amortizable}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent
                  ${formData.is_amortizable
                    ? requiredUmurManfaatTahun ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500 bg-white'
                    : 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'}`}
                onChange={(e) => handleInputChange('umur_manfaat_tahun', Number(e.target.value))}
                value={formData.umur_manfaat_tahun || ''}
              />
              {requiredUmurManfaatTahun && <p className="text-red-500 text-xs mt-1">Umur Manfaat wajib diisi dan harus lebih dari nol.</p>}
            </div>
            {/* Nilai Sisa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nilai Sisa</label>
              <input
                type="number"
                min="0"
                disabled={!formData.is_amortizable}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent
                  ${formData.is_amortizable
                    ? requiredNilaiSisa ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500 bg-white'
                    : 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'}`}
                onChange={(e) => handleInputChange('nilai_sisa', Number(e.target.value))}
                value={formData.nilai_sisa ?? ''}
              />
              {requiredNilaiSisa && <p className="text-red-500 text-xs mt-1">Nilai Sisa wajib diisi dan tidak boleh negatif.</p>}
            </div>

            {/* Rate (%) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rate (%)</label>
              <input
                type="number"
                max="100"
                disabled={!formData.is_amortizable}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent
                  ${formData.is_amortizable
                    ? requiredRate ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500 bg-white'
                    : 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'}`}
                onChange={(e) => handleInputChange('rate', Number(e.target.value))}
                value={formData.rate ?? ''}
              />
              {requiredRate && <p className="text-red-500 text-xs mt-1">Rate wajib diisi antara 1-100%.</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Opsi Akuisisi</label>
              <div className="relative flex items-center">
                <select
                  className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white ${requiredOptionAcquisition ? 'border-red-500' : 'border-gray-300'}`}
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
              {requiredOptionAcquisition && <p className="text-red-500 text-xs mt-1">Opsi Akuisisi wajib dipilih.</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Metode Amortisasi</label>
              <div className="relative flex items-center">
                <select
                  disabled={!formData.is_amortizable}
                  className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:border-transparent appearance-none
                    ${formData.is_amortizable
                      ? requiredMetodePenyusutan ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500 bg-white' // Reusing requiredMetodePenyusutan for simplicity
                      : 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'}`}
                  onChange={(e) => handleInputChange('metode_amortisasi', e.target.value)}
                  value={formData.metode_amortisasi ?? ''}
                >
                  <option value="">Pilih Metode</option>
                  <option value="garis_lurus">Garis Lurus</option>
                  <option value="saldo_menurun">Saldo Menurun</option>
                </select>
                <ChevronDown className={`absolute right-3 top-3 bottom-3 my-auto h-5 w-5
                  ${!formData.is_amortizable ? 'text-gray-300' : 'text-gray-400'} pointer-events-none`} />
              </div>
              {requiredMetodeAmortisasi && <p className="text-red-500 text-xs mt-1">Metode Amortisasi wajib dipilih.</p>}
            </div>
          </div>
          {commonFields} {/* Reusing common fields for date, amount, keterangan */}
        </div>
      );
    }

    // Modal Awal & Modal Disetor
    if (selectedType === 'Pencatatan Modal Disetor' || selectedType === 'Pencatatan Modal Awal' || selectedType === 'Pencatatan Beban Gaji' || selectedType === 'Pencatatan Prive') {
      return (
        <div className="space-y-6">
          {commonFields}
        </div>
      )
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {toast && (
        <ToastPortal> 
          <div className='fixed top-8 left-1/2 transform -translate-x-1/2 z-100'>
            <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
            duration={3000}
            />
          </div>
        </ToastPortal>
      )}

      { (loadingUpdateGeneralJournalInternal || loadingInputGeneralJournal || loadingGetJournalByJson)  && (
        <SpinnerFixed colors={'fill-gray-800'}/>
      )}
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
                  value={journalData !== null ? journalDataSelectedAccount : selectedAccount}
                  onChange={(e) => handleAccountChange(e.target.value)}
                  disabled={isUpdateMode}
                  className="w-full px-4 py-3 pr-10 border border-gray-300 disabled:cursor-not-allowed disabled:opacity-60
                  disabled:hover:border-gray-300 disabled:hover:bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
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
                    disabled={isUpdateMode}
                    className="w-full px-4 py-3 border disabled:cursor-not-allowed disabled:opacity-60
                    disabled:hover:border-gray-300 disabled:hover:bg-gray-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
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
              <div className="mt-2 pt-6 border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <button
                    onClick={() => handleInputJournal('DRAF')}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
                  >
                    Simpan sebagai Draf
                  </button>
                  <button
                    onClick={() => handleInputJournal('FINALIZE')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    Finalisasi Transaksi
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