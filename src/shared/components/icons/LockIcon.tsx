import React from "react";
import { SvgXml, XmlProps } from "react-native-svg";

export const LockIcon = (props: Omit<XmlProps, "xml">) => {
  return (
    <SvgXml
      {...props}
      xml={`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M24 12H22V10C22 6.69 19.31 4 16 4S10 6.69 10 10V12H8C6.9 12 6 12.9 6 14V28C6 29.1 6.9 30 8 30H24C25.1 30 26 29.1 26 28V14C26 12.9 25.1 12 24 12ZM16 26C14.9 26 14 25.1 14 24C14 22.9 14.9 22 16 22C17.1 22 18 22.9 18 24C18 25.1 17.1 26 16 26ZM18 12H14V10C14 7.79 15.79 6 18 6C20.21 6 22 7.79 22 10V12H18Z" fill="currentColor"/>
</svg>`}
    />
  );
};
