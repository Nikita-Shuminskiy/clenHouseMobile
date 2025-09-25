import React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';


interface BadgeProps {
  children: React.ReactNode;
  type?: BadgeType;
  icon?: React.ComponentType<any>;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  type = 'type4',
  icon,
  style,
  textStyle,
}) => {
  // Получаем стили для выбранного типа
  const containerStyleFromType = BadgeContainerStyles[type];
  const textStyleFromType = BadgeTextStyles[type];
  const iconStyleFromType = BadgeIconStyles[type];

  // Определяем иконку
  const IconComponent = icon;

  return (
    <View style={[styles.container, containerStyleFromType, style]}>
      {/* Иконка слева */}
      {IconComponent && (
        <IconComponent style={iconStyleFromType} />
      )}
      
      {/* Текст */}
      {typeof children === 'string' ? (
        <Text style={[styles.text, textStyleFromType, textStyle]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
});

export default Badge;
