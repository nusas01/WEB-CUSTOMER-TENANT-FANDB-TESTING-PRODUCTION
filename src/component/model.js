import React from "react";

const ModalConfirm = ({ isOpen, onClose, onConfirm, message }) => {
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

export default ModalConfirm;
