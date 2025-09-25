import React from "react";
import { SvgXml, XmlProps } from "react-native-svg";

export const Anchor16Icon = (props: Omit<XmlProps, "xml">) => {
  return (
    <SvgXml
      {...props}
      xml={`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.5 12l1.55 1.55c-.96 1.69-3.33 3.04-5.55 3.37V7h2.5V5.5H5V4.32C6.16 3.9 7 2.8 7 1.5 7 0.85 6.15 0 5.5 0S4 0.85 4 1.5c0 1.3.84 2.4 2 2.82V5.5H2.5V7H5v8.92c-2.22-.33-4.59-1.68-5.55-3.37L3.5 12c1.25-1.25 2-2.97 2-4.82 0-2.76-2.24-5-5-5s-5 2.24-5 5c0 1.85.75 3.57 2 4.82l1.55-1.55c.96-1.69 3.33-3.04 5.55-3.37V15h2.5v-8.92c2.22.33 4.59 1.68 5.55 3.37L8.5 12z" fill="currentColor"/>
</svg>`}
    />
  );
};
