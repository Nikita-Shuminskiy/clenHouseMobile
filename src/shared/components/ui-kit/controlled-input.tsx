import React from 'react';
import { Control, Controller, FieldError, FieldPath, FieldValues } from 'react-hook-form';
import Input from './input';

interface InputProps {
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
  style?: any;
  inputStyle?: any;
  containerStyle?: any;
  secureTextEntry?: boolean;
  error?: { message?: string };
}

interface ControlledInputProps<T extends FieldValues> extends Omit<InputProps, 'value' | 'onChangeText' | 'onBlur'> {
  control: Control<T>;
  name: FieldPath<T>;
  error?: FieldError;
}

const ControlledInput = <T extends FieldValues>({
  control,
  name,
  error,
  ...inputProps
}: ControlledInputProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <Input
          {...inputProps}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          state={error ? 'error' : inputProps.state}
          error={error}
        />
      )}
    />
  );
};

export default ControlledInput;
