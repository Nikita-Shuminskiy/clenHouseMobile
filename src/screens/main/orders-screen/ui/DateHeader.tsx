import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import useTheme from '@/src/shared/use-theme/use-theme';
import { Ionicons } from '@expo/vector-icons';

interface DateHeaderProps {
  title: string;
  count?: number;
  overdueCount?: number;
  isExpanded?: boolean;
  onPress?: () => void;
  isOverdueGroup?: boolean;
}

const DateHeader: React.FC<DateHeaderProps> = ({
  title,
  count,
  overdueCount = 0,
  isExpanded = true,
  onPress,
  isOverdueGroup = false,
}) => {
  const theme = useTheme();
  const rotateAnim = React.useRef(new Animated.Value(isExpanded ? 1 : 0)).current;
  const hasOverdue = overdueCount > 0 || isOverdueGroup;

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
    <View style={[styles.wrapper, { backgroundColor: theme.colors.white }]}>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={onPress}
        style={[
          styles.container,
          { backgroundColor: theme.colors.white },
          isOverdueGroup && [
            styles.containerOverdue,
            { backgroundColor: theme.colors.destructiveLight, borderLeftColor: theme.colors.destructive },
          ],
        ]}
      >
        <View style={styles.leftContent}>
          <View style={styles.dateBlock}>
            <View style={styles.titleRow}>
              {isOverdueGroup && (
                <Ionicons
                  name="alert-circle"
                  size={18}
                  color={theme.colors.destructive as string}
                  style={styles.alertIcon}
                />
              )}
              <Text style={[
                styles.title,
                {
                  color: isOverdueGroup ? theme.colors.destructive : theme.colors.grey900,
                  fontWeight: isOverdueGroup ? '700' : '600',
                },
              ]}>
                {title}
              </Text>
            </View>
            <View style={styles.badges}>
              {count !== undefined && (
                <View
                  style={[
                    styles.countBadge,
                    {
                      backgroundColor:
                        isOverdueGroup || hasOverdue
                          ? theme.colors.destructiveLight
                          : 'rgba(0, 0, 0, 0.06)',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.countText,
                      {
                        color:
                          isOverdueGroup || hasOverdue
                            ? theme.colors.destructive
                            : theme.colors.grey600,
                      },
                    ]}
                  >
                    {count}{' '}
                    {count === 1 ? 'заказ' : count < 5 ? 'заказа' : 'заказов'}
                  </Text>
                </View>
              )}
              {hasOverdue && !isOverdueGroup && (
                <View style={[styles.overdueBadge, { backgroundColor: theme.colors.destructive }]}>
                  <Ionicons name="alert-circle" size={12} color={theme.colors.white as string} />
                  <Text style={styles.overdueText}>
                    {overdueCount}{' '}
                    {overdueCount === 1 ? 'просрочен' : 'просрочено'}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <Animated.View style={[styles.chevronWrapper, { transform: [{ rotate }] }]}>
          <Ionicons
            name="chevron-down"
            size={20}
            color={(isOverdueGroup ? theme.colors.destructive : (theme.colors.grey500 ?? theme.colors.grey400)) as string}
          />
        </Animated.View>
      </TouchableOpacity>

      <View style={[styles.divider, { backgroundColor: theme.colors.grey200 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 10,
    marginHorizontal: 4,
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  containerOverdue: {
    borderLeftWidth: 3,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  dateBlock: {
    flex: 1,
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  alertIcon: {
    marginRight: 2,
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
    gap: 8,
    flexWrap: 'wrap',
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  countText: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16,
  },
  overdueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  overdueText: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 11,
    lineHeight: 14,
    color: '#FFFFFF',
  },
  chevronWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    marginLeft: 8,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
    marginBottom: 4,
    opacity: 0.5,
  },
});

export default DateHeader;

