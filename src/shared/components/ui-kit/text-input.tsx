import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from "react";
import { KeyboardTypeOptions, Pressable, StyleSheet, Text, TextInput, TextInputProps, View, } from "react-native";

interface ITextInputProps extends TextInputProps {
    value: string;
    onChangeText?: (text: string) => void;
    error?: string;
    keyboardType?: KeyboardTypeOptions;
    placeholder?: string;
    secureTextEntry?: boolean;
    maxLength?: number;
    isDisabled?: boolean;
    rightIcon?: React.ReactNode;
    onPress?: () => void;
    customInputContainerStyles?: object;
}

const Input: React.FC<ITextInputProps> = ({
    value = "",
    onChangeText,
    error,
    keyboardType = "default",
    secureTextEntry = false,
    maxLength = 100,
    placeholder = "",
    isDisabled,
    rightIcon,
    onPress,
    customInputContainerStyles,
    ...rest
}) => {
    const ref = useRef<TextInput>(null);

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    // Цвета для разных состояний
    const borderColor = error
        ? '#FC3C3C' // красный
        : isDisabled
            ? '#E1EAF0' // светло-серый
            : '#E1EAF0'; // обычный серый

    const textColor = error
        ? '#FC3C3C'
        : isDisabled
            ? '#BFC9D1'
            : '#3D3D3D';

    const placeholderTextColor = isDisabled ? '#BFC9D1' : '#8B97A1';

    const handleFocus = () => {
        onPress?.();
    };

    const handleBlur = () => {
        // Обработка потери фокуса
    };

    const handlePress = () => {
        ref.current?.focus();
    };

    const togglePasswordVisibility = () => {
        if (!isDisabled) setIsPasswordVisible(!isPasswordVisible);
    };

    const renderPasswordIcon = () => {
        if (!secureTextEntry) return null;
        return (
            <Pressable
                onPress={togglePasswordVisibility}
                style={styles.passwordIcon}
                disabled={isDisabled}
            >
                <Ionicons
                    name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                    size={24}
                    color={isDisabled ? '#BFC9D1' : '#3D3D3D'}
                />
            </Pressable>
        );
    };

    return (
        <View style={styles.mainContainer}>
            <Pressable
                onPress={handlePress}
                style={[
                    styles.container,
                    { borderColor, opacity: isDisabled ? 0.5 : 1 },
                    customInputContainerStyles,
                ]}
            >
                <TextInput
                    ref={ref}
                    editable={!isDisabled}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    value={value || ""}
                    keyboardType={keyboardType}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry && !isPasswordVisible}
                    maxLength={maxLength}
                    placeholder={placeholder}
                    placeholderTextColor={placeholderTextColor}
                    style={[
                        styles.input,
                        { color: textColor },
                        error && styles.isErrorText,
                    ]}
                    cursorColor="#FC712C"
                    {...rest}
                />
                {renderPasswordIcon()}
                {rightIcon && rightIcon}
            </Pressable>
            {error && (
                <Text style={[styles.isErrorText, { textAlign: "left", marginTop: 4 }]}>{error}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        width: "100%",
    },
    container: {
        borderWidth: 1,
        height: 54,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 16,
        backgroundColor: '#fff',
    },
    isErrorText: {
        color: "#FC3C3C",
        fontWeight: '600',
    },
    input: {
        fontSize: 18,
        flex: 1,
        color: "#3D3D3D",
        fontWeight: '500',
    },
    passwordIcon: {
        padding: 4,
        marginLeft: 8,
    },
});

export default Input;
