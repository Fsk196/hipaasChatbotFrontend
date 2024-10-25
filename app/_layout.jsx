import { Provider } from "react-redux";
import store from "../store/store";
import { useFonts } from "expo-font";
import { SplashScreen, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { useSelector } from "react-redux";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;

  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

const AppContent = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const segments = useSegments();
  const router = useRouter();

  console.log("Logged: ", isLoggedIn);

  const isAuthGroup = segments[0] === "chatscreen";
  useEffect(() => {
    console.log("AuthGroup: ", isAuthGroup);

    if (!isLoggedIn && isAuthGroup) {
      router.replace("/");
    } else if (isLoggedIn === true) {
      router.replace("chatscreen");
    }
  }, [isLoggedIn, isAuthGroup]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="chatscreen" />
      </Stack>

      <StatusBar backgroundColor="#000" style="dark" />
    </>
  );
};
