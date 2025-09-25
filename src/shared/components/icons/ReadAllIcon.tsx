import React from "react";
import { SvgXml, XmlProps } from "react-native-svg";

export const ReadAllIcon = (props: Omit<XmlProps, "xml">) => {
  return (
    <SvgXml
      {...props}
      xml={`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm-2 15l-5-5 1.41-1.41L8 13.17 13.59 7.58 15 9l-7 6z" fill="currentColor"/>
</svg>`}
    />
  );
};
