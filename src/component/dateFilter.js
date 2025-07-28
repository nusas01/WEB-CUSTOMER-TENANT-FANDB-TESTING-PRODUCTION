import { useState, useEffect } from 'react';
import dayjs from "dayjs";

function FilterPanel({
  // State values
  filterMethod,
  filterStatus,
  startDate,
  endDate,
  dateError,
  
  // State handlers
  onMethodChange,
  onStatusChange, // 1. Tambahkan prop ini
  onStartDateChange,
  onEndDateChange,
  onClear,
  onApply,
  
  // UI configuration
  showMethodFilter = true,
  showStatusFilter = true,
  showDateFilter = true,

  validationErrors,
}) {
  const [isDropdownOpenMethod, setIsDropdownOpenMethod] = useState(false);
  const [isDropdownOpenStatus, setIsDropdownOpenStatus] = useState(false);
  const [isInvalidPeriode, setIsInvalidPeriode] = useState(null)

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const validateDateRange = (start, end) => {
    const startDay = dayjs(start);
    const endDay = dayjs(end);
    const diff = endDay.diff(startDay, "day");

    if (diff < 0) {
      setIsInvalidPeriode("Tanggal akhir tidak boleh sebelum tanggal awal!");
      return false;
    }

    if (diff >= 7) {
      setIsInvalidPeriode("Rentang tanggal tidak boleh lebih dari 7 hari!");
      return false;
    }

    setIsInvalidPeriode(""); // Reset error jika valid
    return true;
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    onStartDateChange(newStartDate); // Update dulu

    if (endDate && !validateDateRange(newStartDate, endDate)) {
      onEndDateChange(""); // Reset endDate jika tidak valid
    }
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    if (startDate && !validateDateRange(startDate, newEndDate)) {
      return onEndDateChange(""); // Reset endDate jika tidak valid
    }
    onEndDateChange(newEndDate); // Update jika valid
  };

  return (
    <div className="border border-gray-200 bg-white z-50 relative rounded-lg px-4 py-4 w-80 font-sans shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div
          onClick={onClear}
          className="bg-white px-3 cursor-pointer border bg-gray-100 border-gray-300 rounded-sm text-black text-sm hover:bg-gray-50"
        >
          Clear
        </div>
        <div
          onClick={onApply}
          className={`px-3 bg-blue-500 cursor-pointer text-white rounded-sm text-sm ${
            dateError ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-blue-600'
          }`}
        >
          Apply changes
        </div>
      </div>

      <p className="text-red-500 text-xs py-4">Dengan Filtering Data Tidak Realtime</p>

      <div className="space-y-4">
        {/* Method Filter */}
        {showMethodFilter && (
          <div className="relative">
            <label className="text-sm text-gray-700 mb-1 block">Payment Method</label>
            <button 
              onClick={() => setIsDropdownOpenMethod(!isDropdownOpenMethod)}
              className="border rounded-md p-2 text-gray-700 text-sm w-full text-left flex justify-between items-center hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
            >
              {filterMethod || "Select Method"}
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Tampilkan error jika ada */}
            {validationErrors.method && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.method}</p>
            )}

            {isDropdownOpenMethod && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                <div className="py-1">
                  {["Cash", "Non Cash", "All"].map((method) => (
                    <button
                      key={method}
                      onClick={() => {
                        onMethodChange(method);
                        setIsDropdownOpenMethod(false);
                      }}
                      className={`w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-blue-50 ${
                        filterMethod === method ? "font-medium" : ""
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Status Filter - Diperbaiki */}
        {showStatusFilter && (
          <div className="relative">
            <label className="text-sm text-gray-700 mb-1 block">Transaction Status</label>
            <button 
              onClick={() => setIsDropdownOpenStatus(!isDropdownOpenStatus)}
              className="border rounded-md p-2 text-gray-700 text-sm w-full text-left flex justify-between items-center hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
            >
              {filterStatus || "Select Status"}
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Tampilkan error jika ada */}
            {validationErrors.status && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.status}</p>
            )}

            {isDropdownOpenStatus && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                <div className="py-1">
                  {["On Going", "History"].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        onStatusChange(status); // 2. Gunakan onStatusChange
                        setIsDropdownOpenStatus(false);
                      }}
                      className={`w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-blue-50 ${
                        filterStatus === status ? "font-medium" : "" // 3. Bandingkan dengan filterStatus
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Date Range */}
        {showDateFilter && (
          <div>
            <label className="text-sm text-gray-700 mb-1 block">Date</label>
            <div className="flex items-center gap-2 mb-1">
              <input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                className="border rounded-md px-2 py-1.5 text-gray-700 text-sm min-w-0"
              />
              <span className="text-gray-500">-</span>
              <input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                className="border rounded-md px-2 text-gray-700 py-1.5 text-sm min-w-0"
              />
            </div>

            {/* Tampilkan error jika ada */}
            <div className="flex flex-wrap gap-x-4">
              { isInvalidPeriode && (
                <p className='text-red-500 text-xs'>{isInvalidPeriode}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


export default FilterPanel;