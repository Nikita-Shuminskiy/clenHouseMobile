import React from "react";
import { SvgXml, XmlProps } from "react-native-svg";

export const TagDefaultIcon = (props: Omit<XmlProps, "xml">) => {
  return (
    <SvgXml
      {...props}
      xml={`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21.41 11.58L20.42 10.59L12.59 18.42L11.58 17.41L19.41 9.58L21.41 11.58ZM22.83 9.17L20.83 7.17L19.42 8.58L21.42 10.58L22.83 9.17ZM24 6L18 12L16.59 10.59L22.59 4.59L24 6ZM6 18L12 24L13.41 22.59L7.41 16.59L6 18Z" fill="currentColor"/>
</svg>`}
    />
  );
};
