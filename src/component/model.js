import React from "react";
import { useOutsideClick } from "../helper/helper";
import { X, AlertTriangle } from "lucide-react"
import { useRef } from "react";

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
    <div className="fixed inset-0 z-[500] flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-lg shadow-xl max-w-sm w-full mx-4"
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
  );
};
