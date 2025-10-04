import React, { useState, useEffect } from "react";
import { useOutsideClick } from "../helper/helper";
import { 
  X, 
  AlertTriangle, 
  Trash2,
  Store,
  MapPin,
  ChevronDown,
  Phone,
  Heart,
  Star,
  Share2,
  Clock,
} from "lucide-react"
import { useRef } from "react";
import {
  storeInfoCustomerSlice
} from "../reducers/reducers"
import { useDispatch, useSelector } from "react-redux";

export const ModalConfirm = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-lg font-bold text-gray-800">Are you sure?</h2>
        <p className="text-gray-600 mt-2">{message}</p>

        {/* Tombol Aksi */}
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};


export const AccessDeniedModal = ({
  isOpen,
  onClose,
  title = "Akses Ditolak",
  message = "Anda tidak memiliki izin untuk mengakses fitur ini. Silakan hubungi administrator.",
  buttonText = "Mengerti"
}) => {
  const modalRef = useRef(null);

  // panggil custom hook
  useOutsideClick({ ref: modalRef, callback: onClose, isActive: isOpen });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex bg-gray-900 bg-opacity-50 items-center justify-center">
      {/* Backdrop - perlu positioning yang benar */}
      <div className="shadow-sm w-full max-w-md">
        {/* Modal Content - perlu z-index lebih tinggi dari backdrop */}
        <div
          ref={modalRef}
          className="relative z-10 bg-white rounded-lg shadow-xl max-w-sm w-full mx-4"
        >
          <div className="p-6">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
            
            {/* Content */}
            <div className="flex flex-col items-center text-center">
              <div className="flex-shrink-0 w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-sm text-gray-600 mb-6">{message}</p>
              <button
                onClick={onClose}
                className="w-full px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                {buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DeleteEmployeeConfirmation = ({ 
  employeeId, 
  onConfirm, 
  onCancel 
}) => {
  return (
    <div className="fixed inset-0 z-[9999] flex bg-gray-900 bg-opacity-50 items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Konfirmasi Penghapusan
            </h3>
          </div>
          <button 
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
          </div>
          
          <p className="text-gray-700 text-center mb-2">
            Anda akan menghapus data karyawan dengan ID:
          </p>
          <div className="bg-gray-100 rounded-lg py-3 px-4 mb-4">
            <p className="text-gray-900 font-mono text-center font-bold text-lg">
              {employeeId}
            </p>
          </div>
          <p className="text-red-600 text-center text-sm">
            Jika sudah terhapus tindakan ini tidak dapat dibatalkan!
          </p>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Hapus Karyawan
          </button>
        </div>
      </div>
    </div>
  );
};

export const ModernStoreBrand = ({ 
  storeName = "Cafe Nusantara",
  location = "Jakarta Selatan",
  isOpen = true,
  rating = 4.8,
  totalReviews = 1234,
  phone = "+62 812-3456-7890"
}) => {
  const dispatch = useDispatch()

  const {setStoreInfoCustomer:setIsMinimized} = storeInfoCustomerSlice.actions
  const {statusStoreInfo:isMinimized} = useSelector((state) => state.persisted.storeInfoCustomer)

  return (
    <div 
      className={`fixed top-4 left-4 z-10 pt-20 pl-3 transition-all duration-500 pointer-events-none`}
    >
      {/* Main Brand Container */}
      <div className="relative group">
        {/* Main Card - pointer-events-auto untuk bisa diklik */}
        <div 
          className={`relative bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl overflow-hidden transition-all duration-500 pointer-events-auto ${
            isMinimized 
              ? 'rounded-2xl w-[80px]' 
              : 'rounded-3xl w-[300px]'
          }`}
        >
          {/* Decorative Pattern Overlay */}
          {!isMinimized && (
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                backgroundSize: '24px 24px',
                color: '#10b981'
              }} />
            </div>
          )}

          {/* Top Gradient Bar */}
          <div className="h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
          </div>

          {/* MINIMIZED VIEW */}
          {isMinimized ? (
            <div className="relative p-4">
              <button
                onClick={() => dispatch(setIsMinimized(false))}
                className="w-full flex flex-col items-center gap-2 group/expand"
                aria-label="Expand store info"
              >
                {/* Store Icon Minimized */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl blur-md opacity-40" />
                  <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-2.5 rounded-xl transform group-hover/expand:scale-110 group-hover/expand:rotate-12 transition-all duration-300">
                    <Store className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                </div>

                {/* Status Indicator */}
                {isOpen && (
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </div>
                )}

                {/* Expand Icon */}
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover/expand:text-green-600 transition-colors rotate-90 group-hover/expand:translate-x-1" strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            /* EXPANDED VIEW */
            <div className="relative p-5">
              {/* Minimize Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(setIsMinimized(true));
                }}
                className="absolute top-3 right-3 z-10 p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-200 transition-all duration-300 hover:scale-110 active:scale-95 group/minimize"
                aria-label="Minimize"
              >
                <ChevronDown className="w-3.5 h-3.5 text-gray-600 group-hover/minimize:text-gray-800 transition-colors -rotate-90" strokeWidth={2.5} />
              </button>

              {/* Header Section */}
              <div className="flex items-start gap-3 mb-4 pr-8">
                {/* Store Icon */}
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl blur-md opacity-40" />
                  <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-2.5 rounded-xl transform group-hover:scale-105 transition-all duration-300">
                    <Store className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                </div>

                {/* Store Name & Info */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg font-bold text-gray-900 mb-1 truncate">
                    {storeName}
                  </h1>
                  
                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-gray-600 mb-2">
                    <MapPin className="w-3 h-3 text-green-500 flex-shrink-0" strokeWidth={2.5} />
                    <span className="text-xs truncate">{location}</span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-gradient-to-r from-amber-50 to-yellow-50 px-2 py-0.5 rounded-lg border border-amber-200/50">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" strokeWidth={2.5} />
                      <span className="text-xs font-bold text-amber-700">{rating}</span>
                    </div>
                    <span className="text-[10px] text-gray-500">({totalReviews.toLocaleString()})</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                <div className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all duration-300 ${
                  isOpen
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200'
                    : 'bg-gradient-to-r from-red-50 to-orange-50 text-red-700 border border-red-200'
                }`}>
                  <Clock className="w-3 h-3" strokeWidth={2.5} />
                  <span className="text-[11px]">{isOpen ? 'Buka' : 'Tutup'}</span>
                  {isOpen && (
                    <div className="absolute -right-0.5 -top-0.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Opening Hours */}
                <div className="text-[10px] text-gray-600 flex items-center gap-1">
                  <span className="font-medium">10:00</span>
                  <span className="text-gray-400">-</span>
                  <span className="font-medium">22:00</span>
                </div>
              </div>

              {/* Contact Button */}
              <a
                href={`tel:${phone}`}
                onClick={(e) => e.stopPropagation()}
                className="group/contact relative w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/contact:translate-x-[100%] transition-transform duration-700" />
                
                <Phone className="w-4 h-4 relative z-10 group-hover/contact:rotate-12 transition-transform duration-300" strokeWidth={2.5} />
                <span className="relative z-10">Hubungi Toko</span>
              </a>

              {/* Info Badge */}
              <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                  <span>Verified Store</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info Tooltip - only show when minimized */}
        {isMinimized && (
          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Klik untuk info toko
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};