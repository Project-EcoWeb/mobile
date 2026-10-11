import { useWindowDimensions } from "react-native";
import { getResponsiveLayout } from "../src/utils/responsiveLayout";

/** Breakpoints also account for the user's preferred text size. */
export function useResponsiveLayout() {
  const { width, height, fontScale } = useWindowDimensions();
  return getResponsiveLayout(width, height, fontScale);
}
