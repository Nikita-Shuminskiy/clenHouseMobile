import { AppointmentsIcon } from "@/src/shared/components/icons/tabs-icon/apoitments-icon";
import { HomeIcon } from "@/src/shared/components/icons/tabs-icon/home-icon";
import { ProfileIcon } from "@/src/shared/components/icons/tabs-icon/profile-icon";
import useTheme from "@/src/shared/use-theme/use-theme";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import {
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProtectedLayout() {
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ state, descriptors, navigation }) => {
        return (
          <View
            style={{ position: "relative", backgroundColor: "transparent" }}
          >
            <LinearGradient
              colors={["#FFFFFF", "#FFFFFF"]}
            >
              <BlurView
                intensity={20}
                style={{
                  height: 90,
                  width: "100%",
                  paddingHorizontal: 16,
                }}
              ></BlurView>
            </LinearGradient>
            <View
              style={{
                backgroundColor: theme.colors.white,
                zIndex: 1000,
                boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
                position: "absolute",
                width: "90%",
                top: -insets.bottom + 10,
                left: screenWidth * 0.5,
                transform: [{ translateX: -(screenWidth * 0.45) }],
                borderRadius: 24,
                flexDirection: "row",
                gap: 40,
                justifyContent: "space-evenly",
                paddingVertical: 12,
                paddingHorizontal: 16,
              }}
            >
              {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;

                return (
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      minWidth: 42,
                      minHeight: 42,
                      gap: 5,
                    }}
                    onPress={() => navigation.navigate(route.name)}
                    key={route.key}
                  >
                    <View
                      style={{
                        width: 24,
                        height: 24,
                      }}
                    >
                      {options.tabBarIcon?.({
                        focused: isFocused,
                        color: isFocused ? String(theme.colors.primary500) : String(theme.colors.muted),
                        size: 24,
                      })}
                    </View>
                    <Text
                      style={{
                        color: isFocused ? String(theme.colors.primary500) : String(theme.colors.muted),
                        fontSize: 10,
                        lineHeight: 16,
                        fontWeight: "500",
                      }}
                    >
                      {options.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Главная",
          tabBarIcon: ({ color, size }) => <HomeIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Заказы",
          tabBarIcon: ({ color, size }) => <AppointmentsIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Профиль",
          tabBarIcon: ({ color, size }) => <ProfileIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
