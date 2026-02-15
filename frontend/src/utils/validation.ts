export const validation = {
  // Email validation
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Phone validation (basic, can be enhanced for specific countries)
  isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
  },

  // Password validation (minimum 6 characters)
  isValidPassword(password: string): boolean {
    return password.length >= 6;
  },

  // Name validation
  isValidName(name: string): boolean {
    return name.trim().length >= 2;
  },

  // Date validation (YYYY-MM-DD format)
  isValidDate(dateString: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  },

  // Time validation (HH:MM format)
  isValidTime(timeString: string): boolean {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timeRegex.test(timeString);
  },

  // Location validation
  isValidLocation(location: string): boolean {
    return location.trim().length >= 2;
  },
};
