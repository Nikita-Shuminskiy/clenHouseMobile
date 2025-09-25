import React from "react";
import { SvgXml, XmlProps } from "react-native-svg";

export const WarningIcon = (props: Omit<XmlProps, "xml">) => {
  return (
    <SvgXml
      {...props}
      xml={`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8 1L1 15H15L8 1Z" fill="currentColor"/>
<path d="M8 6V10M8 12H8.01" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
</svg>`}
    />
  );
};
