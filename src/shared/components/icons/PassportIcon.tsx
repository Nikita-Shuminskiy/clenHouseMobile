import React from "react";
import { SvgXml, XmlProps } from "react-native-svg";

export const PassportIcon = (props: Omit<XmlProps, "xml">) => {
  return (
    <SvgXml
      {...props}
      xml={`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M24 4H8C6.9 4 6 4.9 6 6V26C6 27.1 6.9 28 8 28H24C25.1 28 26 27.1 26 26V6C26 4.9 25.1 4 24 4ZM24 26H8V6H24V26ZM16 8C13.79 8 12 9.79 12 12C12 14.21 13.79 16 16 16C18.21 16 20 14.21 20 12C20 9.79 18.21 8 16 8ZM16 14C14.9 14 14 13.1 14 12C14 10.9 14.9 10 16 10C17.1 10 18 10.9 18 12C18 13.1 17.1 14 16 14ZM16 18C12.69 18 10 20.69 10 24H22C22 20.69 19.31 18 16 18Z" fill="currentColor"/>
</svg>`}
    />
  );
};
