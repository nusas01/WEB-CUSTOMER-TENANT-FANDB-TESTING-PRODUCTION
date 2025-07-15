
export const validateEmail = (email) => {
    // Simple regex for email validation (can be more robust if needed)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (newPassword, confirmPassword) => {
  const errors = {
    newPassword: '',
    confirmPassword: ''
  };

  const uppercaseRegex = /[A-Z]/;
  const numberRegex = /[0-9]/;
  const specialCharRegex = /[^A-Za-z0-9]/;

  // --- Validasi New Password ---
  if (!newPassword) {
    errors.newPassword = 'Password baru wajib diisi';
  } else {
    if (newPassword.length < 6) {
      errors.newPassword = 'Password minimal 6 karakter';
    } else if (newPassword.length > 50) {
      errors.newPassword = 'Password maksimal 50 karakter';
    } else if (!uppercaseRegex.test(newPassword)) {
      errors.newPassword = 'Password harus mengandung huruf kapital';
    } else if (!numberRegex.test(newPassword)) {
      errors.newPassword = 'Password harus mengandung angka';
    } else if (!specialCharRegex.test(newPassword)) {
      errors.newPassword = 'Password harus mengandung karakter spesial';
    }
  }

  // --- Validasi Confirm Password ---
  if (confirmPassword !== newPassword) {
    errors.confirmPassword = 'Konfirmasi password tidak cocok';
  }

  return errors;
};