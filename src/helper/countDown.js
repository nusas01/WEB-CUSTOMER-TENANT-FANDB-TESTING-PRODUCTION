import { useState, useEffect } from "react";

export const CountDown = ({ expiry }) => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const expTime = new Date(expiry);
    const diff = expTime - now;

    if (diff <= 0) return "Waktu habis";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours} jam ${minutes} menit ${seconds} detik`;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [expiry]);

  return (
    <p>{timeLeft}</p>
  );
};