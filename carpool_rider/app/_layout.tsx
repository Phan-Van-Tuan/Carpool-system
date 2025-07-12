import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, SplashScreen } from "expo-router";
import { useEffect } from "react";
import { ErrorBoundary } from "./error-boundary";
import { useThemeStore } from "@/store/themeStore";
import { getColors } from "@/constants/color";
import { useTranslation } from "@/constants/i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Create a client
const queryClient = new QueryClient();

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
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <RootLayoutNav />
          </QueryClientProvider>
        </ErrorBoundary>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

function RootLayoutNav() {
  const { theme } = useThemeStore();
  const colors = getColors(theme);
  const { t } = useTranslation();

  return (
    <>
      {/* <StatusBar style={theme === "dark" ? "light" : "dark"} /> */}
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.theme.background,
          },
          headerTintColor: colors.theme.text,
          headerTitleStyle: {
            fontWeight: "bold",
          },
          contentStyle: {
            backgroundColor: colors.theme.background,
          },
        }}
      >
        {/* Tab & Home */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Auth */}
        <Stack.Screen
          name="auth/login"
          options={{ title: t("auth.login"), headerShown: false }}
        />
        <Stack.Screen
          name="auth/register"
          options={{ title: t("auth.register"), headerShown: false }}
        />
        <Stack.Screen
          name="auth/verify-otp"
          options={{ title: t("auth.verifyPhone"), headerShown: false }}
        />
        <Stack.Screen
          name="auth/forgot-password"
          options={{ title: t("auth.forgotPassword"), headerShown: false }}
        />

        {/* Ride */}
        <Stack.Screen name="ride" />
        <Stack.Screen
          name="ride/options"
          options={{ title: t("booking.rideDetails") }}
        />
        <Stack.Screen
          name="ride/confirm"
          options={{ title: t("booking.confirmBooking") }}
        />
        <Stack.Screen
          name="ride/tracking"
          options={{
            title: t("booking.rideDetails"),
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="ride/booking"
          options={{
            title: t("booking.rideDetails"),
            headerShown: false,
            gestureEnabled: false,
          }}
        />

        {/* Trips */}
        <Stack.Screen name="trips" options={{ title: t("trips.myTrips") }} />
        <Stack.Screen
          name="trips/details"
          options={{ title: t("trips.tripDetails") }}
        />
        <Stack.Screen
          name="trips/receipt"
          options={{ title: t("trips.receipt") }}
        />
        <Stack.Screen
          name="trips/payment"
          options={{ title: t("trips.payment") }}
        />

        <Stack.Screen
          name="trips/map"
          options={{ title: t("trips.tripDetails") }}
        />

        {/* Profile */}
        <Stack.Screen
          name="profile/edit"
          options={{ title: t("profile.editProfile") }}
        />
        <Stack.Screen
          name="profile/payment-methods"
          options={{ title: t("profile.paymentMethods") }}
        />
        <Stack.Screen
          name="profile/saved-locations"
          options={{ title: t("profile.savedLocations") }}
        />
        <Stack.Screen
          name="profile/become-driver"
          options={{ title: t("profile.becomeDriver") }}
        />
        <Stack.Screen
          name="profile/settings"
          options={{ title: t("profile.settings") }}
        />
        <Stack.Screen
          name="profile/about"
          options={{ title: t("profile.about") }}
        />
        <Stack.Screen
          name="profile/policy"
          options={{ title: t("profile.policy") }}
        />
        <Stack.Screen
          name="profile/privacy"
          options={{ title: t("profile.privacy") }}
        />

        {/* Help */}
        <Stack.Screen name="help" options={{ title: t("help.helpCenter") }} />
        <Stack.Screen
          name="help/contact"
          options={{ title: t("help.contactUs") }}
        />
        <Stack.Screen
          name="help/report"
          options={{ title: t("help.reportIssue") }}
        />

        {/* Modal */}
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </>
  );
}
