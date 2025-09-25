import React from "react";
import { SvgXml, XmlProps } from "react-native-svg";

export const TextButtonBaseIcon = (props: Omit<XmlProps, "xml">) => {
  return (
    <SvgXml
      {...props}
      xml={`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="32" height="32" rx="8" fill="currentColor"/>
<text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-family="Arial">Text</text>
</svg>`}
    />
  );
};
