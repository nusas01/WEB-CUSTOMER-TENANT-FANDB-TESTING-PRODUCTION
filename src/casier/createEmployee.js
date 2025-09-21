import React, { useState, useRef, useEffect } from 'react'
import { 
  User, Mail, Lock, Phone, Briefcase, Calendar, 
  DollarSign, Upload, Camera, Eye, EyeOff, 
  UserCheck, X 
} from 'lucide-react'
import { 
    createEmployeeSlice
} from '../reducers/post'
import {
    createEmployee
} from '../actions/post'
import {
  updateEmployee
} from '../actions/put'
import {
  updateEmployeeSlice
} from '../reducers/put'
import {
    Toast, 
    ToastPortal
} from '../component/alert'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
  fetchAllEmployees,
  fetchDataEmployeeInternal,
} from '../actions/get'

const CreateEmployee = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [toast, setToast] = useState(null)
  const [errors, setErrors] = useState({})
  const location = useLocation()
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    phone_number: '',
    position: '',
    gender: '',
    date_of_birth: '',
    salery: '',
    image: null
  })

  // handle update employee
  const employeUpdateState = location.state?.employeeState
  const {resetUpdateEmployee} = updateEmployeeSlice.actions
  const {successUpdateEmployee, errorUpdateEmployee, loadingUpdateEmployee} = useSelector((state) => state.updateEmployeeState)
  const isUpdate = Boolean(employeUpdateState?.id);

  useEffect(() => {
    if (employeUpdateState) {
        setFormData(prev => ({
        ...prev,
        ...employeUpdateState
        }));
    }
    }, [employeUpdateState]);

    useEffect(() => {
      if (successUpdateEmployee) {
        navigate('/internal/admin/employees')
        dispatch(fetchAllEmployees())
        dispatch(fetchDataEmployeeInternal())
      } 
    }, [successUpdateEmployee])

    useEffect(() => {
      if (errorUpdateEmployee) {
        setToast({
          type: "error",
          message: errorUpdateEmployee
        })
      }
    }, [errorUpdateEmployee])


    // handle submit create employee
    const {resetCreateEmployee} = createEmployeeSlice.actions
    const {
      successCreateEmployee, 
      errorCreateEmployee,
      ErrorFieldCreateEmployee, 
      loadingCreateEmployee
    } = useSelector((state) => state.createEmployeeState)

    useEffect(() => {
      if (successCreateEmployee) {
          navigate('/internal/admin/employees')
          dispatch(fetchAllEmployees())
      }
    }, [successCreateEmployee])

    useEffect(() => {
      if (errorCreateEmployee) {
          setToast({
            type: "error",
            message: errorCreateEmployee
          })
      }
    }, [errorCreateEmployee])  

    useEffect(() => {
      if (ErrorFieldCreateEmployee?.Email) {
          setErrors({email: ErrorFieldCreateEmployee?.Email})
      }
    }, [ErrorFieldCreateEmployee?.Email])

    useEffect(() => {
      if (ErrorFieldCreateEmployee?.PhoneNumber) {
        setErrors({phone_number: ErrorFieldCreateEmployee?.PhoneNumber})
      }
    }, [ErrorFieldCreateEmployee?.PhoneNumber])



    const [showPassword, setShowPassword] = useState(false)
    const [imagePreview, setImagePreview] = useState(null)
    const fileInputRef = useRef(null)

    const validMimeTypes = {
      '.jpeg': 'image/jpeg',
      '.jpg': 'image/jpeg', 
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml'
    }

    const validateField = (name, value) => {
      const newErrors = { ...errors }
      let errorMessage = null
      
      switch (name) {
        case 'name':
          if (!value.trim()) {
            errorMessage = 'Nama wajib diisi'
            newErrors.name = errorMessage
          } else if (value.length > 100) {
            errorMessage = 'Nama maksimal 100 karakter'
            newErrors.name = errorMessage
          } else {
            delete newErrors.name
          }
          break
          
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!value.trim()) {
            errorMessage = 'Email wajib diisi'
            newErrors.email = errorMessage
          } else if (!emailRegex.test(value)) {
            errorMessage = 'Format email tidak valid'
            newErrors.email = errorMessage
          } else {
            delete newErrors.email
          }
          break
          
        case 'password':
          if (!isUpdate) {
            if (!value) {
              errorMessage = 'Password wajib diisi'
              newErrors.password = errorMessage
            } else if (value.length < 6) {
              errorMessage = 'Password minimal 6 karakter'
              newErrors.password = errorMessage
            } else if (value.length > 50) {
              errorMessage = 'Password maksimal 50 karakter'
              newErrors.password = errorMessage
            } else if (!/[A-Z]/.test(value)) {
              errorMessage = 'Password harus mengandung huruf kapital'
              newErrors.password = errorMessage
            } else if (!/[0-9]/.test(value)) {
              errorMessage = 'Password harus mengandung angka'
              newErrors.password = errorMessage
            } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
              errorMessage = 'Password harus mengandung karakter khusus'
              newErrors.password = errorMessage
            } else {
              delete newErrors.password
            }
          }
          break
        
        case 'phone_number':
          if (!value.trim()) {
            errorMessage = 'Nomor telepon wajib diisi'
            newErrors.phone_number = errorMessage
          } else if (!/^\d+$/.test(value)) {
            errorMessage = 'Nomor telepon hanya boleh berisi angka'
            newErrors.phone_number = errorMessage
          } else {
            delete newErrors.phone_number
          }
          break
          
        case 'position':
          if (!value) {
            errorMessage = 'Posisi wajib dipilih'
            newErrors.position = errorMessage
          } else if (!['Manager', 'Staff'].includes(value)) {
            errorMessage = 'Posisi harus manager atau staff'
            newErrors.position = errorMessage
          } else {
            delete newErrors.position
          }
          break
          
        case 'gender':
          if (!value) {
            errorMessage = 'Jenis kelamin wajib dipilih'
            newErrors.gender = errorMessage
          } else if (!['Man', 'Women'].includes(value)) {
            errorMessage = 'Jenis kelamin harus man atau women'
            newErrors.gender = errorMessage
          } else {
            delete newErrors.gender
          }
          break
          
        case 'date_of_birth':
          if (!value) {
            errorMessage = 'Tanggal lahir wajib diisi'
            newErrors.date_of_birth = errorMessage
          } else {
            const date = new Date(value)
            if (isNaN(date.getTime())) {
              errorMessage = 'Format tanggal tidak valid'
              newErrors.date_of_birth = errorMessage
            } else {
              delete newErrors.date_of_birth
            }
          }
          break
          
        case 'salery':
          if (!value) {
            errorMessage = 'Gaji wajib diisi'
            newErrors.salery = errorMessage
          } else if (!/^\d+$/.test(value)) {
            errorMessage = 'Gaji harus berupa angka'
            newErrors.salery = errorMessage
          } else if (parseInt(value) <= 0) {
            errorMessage = 'Gaji harus lebih dari 0'
            newErrors.salery = errorMessage
          } else {
            delete newErrors.salery
          }
          break
          
        case 'image':
          if (!value) {
            errorMessage = 'Gambar wajib diupload'
            newErrors.image = errorMessage
          } else {
            delete newErrors.image
          }
          break
      }
      
      setErrors(newErrors)
      return errorMessage
    }

    const validateAllFields = () => {
      const newErrors = {}
      Object.keys(formData).forEach(key => {
        const currentErrors = { ...errors }
        let errorMessage = null
        
        const value = formData[key]
        switch (key) {
          case 'name':
            if (!value || !value.trim()) {
              errorMessage = 'Nama wajib diisi'
            } else if (value.length > 100) {
              errorMessage = 'Nama maksimal 100 karakter'
            }
            break
            
          case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!value || !value.trim()) {
              errorMessage = 'Email wajib diisi'
            } else if (!emailRegex.test(value)) {
              errorMessage = 'Format email tidak valid'
            }
            break
            
          case 'password':
            if (!isUpdate) {
              if (!value) {
                errorMessage = 'Password wajib diisi'
              } else if (value.length < 6) {
                errorMessage = 'Password minimal 6 karakter'
              } else if (value.length > 50) {
                errorMessage = 'Password maksimal 50 karakter'
              } else if (!/[A-Z]/.test(value)) {
                errorMessage = 'Password harus mengandung huruf kapital'
              } else if (!/[0-9]/.test(value)) {
                errorMessage = 'Password harus mengandung angka'
              } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                errorMessage = 'Password harus mengandung karakter khusus'
              }
            }
            break
            
          case 'phone_number':
            if (!value || !value.trim()) {
              errorMessage = 'Nomor telepon wajib diisi'
            } else if (!/^\d+$/.test(value)) {
              errorMessage = 'Nomor telepon hanya boleh berisi angka'
            }
            break
            
          case 'position':
            if (!value) {
              errorMessage = 'Posisi wajib dipilih'
            } else if (!['Manager', 'Staff'].includes(value)) {
              errorMessage = 'Posisi harus manager atau staff'
            }
            break
            
          case 'gender':
            if (!value) {
              errorMessage = 'Jenis kelamin wajib dipilih'
            } else if (!['Man', 'Women'].includes(value)) {
              errorMessage = 'Jenis kelamin harus Laki-laki atau Perempuan'
            }
            break
            
          case 'date_of_birth':
            if (!value) {
              errorMessage = 'Tanggal lahir wajib diisi'
            } else {
              const date = new Date(value)
              if (isNaN(date.getTime())) {
                errorMessage = 'Format tanggal tidak valid'
              }
            }
            break
            
          case 'salery':
            if (!value) {
              errorMessage = 'Gaji wajib diisi'
            } else if (!/^\d+$/.test(value.toString())) {
              errorMessage = 'Gaji harus berupa angka'
            } else if (parseInt(value) <= 0) {
              errorMessage = 'Gaji harus lebih dari 0'
            }
            break
            
          case 'image':
            if (!value) {
              errorMessage = 'Gambar wajib diupload'
            }
            break
        }
        
        if (errorMessage) {
          newErrors[key] = errorMessage
        }
      })
      
      setErrors(newErrors)
      return newErrors
    }

    const handleInputChange = (e) => {
      const { name, value } = e.target
      setFormData(prev => ({ ...prev, [name]: value }))
      validateField(name, value)
    }

    const handleInputSalery = (e) => {
      const raw = e.target.value.replace(/\./g, '');

      if (!/^\d*$/.test(raw)) return;

      const numericValue = parseInt(raw, 10) || 0;

      setFormData((prev) => ({
        ...prev,
        [e.target.name]: numericValue,
      }));

      if (errors[e.target.name]) {
        setErrors(prev => ({ ...prev, [e.target.name]: '' }))
      }
    }

    const handleImageChange = (e) => {
      const file = e.target.files[0]
      if (!file) return

      // Validate file type
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
      if (!Object.keys(validMimeTypes).includes(fileExtension)) {
        setErrors(prev => ({
          ...prev,
          image: 'Format file tidak didukung. Gunakan: JPEG, JPG, PNG, GIF, atau SVG'
        }))
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Ukuran file maksimal 5MB'
        }))
        return
      }

      setFormData(prev => ({ ...prev, image: file }))
      setErrors(prev => ({ ...prev, image: undefined }))

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }

    const handleSubmit = (e) => {
      if (e) e.preventDefault()
      
      // Validate all fields
      const foundErrors = validateAllFields()
      
      // Check if there are any errors
      if (Object.keys(foundErrors).length > 0) return

      // Create FormData for multipart submission
      const submitData = new FormData()
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          submitData.append(key, formData[key])
        }
      })

      if (!isUpdate) {
        dispatch(createEmployee(formData))
      } 

      if (isUpdate) {
        dispatch(updateEmployee(formData))
      }
    }

    const resetForm = () => {
      setFormData({
        id: '',
        name: '',
        email: '',
        password: '',
        phone_number: '',
        position: '',
        gender: '',
        date_of_birth: '',
        salery: '',
        image: null
      })
      setErrors({})
      setImagePreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        {toast && (
          <ToastPortal> 
              <div className='fixed top-8 left-1/2 transform -translate-x-1/2 z-[9999]'>
              <Toast 
              message={toast.message} 
              type={toast.type} 
              onClose={() => { 
              setToast(null)
              dispatch(resetCreateEmployee())
              dispatch(resetUpdateEmployee())
              }} 
              duration={3000}
              />
              </div>
          </ToastPortal>
      )}

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gray-900 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <UserCheck className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-xl font-semibold text-white">{isUpdate ? 'Perbaruhi Data Karyawan' : 'Tambah Karyawan Baru'}</h1>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Image Upload */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  {imagePreview ? (
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : formData.image ? (
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                      <img
                        src={`https://nusas-bucket.oss-ap-southeast-5.aliyuncs.com/${formData.image}`}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-100 border-4 border-white shadow-lg flex items-center justify-center">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors shadow-lg"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpeg,.jpg,.png,.gif,.svg"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {errors.image && (
                  <p className="text-red-500 text-sm text-center">{errors.image}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap *
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3 w-5 h-5 text-gray-400"/>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Masukkan nama lengkap"
                      maxLength={100}
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3 w-5 h-5 text-gray-400"/>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="nama@email.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Password */}
                { !isUpdate && (
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                      </label>
                      <div className="relative flex items-center">
                      <Lock className="absolute left-3 w-5 h-5 text-gray-400"/>
                      <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${
                          errors.password ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Minimal 6 karakter"
                          maxLength={50}
                      />
                      <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 p-1 text-gray-400 hover:text-gray-600"
                      >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      </div>
                      {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                      <p className="text-xs text-gray-500 mt-1">
                      Harus mengandung: huruf kapital, angka, dan karakter khusus
                      </p>
                  </div>
                )}

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Telepon *
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="absolute left-3 w-5 h-5 text-gray-400"/>
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${
                        errors.phone_number ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="08123456789"
                    />
                  </div>
                  {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>}
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Posisi *
                  </label>
                  <div className="relative flex items-center">
                    <Briefcase className="absolute left-3 w-5 h-5 text-gray-400"/>
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all appearance-none ${
                        errors.position ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Pilih posisi</option>
                      <option value="Manager">Manager</option>
                      <option value="Staff">Staff</option>
                    </select>
                  </div>
                  {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jenis Kelamin *
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="Man"
                        checked={formData.gender === 'Man'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-gray-900 focus:ring-gray-900"
                      />
                      <span className="text-sm text-gray-700">Laki-laki</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="Women"
                        checked={formData.gender === 'Women'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-gray-900 focus:ring-gray-900"
                      />
                      <span className="text-sm text-gray-700">Perempuan</span>
                    </label>
                  </div>
                  {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Lahir *
                  </label>
                  <div className="relative flex items-center">
                    <Calendar className="absolute left-3 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${
                        errors.date_of_birth ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.date_of_birth && <p className="text-red-500 text-sm mt-1">{errors.date_of_birth}</p>}
                </div>

                {/* Salary */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gaji *
                  </label>
                  <div className="relative flex items-center">
                    <DollarSign className="absolute left-3 w-5 h-5 text-gray-400" />
                    <input
                      name="salery"
                      type="text"
                      value={formData.salery.toLocaleString("id-ID")}
                      onChange={handleInputSalery}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${
                        errors.salery ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="5.000.000"
                      min="0"
                    />
                  </div>
                  {errors.salery && <p className="text-red-500 text-sm mt-1">{errors.salery}</p>}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className='px-6 py-3 rounded-lg font-medium bg-white hover:bg-gray-300 border border-gray-900 text-gray-9000 transition duration-300'
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={loadingCreateEmployee}
                  className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
                >
                  {loadingCreateEmployee || loadingUpdateEmployee ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <span>Simpan Karyawan</span>
                    </>
                  )}
                </button>
                
                { !isUpdate && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 sm:flex-none sm:px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

export default CreateEmployee