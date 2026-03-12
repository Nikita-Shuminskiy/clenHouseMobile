import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import useTheme from '@/src/shared/use-theme/use-theme';

const NARROW_SCREEN_WIDTH = 360;

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
  const { width: screenWidth } = useWindowDimensions();
  const isNarrowScreen = screenWidth < NARROW_SCREEN_WIDTH;
  const overdueLabel = isNarrowScreen ? 'Просроч.' : 'Просроченные';
  const tabs = [
    { key: 'new' as OrderTabType, label: 'Новые', count: counts?.new, activeColor: colors.primary500 },
    { key: 'my' as OrderTabType, label: 'Мои', count: counts?.my, activeColor: colors.primary500 },
    { key: 'overdue' as OrderTabType, label: overdueLabel, count: counts?.overdue, activeColor: '#DC2626' },
  ];

  const renderTab = (tab: (typeof tabs)[number], isFullWidth = false) => {
    const isActive = activeTab === tab.key;
    return (
      <TouchableOpacity
        key={tab.key}
        style={[
          styles.tab,
          isFullWidth && styles.fullWidthTab,
          {
            backgroundColor: isActive ? tab.activeColor : colors.grey100,
          },
        ]}
        onPress={() => onTabChange(tab.key)}
        activeOpacity={0.7}
      >
        <View style={styles.tabContent}>
          <Text
            style={[
              styles.tabText,
              {
                color: isActive ? colors.white : colors.muted,
              },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
            adjustsFontSizeToFit
            minimumFontScale={0.8}
          >
            {tab.label}
          </Text>
          {tab.count !== undefined && tab.count > 0 && (
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.3)' : tab.activeColor,
                },
              ]}
            >
              <Text style={styles.badgeText}>{tab.count}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    isNarrowScreen ? (
      <View style={styles.containerNarrow}>
        <View style={styles.row}>
          {renderTab(tabs[0])}
          {renderTab(tabs[1])}
        </View>
        <View style={styles.row}>
          {renderTab(tabs[2], true)}
        </View>
      </View>
    ) : (
      <View style={styles.container}>
        {tabs.map((tab) => renderTab(tab))}
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  containerNarrow: {
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
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
  fullWidthTab: {
    flex: 1,
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
    color: '#FFFFFF',
  },
});

export default OrderTabs;
