import React from "react";
import { SvgXml, XmlProps } from "react-native-svg";

export const Badge10To99Icon = (props: Omit<XmlProps, "xml">) => {
  return (
    <SvgXml
      {...props}
      xml={`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="16" cy="16" r="16" fill="currentColor"/>
<text x="16" y="22" text-anchor="middle" fill="white" font-size="12" font-family="Arial" font-weight="bold">10-99</text>
</svg>`}
    />
  );
};
