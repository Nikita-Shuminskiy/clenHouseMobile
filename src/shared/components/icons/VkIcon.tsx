import React from "react";
import { SvgXml, XmlProps } from "react-native-svg";

export const VkIcon = (props: Omit<XmlProps, "xml">) => {
  return (
    <SvgXml
      {...props}
      xml={`<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_dd_1325_11957)">
<rect x="5" y="3.5" width="16" height="16" rx="8" fill="currentColor"/>
<path d="M12.468 15.596C12.028 15.596 11.616 15.524 11.232 15.38C10.848 15.236 10.516 15.016 10.236 14.72C9.964 14.416 9.78 14.04 9.684 13.592H11.004C11.132 13.88 11.344 14.096 11.64 14.24C11.944 14.376 12.252 14.444 12.564 14.444C12.964 14.444 13.296 14.364 13.56 14.204C13.824 14.036 14.032 13.812 14.184 13.532C14.344 13.244 14.456 12.928 14.52 12.584C14.592 12.232 14.628 11.872 14.628 11.504C14.628 11.464 14.628 11.424 14.628 11.384C14.628 11.336 14.628 11.296 14.628 11.264C14.468 11.552 14.26 11.784 14.004 11.96C13.756 12.136 13.484 12.26 13.188 12.332C12.892 12.404 12.596 12.44 12.3 12.44C11.804 12.44 11.348 12.34 10.932 12.14C10.524 11.932 10.2 11.628 9.96 11.228C9.72 10.828 9.6 10.344 9.6 9.776C9.6 9.192 9.728 8.688 9.984 8.264C10.248 7.832 10.608 7.5 11.064 7.268C11.52 7.036 12.036 6.92 12.612 6.92C13.236 6.92 13.756 7.048 14.172 7.304C14.588 7.56 14.916 7.908 15.156 8.348C15.396 8.78 15.564 9.26 15.66 9.788C15.764 10.308 15.816 10.832 15.816 11.36C15.816 11.952 15.756 12.504 15.636 13.016C15.516 13.528 15.324 13.98 15.06 14.372C14.796 14.756 14.448 15.056 14.016 15.272C13.592 15.488 13.076 15.596 12.468 15.596ZM12.54 11.324C12.868 11.324 13.16 11.256 13.416 11.12C13.68 10.976 13.884 10.788 14.028 10.556C14.18 10.316 14.256 10.048 14.256 9.752C14.256 9.416 14.18 9.124 14.028 8.876C13.884 8.62 13.684 8.424 13.428 8.288C13.18 8.144 12.896 8.072 12.576 8.072C12.24 8.072 11.944 8.144 11.688 8.288C11.44 8.432 11.244 8.628 11.1 8.876C10.956 9.124 10.884 9.396 10.884 9.692C10.884 10.188 11.028 10.584 11.316 10.88C11.612 11.176 12.02 11.324 12.54 11.324Z" fill="currentColor"/>
</g>
<defs>
<filter id="filter0_dd_1325_11957" x="0" y="0" width="26" height="26" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.960784 0 0 0 0 0.247059 0 0 0 0 0.247059 0 0 0 0.4 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1325_11957"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1.5"/>
<feGaussianBlur stdDeviation="2.5"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.960784 0 0 0 0 0.247059 0 0 0 0 0.247059 0 0 0 0.6 0"/>
<feBlend mode="normal" in2="effect1_dropShadow_1325_11957" result="effect2_dropShadow_1325_11957"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_1325_11957" result="shape"/>
</filter>
</defs>
</svg>`}
    />
  );
};
