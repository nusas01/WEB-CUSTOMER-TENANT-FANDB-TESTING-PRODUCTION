
export const validateEmail = (email) => {
    // Simple regex for email validation (can be more robust if needed)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

