import { Stack } from "expo-router";
import { ThemeProvider } from "@components/ThemeProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@components/AuthContext";
import { RequestProvider } from "@components/RequestContext";
import { BillPaymentProvider } from "@components/BillPaymentContext";
import { SettingsProvider } from "@/features/settings";
import "../global.css";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <SettingsProvider>
            <RequestProvider>
              <BillPaymentProvider>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="index" />
                  <Stack.Screen name="signup" />
                  <Stack.Screen name="(tabs)" />
                </Stack>
              </BillPaymentProvider>
            </RequestProvider>
          </SettingsProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
