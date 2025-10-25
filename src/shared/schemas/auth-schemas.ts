import * as yup from 'yup';

export const resetPasswordRequestSchema = yup.object({
  email: yup
    .string()
    .email('Некорректный формат email')
    .required('Email обязателен'),
});

export const verifyResetCodeSchema = yup.object({
  email: yup
    .string()
    .email('Некорректный формат email')
    .required('Email обязателен'),
  code: yup
    .string()
    .length(6, 'Код должен содержать 6 цифр')
    .matches(/^\d{6}$/, 'Код должен содержать только цифры')
    .required('Код обязателен'),
});

export const resetPasswordSchema = yup.object({
  email: yup
    .string()
    .email('Некорректный формат email')
    .required('Email обязателен'),
  code: yup
    .string()
    .length(6, 'Код должен содержать 6 цифр')
    .matches(/^\d{6}$/, 'Код должен содержать только цифры')
    .required('Код обязателен'),
  newPassword: yup
    .string()
    .min(8, 'Минимум 8 символов')
    .matches(/\d/, 'Используйте хотя бы одну цифру')
    .matches(/[A-ZА-Я]/, 'Используйте хотя бы одну заглавную букву')
    .required('Новый пароль обязателен'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Пароли не совпадают')
    .required('Подтверждение пароля обязательно'),
});

export const signInSoftSchema = yup.object({
  phone: yup
    .string()
    .required('Номер телефона обязателен')
    .test('phone-format', 'Некорректный формат номера телефона', function(value) {
      if (!value) return false;
      
      // Убираем все символы кроме цифр
      const cleanPhone = value.replace(/\D/g, '');
      
      // Проверяем длину (должно быть 10 цифр для российского номера без кода страны)
      if (cleanPhone.length !== 10) {
        return false;
      }
      
      // Проверяем, что первая цифра не 0 (недопустимые коды операторов)
      if (cleanPhone[0] === '0') {
        return false;
      }
      
      return true;
    }),
});

export const signUpSchema = yup.object({
  email: yup
    .string()
    .email('Некорректный формат email')
    .required('Email обязателен'),
  password: yup
    .string()
    .min(8, 'Минимум 8 символов')
    .matches(/\d/, 'Используйте хотя бы одну цифру')
    .matches(/[A-ZА-Я]/, 'Используйте хотя бы одну заглавную букву')
    .required('Пароль обязателен'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Пароли не совпадают')
    .required('Подтверждение пароля обязательно'),
});

export type ResetPasswordRequestFormData = yup.InferType<typeof resetPasswordRequestSchema>;
export type VerifyResetCodeFormData = yup.InferType<typeof verifyResetCodeSchema>;
export type ResetPasswordFormData = yup.InferType<typeof resetPasswordSchema>;
export type SignInSoftFormData = yup.InferType<typeof signInSoftSchema>;

// Схема для регистрации данных
export const registrationDataSchema = yup.object({
  name: yup
    .string()
    .required('ФИО обязательно')
    .min(2, 'ФИО должно содержать минимум 2 символа'),
  email: yup
    .string()
    .required('Email обязателен')
    .email('Некорректный email'),
  password: yup
    .string()
    .required('Пароль обязателен')
    .min(8, 'Минимум 8 символов')
    .matches(/\d/, 'Используйте хотя бы одну цифру')
    .matches(/[A-ZА-Я]/, 'Используйте хотя бы одну заглавную букву'),
  confirmPassword: yup
    .string()
    .required('Подтверждение пароля обязательно')
    .oneOf([yup.ref('password')], 'Пароли должны совпадать'),
  agreeToTerms: yup
    .boolean()
    .required('')
    .oneOf([true], '')
});

export type RegistrationDataFormData = yup.InferType<typeof registrationDataSchema>;
export type SignUpFormData = yup.InferType<typeof signUpSchema>;
