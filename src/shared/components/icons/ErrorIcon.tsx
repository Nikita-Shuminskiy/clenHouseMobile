import React from 'react';
import { Svg, Path } from 'react-native-svg';

interface ErrorIconProps {
  width?: number;
  height?: number;
  color?: string;
}

const ErrorIcon: React.FC<ErrorIconProps> = ({
  width = 12,
  height = 12,
  color = '#F53F3F',
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 12 12" fill="none">
      <Path
        d="M6 0C9.31802 0 11.9999 2.68859 12 6C12 9.31266 9.31806 12 6 12C2.68799 11.9999 0 9.31262 0 6C5.75444e-05 2.68863 2.68803 5.72227e-05 6 0ZM6 7.75879C5.71204 7.75885 5.47852 7.99328 5.47852 8.28125C5.47878 8.56896 5.71214 8.80846 6.00586 8.80859C6.2937 8.80859 6.52806 8.56904 6.52832 8.28125C6.52832 7.99324 6.294 7.75879 6 7.75879ZM6 3.19824C5.71206 3.19832 5.47168 3.4392 5.47168 3.72656V6.37793C5.47168 6.66649 5.71206 6.90031 6 6.90039C6.288 6.90039 6.52246 6.66653 6.52246 6.37793V3.72656C6.52246 3.43916 6.288 3.19824 6 3.19824Z"
        fill={color}
      />
    </Svg>
  );
};

export default ErrorIcon;
