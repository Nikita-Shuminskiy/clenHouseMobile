import React from "react";
import { SvgXml, XmlProps } from "react-native-svg";

export const DocumentIcon = (props: Omit<XmlProps, "xml">) => {
  return (
    <SvgXml
      {...props}
      xml={`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14 2H6C4.9 2 4 2.9 4 4V28C4 29.1 4.9 30 6 30H26C27.1 30 28 29.1 28 28V12L14 2Z" fill="currentColor"/>
</svg>`}
    />
  );
};
