import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import { HARVEST_COLORS } from '../../harvest-theme';

interface DotIconProps {
  width?: number;
  height?: number;
  color?: string;
}

const DotIcon: React.FC<DotIconProps> = ({ 
  width = 4, 
  height = 4, 
  color = HARVEST_COLORS.danger
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 4 4" fill="none">
      <Circle cx="2" cy="2" r="2" fill={color} />
    </Svg>
  );
};

export default DotIcon;
