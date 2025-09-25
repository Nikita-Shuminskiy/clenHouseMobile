import { Ionicons } from '@expo/vector-icons';
import React from 'react';

interface IconProps {
  name: keyof typeof iconMapping;
  size?: number;
  color?: string;
  style?: any;
}

// Маппинг названий иконок на Ionicons
const iconMapping = {
  // 24px иконки
  arrowBack: 'arrow-back',
  search: 'search',
  scaleMax: 'expand',
  scaleMin: 'contract',
  phone: 'call',
  notification: 'notifications',
  heart: 'heart',
  widget: 'grid',
  user: 'person',
  calendar: 'calendar',
  anchor: 'boat',
  ship: 'boat',
  vk: 'logo-vk',
  telegram: 'paper-plane',
  
  // 20px иконки
  edit: 'create',
  xCircle: 'close-circle',
  info: 'information-circle',
  readAll: 'book',
  reset: 'refresh',
  clean: 'trash',
  search20: 'search',
  phone20: 'call',
  heart20: 'heart',
  
  // 16px иконки
  warning: 'warning',
  mapPoint: 'location',
  closeLine: 'close',
  anchor16: 'boat',
  xCircle16: 'close-circle',
  
  // 32px иконки
  passport: 'card',
  verified: 'checkmark-circle',
  document: 'document',
  lock: 'lock-closed',
  eye: 'eye',
} as const;

export const Icon: React.FC<IconProps> = ({ name, size = 24, color = '#1A1A1A', style }) => {
  const iconName = iconMapping[name];
  
  if (!iconName) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  
  return <Ionicons name={iconName as any} size={size} color={color} style={style} />;
};

export default Icon;
