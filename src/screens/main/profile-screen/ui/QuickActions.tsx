import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { HARVEST_COLORS, HARVEST_SHADOWS } from '@/src/shared/harvest-theme';

interface QuickActionsProps {
  onViewOrders?: () => void;
  onCreateOrder?: () => void;
  onViewHistory?: () => void;
  onInviteFriends?: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onViewOrders,
  onCreateOrder,
  onViewHistory,
  onInviteFriends
}) => {
  const actions = [
    {
      icon: '📋',
      title: 'Мои заказы',
      subtitle: 'Просмотр заказов',
      onPress: onViewOrders,
      color: HARVEST_COLORS.flame,
    },
    {
      icon: '➕',
      title: 'Создать заказ',
      subtitle: 'Новый заказ',
      onPress: onCreateOrder,
      color: HARVEST_COLORS.flame,
    },
    {
      icon: '📊',
      title: 'История',
      subtitle: 'Статистика',
      onPress: onViewHistory,
      color: HARVEST_COLORS.flame,
    },
    {
      icon: '👥',
      title: 'Пригласить друзей',
      subtitle: 'Поделиться приложением',
      onPress: onInviteFriends,
      color: HARVEST_COLORS.flame,
    }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Быстрые действия</Text>
      <View style={styles.actionsGrid}>
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionItem}
            onPress={action.onPress}
            activeOpacity={0.8}
          >
            <Text style={styles.actionIcon}>{action.icon}</Text>
            <Text style={styles.actionTitle}>{action.title}</Text>
            <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: HARVEST_COLORS.paper,
    marginHorizontal: 16,
    marginTop: 16,
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
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionItem: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: HARVEST_COLORS.softCream,
    borderWidth: 1,
    borderColor: HARVEST_COLORS.mist,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionTitle: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 20,
    color: HARVEST_COLORS.ink,
    textAlign: 'center',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
    color: HARVEST_COLORS.stone,
    textAlign: 'center',
    opacity: 0.9,
  },
});

export default QuickActions;
