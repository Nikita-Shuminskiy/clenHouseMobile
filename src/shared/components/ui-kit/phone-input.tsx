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

  // Маска для российского номера телефона
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
    /\d/
  ];

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
    
    // Валидация при потере фокуса
    if (validateOnBlur && value) {
      const validation = validateRussianPhone(value);
      if (!validation.isValid) {
        setValidationError(validation.error || 'Некорректный номер телефона');
      } else {
        setValidationError(null);
      }
    }
    
    onBlur?.();
  };
  
  const handleClear = () => {
    onChangeText?.('', '');
    setValidationError(null);
    onClear?.();
  };
  
  const shouldShowClear = clearable && value && value.length > 0 && !disabled && inputState !== 'filled';
  
  const handleChangeText = (masked: string, unmasked: string) => {
    // Очищаем ошибку валидации при изменении текста
    if (validationError) {
      setValidationError(null);
    }
    
    // Проверяем, не превышает ли количество цифр максимально допустимое
    const digitsOnly = unmasked.replace(/\D/g, '');
    if (digitsOnly.length > 10) {
      // Если цифр больше 10, не обновляем значение
      return;
    }
    
    onChangeText?.(masked, unmasked);
  };

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
            placeholder={placeholder}
            placeholderTextColor={colors.grey500}
            value={value}
            onChangeText={handleChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            editable={!disabled}
            mask={phoneMask}
            keyboardType="phone-pad"
            autoComplete="tel"
            maxLength={18} // Максимальная длина с маской
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
    gap: 8,
  },
  label: {
    marginBottom: 0,
  },
  iconContainer: {
    padding: 2,
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
