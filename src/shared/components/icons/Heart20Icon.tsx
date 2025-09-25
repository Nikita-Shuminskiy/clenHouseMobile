import React from "react";
import { SvgXml, XmlProps } from "react-native-svg";

export const Heart20Icon = (props: Omit<XmlProps, "xml">) => {
  return (
    <SvgXml
      {...props}
      xml={`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10 17.5l-1.45-1.32C4.4 13.36 1 10.28 1 6.5 1 3.42 3.42 1 6.5 1c1.74 0 3.41.81 4.5 2.09C12.09 1.81 13.76 1 16.5 1 19.58 1 22 3.42 22 6.5c0 3.78-3.4 6.86-8.55 11.54L10 17.5z" fill="currentColor"/>
</svg>`}
    />
  );
};
