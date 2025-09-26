import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

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
      color: '#2196F3'
    },
    {
      icon: '➕',
      title: 'Создать заказ',
      subtitle: 'Новый заказ',
      onPress: onCreateOrder,
      color: '#4CAF50'
    },
    {
      icon: '📊',
      title: 'История',
      subtitle: 'Статистика',
      onPress: onViewHistory,
      color: '#FF9800'
    },
    {
      icon: '👥',
      title: 'Пригласить друзей',
      subtitle: 'Поделиться приложением',
      onPress: onInviteFriends,
      color: '#9C27B0'
    }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Быстрые действия</Text>
      <View style={styles.actionsGrid}>
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.actionItem, { backgroundColor: action.color }]}
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
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
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
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
});

export default QuickActions;
