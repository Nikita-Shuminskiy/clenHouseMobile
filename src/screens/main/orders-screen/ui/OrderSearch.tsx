import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

import { useTheme } from '@/src/shared/use-theme';
import { SearchIcon, CloseLineIcon } from '@/src/shared/components/icons';

interface OrderSearchProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const OrderSearch: React.FC<OrderSearchProps> = ({
  value,
  onChangeText,
  placeholder = 'Поиск заказов...',
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.field, { backgroundColor: colors.background }]}>
        <SearchIcon width={20} height={20} color={String(colors.grey500)} />
        <TextInput
          style={[styles.input, { color: colors.grey900 }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.grey500}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {value.length > 0 && (
          <TouchableOpacity
            onPress={() => onChangeText('')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel="Очистить поиск"
          >
            <CloseLineIcon width={18} height={18} color={String(colors.grey500)} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  input: {
    flex: 1,
    padding: 0,
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
  },
});

export default OrderSearch;
