import { Stack } from "expo-router";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RequestProvider } from "@/components/RequestContext";
import { BillPaymentProvider } from "@/components/BillPaymentContext";
import "@/global.css";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <RequestProvider>
          <BillPaymentProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="login" />
              <Stack.Screen name="(tabs)" />
            </Stack>
          </BillPaymentProvider>
        </RequestProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
