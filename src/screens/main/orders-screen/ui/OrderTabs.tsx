import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import useTheme from '@/src/shared/use-theme/use-theme';

type OrderTabType = 'new' | 'my';

interface OrderTabsProps {
  activeTab: OrderTabType;
  onTabChange: (tab: OrderTabType) => void;
}

const OrderTabs: React.FC<OrderTabsProps> = ({ activeTab, onTabChange }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'new' && {
            backgroundColor: colors.primary500,
          },
          activeTab !== 'new' && {
            backgroundColor: colors.grey100,
          },
        ]}
        onPress={() => onTabChange('new')}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.tabText,
            {
              color: activeTab === 'new' ? colors.white : colors.muted,
            },
          ]}
        >
          Новые заказы
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'my' && {
            backgroundColor: colors.primary500,
          },
          activeTab !== 'my' && {
            backgroundColor: colors.grey100,
          },
        ]}
        onPress={() => onTabChange('my')}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.tabText,
            {
              color: activeTab === 'my' ? colors.white : colors.muted,
            },
          ]}
        >
          Мои заказы
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tabText: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default OrderTabs;
