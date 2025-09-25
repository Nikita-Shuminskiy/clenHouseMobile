import React from 'react';
import { ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface EmailIconProps {
  style?: ViewStyle;
  color?: string;
  size?: number;
}

const EmailIcon: React.FC<EmailIconProps> = ({ 
  style, 
  color = '#1A1A1A', 
  size = 24 
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Path
        d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12 15C8.90994 15 7.41049 15.8302 6.68262 17.1631C6.33152 17.8061 6.58951 18.5959 7.19336 19.0107C8.56057 19.9499 10.2159 20.5 12 20.5C13.7841 20.5 15.4394 19.9499 16.8066 19.0107C17.4104 18.5959 17.6685 17.8061 17.3174 17.1631C16.5895 15.8303 15.0901 15 12 15ZM12 6C10.3432 6 9 7.34315 9 9C9 10.6569 10.3432 12 12 12C13.6569 12 15 10.6569 15 9C15 7.34317 13.6569 6.00003 12 6Z"
        fill={color}
      />
    </Svg>
  );
};

export { EmailIcon };
