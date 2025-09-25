import React from "react";
import { SvgXml, XmlProps } from "react-native-svg";

export const WidgetIcon = (props: Omit<XmlProps, "xml">) => {
  return (
    <SvgXml
      {...props}
      xml={`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13 13v8h8v-8h-8zM3 13v8h8V3H3zm0-10v8h8V3H3zm10 0v8h8V3h-8z" fill="currentColor"/>
</svg>`}
    />
  );
};
