import { useFonts as useExpoFonts } from "expo-font";
import { LIGHT } from "../use-theme";

export const useFonts = () => {
  const [fontsLoaded, error] = useExpoFonts({
    "Onest-Regular": LIGHT.assets.OnestRegular,
    "Onest-Medium": LIGHT.assets.OnestMedium,
    "Onest-Bold": LIGHT.assets.OnestBold,
  });

  if (error) {
    console.log("Font loading error:", error);
  }

  console.log("Fonts loaded:", fontsLoaded, "Error:", error);
  return fontsLoaded;
};
