import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface OrderSearchProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const OrderSearch: React.FC<OrderSearchProps> = ({ 
  value, 
  onChangeText, 
  placeholder = 'Поиск заказов...' 
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#7D8EAA"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  input: {
    backgroundColor: '#F3F3F3',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    color: '#1A1A1A',
  },
});

export default OrderSearch;
