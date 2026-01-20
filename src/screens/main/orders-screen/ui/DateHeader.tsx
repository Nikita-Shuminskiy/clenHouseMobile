import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import useTheme from '@/src/shared/use-theme/use-theme';
import { CalendarIcon } from '@/src/shared/components/icons';

interface DateHeaderProps {
  title: string;
  isExpanded?: boolean;
  onPress?: () => void;
}

const DateHeader: React.FC<DateHeaderProps> = ({ title, onPress }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={styles.touchable}
      >
        <View 
          style={[
            styles.badge, 
            { 
              backgroundColor: theme.colors.white,
              shadowColor: theme.colors.black,
            }
          ]}
        >
          <View style={styles.content}>
            <CalendarIcon 
              width={14} 
              height={14} 
              color={theme.colors.primary500} 
            />
            <Text style={[styles.title, { color: theme.colors.grey900 }]}>
              {title}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  badge: {
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  touchable: {
    width: '100%',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.2,
    textTransform: 'capitalize',
  },
});

export default DateHeader;

