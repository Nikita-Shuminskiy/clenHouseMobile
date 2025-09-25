import React from "react";
import { SvgXml, XmlProps } from "react-native-svg";

export const XCircle16Icon = (props: Omit<XmlProps, "xml">) => {
  return (
    <SvgXml
      {...props}
      xml={`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="8" cy="8" r="8" fill="currentColor"/>
<path d="M11 5L5 11M5 5L11 11" stroke="white" stroke-width="2" stroke-linecap="round"/>
</svg>`}
    />
  );
};
