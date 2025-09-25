import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { useTheme } from '../../use-theme';

interface TabItem {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  state?: 'default' | 'active' | 'disabled';
  notificationCount?: number;
}

interface TabsProps {
  type?: 'type1' | 'type2' | 'type3';
  items: TabItem[];
  activeTabId?: string;
  onTabPress?: (tabId: string) => void;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
}

const Tabs: React.FC<TabsProps> = ({
  type = 'type1',
  items,
  activeTabId,
  onTabPress,
  style,
  containerStyle,
}) => {
  const { colors, fonts, weights, sizes } = useTheme();
  
  const handleTabPress = (tabId: string) => {
    onTabPress?.(tabId);
  };

  const getTabState = (item: TabItem): 'default' | 'active' | 'disabled' => {
    if (item.state) return item.state;
    if (item.id === activeTabId) return 'active';
    return 'default';
  };

  const renderTabIcon = (item: TabItem, tabState: 'default' | 'active' | 'disabled') => {
    if (!item.icon) return null;

    return (
      <View style={styles.iconContainer}>
        {/* Иконка пока не реализована */}
      </View>
    );
  };

  const getTabItemStyle = (tabState: 'default' | 'active' | 'disabled') => {
    if (type === 'type3') {
      if (tabState === 'active') {
        return { backgroundColor: '#EFF3F8' };
      }
      return { backgroundColor: 'transparent' };
    }
    
    if (tabState === 'active') {
      return { backgroundColor: colors.primary500 };
    }
    return { backgroundColor: colors.white };
  };

  const getTabTextStyle = (tabState: 'default' | 'active' | 'disabled') => {
    if (type === 'type3') {
      if (tabState === 'active') {
        return { color: '#1A1A1A', fontWeight: '500' as any };
      }
      return { color: '#A1B0CA', fontWeight: '500' as any };
    }
    
    if (tabState === 'active') {
      return { color: colors.white, fontWeight: weights.medium };
    }
    return { color: colors.black, fontWeight: weights.normal };
  };

  const getTabDescriptionStyle = (tabState: 'default' | 'active' | 'disabled') => {
    if (tabState === 'active') {
      return { color: colors.white };
    }
    return { color: colors.grey500 };
  };

  const renderNotificationBadge = (item: TabItem) => {
    if (!item.notificationCount) return null;

    return (
      <View style={[styles.notificationBadge, { backgroundColor: colors.red }]}>
        <Text style={[styles.notificationText, { color: colors.white }]}>
          {item.notificationCount > 99 ? '99+' : item.notificationCount}
        </Text>
      </View>
    );
  };

  const getContainerStyle = () => {
    if (type === 'type3') {
      return {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 8,
        shadowColor: '#1A1A1A',
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 0.05,
        shadowRadius: 50,
        elevation: 6,
      };
    }
    return {};
  };

  const getTabsContainerStyle = () => {
    if (type === 'type3') {
      return {
        flexDirection: 'row' as const,
        gap: 4,
      };
    }
    return {};
  };

  const getTabItemStyleForType3 = () => {
    if (type === 'type3') {
      return {
        borderRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 8,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
      };
    }
    return {};
  };

  const getTabTitleStyleForType3 = () => {
    if (type === 'type3') {
      return {
        fontFamily: 'Inter',
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center' as const,
      };
    }
    return {};
  };

  return (
    <View style={[styles.container, getContainerStyle(), containerStyle]}>
      <View style={[styles.tabsContainer, getTabsContainerStyle(), style]}>
        {items.map((item) => {
          const tabState = getTabState(item);
          const tabItemStyle = getTabItemStyle(tabState);
          const tabTextStyle = getTabTextStyle(tabState);
          const tabDescriptionStyle = getTabDescriptionStyle(tabState);

          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.tabItem, 
                tabItemStyle, 
                getTabItemStyleForType3()
              ]}
              onPress={() => handleTabPress(item.id)}
              activeOpacity={0.7}
            >
              {/* Иконка */}
              {renderTabIcon(item, tabState)}
              
              {/* Текст и описание */}
              <View style={[
                styles.textContainer,
                type === 'type3' && { padding: 4 }
              ]}>
                <Text style={[
                  styles.tabTitle, 
                  tabTextStyle, 
                  getTabTitleStyleForType3()
                ]}>
                  {item.title}
                </Text>
                {item.description && (
                  <Text style={[styles.tabDescription, tabDescriptionStyle]}>
                    {item.description}
                  </Text>
                )}
              </View>
              
              {/* Notification badge */}
              {renderNotificationBadge(item)}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  tabsContainer: {
    alignItems: 'stretch',
  },
  tabItem: {
    flex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    color: '#A1B0CA', // Цвет иконки по умолчанию
  },
  textContainer: {
    alignItems: 'center',
    gap: 4,
  },
  tabTitle: {
    textAlign: 'center',
  },
  tabDescription: {
    textAlign: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  notificationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
});

export default Tabs;
