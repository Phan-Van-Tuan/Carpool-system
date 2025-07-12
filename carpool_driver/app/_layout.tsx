import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ErrorBoundary } from "./error-boundary";
import { TripProvider } from "@/contexts/TripContext";
import { EarningsProvider } from "@/contexts/EarningsContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <TripProvider>
            <EarningsProvider>
              <RootLayoutNav />
            </EarningsProvider>
          </TripProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#121212",
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        contentStyle: {
          backgroundColor: "#121212",
        },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ headerShown: false }} />
      <Stack.Screen name="error-boundary" options={{ headerShown: false }} />
      <Stack.Screen
        name="trip/[id]"
        options={{
          title: "Trip Details",
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="trip/active"
        options={{
          title: "Active Trip",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
