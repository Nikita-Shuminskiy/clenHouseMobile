import type React from "react";

declare global {
  type AvatarType = string;
  const AvatarContainerStyles: Record<string, any>;
  const AvatarTextStyles: Record<string, any>;

  type BadgeType = string;
  const BadgeContainerStyles: Record<string, any>;
  const BadgeTextStyles: Record<string, any>;
  const BadgeIconStyles: Record<string, any>;

  const BottomBarContainerStyles: any;
  const PriceBlockStyles: any;
  const MainPriceStyles: any;
  const SecondaryPriceStyles: any;
  const BottomBarButtonStyles: any;
  const BottomBarButtonTextStyles: any;

  const BottomSheetContainerStyles: any;
  const BottomSheetMainBlockStyles: any;
  const BottomSheetTitleStyles: any;
  const BottomSheetDescriptionStyles: any;
  const BottomSheetButtonStyles: any;
  const BottomSheetButtonTextStyles: any;

  const ClubCardContainerStyles: any;
  const PhotoBlockStyles: any;
  const ContentBlockStyles: any;
  const TitleAddressStyles: any;
  const TitleStyles: any;
  const AddressStyles: any;
  const PriceSuffixStyles: any;

  type CodeFieldState = string;
  const CodeFieldContainerStyles: any;
  const CodeFieldInputStyles: Record<string, any>;
  const CodeFieldTextStyles: Record<string, any>;
  const CodeFieldPlaceholderStyles: any;
  const CodeFieldErrorStyles: any;
  const CodeFieldWarningIconStyles: any;
  const CodeFieldErrorTextStyles: any;

  const DividerStyles: any;

  type DotState = string;
  const DotBarStyles: any;
  const DotStyles: Record<string, any>;

  const HandleStyles: any;

  type MetroMarkColor = string;
  const MetroMarkContainerStyles: Record<string, any>;
  const MetroMarkStyles: Record<string, any>;

  const PlansCardContainerStyles: any;
  const PlansCardTitleStyles: any;
  const PlansCardMainBlockStyles: any;
  const PlansCardLeftBlockStyles: any;
  const PlansCardDescriptionStyles: any;
  const PlansCardPriceBlockStyles: any;
  const PlansCardMainPriceStyles: any;
  const PlansCardPriceSuffixStyles: any;

  const ServiceCardContainerStyles: any;
  const ServiceCardTitleStyles: any;
  const ServiceCardPriceBlockStyles: any;
  const ServiceCardMainPriceStyles: any;
  const ServiceCardPriceSuffixStyles: any;

  type TabBarState = string;
  const TabBarContainerStyles: any;
  const TabBarItemStyles: Record<string, any>;
  const TabBarIconStyles: Record<string, any>;
  const TabBarTextStyles: Record<string, any>;

  type TagState = string;
  const TagContainerStyles: Record<string, any>;
  const TagTextStyles: Record<string, any>;

  const WarningIcon: React.ComponentType<any>;
  const HeartIcon: React.ComponentType<any>;
}

export {};
