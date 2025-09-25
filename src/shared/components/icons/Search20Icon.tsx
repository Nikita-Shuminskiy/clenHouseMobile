import React from "react";
import { SvgXml, XmlProps } from "react-native-svg";

export const Search20Icon = (props: Omit<XmlProps, "xml">) => {
  return (
    <SvgXml
      {...props}
      xml={`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.5 11.5h-.79l-.28-.27C12.41 9.59 13 8.11 13 6.5 13 2.91 10.09 0 6.5 0S0 2.91 0 6.5 2.91 13 6.5 13c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l4 3.99L16.49 15l-3.99-4zm-6 0C3.01 11.5 1 9.49 1 6.5S3.01 1.5 6.5 1.5 12 3.51 12 6.5 9.99 11.5 6.5 11.5z" fill="currentColor"/>
</svg>`}
    />
  );
};
