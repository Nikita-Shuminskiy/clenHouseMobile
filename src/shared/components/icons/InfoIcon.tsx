import React from "react";
import { SvgXml, XmlProps } from "react-native-svg";

export const InfoIcon = (props: Omit<XmlProps, "xml">) => {
  return (
    <SvgXml
      {...props}
      xml={`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9V9h2v6zm0-8H9V7h2v0z" fill="currentColor"/>
</svg>`}
    />
  );
};
