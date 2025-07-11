import React, { useEffect, useState } from 'react';
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
  AlertCircle
} from 'lucide-react';
import Sidebar  from '../component/sidebar';
import { fetchDataEmployeeInternal } from '../actions/get'
import { getDataEmployeeInternalSlice } from '../reducers/get'
import { ErrorAlert, SuccessAlert } from '../component/alert';
import { SpinnerFixed } from '../helper/spinner';
import { useDispatch, useSelector } from 'react-redux';
import { updateDataEmployeeInternal } from '../actions/patch'
import { updateDataEmployeeSlice } from '../reducers/patch'

export default function KasirSettings() {
  const dispatch = useDispatch
  const [alertError, setAlertError] = useState(false)
  const [successAlert, setSuccessAlert] = useState(false)
  const [spinnerFixed, setSpinnerFixed] = useState(false)

  const { resetErrorDataEmployeeInternal } = getDataEmployeeInternalSlice.actions
  const { errorDataEmployeeInternal } = useSelector((state) => state.persisted.getDataEmployeeInternal)

  const { resetUpdateDataEmployee } = updateDataEmployeeSlice.actions
  const { successUpdateDataEmployee, errorUpdateDataEmployee, loadingUpdateDataEmployee } = useSelector((state) => state.updateDataEmployeeState)

  useEffect(() => {
    setSpinnerFixed(loadingUpdateDataEmployee)
  }, [loadingUpdateDataEmployee])

  useEffect(() => {
    if (successUpdateDataEmployee) {
      setSuccessAlert(true)

      const timer = setTimeout(() => {
        setSuccessAlert(false)
        dispatch(resetUpdateDataEmployee())
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [successUpdateDataEmployee])
  

  useEffect(() => {
    if (errorDataEmployeeInternal || errorUpdateDataEmployee) {
      setAlertError(true)

      const timer = setTimeout(() => {
        setAlertError(false)
        dispatch(resetErrorDataEmployeeInternal())
        dispatch(resetUpdateDataEmployee())
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [errorDataEmployeeInternal, errorUpdateDataEmployee])


    return (
        <div className='flex'>
            <div className='w-1/10 min-w-[250px]'>
                <Sidebar activeMenu="settings"/>
            </div>

            {alertError && (
                <ErrorAlert
                  message="Terjadi kesalahan pada sistem saat memuat data customer. Kami sedang mengatasinya. Silakan coba beberapa saat lagi."
                  onClose={() => setAlertError(false)}
                />
              )}

              {successAlert && (
                <SuccessAlert message={"Data berhasil diperbaruhi"} onClose={() => setSuccessAlert(false)}/>
              )}

              { spinnerFixed && (
                <SpinnerFixed/>
              )}

            <div className='flex-1'>
                <SettingsDashboard />
            </div>
        </div>
    )
} 

const SettingsDashboard = () => {
  const dispatch = useDispatch()
  const [spinnerFixed, setSpinnerFixed] = useState(false)

  // User Profile State
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+62 812 3456 7890',
    dateOfBirth: '1990-01-15',
    gender: 'Male',
    position: 'Manager',
    image: null
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Payment Settings State
  const [paymentSettings, setPaymentSettings] = useState({
    taxRate: 10,
    cashPaymentActive: true,
    virtualAccountFees: {
      bca: 4000,
      bni: 4000,
      bri: 4000,
      mandiri: 4000,
      permata: 4000
    },
    ewalletFees: {
      gopay: 2.5,
      ovo: 2.5,
      dana: 2.5,
      linkaja: 2.5,
      shopeepay: 2.5
    }
  });

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
  const {dataEmployeeInternal, updateStatusImage} = useSelector((state) => state.persisted.getDataEmployeeInternal)

  useEffect(() => {
    if (dataEmployeeInternal) {
      dispatch(fetchDataEmployeeInternal())
    }
  }, [])


  // Handlers
 const handleProfileUpdate = (field, value) => {
    if (field === 'email' || field === 'gender' || field === 'position') return;

    dispatch(updateEmployeeInternalFields({ [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = (event) => {
      const imageData = event.target.result; 

      dispatch(updateEmployeeImage(imageData));
      dispatch(setUpdateStatusImage(true))
    };

    reader.readAsDataURL(file);
  }
};

  const handleSubmitUpdateEmployee = () => {
    const data = {
      id: dataEmployeeInternal.id,
      image: dataEmployeeInternal.image,
      name: dataEmployeeInternal.name,
      phone_number: dataEmployeeInternal.phone_number,
      date_of_birth: dataEmployeeInternal.date_of_birth,
    }
    dispatch(dispatch(data))
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
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

  const InputField = ({ label, type = 'text', value, onChange, disabled = false, icon: Icon, placeholder }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-800">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 ${
            Icon ? 'pl-11' : ''
          } ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}`}
        />
      </div>
    </div>
  );

  const PasswordField = ({ label, value, onChange, showPassword, toggleShow, placeholder }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-800">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
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
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
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

        <div className="p-4">
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
                        {dataEmployeeInternal && dataEmployeeInternal.image && !updateStatusImage ? (
                          <img
                            src={require(`../image/${dataEmployeeInternal.image}`)}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : dataEmployeeInternal && updateStatusImage && dataEmployeeInternal.image ? (
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
                    onChange={(value) => handleProfileUpdate('phoneNumber', value)}
                    icon={Phone}
                    placeholder="+62 812 3456 7890"
                  />
                  
                  <InputField
                    label="Tanggal Lahir"
                    type="date"
                    value={dataEmployeeInternal?.date_of_birth || ''}
                    onChange={(value) => handleProfileUpdate('dateOfBirth', value)}
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
                  <PasswordField
                    label="Password Saat Ini"
                    value={passwordData.currentPassword}
                    onChange={(value) => handlePasswordChange('currentPassword', value)}
                    showPassword={showPassword.current}
                    toggleShow={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                    placeholder="Masukkan password saat ini"
                  />
                  
                  <PasswordField
                    label="Password Baru"
                    value={passwordData.newPassword}
                    onChange={(value) => handlePasswordChange('newPassword', value)}
                    showPassword={showPassword.new}
                    toggleShow={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                    placeholder="Masukkan password baru"
                  />
                  
                  <PasswordField
                    label="Konfirmasi Password Baru"
                    value={passwordData.confirmPassword}
                    onChange={(value) => handlePasswordChange('confirmPassword', value)}
                    showPassword={showPassword.confirm}
                    toggleShow={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                    placeholder="Konfirmasi password baru"
                  />

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="text-blue-600 mt-0.5" size={16} />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Ketentuan Password:</p>
                        <ul className="space-y-1 text-blue-700">
                          <li>• Minimal 8 karakter</li>
                          <li>• Mengandung huruf besar dan kecil</li>
                          <li>• Mengandung angka dan simbol</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    // onClick={() => handleSave('Password')}
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
                      <label className="block text-sm font-semibold text-gray-800">Tarif Pajak (%)</label>
                      <div className="relative">
                        <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="number"
                          value={paymentSettings.taxRate}
                          onChange={(e) => setPaymentSettings(prev => ({ ...prev, taxRate: parseFloat(e.target.value) }))}
                          className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                          placeholder="0"
                          min="0"
                          max="100"
                          step="0.1"
                        />
                      </div>
                      <p className="text-sm text-gray-500">Pajak akan diterapkan pada setiap transaksi</p>
                    </div>
                  </div>
                </div>

                {/* Cash Payment Toggle */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Wallet className="text-gray-800" size={24} />
                    <h2 className="text-xl font-bold text-gray-800">Metode Pembayaran Cash</h2>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">Aktifkan Pembayaran Cash</p>
                      <p className="text-sm text-gray-600">Mengizinkan pelanggan membayar dengan uang tunai</p>
                    </div>
                    <button
                      onClick={() => setPaymentSettings(prev => ({ ...prev, cashPaymentActive: !prev.cashPaymentActive }))}
                      className={`p-1 rounded-full transition-colors ${
                        paymentSettings.cashPaymentActive ? 'text-gray-800' : 'text-gray-400'
                      }`}
                    >
                      {paymentSettings.cashPaymentActive ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                    </button>
                  </div>
                </div>

                {/* Virtual Account Fees */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Building className="text-gray-800" size={24} />
                    <h2 className="text-xl font-bold text-gray-800">Biaya Virtual Account</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(paymentSettings.virtualAccountFees).map(([bank, fee]) => (
                      <div key={bank} className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-800 capitalize">{bank.toUpperCase()}</label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="number"
                            value={fee}
                            onChange={(e) => setPaymentSettings(prev => ({
                              ...prev,
                              virtualAccountFees: {
                                ...prev.virtualAccountFees,
                                [bank]: parseInt(e.target.value)
                              }
                            }))}
                            className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                        <p className="text-xs text-gray-500">{formatCurrency(fee)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* E-wallet Fees */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard className="text-gray-800" size={24} />
                    <h2 className="text-xl font-bold text-gray-800">Biaya E-wallet (%)</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(paymentSettings.ewalletFees).map(([wallet, fee]) => (
                      <div key={wallet} className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-800 capitalize">
                          {wallet === 'shopeepay' ? 'ShopeePay' : wallet.toUpperCase()}
                        </label>
                        <div className="relative">
                          <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="number"
                            value={fee}
                            onChange={(e) => setPaymentSettings(prev => ({
                              ...prev,
                              ewalletFees: {
                                ...prev.ewalletFees,
                                [wallet]: parseFloat(e.target.value)
                              }
                            }))}
                            className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                            placeholder="0"
                            min="0"
                            max="100"
                            step="0.1"
                          />
                        </div>
                        <p className="text-xs text-gray-500">{fee}% dari total transaksi</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    // onClick={() => handleSave('Pengaturan Payment')}
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
