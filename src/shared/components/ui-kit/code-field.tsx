import React, { useEffect, useRef, useState } from 'react';
import {
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';


interface CodeFieldProps {
  state?: CodeFieldState;
  length?: number;
  value?: string;
  onChangeText?: (code: string) => void;
  onComplete?: (code: string) => void;
  errorMessage?: string;
  disabled?: boolean;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

const CodeField: React.FC<CodeFieldProps> = ({
  state = 'default',
  length = 4,
  value = '',
  onChangeText,
  onComplete,
  errorMessage,
  disabled = false,
  style,
  containerStyle,
  inputStyle,
}) => {
  const [code, setCode] = useState(value);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<TextInput[]>([]);

  // Определяем состояние CodeField
  const codeFieldState: CodeFieldState = errorMessage ? 'error' : state;
  
  // Получаем стили для выбранного состояния
  const containerStyleFromState = CodeFieldContainerStyles[codeFieldState];
  const inputStyleFromState = CodeFieldInputStyles[codeFieldState];
  const textStyleFromState = CodeFieldTextStyles[codeFieldState];
  const placeholderStyleFromState = CodeFieldPlaceholderStyles[codeFieldState];
  const errorStyleFromState = CodeFieldErrorStyles[codeFieldState];
  const warningIconStyleFromState = CodeFieldWarningIconStyles[codeFieldState];
  const errorTextStyleFromState = CodeFieldErrorTextStyles[codeFieldState];

  // Обработчик изменения текста в поле
  const handleInputChange = (text: string, index: number) => {
    const newCode = code.split('');
    newCode[index] = text;
    const newCodeString = newCode.join('');
    
    setCode(newCodeString);
    onChangeText?.(newCodeString);
    
    // Если введена цифра, переходим к следующему полю
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
    
    // Если код заполнен, вызываем onComplete
    if (newCodeString.length === length) {
      onComplete?.(newCodeString);
      Keyboard.dismiss();
    }
  };

  // Обработчик нажатия клавиши Backspace
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    }
  };

  // Обработчик фокуса
  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  // Обработчик потери фокуса
  const handleBlur = () => {
    setFocusedIndex(null);
  };

  // Синхронизируем внутреннее состояние с внешним
  useEffect(() => {
    setCode(value);
  }, [value]);

  // Создаем массив полей ввода
  const renderInputs = () => {
    const inputs = [];
    
    for (let i = 0; i < length; i++) {
      const isFocused = focusedIndex === i;
      const hasValue = code[i];
      
      // Определяем состояние для каждого поля
      let fieldState: CodeFieldState = 'default';
      if (isFocused) fieldState = 'active';
      else if (hasValue) fieldState = 'filled';
      else if (codeFieldState === 'error') fieldState = 'error';
      
      const fieldInputStyle = CodeFieldInputStyles[fieldState];
      const fieldTextStyle = CodeFieldTextStyles[fieldState];
      
      inputs.push(
        <TextInput
          key={i}
          ref={(ref) => {
            if (ref) inputRefs.current[i] = ref;
          }}
          style={[
            styles.input,
            fieldInputStyle,
            inputStyleFromState,
            inputStyle,
            fieldInputStyle,
            fieldTextStyle,
            textStyleFromState,
            // Убираем дублирующиеся стили
            {
              backgroundColor: fieldInputStyle.backgroundColor,
              color: fieldTextStyle.color,
            }
          ]}
          value={code[i] || ''}
          onChangeText={(text) => handleInputChange(text, i)}
          onKeyPress={(e) => handleKeyPress(e, i)}
          onFocus={() => handleFocus(i)}
          onBlur={handleBlur}
          editable={!disabled}
          maxLength={1}
          keyboardType="numeric"
          textAlign="center"
          placeholder="0"
          placeholderTextColor={placeholderStyleFromState.color}
        />
      );
    }
    
    return inputs;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Поля ввода кода */}
      <View style={[styles.codeContainer, containerStyleFromState, style]}>
        {renderInputs()}
      </View>
      
      {/* Сообщение об ошибке */}
      <View style={[styles.errorContainer, errorStyleFromState]}>
        {errorMessage && (
          <>
            <WarningIcon style={warningIconStyleFromState} />
            <Text style={[styles.errorText, errorTextStyleFromState]}>
              {errorMessage}
            </Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  codeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    textAlign: 'center',
  },
});

export default CodeField;
