import React from "react";
import { SvgXml, XmlProps } from "react-native-svg";

export const ResetIcon = (props: Omit<XmlProps, "xml">) => {
  return (
    <SvgXml
      {...props}
      xml={`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10 3c-3.87 0-7 3.13-7 7s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" fill="currentColor"/>
<path d="M10 6c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="currentColor"/>
</svg>`}
    />
  );
};
