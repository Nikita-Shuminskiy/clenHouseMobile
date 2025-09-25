import React from "react";
import { SvgXml, XmlProps } from "react-native-svg";

export const CleanIcon = (props: Omit<XmlProps, "xml">) => {
  return (
    <SvgXml
      {...props}
      xml={`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm5 13.59L13.59 15 10 11.41 6.41 15 5 13.59 8.59 10 5 6.41 6.41 5 10 8.59 13.59 5 15 6.41 11.41 10 15 13.59z" fill="currentColor"/>
</svg>`}
    />
  );
};
