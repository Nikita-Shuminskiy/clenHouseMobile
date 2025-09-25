import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { useTheme } from '../../use-theme';
import { ErrorIcon, EyeOpenIcon, LockKeyIcon, MailIcon, SearchIcon, UserIcon, XCircle20Icon } from '../icons';

interface InputProps extends Omit<TextInputProps, 'style'> {
  state?: 'default' | 'error' | 'success' | 'disabled' | 'active' | 'filled';
  type?: 'base' | 'search' | 'mail' | 'password' | 'name';
  icon?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  clearable?: boolean;
  onClear?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  containerStyle?: ViewStyle;
  secureTextEntry?: boolean;
  error?: { message?: string };
}

const Input: React.FC<InputProps> = ({
  state = 'default',
  type = 'base',
  icon,
  label,
  placeholder,
  value,
  onChangeText,
  onFocus,
  onBlur,
  clearable = false,
  onClear,
  disabled = false,
  style,
  inputStyle,
  containerStyle,
  secureTextEntry,
  error,
  ...props
}) => {
  const { colors, fonts, weights, sizes } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  

 
  const hasValue = value && value.length > 0;
  
  const inputState = disabled 
    ? 'disabled' 
    : error 
      ? 'error'
      : isFocused 
        ? 'active' 
        : (state !== 'default' && state !== 'filled') 
          ? state 
          : hasValue 
            ? 'filled' 
            : 'default';
  
  // Определяем свойства в зависимости от типа
  const isPasswordType = type === 'password';
  const shouldShowPasswordToggle = isPasswordType;
  const actualSecureTextEntry = isPasswordType ? !showPassword : secureTextEntry;
  const shouldShowErrorDots = isPasswordType && error && hasValue;
  
  // Автоматически включаем clearable для определенных типов
  const shouldBeClearable = clearable || type === 'search' || type === 'mail' || type === 'name';

  const getInputStyle = () => {
    // Точные цвета из Figma
    if (inputState === 'disabled') {
      return {
        backgroundColor: colors.grey100, // #EFF3F8
        borderColor: 'transparent',
        color: colors.grey500, // #A1B0CA
      };
    }
    if (inputState === 'error') {
      return {
        backgroundColor: colors.white,
        borderColor: colors.red,
        color: colors.black,
      };
    }
    if (inputState === 'active') {
      return {
        backgroundColor: colors.white, // #FFFFFF
        borderColor: 'transparent',
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
      backgroundColor: colors.grey100, // #EFF3F8
      borderColor: 'transparent',
      color: colors.grey500, // #A1B0CA 
    };
  };

  const inputStyleFromState = getInputStyle();
  
  // Обработчики событий
  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };
  
  const handleClear = () => {
    onChangeText?.('');
    onClear?.();
  };
  
  const shouldShowClear = shouldBeClearable && value && value.length > 0 && !disabled && inputState !== 'filled';
  
  const getLeftIcon = () => {
    if (icon) return null; 
    
    switch (type) {
      case 'mail':
        return <MailIcon width={20} height={20} color={colors.grey500} />;
      case 'password':
        return <LockKeyIcon width={20} height={20} color={colors.grey500} />;
      case 'search':
        return <SearchIcon width={20} height={20} color={colors.grey500} />;
      case 'name':
        return <UserIcon width={20} height={20} color={colors.grey500} />;
      default:
        return null;
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
        
                        {/* Поле ввода с кнопкой переключения видимости */}
                <View style={styles.inputRow}>
                    <TextInput
                      style={[
                        styles.textInput,
                        {
                          fontFamily: fonts.text2,
                          fontWeight: weights.normal,
                          fontSize: 16, 
                          color: shouldShowErrorDots ? colors.red : inputStyleFromState.color,
                        },
                        inputStyle,
                      ]}
                      placeholder={placeholder}
                      placeholderTextColor={colors.grey500} // #A1B0CA
                      value={value}
                      onChangeText={onChangeText}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      editable={!disabled}
                      secureTextEntry={actualSecureTextEntry}
                      autoCapitalize={type === 'mail' ? 'none' : 'sentences'}
                      keyboardType={type === 'mail' ? 'email-address' : 'default'}
                      {...props}
                    />
                  
                  {/* Кнопка переключения видимости пароля */}
                  {shouldShowPasswordToggle && (
                    <TouchableOpacity 
                      style={styles.eyeButton} 
                      onPress={togglePasswordVisibility}
                      disabled={disabled}
                    >
                      <EyeOpenIcon width={20} height={20} color="#A1B0CA" />
                    </TouchableOpacity>
                  )}
                </View>
      </View>
      
      {/* Сообщение об ошибке */}
      {error && error.message && (
        <View style={styles.errorContainer}>
          <ErrorIcon width={16} height={16} color="#F53F3F" />
          <Text style={styles.errorText}>{error.message}</Text>
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
    justifyContent: 'space-between',
  },
  label: {
    marginBottom: 0,
  },
  textInput: {
    flex: 1,
    textAlignVertical: 'center',
    paddingVertical: 0,
    margin: 0,
  },
  eyeButton: {
    padding: 8,
    marginLeft: 8,
  },
  passwordDotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    flex: 1,
    paddingVertical: 0,
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

export default Input;
