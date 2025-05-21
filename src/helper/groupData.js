import { format, parseISO } from 'date-fns';

// Fungsi untuk mengelompokkan data berdasarkan tanggal (tanpa jam)
export const groupByDate = (data) => {
    return data.reduce((acc, item) => {
      const dateKey = format(parseISO(item.created_at), 'yyyy-MM-dd');
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(item);
      return acc;
    }, {});
  };