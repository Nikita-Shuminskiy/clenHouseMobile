import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import useTheme from '@/src/shared/use-theme/use-theme';
import { Ionicons } from '@expo/vector-icons';

interface DateHeaderProps {
  title: string;
  count?: number;
  overdueCount?: number;
  isExpanded?: boolean;
  onPress?: () => void;
}

const DateHeader: React.FC<DateHeaderProps> = ({
  title,
  count,
  overdueCount = 0,
  isExpanded = true,
  onPress
}) => {
  const theme = useTheme();
  const rotateAnim = React.useRef(new Animated.Value(isExpanded ? 1 : 0)).current;
  const hasOverdue = overdueCount > 0;

  React.useEffect(() => {
    Animated.spring(rotateAnim, {
      toValue: isExpanded ? 1 : 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, [isExpanded, rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={styles.container}
      >
        <View style={styles.leftContent}>
          <View style={styles.dateBlock}>
            <Text style={[styles.title, { color: theme.colors.grey900 }]}>
              {title}
            </Text>
            <View style={styles.badges}>
              {count !== undefined && (
                <View style={[
                  styles.countBadge,
                  { backgroundColor: hasOverdue ? 'rgba(244, 67, 54, 0.08)' : 'rgba(0, 0, 0, 0.04)' }
                ]}>
                  <Text style={[
                    styles.countText,
                    { color: hasOverdue ? '#F44336' : theme.colors.grey600 }
                  ]}>
                    {count} {count === 1 ? 'заказ' : count < 5 ? 'заказа' : 'заказов'}
                  </Text>
                </View>
              )}

              {hasOverdue && (
                <View style={[styles.overdueBadge, { backgroundColor: '#F44336' }]}>
                  <Ionicons name="alert-circle" size={12} color="#FFFFFF" />
                  <Text style={styles.overdueText}>
                    {overdueCount} {overdueCount === 1 ? 'просрочен' : 'просрочено'}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <Animated.View style={{ transform: [{ rotate }] }}>
          <Ionicons
            name="chevron-down"
            size={18}
            color={theme.colors.grey400}
          />
        </Animated.View>
      </TouchableOpacity>

      <View style={[styles.divider, { backgroundColor: theme.colors.grey200 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 8,
    backgroundColor: '#F3F3F3',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 4,
    backgroundColor: '#F3F3F3',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  dateBlock: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 22,
    textTransform: 'capitalize',
    letterSpacing: -0.2,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  countText: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 11,
    lineHeight: 14,
  },
  overdueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  overdueText: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 11,
    lineHeight: 14,
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    marginTop: 4,
  },
});

export default DateHeader;

