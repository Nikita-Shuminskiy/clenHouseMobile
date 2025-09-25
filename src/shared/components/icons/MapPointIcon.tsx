import React from "react";
import { SvgXml, XmlProps } from "react-native-svg";

export const MapPointIcon = (props: Omit<XmlProps, "xml">) => {
  return (
    <SvgXml
      {...props}
      xml={`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8 0C4.42 0 1.5 2.92 1.5 6.5c0 4.5 6.5 9.5 6.5 9.5s6.5-5 6.5-9.5C14.5 2.92 11.58 0 8 0zm0 9.5c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" fill="currentColor"/>
</svg>`}
    />
  );
};
