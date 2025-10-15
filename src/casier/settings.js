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
import { fetchAllEmployees, fetchDataEmployeeInternal } from '../actions/get'
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
import { AccessDeniedModal } from '../component/model';
import { Navigate, useLocation } from 'react-router-dom';
 
export default function KasirSettings() {
  const activeMenu = "settings"
  const dispatch = useDispatch()
  const [toast, setToast] = useState({ show: false, type: '', message: '' })

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
  const { 
    successUpdateDataEmployee, 
    errorUpdateDataEmployee, 
  } = useSelector((state) => state.updateDataEmployeeState)

  // response change password
  const { resetChangePasswordInternal } = changePasswordInternalSlice.actions
  const { successChangePassword, errorChangePassword, loadingChangePassword } = useSelector((state) => state.changePasswordInternalState)

  // response update payment methods
  const { resetUpdatePaymentMethodsInternal } = updatePaymentMethodsInternalSlice.actions
  const {successUpdatePaymentMethods, errorUpdatePaymentMethods, loadingUpdatePaymentMethods } = useSelector((state) => state.updatePaymentMethodsInternalState)

  useEffect(() => {
    if (successUpdateDataEmployee || successChangePassword || successUpdatePaymentMethods) {
      setToast({ 
        show: true, 
        type: 'success', 
        message: successUpdateDataEmployee || successChangePassword || successUpdatePaymentMethods 
      })

      if (successUpdatePaymentMethods) {
        dispatch(fetchPaymentMethodsInternal())
      }

      if (successUpdateDataEmployee) {
        dispatch(fetchAllEmployees())
        dispatch(fetchDataEmployeeInternal())
      }
    }
  }, [successUpdateDataEmployee, successChangePassword, successUpdatePaymentMethods])
  
  useEffect(() => {
    if (errorDataEmployeeInternal || errorUpdateDataEmployee || errorChangePassword || errorUpdatePaymentMethods) {
      setToast({ 
        show: true, 
        type: 'error', 
        message: errorDataEmployeeInternal || errorUpdateDataEmployee || errorChangePassword || errorUpdatePaymentMethods
      })
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

      {/* Toast Portal */}
      {toast.show && (
        <ToastPortal>
          <div className='fixed top-8 left-1/2 transform -translate-x-1/2 z-100'>
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={handleToastClose}
              duration={5000}
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
  const [spinnerFixed, setSpinnerFixed] = useState(false)
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [profileImage, setProfileImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [errors, setErrors] = useState()
  const [isUpdate, setIsUpdate] = useState()

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
  const {updateEmployeeInternalFields} = getDataEmployeeInternalSlice.actions
  const {dataEmployeeInternal} = useSelector((state) => state.persisted.getDataEmployeeInternal)
  const [formDataUpdateEmployee, setFormDataUpdateEmployee] = useState({
    name: '',
    email: '',
    phone_number: '',
    date_of_birth: '',
    gender: '', 
    position: '',
  }) 

  useEffect(() => {
    if (!dataEmployeeInternal) {
      dispatch(fetchDataEmployeeInternal())
    }
  }, [])

  // Handlers
 const handleProfileUpdate = (field, value) => {
    if (field === 'gender' || field === 'position') return;

    setIsUpdate((prev) => ({
      ...prev,
      [field]: true
    }))

    setFormDataUpdateEmployee((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileImage(file);

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);


  const { resetUpdateDataEmployee } = updateDataEmployeeSlice.actions

  const handleSubmitUpdateEmployee = () => {
    dispatch(resetUpdateDataEmployee())
    setErrors()

    const formData = new FormData();
    formData.append("id", (formDataUpdateEmployee?.id || dataEmployeeInternal?.id));
    formData.append("name", (formDataUpdateEmployee?.name || dataEmployeeInternal?.name));
    formData.append("phone_number", `+62${formDataUpdateEmployee?.phone_number || dataEmployeeInternal?.phone_number}`);
    formData.append("date_of_birth", (formDataUpdateEmployee?.date_of_birth || dataEmployeeInternal?.date_of_birth));
    formData.append("email", (formDataUpdateEmployee?.email || dataEmployeeInternal?.email))

    if (profileImage instanceof File) {
      formData.append("image", profileImage);
    }

    dispatch(updateDataEmployeeInternal(formData))
  };

  // handle change password
  const { resetChangePasswordInternal } = changePasswordInternalSlice.actions
  const { errorValidatePassword, errorValidateNewPassword,  loadingChangePassword } = useSelector((state) => state.changePasswordInternalState)
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

   const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitChangePassword = () => {
    dispatch(resetChangePasswordInternal())

    const errors = validatePassword(passwordData.newPassword, passwordData.confirmPassword);
    setPasswordErrors(errors);

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
  };

  // handle loading update data employee
  const { 
    successUpdateDataEmployee,
    errorFieldUpdateDataEmployee,
    loadingUpdateDataEmployee,
  } = useSelector((state) => state.updateDataEmployeeState)

  useEffect(() => {
    if (successUpdateDataEmployee) {
      setFormDataUpdateEmployee()
      setIsUpdate()
      setPreviewUrl()
      setProfileImage()
    }
  }, [successUpdateDataEmployee])

  useEffect(() => {
    if (errorFieldUpdateDataEmployee) {
      const mappedErrors = errorFieldUpdateDataEmployee.reduce((acc, curr) => {
        const [field, message] = Object.entries(curr)[0]; 
        acc[field] = message;
        return acc;
      }, {});
      if (isMobileDeviceType) {
        window.scrollTo({
          top: 0,
          behavior: "smooth" 
        });
      }
      setErrors(mappedErrors)
      dispatch(resetUpdateDataEmployee())
    }
  }, [errorFieldUpdateDataEmployee])


  // response loading update payment methods
  const { loadingUpdatePaymentMethods } = useSelector((state) => state.updatePaymentMethodsInternalState)

  useEffect(() => {
    setSpinnerFixed(loadingUpdatePaymentMethods)
  }, [loadingUpdatePaymentMethods])

  useEffect(() => {
    setSpinnerFixed(loadingUpdateDataEmployee)
  }, [loadingUpdateDataEmployee])

  useEffect(() => {
    setSpinnerFixed(loadingChangePassword)
  }, [loadingChangePassword])
  
  // handle sidebar and elemant header yang responsice
  const { ref: headerRef, height: headerHeight } = useElementHeight();
  const { setIsOpen } = navbarInternalSlice.actions
  const { isOpen, isMobileDeviceType } = useSelector((state) => state.persisted.navbarInternal)

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

  return (
    <div className="min-h-screen bg-gray-50 relative">

      { spinnerFixed && (
        <ToastPortal>
          <SpinnerFixed colors={"fill-gray-900"}/>
        </ToastPortal>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          ref={headerRef}
          className={`fixed top-0 z-10 bg-white border-b border-gray-200 ${(isOpen && isMobileDeviceType) || spinnerFixed ? 'hidden' : ''}`}
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
                        <Settings className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h1 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-gray-800 truncate">Settings</h1>
                    </div>
                </div>

                <div className='flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0'>
                  <button 
                  onClick={() => fullscreenchange()} 
                  className="p-1.5 sm:p-2 hover:bg-gray-100 hover:scale-105 rounded-md sm:rounded-lg transition-all touch-manipulation"
                  aria-label={isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
                  >
                    {isFullScreen ? (
                      <Minimize className="w-5 h-5 sm:w-5 sm:h-5 text-gray-600" />
                    ) : (
                      <Maximize className="w-5 h-5 sm:w-5 sm:h-5 text-gray-600" />
                    )}
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

        <AccessDeniedModal 
          isOpen={showAccessDenied}
          onClose={() => setShowAccessDenied(false)}
          title='Akses Ditolak'
          message='Role anda tidak memiliki izin untuk mengakses fitur ini.'
          buttonText='Mengerti'
        />

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
                  onClick={() => dataEmployeeInternal?.position !== "Manager" ?
                    setShowAccessDenied(true) : setActiveTab('payment') }
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
                      <div
                        className={`w-20 h-20 rounded-full flex items-center justify-center overflow-hidden
                          ${errors?.Image || errors?.FileSize ? "border-2 border-red-500" : "bg-gray-200"}`}
                      >
                        {dataEmployeeInternal?.image &&
                        dataEmployeeInternal.image !== "00000000-0000-0000-0000-000000000000" &&
                        !previewUrl ? (
                          <img
                            src={`https://assets.nusas.id/${dataEmployeeInternal.image}`}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : previewUrl ? (
                          <img
                            src={previewUrl}
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
                      <p className="text-xs text-gray-400">JPG, PNG hingga 2MB</p>
                      {(errors?.Image || errors?.FileSize) && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.Image || errors.FileSize}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Nama Lengkap"
                    error={errors?.Name}
                    value={isUpdate?.name ? formDataUpdateEmployee.name : dataEmployeeInternal?.name}
                    onChange={(value) => handleProfileUpdate('name', value)}
                    icon={User}
                    placeholder="Masukkan nama lengkap"
                  />
                  
                  <InputField
                    label="Email"
                    value={isUpdate?.email ? formDataUpdateEmployee?.email : dataEmployeeInternal?.email}
                    onChange={(value) => handleProfileUpdate('email', value)}
                    type="email"
                    error={errors?.Email}
                    icon={Mail}
                    placeholder="Masukkan email anda"
                  />
                  
                  <InputField
                    label="Nomor Telepon"
                    value={isUpdate?.phone_number ? formDataUpdateEmployee?.phone_number : dataEmployeeInternal?.phone_number}
                    onChange={(value) => handleProfileUpdate('phone_number', value)}
                    isPhone={true}
                    error={errors?.PhoneNumber}
                    icon={Phone}
                    placeholder="81234567890"
                  />
                  
                  <InputField
                    label="Tanggal Lahir"
                    type="date"
                    error={errors?.DateOfBirth}
                    value={isUpdate?.date_of_birth ? dataEmployeeInternal?.date_of_birth : dataEmployeeInternal?.date_of_birth}
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
                    Ganti Password
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="space-y-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {/* Tax Settings */}
                <div>
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
                <div>                  
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
                <div>
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
                <div>
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
                <div>
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
                    onClick={() => { 
                      if (dataEmployeeInternal?.position === "Manager") {
                        handleSubmitUpdatePaymentMethods()
                      } else {
                        setShowAccessDenied(true)
                      }
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
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

const InputField = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  disabled = false, 
  icon: Icon, 
  placeholder,
  isPhone = false,
  error = null,
  maxLength
}) => {
  // Untuk input phone number dengan prefix +62
  if (isPhone) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-800">{label}</label>
        <div className="relative flex items-center">
          <div className="flex items-center bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg px-3 py-2.5 h-[44px]">
            {Icon && <Icon className="h-5 w-5 text-gray-500 mr-2" />}
            <span className="text-gray-900 font-normal text-base">+62</span>
          </div>
          <input
            type="tel"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder={placeholder}
            maxLength={maxLength || "12"}
            className={`block w-full px-4 py-2.5 border ${
              error ? 'border-red-500' : 'border-gray-300'
            } rounded-r-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 ${
              disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'text-gray-900'
            } text-base h-[44px]`}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-600">• {error}</p>}
      </div>
    );
  }

  // Input field biasa
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-800">{label}</label>
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 top-0 h-full flex items-center pointer-events-none">
            <Icon className="text-gray-400" size={18} />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`w-full px-4 py-3 border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 ${
            Icon ? 'pl-11' : ''
          } ${
            disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'
          } leading-none text-sm h-[42px]`}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">• {error}</p>}
    </div>
  );
};

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
