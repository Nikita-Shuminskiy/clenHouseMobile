import React from "react";
import { SvgXml, XmlProps } from "react-native-svg";

export const VerifiedIcon = (props: Omit<XmlProps, "xml">) => {
  return (
    <SvgXml
      {...props}
      xml={`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16 2L18.09 8.26L26 9L18.09 9.74L16 16L13.91 9.74L6 9L13.91 8.26L16 2Z" fill="currentColor"/>
<path d="M16 18L18.09 24.26L26 25L18.09 25.74L16 32L13.91 25.74L6 25L13.91 24.26L16 18Z" fill="currentColor"/>
</svg>`}
    />
  );
};
