import React from "react";
import { SvgXml, XmlProps } from "react-native-svg";

export const XCircle20Icon = (props: Omit<XmlProps, "xml">) => {
  return (
    <SvgXml
      {...props}
      xml={`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="10" cy="10" r="10" fill="currentColor"/>
<path d="M13.5 6.5L6.5 13.5M6.5 6.5L13.5 13.5" stroke="white" stroke-width="2" stroke-linecap="round"/>
</svg>`}
    />
  );
};
