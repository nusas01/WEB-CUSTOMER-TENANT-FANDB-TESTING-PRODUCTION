import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const FormatISODate = (isoDate) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(isoDate));
  };

export const FormatDate = (dateString) => {
  const date = new Date(dateString);

  const padTo2Digits = (num) => num.toString().padStart(2, '0');

  const year = date.getFullYear();
  const month = padTo2Digits(date.getMonth() + 1); // Bulan dimulai dari 0
  const day = padTo2Digits(date.getDate());
  const hours = padTo2Digits(date.getHours());
  const minutes = padTo2Digits(date.getMinutes());
  const seconds = padTo2Digits(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Komponen filter tanggal fleksibel
 *
 * @param {string|null} startDate - Tanggal awal dalam format YYYY-MM-DD
 * @param {string|null} endDate - Tanggal akhir dalam format YYYY-MM-DD
 * @param {function} setStartDate - Fungsi untuk set tanggal awal
 * @param {function} setEndDate - Fungsi untuk set tanggal akhir
 * @param {number} maxRangeDays - Maksimum hari yang diizinkan (default: 7)
 */
export const DateFilterComponent = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  maxRangeDays = 7,
}) => {
  const dispatch = useDispatch();
  const [isDateRangeInvalid, setIsDateRangeInvalid] = useState(false);

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    // Validasi hanya dilakukan jika endDate sudah diisi
    if (endDate && !validateDateRange(newStartDate, endDate, maxRangeDays, setIsDateRangeInvalid)) return;
    dispatch(setStartDate(newStartDate));
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    if (startDate && !validateDateRange(startDate, newEndDate, maxRangeDays, setIsDateRangeInvalid)) return;
    dispatch(setEndDate(newEndDate));
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-4 items-end">
        {/* Start Date */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            value={startDate || ""}
            onChange={handleStartDateChange}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* End Date */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            value={endDate || ""}
            onChange={handleEndDateChange}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {isDateRangeInvalid && (
        <div className="text-xs text-red-500 absolute">
          Tanggal tidak valid. Maksimal {maxRangeDays} hari dan tidak boleh lebih.
        </div>
      )}
    </div>
  );
};

export const validateDateRange = (start, end, maxRangeDays, setIsDateRangeInvalid) => {
    const startDay = dayjs(start);
    const endDay = dayjs(end);
    const diff = endDay.diff(startDay, "day");

    if (diff < 0) {
      toast.error("Tanggal akhir tidak boleh sebelum tanggal awal!");
      setIsDateRangeInvalid(true);
      return false;
    }

    if (diff >= maxRangeDays) {
      toast.warning(`Rentang tanggal tidak boleh lebih dari ${maxRangeDays} hari!`);
      setIsDateRangeInvalid(true);
      return false;
    }

    setIsDateRangeInvalid(false);
    return true;
  };