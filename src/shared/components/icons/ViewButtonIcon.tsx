import React from "react";
import { SvgXml, XmlProps } from "react-native-svg";

export const ViewButtonIcon = (props: Omit<XmlProps, "xml">) => {
  return (
    <SvgXml
      {...props}
      xml={`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16 8C9.37 8 3.57 12.06 1.43 17.5C3.57 22.94 9.37 27 16 27C22.63 27 28.43 22.94 30.57 17.5C28.43 12.06 22.63 8 16 8ZM16 24C12.69 24 10 21.31 10 18C10 14.69 12.69 12 16 12C19.31 12 22 14.69 22 18C22 21.31 19.31 24 16 24ZM16 14C13.79 14 12 15.79 12 18C12 20.21 13.79 22 16 22C18.21 22 20 20.21 20 18C20 15.79 18.21 14 16 14Z" fill="currentColor"/>
</svg>`}
    />
  );
};
