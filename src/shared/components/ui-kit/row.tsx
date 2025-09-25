import React from 'react';
import { View, ViewProps } from 'react-native';

interface RowProps extends ViewProps {
  children?: React.ReactNode;
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  gap?: number;
  flex?: number;
  flexWrap?: 'wrap' | 'nowrap';
}

export function Row({ 
  children, 
  style, 
  justifyContent = 'flex-start',
  alignItems = 'center',
  gap = 0,
  flex,
  flexWrap = 'nowrap',
  ...props 
}: RowProps) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
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
