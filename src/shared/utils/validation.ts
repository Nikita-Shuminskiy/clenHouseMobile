// Утилиты для валидации
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Пароль должен содержать минимум 8 символов');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Пароль должен содержать заглавную букву');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Пароль должен содержать строчную букву');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Пароль должен содержать цифру');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[1-9]\d{10,14}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateRussianPhone = (phone: string): { isValid: boolean; error?: string } => {
  // Убираем все символы кроме цифр
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Проверяем длину (должно быть 10 цифр для российского номера без кода страны)
  if (cleanPhone.length === 0) {
    return { isValid: false, error: 'Введите номер телефона' };
  }
  
  if (cleanPhone.length < 10) {
    return { isValid: false, error: 'Введите полный номер телефона' };
  }
  
  if (cleanPhone.length > 10) {
    return { isValid: false, error: 'Номер телефона слишком длинный' };
  }
  
  // Проверяем, что первая цифра не 0 (недопустимые коды операторов)
  if (cleanPhone[0] === '0') {
    return { isValid: false, error: 'Некорректный код оператора' };
  }
  
  return { isValid: true };
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

