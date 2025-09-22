import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { View } from "react-native";

export default function RootLayout() {
  const [loaded] = useFonts({
    Anton: require("../assets/fonts/Anton-Regular.ttf"),
    PlusJakartaSans: require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "PlusJakartaSans-Medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "PlusJakartaSans-SemiBold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  if (!loaded) return <View style={{ flex:1, backgroundColor:"#0F0F12" }} />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0F0F12" }
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="splash" />
      <Stack.Screen name="main" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(modals)/log-live" options={{ presentation: 'modal' }} />
      <Stack.Screen name="(modals)/log-post-game" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
