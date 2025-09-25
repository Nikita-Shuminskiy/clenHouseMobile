import React from "react";
import { SvgXml, XmlProps } from "react-native-svg";

export const AnchorIcon = (props: Omit<XmlProps, "xml">) => {
  return (
    <SvgXml
      {...props}
      xml={`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17 15l1.55 1.55c-.96 1.69-3.33 3.04-5.55 3.37V11h3V9h-3V7.82C14.16 7.4 15 6.3 15 5c0-1.65-1.35-3-3-3S9 3.35 9 5c0 1.3.84 2.4 2 2.82V9H8v2h3v8.92c-2.22-.33-4.59-1.68-5.55-3.37L7 15c1.25-1.25 2-2.97 2-4.82 0-2.76-2.24-5-5-5s-5 2.24-5 5c0 1.85.75 3.57 2 4.82l1.55-1.55c.96-1.69 3.33-3.04 5.55-3.37V21h2v-8.92c2.22.33 4.59 1.68 5.55 3.37L17 15z" fill="currentColor"/>
</svg>`}
    />
  );
};
