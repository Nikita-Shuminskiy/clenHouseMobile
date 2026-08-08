import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatDateStringMonthYear } from '@/src/shared/utils/formatting';
import { HARVEST_COLORS, HARVEST_SHADOWS } from '@/src/shared/harvest-theme';

interface UserStatsProps {
  totalOrders?: number;
  completedOrders?: number;
  rating?: number;
  joinDate?: string;
}

const UserStats: React.FC<UserStatsProps> = ({
  totalOrders = 0,
  completedOrders = 0,
  rating = 0,
  joinDate
}) => {
  const stats = [
    {
      label: 'Всего заказов',
      value: totalOrders.toString(),
      icon: '📋'
    },
    {
      label: 'Завершено',
      value: completedOrders.toString(),
      icon: '✅'
    },
    {
      label: 'Рейтинг',
      value: rating.toFixed(1),
      icon: '⭐'
    },
    {
      label: 'С нами с',
      value: formatDateStringMonthYear(joinDate),
      icon: '📅'
    }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Статистика</Text>
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <Text style={styles.statIcon}>{stat.icon}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: HARVEST_COLORS.paper,
    marginHorizontal: 16,
    marginTop: 24,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: HARVEST_COLORS.mist,
    ...HARVEST_SHADOWS.card,
  },
  title: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 24,
    color: HARVEST_COLORS.ink,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: HARVEST_COLORS.softCream,
    borderRadius: 16,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  statValue: {
    fontFamily: 'Onest',
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 24,
    color: HARVEST_COLORS.ink,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
    color: HARVEST_COLORS.stone,
    textAlign: 'center',
  },
});

export default UserStats;
