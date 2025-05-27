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
