import React, { useEffect, useState, useRef } from 'react';
import { 
  Users, 
  Hash,
  Key,
  ChevronUp,
  Lock,
  EyeOff,
  Eye,
  X,
  Check,
  Plus, 
  Edit3, 
  Trash2, 
  Menu,
  Info,
  Phone, 
  Shield,
  UserCheck,
  Clock,
  Calendar,
  User,
  Mail,
  DollarSign,
  Search,
  ChevronDown,
  Settings,
  Maximize,
  Minimize,
} from 'lucide-react';
import Sidebar from '../component/sidebar';
import { useElementHeight, useFullscreen, formatDateTime } from '../helper/helper';
import { useDispatch, useSelector } from 'react-redux';
import { navbarInternalSlice } from '../reducers/reducers';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Toast, 
  ToastPortal
} from '../component/alert'
import {
  getEmployeesSlice,
} from '../reducers/get'
import {
  updateEmployeeSlice,
} from '../reducers/put'
import {
  createEmployeeSlice
} from '../reducers/post'
import {
  changePasswordEmployee
} from '../actions/patch'
import {
  changePasswordEmployeeSlice
} from '../reducers/patch'
import {
  deleteEmployee
} from '../actions/delete'
import {
  deleteEmployeeSlice
} from '../reducers/delete'
import { 
  DeleteEmployeeConfirmation,
} from '../component/model';
import { 
  fetchAllEmployees,
} from '../actions/get';
import { AccessDeniedModal } from '../component/model';

const EmployeeManagement = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation();
    const [sortOption, setSortOption] = useState('name');
    const [roleFilter, setRoleFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [toast, setToast] = useState(null);
    const [error, setError] = useState({});
    const [showAccessDenied, setShowAccessDenied] = useState(false);

    // Fullscreen functionality
    const contentRef = useRef(null);
    const { isFullScreen, toggleFullScreen } = useFullscreen(contentRef);

    const { setIsOpen } = navbarInternalSlice.actions
    const { isOpen, isMobileDeviceType } = useSelector((state) => state.persisted.navbarInternal)

    const { ref: headerRef, height: headerHeight } = useElementHeight();

    // data employee
    const {dataEmployeeInternal} = useSelector((state) => state.persisted.getDataEmployeeInternal)
    useEffect(() => {
      if (dataEmployeeInternal?.position === "Staff") {
        setShowAccessDenied(true)
      }
    }, [dataEmployeeInternal])

    // Data employee store
    const {resetErrorGetEmployees} = getEmployeesSlice.actions
    const {employees, loadingGetEmployees, errorGetEmployees} = useSelector((state) => state.persisted.getEmployee)

    useEffect(() => {
        if (employees.length === 0) {
        dispatch(fetchAllEmployees())
        }
    }, [])

    useEffect(() => {
        if (errorGetEmployees) {
        setToast({
            type: "error",
            message: errorGetEmployees
        })
        }
    }, [errorGetEmployees])

    // Handle response success add employee
    const {resetCreateEmployee} = createEmployeeSlice.actions
    const {successCreateEmployee} = useSelector((state) => state.createEmployeeState)
    useEffect(() => {
        if (successCreateEmployee) {
            setToast({
                type: "success",
                message: successCreateEmployee
            })
            dispatch(fetchAllEmployees())
        } 
    }, [successCreateEmployee])
    
    // Handle response success update employee
    const {resetUpdateEmployee} = updateEmployeeSlice.actions
    const {successUpdateEmployee} = useSelector((state) => state.updateEmployeeState)
    useEffect(() => {
        if (successUpdateEmployee) {
            setToast({
                type: "success",
                message: successUpdateEmployee
            })
        }
    }, [successUpdateEmployee])

    // Handle change password employee
    const [expandedPassword, setExpandedPassword] = useState(null);
    const [passwordData, setPasswordData] = useState({});
    const [showPassword, setShowPassword] = useState({});
    const {resetChangePasswordEmployee} = changePasswordEmployeeSlice.actions
    const {successChangePasswordEmployee, errorChangePasswordEmployee, errorFieldsChangePasswordEmployee, loadingChangePasswordEmployee} = useSelector((state) => state.changePasswordEmployeeState)

    useEffect(() => {
        if (successChangePasswordEmployee) {
        setToast({
            type: "success",
            message: successChangePasswordEmployee
        })
        setPasswordData({});
        setExpandedPassword(null);
        setShowPassword({})
        }
    }, [successChangePasswordEmployee])

    useEffect(() => {
        if (errorChangePasswordEmployee) {
        setToast({
            type: "error",
            message: errorChangePasswordEmployee
        })
        }
    }, [errorChangePasswordEmployee])

    const togglePasswordForm = (employeeId) => {
        if (expandedPassword === employeeId) {
        setExpandedPassword(null);
        // Reset form data when closing
        setPasswordData(prev => ({
            ...prev,
            [employeeId]: { newPassword: '', confirmPassword: '' }
        }));
        } else {
        setExpandedPassword(employeeId);
        // Initialize form data
        if (!passwordData[employeeId]) {
            setPasswordData(prev => ({
            ...prev,
            [employeeId]: { newPassword: '', confirmPassword: '' }
            }));
        }
        }
    };

    const handlePasswordChange = (employeeId, field, value) => {
        setPasswordData(prev => ({
        ...prev,
        [employeeId]: {
            ...prev[employeeId],
            [field]: value
        }
        }));
    };

    const togglePasswordVisibility = (employeeId, field) => {
        setShowPassword(prev => ({
        ...prev,
        [`${employeeId}-${field}`]: !prev[`${employeeId}-${field}`]
        }));
    };

    const handlePasswordUpdate = (employeeId) => {
        const data = passwordData[employeeId];
        
        // 1. Cek wajib diisi
        if (!data.newPassword || !data.confirmPassword) {
        setError(prev => ({
            ...prev,
            change_Password: 'Semua field password harus diisi',
        }));
        return;
        }

        // 2. Cek password sama
        if (data.newPassword !== data.confirmPassword) {
        setError(prev => ({
            ...prev,
            change_Password: 'Password baru dan konfirmasi password tidak cocok',
        }));
        return;
        }

        const newPass = data.newPassword;

        // 3. Cek panjang password
        if (newPass.length < 6) {
        setError(prev => ({
            ...prev,
            change_Password: 'Password minimal 6 karakter',
        }));
        return;
        }
        if (newPass.length > 50) {
        setError(prev => ({
            ...prev,
            change_Password: 'Password maksimal 50 karakter',
        }));
        return;
        }

        // 4. Cek minimal 1 huruf kapital
        if (!/[A-Z]/.test(newPass)) {
        setError(prev => ({
            ...prev,
            change_Password: 'Password harus mengandung minimal 1 huruf kapital',
        }));
        return;
        }

        // 5. Cek minimal 1 angka
        if (!/[0-9]/.test(newPass)) {
        setError(prev => ({
            ...prev,
            change_Password: 'Password harus mengandung minimal 1 angka',
        }));
        return;
        }

        // 6. Cek minimal 1 karakter unik (simbol)
        if (!/[^A-Za-z0-9]/.test(newPass)) {
        setError(prev => ({
            ...prev,
            change_Password: 'Password harus mengandung minimal 1 simbol',
        }));
        return;
        }

        setError({})
        dispatch(changePasswordEmployee({id: employeeId, password: data.newPassword}))
    };

    // Handle delete employee store
    const [deleteEmployeeId, setDeleteEmployeeId] = useState(null)
    const {resetDeleteEmployee} = deleteEmployeeSlice.actions
    const {successDeleteEmployee, errorDeleteEmployee, loadingDeleteEmployee} = useSelector((state) => state.deleteEmployeeState)

    const handleDeleteEmploye = () => {
        dispatch(deleteEmployee(deleteEmployeeId))
    }

    useEffect(() => {
        if (successDeleteEmployee) {
            setToast({
                type: "success",
                message: successDeleteEmployee
            })
            setDeleteEmployeeId(null)
            dispatch(fetchAllEmployees())
        }
    }, [successDeleteEmployee])

    useEffect(() => {
        if (errorDeleteEmployee) {
        setToast({
            type: "error",
            message: errorDeleteEmployee
        })
        setDeleteEmployeeId(null)
        }
    }, [errorDeleteEmployee])

    const calculateAge = (dateOfBirth) => {
        const today = new Date();
        const birth = new Date(dateOfBirth);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
        }
        return age;
    };

    // Filter employees based on search and filter criteria
    const filteredEmployees = employees
        .filter(emp => {
        // Role filter
        const matchesRole = roleFilter === 'all' || emp.position === roleFilter;
        
        // Search filter (name or email)
        const matchesSearch = searchQuery === '' || 
            emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesRole && matchesSearch;
        })
        .sort((a, b) => {
        if (sortOption === 'name') return a.name.localeCompare(b.name);
        if (sortOption === 'position') return a.position.localeCompare(b.position);
        if (sortOption === 'salary') return b.salery - a.salery; // Fixed: salery not salary
        return 0;
        });
    
    const managerCount = employees.filter(emp => emp.position === 'Manager').length;
    const staffCount = employees.filter(emp => emp.position === 'Staff').length;

    return (
        <div className='flex relative bg-gray-50'>
        {toast && (
            <ToastPortal> 
            <div className='fixed top-8 left-1/2 transform -translate-x-1/2 z-[9999]'>
                <Toast 
                message={toast.message} 
                type={toast.type} 
                onClose={() => { 
                    setToast(null)
                    dispatch(resetErrorGetEmployees())
                    dispatch(resetUpdateEmployee())
                    dispatch(resetCreateEmployee())
                    dispatch(resetChangePasswordEmployee())
                    dispatch(resetDeleteEmployee())
                }} 
                duration={5000}
                />
            </div>
            </ToastPortal>
        )}

        {/* Sidebar - Fixed width */}
        {(!isFullScreen && (!isMobileDeviceType || (isOpen && isMobileDeviceType))) && (
            <div className="w-1/10 z-50 min-w-[290px]">
            <Sidebar 
                activeMenu={"Employees"}
            />
            </div>
        )}

        {/* Main Content */}
        <div
            ref={contentRef}
            className={`flex-1 bg-gray-50 ${isFullScreen ? 'w-full h-screen overflow-y-auto' : ''}`}
        >
            <div className='relative'>
                {/* Header */}
                <div
                ref={headerRef}
                className={`fixed top-0 z-10 bg-white border-b border-gray-200 ${(isOpen && isMobileDeviceType) ? 'hidden' : ''}`}
                style={{
                    left: (isFullScreen || isMobileDeviceType) ? '0' : '288px',
                    width: isMobileDeviceType ? '100%' : (isFullScreen ? '100%' : 'calc(100% - 288px)'),
                    height: '64px'
                }}
                >
                    <div className="h-full mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
                        <div className="flex items-center justify-between h-full gap-2 sm:gap-4">
                        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0 flex-1">
                            <div className="w-11 h-11 bg-gradient-to-br from-gray-800 to-gray-900 rounded-md flex items-center justify-center shadow-lg flex-shrink-0">
                            <Users className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                            <h1 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-gray-800 truncate">Employee</h1>
                            </div>
                        </div>

                        <div className='flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0'>
                            <button 
                            onClick={() => toggleFullScreen()} 
                            className="p-1.5 sm:p-2 hover:bg-gray-100 hover:scale-105 rounded-md sm:rounded-lg transition-all touch-manipulation"
                            aria-label={isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
                            >
                            {isFullScreen ? ( 
                                <Minimize className="w-5 h-5 sm:w-5 sm:h-5 text-gray-600" />
                            ) : ( 
                                <Maximize className="w-5 h-5 sm:w-5 sm:h-5 text-gray-600" />
                            )}
                            </button>
                            <button
                            onClick={() => navigate('/internal/admin/employee/create')}
                            className="flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-1.5 rounded-lg transition-colors duration-200"
                            >
                            <Plus className="w-5 h-5" />
                            <span>Add Employee</span>
                            </button>
                            <button 
                            className="p-1.5 sm:p-2 lg:p-3 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-105 touch-manipulation" 
                            onClick={() => navigate('/internal/admin/settings')}
                            aria-label="Settings"
                            >
                            <Settings className="w-5 h-5 sm:w-5 sm:h-5 text-gray-600" />
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
                    onClose={() => setShowAccessDenied(true)}
                    title='Akses Ditolak'
                    message='Role anda tidak memiliki izin untuk mengakses fitur ini.'
                    buttonText='Mengerti'
                />

                {deleteEmployeeId && (
                    <DeleteEmployeeConfirmation 
                    employeeId={deleteEmployeeId}
                    onConfirm={() => handleDeleteEmploye()} 
                    onCancel={() => setDeleteEmployeeId(null)}
                    />
                )}

                <div className='mx-auto space-y-8 p-4' style={{marginTop: headerHeight}}>
                    {/* Employee Access Management */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                        {/* Header */}
                        <div className="bg-gray-900 px-6 py-4 text-white">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-4">
                            <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                <Users size={28} className="text-gradient-to-r from-green-500 to-emerald-500" />
                            </div>
                            <div>
                                <h2 className="text-xl md:text-xl font-bold">Access Management</h2>
                                <p className="text-blue-100">Control permissions and roles</p>
                            </div>
                            </div>
                        </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 mx-6 mt-6 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 shadow-lg border border-blue-100 flex items-center gap-4">
                                <div className="bg-blue-100 p-3 rounded-lg">
                                <Users size={24} className="text-blue-600" />
                                </div>
                                <div>
                                <p className="text-gray-500 text-sm">Total Employees</p>
                                <p className="text-2xl font-bold text-gray-800">{employees.length}</p>
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-5 shadow-lg border border-green-100 flex items-center gap-4">
                                <div className="bg-green-100 p-3 rounded-lg">
                                <Shield size={24} className="text-green-600" />
                                </div>
                                <div>
                                <p className="text-gray-500 text-sm">Managers</p>
                                <p className="text-2xl font-bold text-gray-800">{managerCount}</p>
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-5 shadow-lg border border-purple-100 flex items-center gap-4">
                                <div className="bg-purple-100 p-3 rounded-lg">
                                <UserCheck size={24} className="text-purple-600" />
                                </div>
                                <div>
                                <p className="text-gray-500 text-sm">Staff</p>
                                <p className="text-2xl font-bold text-gray-800">{staffCount}</p>
                                </div>
                            </div>
                        </div>

                        {/* Employee List */}
                        <div className="p-6">
                        {/* Filters and Search */}
                        <div className="flex flex-col md:flex-row justify-between md:justify-end gap-4 mb-6">
                            <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={18} className="text-gray-400" />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Search employees..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            </div>
                            
                            <div className="flex gap-3 flex-wrap">
                            <div className="relative">
                                <select 
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-10"
                                >
                                <option value="all">All Roles</option>
                                <option value="Manager">Manager</option>
                                <option value="Staff">Staff</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <ChevronDown size={18} className="text-gray-500" />
                                </div>
                            </div>
                            
                            <div className="relative">
                                <select 
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-10"
                                >
                                <option value="name">Sort by Name</option>
                                <option value="position">Sort by Position</option>
                                <option value="salary">Sort by Salary</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <User size={18} className="text-gray-500" />
                                </div>
                            </div>
                            </div>
                        </div>
                        
                        {/* Employee Cards */}
                        <div className="space-y-4">
                            {filteredEmployees.map((employee) => (
                            <div key={employee.id} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200 shadow-sm transition-all hover:shadow-md hover:border-blue-200">
                                {/* Main Card Content */}
                                <div className="">
                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                                    <div className="flex items-start gap-4 flex-1">
                                    {/* Avatar */}
                                    <div className="relative">
                                        {employee.image && employee.image !== "" ? (
                                        <img 
                                            src={`https://nusas-bucket.oss-ap-southeast-5.aliyuncs.com/${employee.image}`} 
                                            alt={employee.name}
                                            className="w-16 h-16 rounded-full object-cover shadow-md"
                                        />
                                        ) : (
                                        <div className="bg-gray-900 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                                            {employee.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        )}
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                                    </div>
                                    
                                    {/* Employee Info */}
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                                        <h3 className="text-lg font-semibold text-gray-900">{employee.name}</h3>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 w-fit ${
                                            employee.position === 'Manager' 
                                            ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                                            : 'bg-blue-100 text-blue-700 border border-blue-200'
                                        }`}>
                                            {employee.position === 'Manager' ? <Shield size={14} /> : <UserCheck size={14} />}
                                            {employee.position}
                                        </span>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Hash size={14} className="text-gray-900" />
                                            ID: {employee.id}
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Mail size={14} className="text-gray-900" />
                                            {employee.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Phone size={14} className="text-gray-900" />
                                            {employee.phone_number}
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <User size={14} className="text-gray-900" />
                                            {employee.gender}, {calculateAge(employee.date_of_birth)} tahun
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <DollarSign size={14} className="text-gray-900" />
                                            Rp {employee.salery.toLocaleString("id-ID")}
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Calendar size={14} className="text-gray-900" />
                                            Lahir: {formatDateTime(employee.date_of_birth)}
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Clock size={14} className="text-gray-900" />
                                            Bergabung: {formatDateTime(employee.created_at)}
                                        </div>
                                        </div>
                                    </div>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="gap-2 flex lg:flex-col lg:space-y-0.1">
                                    <button 
                                        className="bg-gray-900 lg:w-full hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-md"
                                        onClick={() => navigate('/internal/admin/employee/create', {state: {employeeState: employee}})}
                                    >
                                        <Edit3 size={16} />
                                        Edit
                                    </button>
                                    
                                    <button 
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-md"
                                        onClick={() => togglePasswordForm(employee.id)}
                                    >
                                        <Key size={16} />
                                        Change Password
                                        {expandedPassword === employee.id ? 
                                        <ChevronUp size={16} /> : 
                                        <ChevronDown size={16} />
                                        }
                                    </button>
                                    
                                    <button 
                                        className="bg-red-600 lg:w-full hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-md"
                                        onClick={() => setDeleteEmployeeId(employee.id)}
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                    </div>
                                </div>
                                </div>
                                
                                {/* Password Update Form */}
                                {expandedPassword === employee.id && (
                                <div className="border-t border-gray-200 bg-gray-50/80 mt-4">
                                    <div className="p-5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                        <Lock size={16} className="text-white" />
                                        </div>
                                        <div>
                                        <h4 className="text-lg font-semibold text-gray-900">Update Password</h4>
                                        <p className="text-sm text-gray-600">Change password for {employee.name}</p>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* New Password */}
                                            <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">New Password</label>
                                            <div className="relative">
                                                <input
                                                type={showPassword[`${employee.id}-new`] ? 'text' : 'password'}
                                                placeholder="Enter new password"
                                                className="w-full pl-4 pr-12 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                value={passwordData[employee.id]?.newPassword || ''}
                                                onChange={(e) => handlePasswordChange(employee.id, 'newPassword', e.target.value)}
                                                />
                                                <button
                                                type="button"
                                                className="absolute right-3 inset-y-0 flex items-center text-gray-500 hover:text-gray-700"
                                                onClick={() => togglePasswordVisibility(employee.id, 'new')}
                                                >
                                                {showPassword[`${employee.id}-new`] ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                            </div>

                                            {/* Confirm Password */}
                                            <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                                            <div className="relative">
                                                <input
                                                type={showPassword[`${employee.id}-confirm`] ? 'text' : 'password'}
                                                placeholder="Confirm new password"
                                                className="w-full pl-4 pr-12 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                value={passwordData[employee.id]?.confirmPassword || ''}
                                                onChange={(e) => handlePasswordChange(employee.id, 'confirmPassword', e.target.value)}
                                                />
                                                <button
                                                type="button"
                                                className="absolute right-3 inset-y-0 flex items-center text-gray-500 hover:text-gray-700"
                                                onClick={() => togglePasswordVisibility(employee.id, 'confirm')}
                                                >
                                                {showPassword[`${employee.id}-confirm`] ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                            </div>
                                        </div>

                                        {error.change_Password && (
                                            <p className="text-red-500 text-sm mt-2">{error.change_Password}</p>
                                        )}

                                        <PasswordInfo />
                                        </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex justify-end gap-3 mt-4">
                                        <button
                                        className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center gap-2 transition-colors"
                                        onClick={() => togglePasswordForm(employee.id)}
                                        disabled={loadingChangePasswordEmployee}
                                        >
                                        <X size={16} />
                                        Cancel
                                        </button>
                                        <button
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() => handlePasswordUpdate(employee.id)}
                                        disabled={loadingChangePasswordEmployee}
                                        >
                                        {loadingChangePasswordEmployee ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <Check size={16} />
                                        )}
                                        {loadingChangePasswordEmployee ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </div>
                                    </div>
                                </div>
                                )}
                            </div>
                            ))}
                        </div>
                        
                        {/* Empty state */}
                        {filteredEmployees.length === 0 && (
                            <div className="text-center py-12">
                            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <User size={24} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No employees found</h3>
                            <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
                            <button
                                onClick={() => navigate('/internal/admin/employee/create')}
                                className="inline-flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Add Employee</span>
                            </button>
                            </div>
                        )}

                        {/* Loading state */}
                        {loadingGetEmployees && (
                            <div className="text-center py-12">
                            <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">Loading employees...</h3>
                            <p className="text-gray-500">Please wait while we fetch employee data</p>
                            </div>
                        )}
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
};

export default EmployeeManagement;

const PasswordInfo = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
      <div className="flex items-start gap-2">
        <Info size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Kriteria Password:</p>
          <p className="text-xs text-gray-600 leading-relaxed">
            Password harus terdiri dari 6-50 karakter, minimal 1 huruf kapital, 1 angka, dan 1 simbol (!@#$%^&*).
          </p>
        </div>
      </div>
    </div>
  );
};