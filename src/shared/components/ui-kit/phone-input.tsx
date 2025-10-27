import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import MaskInput from 'react-native-mask-input';
import { useTheme } from '../../use-theme';
import { ErrorIcon, PhoneIcon } from '../icons';
import { validateRussianPhone } from '../../utils/validation';

interface PhoneInputProps extends Omit<TextInputProps, 'style' | 'onChangeText'> {
  state?: 'default' | 'error' | 'success' | 'disabled' | 'active' | 'filled';
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (masked: string, unmasked: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  clearable?: boolean;
  onClear?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  containerStyle?: ViewStyle;
  error?: { message?: string };
  validateOnBlur?: boolean;
  required?: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  state = 'default',
  label,
  placeholder = '+7 (___) ___-__-__',
  value,
  onChangeText,
  onFocus,
  onBlur,
  clearable = true,
  onClear,
  disabled = false,
  style,
  inputStyle,
  containerStyle,
  error,
  validateOnBlur = true,
  required = false,
  ...props
}) => {
  const { colors, fonts, weights } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Маска для российского номера телефона с фиксированным +7
  const phoneMask = [
    '+',
    '7',
    ' ',
    '(',
    /\d/,
    /\d/,
    /\d/,
    ')',
    ' ',
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/
  ];

  // Префикс +7 всегда отображается
  const displayValue = value ? `+7 ${value}` : '';

  const hasValue = value && value.length > 0;
  
  // Определяем финальную ошибку (приоритет: внешняя ошибка > валидация)
  const finalError = error || (validationError ? { message: validationError } : null);
  
  const inputState = disabled 
    ? 'disabled' 
    : finalError 
      ? 'error'
      : isFocused 
        ? 'active' 
        : (state !== 'default' && state !== 'filled') 
          ? state 
          : hasValue 
            ? 'filled' 
            : 'default';

  const getInputStyle = () => {
    // Цвета согласно веб-версии
    if (inputState === 'disabled') {
      return {
        backgroundColor: colors.grey100,
        borderColor: 'transparent',
        color: colors.muted, // Используем muted цвет для disabled текста
      };
    }
    if (inputState === 'error') {
      return {
        backgroundColor: colors.white,
        borderColor: colors.destructive, // Используем destructive цвет для ошибок
        color: colors.black,
      };
    }
    if (inputState === 'active') {
      return {
        backgroundColor: colors.white,
        borderColor: colors.ring, // Используем ring цвет для активного состояния
        color: colors.black,
      };
    }
    if (inputState === 'filled') {
      return {
        backgroundColor: colors.grey200, 
        borderColor: 'transparent',
        color: colors.black,
      };
    }
    // Default state
    return {
      backgroundColor: colors.grey100,
      borderColor: 'transparent',
      color: colors.muted, // Используем muted цвет для placeholder
    };
  };

  const inputStyleFromState = getInputStyle();
  
  // Обработчики событий
  const handleFocus = () => {
    setIsFocused(true);
    // Очищаем ошибку валидации при фокусе
    if (validationError) {
      setValidationError(null);
    }
    onFocus?.();
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    
    // Валидация при потере фокуса только если номер полностью введен
    if (validateOnBlur && value) {
      const cleanPhone = value.replace(/\D/g, '');
      // Проверяем, что номер содержит 10 цифр (без кода страны)
      if (cleanPhone.length === 10) {
        // Номер полный, очищаем ошибку валидации
        setValidationError(null);
      } else if (cleanPhone.length > 0 && cleanPhone.length < 10) {
        // Показываем ошибку только если номер неполный и пользователь начал вводить
        setValidationError('Введите полный номер телефона');
      } else {
        setValidationError(null);
      }
    }
    
    onBlur?.();
  };
  
  const handleChangeText = (masked: string, unmasked: string) => {
    // Очищаем ошибку валидации при изменении текста
    if (validationError) {
      setValidationError(null);
    }
    
    // Ограничиваем количество цифр до 10 (без кода страны)
    const digitsOnly = unmasked.replace(/\D/g, '');
    if (digitsOnly.length > 10) {
      // Обрезаем до 10 цифр и применим маску вручную
      const trimmedDigits = digitsOnly.slice(0, 10);
      const trimmedMasked = `(${trimmedDigits.slice(0, 3)}) ${trimmedDigits.slice(3, 6)}-${trimmedDigits.slice(6, 8)}-${trimmedDigits.slice(8, 10)}`;
      onChangeText?.(trimmedMasked, trimmedDigits);
      return;
    }
    
    // Если номер полный (10 цифр), очищаем валидационную ошибку
    if (digitsOnly.length === 10) {
      setValidationError(null);
    }
    
    onChangeText?.(masked, unmasked);
  };
  
  const handleClear = () => {
    onChangeText?.('', '');
    setValidationError(null);
    onClear?.();
  };
  
  const shouldShowClear = clearable && value && value.length > 0 && !disabled && inputState !== 'filled';

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.inputContainer, inputStyleFromState, style]}>
        {/* Лейбл */}
        {label && (
          <Text style={[styles.label, {
            fontFamily: fonts.text3,
            fontWeight: weights.medium,
            fontSize: 12,
            lineHeight: 16,
            color: colors.grey900,
          }]}>
            {label}
          </Text>
        )}
        
        {/* Поле ввода с маской */}
        <View style={styles.inputRow}>
          {/* Иконка телефона */}
          <View style={styles.iconContainer}>
            <PhoneIcon width={20} height={20} color={colors.grey500} />
          </View>
          
          {/* Поле ввода с маской */}
          <Text style={[styles.prefixText, { color: inputStyleFromState.color }]}>+7</Text>
          <MaskInput
            style={[
              styles.textInput,
              {
                fontFamily: fonts.text2,
                fontWeight: weights.normal,
                fontSize: 16, 
                color: inputStyleFromState.color,
              },
              inputStyle,
            ]}
            placeholder="(___) ___-__-__"
            placeholderTextColor={colors.grey500}
            value={value}
            onChangeText={handleChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            editable={!disabled}
            mask={[
              '(',
              /\d/,
              /\d/,
              /\d/,
              ')',
              ' ',
              /\d/,
              /\d/,
              /\d/,
              '-',
              /\d/,
              /\d/,
              '-',
              /\d/,
              /\d/
            ]}
            keyboardType="phone-pad"
            autoComplete="tel"
            maxLength={15} // Максимальная длина маски без +7
            {...props}
          />
          
          {/* Кнопка очистки */}
          {shouldShowClear && (
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={handleClear}
              disabled={disabled}
            >
              <Text style={[styles.clearButtonText, { color: colors.grey500 }]}>×</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* Сообщение об ошибке */}
      {finalError && finalError.message && (
        <View style={styles.errorContainer}>
          <ErrorIcon width={16} height={16} color="#F53F3F" />
          <Text style={styles.errorText}>{finalError.message}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'column',
    gap: 4,
    padding: 12, 
    borderRadius: 12, 
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },
  label: {
    marginBottom: 0,
  },
  iconContainer: {
    padding: 2,
  },
  prefixText: {
    fontSize: 16,
    fontWeight: '400',
    marginRight: 0,
  },
  textInput: {
    flex: 1,
    textAlignVertical: 'center',
    paddingVertical: 0,
    margin: 0,
  },
  clearButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 24,
    minHeight: 24,
  },
  clearButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 18,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  errorText: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
    color: '#F53F3F',
  },
});

export default PhoneInput;
