import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import useTheme from '@/src/shared/use-theme/use-theme';

type OrderTabType = 'new' | 'my' | 'overdue';

interface OrderTabsProps {
  activeTab: OrderTabType;
  onTabChange: (tab: OrderTabType) => void;
  counts?: {
    new?: number;
    my?: number;
    overdue?: number;
  };
}

const OrderTabs: React.FC<OrderTabsProps> = ({ activeTab, onTabChange, counts }) => {
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
        <View style={styles.tabContent}>
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'new' ? colors.white : colors.muted,
              },
            ]}
          >
            Новые
          </Text>
          {counts?.new !== undefined && counts.new > 0 && (
            <View style={[
              styles.badge,
              {
                backgroundColor: activeTab === 'new' ? 'rgba(255, 255, 255, 0.3)' : colors.primary500,
              }
            ]}>
              <Text style={[
                styles.badgeText,
                { color: activeTab === 'new' ? colors.white : colors.white }
              ]}>
                {counts.new}
              </Text>
            </View>
          )}
        </View>
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
        <View style={styles.tabContent}>
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'my' ? colors.white : colors.muted,
              },
            ]}
          >
            Мои
          </Text>
          {counts?.my !== undefined && counts.my > 0 && (
            <View style={[
              styles.badge,
              {
                backgroundColor: activeTab === 'my' ? 'rgba(255, 255, 255, 0.3)' : colors.primary500,
              }
            ]}>
              <Text style={[
                styles.badgeText,
                { color: activeTab === 'my' ? colors.white : colors.white }
              ]}>
                {counts.my}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'overdue' && {
            backgroundColor: colors.error || '#DC2626',
          },
          activeTab !== 'overdue' && {
            backgroundColor: colors.grey100,
          },
        ]}
        onPress={() => onTabChange('overdue')}
        activeOpacity={0.7}
      >
        <View style={styles.tabContent}>
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'overdue' ? colors.white : colors.muted,
              },
            ]}
          >
            Просроченные
          </Text>
          {counts?.overdue !== undefined && counts.overdue > 0 && (
            <View style={[
              styles.badge,
              {
                backgroundColor: activeTab === 'overdue' ? 'rgba(255, 255, 255, 0.3)' : colors.error || '#DC2626',
              }
            ]}>
              <Text style={[
                styles.badgeText,
                { color: activeTab === 'overdue' ? colors.white : colors.white }
              ]}>
                {counts.overdue}
              </Text>
            </View>
          )}
        </View>
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
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tabText: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 11,
    lineHeight: 16,
  },
});

export default OrderTabs;
