import React from "react";
import type { ColorValue } from "react-native";
import Svg, { Path } from "react-native-svg";

export const DoneIcon = ({
  width = 12,
  height = 8,
  color = "#FF5E00",
}: {
  width?: number;
  height?: number;
  color?: ColorValue;
}) => (
  <Svg width={width} height={height} viewBox="0 0 12 8" fill="none">
    <Path
      d="M1 4L4.2 7L11 1"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
