import React, { useEffect, useState, useRef } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Camera, 
  Lock, 
  Eye, 
  EyeOff, 
  Save, 
  Settings, 
  CreditCard, 
  Wallet, 
  Building,
  Percent,
  DollarSign,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  QrCode,
  Maximize, 
  Minimize,
  Menu,
} from 'lucide-react';
import Sidebar  from '../component/sidebar';
import { fetchDataEmployeeInternal } from '../actions/get'
import { getDataEmployeeInternalSlice } from '../reducers/get'
import { 
  Toast,
  ToastPortal,
} from '../component/alert';
import { SpinnerFixed } from '../helper/spinner';
import { useDispatch, useSelector } from 'react-redux';
import { 
  updateDataEmployeeInternal, 
  updateChangePasswordInternal,
} from '../actions/patch'
import {
  fetchPaymentMethodsInternal
} from '../actions/get'
import {
    updatePaymentMethodsInternal
} from '../actions/put'
import { 
  updateDataEmployeeSlice,
  changePasswordInternalSlice, 
} from '../reducers/patch'
import {
  updatePaymentMethodsInternalSlice,
} from '../reducers/put'
import {
  getPaymentMethodsInternalSlice
} from '../reducers/get'
import { format } from 'date-fns';
import { validatePassword } from '../helper/validate'
import { formatCurrency, EmptyState, useFullscreen, useElementHeight } from '../helper/helper'
import { current } from '@reduxjs/toolkit';
import { navbarInternalSlice } from "../reducers/reducers"
 
export default function KasirSettings() {
  const activeMenu = "settings"
  const dispatch = useDispatch()
  const [toast, setToast] = useState({ show: false, type: '', message: '' })
  const [spinnerFixed, setSpinnerFixed] = useState(false)

  // maxsimaz minimaz layar
  const contentRef = useRef(null);
  const { setIsOpen } = navbarInternalSlice.actions
  const { isFullScreen, toggleFullScreen } = useFullscreen(contentRef);

  

  // handle sidebar and elemant header yang responsice
  const { isOpen, isMobileDeviceType } = useSelector((state) => state.persisted.navbarInternal)

  // response get data employee
  const { resetErrorDataEmployeeInternal } = getDataEmployeeInternalSlice.actions
  const { errorDataEmployeeInternal } = useSelector((state) => state.persisted.getDataEmployeeInternal)

  // response update data employee
  const { resetUpdateDataEmployee } = updateDataEmployeeSlice.actions
  const { successUpdateDataEmployee, errorUpdateDataEmployee, loadingUpdateDataEmployee } = useSelector((state) => state.updateDataEmployeeState)

  // response change password
  const { resetChangePasswordInternal } = changePasswordInternalSlice.actions
  const { successChangePassword, errorChangePassword, loadingChangePassword } = useSelector((state) => state.changePasswordInternalState)

  // response update payment methods
  const { resetUpdatePaymentMethodsInternal } = updatePaymentMethodsInternalSlice.actions
  const {successUpdatePaymentMethods, errorUpdatePaymentMethods, loadingUpdatePaymentMethods } = useSelector((state) => state.updatePaymentMethodsInternalState)

  useEffect(() => {
    setSpinnerFixed(loadingUpdatePaymentMethods)
  }, [loadingUpdatePaymentMethods])

  useEffect(() => {
    setSpinnerFixed(loadingUpdateDataEmployee)
  }, [loadingUpdateDataEmployee])

  useEffect(() => {
    setSpinnerFixed(loadingChangePassword)
  }, [loadingChangePassword])

  useEffect(() => {
    if (successUpdateDataEmployee || successChangePassword || successUpdatePaymentMethods) {
      const message = successUpdateDataEmployee
        ? 'Data berhasil diperbarui'
        : successChangePassword
        ? 'Password berhasil diperbarui'
        : successUpdatePaymentMethods
        ? 'Metode pembayaran berhasil diperbarui'
        : '';
      
      setToast({ show: true, type: 'success', message })

      if (successUpdatePaymentMethods) {
        dispatch(fetchPaymentMethodsInternal())
      }

      const timer = setTimeout(() => {
        setToast({ show: false, type: '', message: '' })
        dispatch(resetUpdateDataEmployee())
        dispatch(resetChangePasswordInternal())
        dispatch(resetUpdatePaymentMethodsInternal())
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [successUpdateDataEmployee, successChangePassword, successUpdatePaymentMethods])
  
  useEffect(() => {
    if (errorDataEmployeeInternal || errorUpdateDataEmployee || errorChangePassword || errorUpdatePaymentMethods) {
      const message = errorDataEmployeeInternal
        ? 'Terjadi kesalahan pada sistem saat memuat data. Kami sedang mengatasinya. Silakan coba beberapa saat lagi.'
        : errorUpdateDataEmployee 
        ? 'Terjadi kesalahan pada sistem saat memperbaruhi data. Kami sedang mengatasinya. Silakan coba beberapa saat lagi'
        : errorChangePassword 
        ? 'Terjadi kesalahan pada sistem saat memperbaruhi password. Kami sedang mengatasinya. Silakan coba beberapa saat lagi'
        : errorUpdatePaymentMethods 
        ? 'Terjadi kesalahan pada sistem saat memperbarui metode pembayaran. Kami sedang mengatasinya. Silakan coba beberapa saat lagi'
        : ''

      setToast({ show: true, type: 'error', message })

      const timer = setTimeout(() => {
        setToast({ show: false, type: '', message: '' })
        dispatch(resetErrorDataEmployeeInternal())
        dispatch(resetUpdateDataEmployee())
        dispatch(resetChangePasswordInternal())
        dispatch(resetUpdatePaymentMethodsInternal())
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [errorDataEmployeeInternal, errorUpdateDataEmployee, errorChangePassword, errorUpdatePaymentMethods])

  // Handle toast close
  const handleToastClose = () => {
    setToast({ show: false, type: '', message: '' })
    dispatch(resetErrorDataEmployeeInternal())
    dispatch(resetUpdateDataEmployee())
    dispatch(resetChangePasswordInternal())
    dispatch(resetUpdatePaymentMethodsInternal())
  }

  return (
    <div className='flex relative'>
      {/* Sidebar - Fixed width */}
      {(!isFullScreen && (!isMobileDeviceType || (isOpen && isMobileDeviceType))) && (
        <div className="w-1/10 z-50 min-w-[290px]">
            <Sidebar 
            activeMenu={activeMenu}
            />
        </div>
      )}

      {spinnerFixed && (
        <SpinnerFixed/>
      )}

      {/* Toast Portal */}
      {toast.show && (
        <ToastPortal>
          <div className='fixed top-8 left-1/2 transform -translate-x-1/2 z-50'>
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={handleToastClose}
              duration={3000}
            />
          </div>
        </ToastPortal>
      )}

      <div
        ref={contentRef}
        className={`flex-1 ${isFullScreen ? 'w-full h-screen overflow-y-auto' : ''}`}
      >
        <SettingsDashboard 
        isFullScreen={isFullScreen}
        fullscreenchange={toggleFullScreen}
        />
      </div>
    </div>
  )
}

const SettingsDashboard = ({isFullScreen, fullscreenchange}) => {
  const dispatch = useDispatch()

  // call data payment method
  const [paymentSettings, setPaymentSettings] = useState(null);
  const {dataPaymentMethodInternal, taxRateInternal, paymentMethodCash} = useSelector((state) => state.persisted.paymentMethodsInternal)

  useEffect(() => {
    if (
      dataPaymentMethodInternal.length === 0 &&
      taxRateInternal === 0 &&
      paymentMethodCash === null
    ) {
      dispatch(fetchPaymentMethodsInternal());
    } else {
      const virtualAccountFees = {};
      const ewalletFees = {};
      let qrisFee = 0;

      dataPaymentMethodInternal.forEach((method) => {
        const name = method.name.toLowerCase();
        const fee = method.fee;

        switch (method.type) {
          case "VA":
            virtualAccountFees[name] = fee;
            break;
          case "EWALLET":
            ewalletFees[name] = fee * 100; 
            break;
          case "QR":
            if (name.toLowerCase() === "qris") {
              qrisFee = parseFloat((fee * 100).toFixed(2)); 
            }
            break;
          default:
            break;
        }
      });

      setPaymentSettings({
        taxRate: parseFloat((taxRateInternal * 100).toFixed(2)) ?? 0,
        cashPaymentActive: paymentMethodCash?.status_payment ?? true,
        virtualAccountFees,
        ewalletFees,
        qrisFee
      });
    }
  }, [dataPaymentMethodInternal, taxRateInternal, paymentMethodCash, dispatch]);

  console.log("data payment settings: ", dataPaymentMethodInternal)
  console.log("data tax rate: ", taxRateInternal)

  // Payment Settings State
  const isEmptyVA = !paymentSettings?.virtualAccountFees || Object.keys(paymentSettings.virtualAccountFees).length === 0;
  const isEmptyEwallet = !paymentSettings?.ewalletFees || Object.keys(paymentSettings.ewalletFees).length === 0;


  // update payment methods
  const handleSubmitUpdatePaymentMethods = () => {
    const updatedPaymentMethods = dataPaymentMethodInternal.map((method) => {
      const name = method.name.toLowerCase();
      let updatedFee = method.fee;

      switch (method.type) {
        case "VA":
          updatedFee = paymentSettings.virtualAccountFees?.[name] ?? method.fee;
          break;
        case "EWALLET":
          // dari persen (1.5%) ke nilai asli (0.015)
          updatedFee = paymentSettings.ewalletFees?.[name] ?? method.fee;
          break;
        case "QR":
          if (name === "qris") {
            updatedFee = paymentSettings.qrisFee ?? method.fee;
          }
          break;
        default:
          break;
      }

      return {
        ...method,
        fee: updatedFee,
      };
    });

    dispatch(updatePaymentMethodsInternal({
      payment_method_cash: {
        fee: paymentMethodCash.fee,
        status_payment: paymentSettings.cashPaymentActive,
      },
      payment_methods: updatedPaymentMethods,
      tax_rate: paymentSettings.taxRate
    }));
  };


  // UI State
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [savedStatus, setSavedStatus] = useState('');


  // get data customer from state and call api
  const {setUpdateStatusImage, updateEmployeeImage, updateEmployeeInternalFields} = getDataEmployeeInternalSlice.actions
  const {dataEmployeeInternal, updateStatus, imageUpdateEmployee} = useSelector((state) => state.persisted.getDataEmployeeInternal)

  useEffect(() => {
    if (!dataEmployeeInternal) {
      dispatch(fetchDataEmployeeInternal())
    }
  }, [])

  console.log("data employee: ", dataEmployeeInternal)
  console.log("update status image: ", updateStatus)

  // Handlers
 const handleProfileUpdate = (field, value) => {
    if (field === 'email' || field === 'gender' || field === 'position') return;

    dispatch(updateEmployeeInternalFields({ [field]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const imageData = event.target.result; 

        dispatch(updateEmployeeImage({baseStr: imageData, file: file}));
        dispatch(setUpdateStatusImage(true))
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmitUpdateEmployee = () => {
    const formData = new FormData();
    formData.append("id", dataEmployeeInternal.id);
    formData.append("name", dataEmployeeInternal.name);
    formData.append("phone_number", dataEmployeeInternal.phone_number);
    formData.append("date_of_birth", dataEmployeeInternal.date_of_birth);

    if (imageUpdateEmployee instanceof File) {
      formData.append("image", imageUpdateEmployee);
    }

    dispatch(updateDataEmployeeInternal(formData))
  };

  // handle change password
  const { resetChangePasswordInternal } = changePasswordInternalSlice.actions
  const { errorValidatePassword, errorValidateNewPassword } = useSelector((state) => state.changePasswordInternalState)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  console.log("data change password: ", passwordData)
  console.log("error change password: ", passwordErrors)

   const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitChangePassword = () => {
    dispatch(resetChangePasswordInternal())

    const errors = validatePassword(passwordData.newPassword, passwordData.confirmPassword);
    setPasswordErrors(errors);

    console.log("error change password: ", errors); 

    let currentPasswordValid = true; 
    if (passwordData.currentPassword === '') {
      setPasswordErrors(prev => ({
        ...prev, 
        currentPassword: 'Password saat ini tidak boleh kosong'
      }));
      currentPasswordValid = false;
    }

    const isValid = !errors.newPassword && !errors.confirmPassword;

    if (!isValid || !currentPasswordValid) return;

    dispatch(updateChangePasswordInternal({
      new_password: passwordData.newPassword,
      last_password: passwordData.currentPassword
    }));

    console.log("dispatch executed");
  };


  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive 
          ? 'bg-gray-800 text-white shadow-lg' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  // handle sidebar and elemant header yang responsice
  const { ref: headerRef, height: headerHeight } = useElementHeight();
  const { setIsOpen } = navbarInternalSlice.actions
  const { isOpen, isMobileDeviceType } = useSelector((state) => state.persisted.navbarInternal)


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          ref={headerRef}
          className={`fixed top-0 z-10 bg-white border-b border-gray-200 ${isOpen && isMobileDeviceType ? 'hidden' : ''}`}
          style={{
            left: (isFullScreen || isMobileDeviceType) ? '0' : '288px',
            width: isMobileDeviceType ? '100%' : (isFullScreen ? '100%' : 'calc(100% - 288px)'),
            height: '64px'
          }}
        >
            <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl flex items-center justify-center">
                        <Settings className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Settings</h1>
                        <p className="text-gray-600 text-xs">Sesuaikan preferensi dan kelola sistem Anda.</p>
                    </div>
                </div>

                <div>
                  <button onClick={() => fullscreenchange()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors hover:scale-105">
                    {isFullScreen ? <Minimize className="w-5 h-5 text-gray-600" /> : <Maximize className="w-5 h-5 text-gray-600" />}
                  </button>
                  { isMobileDeviceType && !isFullScreen && (
                    <button 
                      onClick={() => dispatch(setIsOpen(true))}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Menu className="w-5 h-5 text-gray-600" />
                    </button>
                  )}
                </div>
            </div>
            </div>
        </div>

        {/* Success Message */}
        {savedStatus && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <div className="p-1 bg-green-100 rounded-full">
              <Save className="text-green-600" size={16} />
            </div>
            <span className="text-green-800 font-medium">{savedStatus}</span>
          </div>
        )}

        <div className="p-4" style={{marginTop: headerHeight}}>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="space-y-2 grid-cols-3 md-:grid-cols-1 lg:grid-cols-3">
                <TabButton
                  id="profile"
                  label="Profil Pengguna"
                  icon={User}
                  isActive={activeTab === 'profile'}
                  onClick={() => setActiveTab('profile')}
                />
                <TabButton
                  id="password"
                  label="Ganti Password"
                  icon={Lock}
                  isActive={activeTab === 'password'}
                  onClick={() => setActiveTab('password')}
                />
                <TabButton
                  id="payment"
                  label="Pengaturan Payment"
                  icon={CreditCard}
                  isActive={activeTab === 'payment'}
                  onClick={() => setActiveTab('payment')}
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 mt-4">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <User className="text-gray-800" size={24} />
                  <h2 className="text-xl font-bold text-gray-800">Profil Pengguna</h2>
                </div>

                {/* Profile Image */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">Foto Profil</label>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {dataEmployeeInternal?.image &&
                        dataEmployeeInternal.image !== "00000000-0000-0000-0000-000000000000" &&
                        !updateStatus ? (
                          <img
                            src={`/image/${dataEmployeeInternal.image}`}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : dataEmployeeInternal?.image && updateStatus ? (
                          <img
                            src={dataEmployeeInternal.image}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="text-gray-400" size={32} />
                        )}
                      </div>
                      <label className="absolute -bottom-2 -right-2 p-2 bg-gray-800 text-white rounded-full cursor-pointer hover:bg-gray-700 transition-colors">
                        <Camera size={16} />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Upload foto profil baru</p>
                      <p className="text-xs text-gray-400">JPG, PNG hingga 5MB</p>
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Nama Lengkap"
                    value={dataEmployeeInternal?.name || ''}
                    onChange={(value) => handleProfileUpdate('name', value)}
                    icon={User}
                    placeholder="Masukkan nama lengkap"
                  />
                  
                  <InputField
                    label="Email"
                    type="email"
                    value={dataEmployeeInternal?.email || ''}
                    disabled={true}
                    icon={Mail}
                    placeholder="Email tidak dapat diubah"
                  />
                  
                  <InputField
                    label="Nomor Telepon"
                    value={dataEmployeeInternal?.phone_number || ''}
                    onChange={(value) => handleProfileUpdate('phone_number', value)}
                    icon={Phone}
                    placeholder="+62 812 3456 7890"
                  />
                  
                  <InputField
                    label="Tanggal Lahir"
                    type="date"
                    value={dataEmployeeInternal?.date_of_birth || ''}
                    onChange={(value) => handleProfileUpdate('date_of_birth', value)}
                    icon={Calendar}
                  />
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800">Jenis Kelamin</label>
                    <select
                      value={dataEmployeeInternal?.gender || ''}
                      disabled={true}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    >
                      <option value="Male">Laki-laki</option>
                      <option value="Female">Perempuan</option>
                    </select>
                  </div>
                  
                  <InputField
                    label="Posisi"
                    value={dataEmployeeInternal?.position || 0}
                    disabled={true}
                    icon={Building}
                    placeholder="Posisi tidak dapat diubah"
                  />
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => handleSubmitUpdateEmployee()}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Save size={18} />
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'password' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Lock className="text-gray-800" size={24} />
                  <h2 className="text-xl font-bold text-gray-800">Ganti Password</h2>
                </div>

                <div className="max-w-md space-y-6">
                  <div>
                    <PasswordField
                      label="Password Saat Ini"
                      value={passwordData.currentPassword}
                      onChange={(value) => handlePasswordChange('currentPassword', value)}
                      showPassword={showPassword.current}
                      toggleShow={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                      placeholder="Masukkan password saat ini"
                    />
                    {(errorValidatePassword || passwordErrors.currentPassword) && (
                      <p className="text-red-500 text-sm">{errorValidatePassword || passwordErrors.currentPassword}</p>
                    )}
                  </div>
                  
                  <div>
                    <PasswordField
                      label="Password Baru"
                      value={passwordData.newPassword}
                      onChange={(value) => handlePasswordChange('newPassword', value)}
                      showPassword={showPassword.new}
                      toggleShow={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                      placeholder="Masukkan password baru"
                    />
                    {(passwordErrors.newPassword || errorValidateNewPassword) && (
                      <p className="text-red-500 text-sm">{passwordErrors.newPassword || errorValidateNewPassword}</p>
                    )}
                  </div>
                  
                  <div>
                    <PasswordField
                      label="Konfirmasi Password Baru"
                      value={passwordData.confirmPassword}
                      onChange={(value) => handlePasswordChange('confirmPassword', value)}
                      showPassword={showPassword.confirm}
                      toggleShow={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                      placeholder="Konfirmasi password baru"
                    />
                    {passwordErrors.confirmPassword && (
                        <p className="text-red-500 text-sm">{passwordErrors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="text-blue-600 mt-0.5" size={16} />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Ketentuan Password:</p>
                        <ul className="space-y-1 text-blue-700">
                          <li>• Wajib diisi</li>
                          <li>• Minimal 6 karakter dan maksimal 50 karakter</li>
                          <li>• Mengandung minimal 1 huruf kapital</li>
                          <li>• Mengandung minimal 1 angka</li>
                          <li>• Mengandung minimal 1 simbol/karakter spesial</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => handleSubmitChangePassword()}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Save size={18} />
                    Ganti Password
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="space-y-6">
                {/* Tax Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Percent className="text-gray-800" size={24} />
                    <h2 className="text-xl font-bold text-gray-800">Pengaturan Pajak</h2>
                  </div>

                  <div className="max-w-md">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Tarif Pajak (%)</label>

                      <div className="relative flex items-center rounded-xl border border-gray-300 bg-white shadow-sm focus-within:ring-2 focus-within:ring-gray-800 transition">
                        <div className="pl-4 flex items-center text-gray-400">
                          <Percent size={18} />
                        </div>
                        <input
                          type="number"
                          value={paymentSettings?.taxRate}
                          onChange={(e) =>
                            setPaymentSettings((prev) => ({
                              ...prev,
                              taxRate: parseFloat(e.target.value),
                            }))
                          }
                          onWheel={(e) => e.target.blur()}
                          placeholder="0"
                          min="0"
                          max="100"
                          step="0.1"
                          className="w-full px-4 py-3 bg-transparent focus:outline-none rounded-r-xl text-sm"
                        />
                      </div>

                      <p className="text-sm text-gray-600">Pajak akan diterapkan pada setiap transaksi</p>
                    </div>
                  </div>
                </div>

                {/* Cash Payment Toggle */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">                  
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center text-gray-800">
                      <Wallet size={24} />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 leading-tight">
                      Metode Pembayaran Cash
                    </h2>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">Aktifkan Pembayaran Cash</p>
                      <p className="text-sm text-gray-600">Mengizinkan pelanggan membayar dengan uang tunai</p>
                    </div>
                    <button
                      onClick={() =>
                        setPaymentSettings(prev => ({
                          ...(prev ?? {}), 
                          cashPaymentActive: !(prev?.cashPaymentActive ?? false)
                        }))
                      }
                      className={`p-1 rounded-full transition-colors ${
                        paymentSettings?.cashPaymentActive ? 'text-gray-800' : 'text-gray-400'
                      }`}
                    >
                      {paymentSettings?.cashPaymentActive ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                    </button>
                  </div>
                </div>

                {/* Virtual Account Fees */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Building className="text-gray-800" size={24} />
                    <h2 className="text-xl font-bold text-gray-800">Biaya Virtual Account</h2>
                  </div>

                  { isEmptyVA ? (
                    <EmptyState
                      title="Gagal Memuat Data E-wallet"
                      description="Data biaya e-wallet gagal dimuat dari server. Periksa jaringan Anda dan coba lagi."
                    />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(paymentSettings.virtualAccountFees).map(([bank, fee]) => (
                        <div key={bank} className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 capitalize">
                            {bank.toUpperCase()}
                          </label>

                          <div className="relative flex items-center rounded-xl border border-gray-300 bg-white shadow-sm focus-within:ring-2 focus-within:ring-gray-800 transition">
                            <div className="pl-4 flex items-center text-gray-400">
                              <DollarSign size={18} />
                            </div>
                            <input
                              type="text"
                              value={fee != null ? fee.toLocaleString("id-ID") : '0'}
                              onChange={(e) => {
                                const rawValue = e.target.value.replace(/\./g, ''); // hilangkan titik ribuan
                                const parsed = parseInt(rawValue) || 0;

                                setPaymentSettings((prev) => ({
                                  ...prev,
                                  virtualAccountFees: {
                                    ...prev.virtualAccountFees,
                                    [bank]: parsed,
                                  },
                                }));
                              }}
                              placeholder="0"
                              min="0"
                              className="w-full px-4 py-3 bg-transparent focus:outline-none rounded-r-xl text-sm"
                            />
                          </div>

                          <p className="text-xs text-gray-500">{formatCurrency(fee)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* E-wallet Fees */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard className="text-gray-800" size={24} />
                    <h2 className="text-xl font-bold text-gray-800">Biaya E-wallet (%)</h2>
                  </div>

                  { isEmptyEwallet ? (
                    <EmptyState
                      title="Gagal Memuat Data E-wallet"
                      description="Data biaya e-wallet gagal dimuat dari server. Periksa jaringan Anda dan coba lagi."
                    />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(paymentSettings.ewalletFees).map(([wallet, fee]) => (
                        <div key={wallet} className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 capitalize">
                            {wallet === "shopeepay" ? "ShopeePay" : wallet.toUpperCase()}
                          </label>

                          <div className="relative flex items-center rounded-xl border border-gray-300 bg-white shadow-sm focus-within:ring-2 focus-within:ring-gray-800 transition">
                            <div className="pl-4 flex items-center text-gray-400">
                              <Percent size={18} />
                            </div>
                            <input
                              type="number"
                              value={fee}
                              onChange={(e) => 
                                setPaymentSettings((prev) => ({
                                  ...prev,
                                  ewalletFees: {
                                    ...prev.ewalletFees,
                                    [wallet]: parseFloat(e.target.value),
                                  },
                                }))
                              }
                              onWheel={(e) => e.target.blur()}
                              placeholder="0"
                              min="0"
                              max="100"
                              step="0.1"
                              className="w-full px-4 py-3 bg-transparent focus:outline-none rounded-r-xl text-sm"
                            />
                          </div>

                          <p className="text-xs text-gray-500">{fee}% dari total transaksi</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* QRIS Fee */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <QrCode className="text-gray-800" size={24} />
                    <h2 className="text-xl font-bold text-gray-800">Biaya QRIS (%)</h2>
                  </div>

                  {paymentSettings?.qrisFee == null ? (
                    <EmptyState
                      title="Gagal Memuat Data QRIS"
                      description="Data biaya QRIS gagal dimuat dari server. Periksa koneksi jaringan Anda dan coba lagi."
                    />
                  ) : (
                    <div className="space-y-2 max-w-md">
                      <label className="block text-sm font-medium text-gray-700">QRIS</label>

                      <div className="relative flex items-center rounded-xl border border-gray-300 bg-white shadow-sm focus-within:ring-2 focus-within:ring-gray-800 transition">
                        <div className="pl-4 flex items-center text-gray-400">
                          <Percent size={18} />
                        </div>
                        <input
                          type="number"
                          value={paymentSettings?.qrisFee}
                          onChange={(e) => 
                            setPaymentSettings((prev) => ({
                              ...prev,
                              qrisFee: parseFloat(e.target.value),
                            }))
                          }
                          onWheel={(e) => e.target.blur()}
                          placeholder='0'
                          min='0'
                          max="100"
                          step="0.1"
                          className="w-full px-4 py-3 bg-transparent focus:outline-none rounded-r-xl text-sm"
                        />
                      </div>

                      <p className="text-xs text-gray-500">{paymentSettings.qrisFee}% dari total transaksi melalui QRIS</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleSubmitUpdatePaymentMethods()}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Save size={18} />
                    Simpan Pengaturan
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

const InputField = ({ label, type = 'text', value, onChange, disabled = false, icon: Icon, placeholder }) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-800">{label}</label>
    <div className="relative flex items-center">
      {Icon && (
        <div className="absolute left-3 top-0 h-full flex items-center">
          <Icon className="text-gray-400" size={18} />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 ${
          Icon ? 'pl-11' : ''
        } ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'} leading-none text-sm`}
      />
    </div>
  </div>
);

const PasswordField = ({ label, value, onChange, showPassword, toggleShow, placeholder }) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-800">{label}</label>
    
    <div className="relative flex items-center">
      <Lock className="absolute left-3 text-gray-400" size={18} />
      
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 pl-11 pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200"
      />
      
      <button
        type="button"
        onClick={toggleShow}
        className="absolute right-3 text-gray-400 hover:text-gray-600"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>
);
