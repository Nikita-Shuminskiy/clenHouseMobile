import React from 'react';
import Svg, { ClipPath, Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

interface ShipGradientIconProps {
  width?: number;
  height?: number;
  color?: string;
}

const ShipGradientIcon: React.FC<ShipGradientIconProps> = ({
  width = 24,
  height = 24,
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient
          id="paint0_linear_3130_704"
          x1="21.9999"
          y1="16"
          x2="1.99988"
          y2="-7.49228e-07"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#15CDCA" />
          <Stop offset="1" stopColor="#81ECEA" />
        </LinearGradient>
        <ClipPath id="clip0_3130_704">
          <Rect width="24" height="24" fill="white" />
        </ClipPath>
      </Defs>
      <G clipPath="url(#clip0_3130_704)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.4215 0.857187C12.4215 0.496312 12.1954 0.17409 11.8561 0.0512398C11.5168 -0.0716111 11.1369 0.0312258 10.9059 0.308457L2.33443 10.5942C2.1215 10.8497 2.07561 11.2053 2.21668 11.5065C2.35775 11.8077 2.66032 12.0001 2.99291 12.0001H9.85704V15.5C11.4999 15.5 10.4999 15.5 12.4285 15.5V3.00304C12.4285 2.95745 12.4261 2.91242 12.4215 2.86807V0.857187ZM16.0823 3.76389C15.8587 3.47259 15.4745 3.35608 15.1268 3.47414C14.7791 3.59218 14.5452 3.91858 14.5452 4.28577V11.1429C14.5452 11.6163 14.929 12.0001 15.4023 12.0001H20.6654C20.9918 12.0001 21.29 11.8147 21.4343 11.522C21.5786 11.2292 21.5442 10.8799 21.3455 10.621L16.0823 3.76389Z"
          fill="url(#paint0_linear_3130_704)"
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.857148 15.4286C0.576022 15.4286 0.312768 15.5665 0.15264 15.7975C-0.00748736 16.0286 -0.0441298 16.3235 0.05458 16.5867L1.79174 21.2191C2.41901 22.8919 4.0181 24 5.80457 24H18.1954C19.9819 24 21.581 22.8919 22.2082 21.2191L23.9455 16.5867C24.0441 16.3235 24.0075 16.0286 23.8474 15.7975C23.6873 15.5665 23.424 15.4286 23.1429 15.4286H0.857148Z"
          fill="#15CDCA"
        />
      </G>
    </Svg>
  );
};

export default ShipGradientIcon;
