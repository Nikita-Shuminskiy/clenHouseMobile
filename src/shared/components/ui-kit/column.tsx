import React from 'react';
import { View, ViewProps } from 'react-native';

interface ColumnProps extends ViewProps {
  children?: React.ReactNode;
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  gap?: number;
  flex?: number;
  flexWrap?: 'wrap' | 'nowrap';
}

export function Column({ 
  children, 
  style, 
  justifyContent = 'flex-start',
  alignItems = 'stretch',
  gap = 0,
  flex = 0,
  flexWrap = 'nowrap',
  ...props 
}: ColumnProps) {
  return (
    <View
      style={[
        {
          flexDirection: 'column',
          justifyContent,
          alignItems,
          flex,
          flexWrap,
          gap,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
