import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatDateStringMonthYear } from '@/src/shared/utils/formatting';

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
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 24,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 24,
    color: '#1A1A1A',
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
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
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
    color: '#1A1A1A',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
    color: '#5A6E8A',
    textAlign: 'center',
  },
});

export default UserStats;
