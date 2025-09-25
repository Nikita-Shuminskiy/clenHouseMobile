import React from "react";
import { SvgXml, XmlProps } from "react-native-svg";

export const BadgeNoneIcon = (props: Omit<XmlProps, "xml">) => {
  return (
    <SvgXml
      {...props}
      xml={`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="16" cy="16" r="16" fill="currentColor"/>
<circle cx="16" cy="16" r="12" fill="white"/>
<circle cx="16" cy="16" r="8" fill="currentColor"/>
</svg>`}
    />
  );
};
