import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/components/AuthContext";
import { authApi } from "@/lib/api";

export default function LoginScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/(tabs)");
    }
  }, [authLoading, isAuthenticated, router]);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await authApi.login({ email: email.trim(), password });
      await login(res.accessToken, res.refreshToken, {
        userId: res.userId,
        email: res.email,
        wezeepId: res.wezeepId,
      });
      router.replace("/(tabs)");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

return (
<SafeAreaView className="flex-1 bg-background">
<ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
{/* Hero Section with Gradient */}
<LinearGradient
colors={["#667eea", "#764ba2"]}
style={{
paddingHorizontal: 24,
paddingTop: 40,
paddingBottom: 60,
borderBottomLeftRadius: 32,
borderBottomRightRadius: 32,
}}
>
<View className="items-center">
{/* Logo/Brand */}
<View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mb-4">
<Text className="text-white text-3xl font-bold">W</Text>
</View>
<Text className="text-white text-4xl font-bold mb-2">
Welcome Back
</Text>
<Text className="text-white/90 text-base text-center">
Sign in to continue your financial journey
</Text>
</View>
</LinearGradient>

{/* Login Form Card */}
<View className="px-6 mt-[-40px]">
<View className="bg-card rounded-3xl p-6 shadow-lg border border-border">
{/* Email Input */}
<View className="mb-5">
<Text className="text-sm font-semibold text-foreground mb-2">
Email Address
</Text>
<View className="flex-row items-center bg-muted rounded-xl px-4 py-3 border border-border">
<Mail className="text-muted-foreground mr-3" size={20} />
<TextInput
className="flex-1 text-foreground text-base"
placeholder="your.email@example.com"
placeholderTextColor="#a8a29e"
value={email}
onChangeText={setEmail}
keyboardType="email-address"
autoCapitalize="none"
autoComplete="email"
/>
</View>
</View>

{/* Password Input */}
<View className="mb-3">
<Text className="text-sm font-semibold text-foreground mb-2">
Password
</Text>
<View className="flex-row items-center bg-muted rounded-xl px-4 py-3 border border-border">
<Lock className="text-muted-foreground mr-3" size={20} />
<TextInput
className="flex-1 text-foreground text-base"
placeholder="Enter your password"
placeholderTextColor="#a8a29e"
value={password}
onChangeText={setPassword}
secureTextEntry={!showPassword}
autoCapitalize="none"
autoComplete="password"
/>
<TouchableOpacity
onPress={() => setShowPassword(!showPassword)}
>
{showPassword ? (
<EyeOff className="text-muted-foreground" size={20} />
) : (
<Eye className="text-muted-foreground" size={20} />
)}
</TouchableOpacity>
</View>
</View>

{/* Forgot Password */}
<TouchableOpacity className="self-end mb-6">
<Text className="text-primary font-semibold text-sm">
Forgot Password?
</Text>
</TouchableOpacity>

{/* Login Button */}
<TouchableOpacity onPress={handleLogin}>
<LinearGradient
colors={["#667eea", "#764ba2"]}
style={{
borderRadius: 16,
paddingVertical: 16,
flexDirection: "row",
alignItems: "center",
justifyContent: "center",
}}
>
<Text className="text-white font-bold text-base mr-2">
Sign In
</Text>
<ArrowRight className="text-white" size={20} />
</LinearGradient>
</TouchableOpacity>

{/* Social Login Options */}
<View className="mt-6">
<Text className="text-muted-foreground text-sm text-center mb-4">
Or sign in with
</Text>
<View className="flex-row items-center justify-center gap-4">
{/* Google */}
<TouchableOpacity className="w-14 h-14 bg-white rounded-full items-center justify-center border border-border shadow-sm">
<Text className="text-2xl">G</Text>
</TouchableOpacity>
{/* Facebook */}
<TouchableOpacity className="w-14 h-14 bg-[#1877F2] rounded-full items-center justify-center shadow-sm">
<Text className="text-white text-xl font-bold">f</Text>
</TouchableOpacity>
{/* Apple */}
<TouchableOpacity className="w-14 h-14 bg-black rounded-full items-center justify-center shadow-sm">
<Text className="text-white text-2xl"></Text>
</TouchableOpacity>
</View>
</View>
</View>
</View>

{/* Security Features */}
<View className="px-6 mt-8">
<View className="flex-row items-center justify-center gap-6">
<View className="items-center">
<View className="w-12 h-12 bg-accent/20 rounded-full items-center justify-center mb-2">
<Text className="text-xl">🔒</Text>
</View>
<Text className="text-muted-foreground text-xs">Encrypted</Text>
</View>
<View className="items-center">
<View className="w-12 h-12 bg-accent/20 rounded-full items-center justify-center mb-2">
<Text className="text-xl">🛡️</Text>
</View>
<Text className="text-muted-foreground text-xs">Secure</Text>
</View>
<View className="items-center">
<View className="w-12 h-12 bg-accent/20 rounded-full items-center justify-center mb-2">
<Text className="text-xl">⚡</Text>
</View>
<Text className="text-muted-foreground text-xs">Fast</Text>
</View>
</View>
</View>

{/* Sign Up Link */}
<View className="flex-row items-center justify-center mt-8 px-6">
  <Text className="text-muted-foreground text-sm">Don't have an account? </Text>
  <TouchableOpacity onPress={() => router.push("/signup")}>
    <Text className="text-primary font-bold text-sm">Sign Up</Text>
  </TouchableOpacity>
</View>

{/* Terms & Privacy */}
<View className="px-6 mt-6">
<Text className="text-muted-foreground text-xs text-center leading-5">
By signing in, you agree to our{" "}
<Text className="text-primary">Terms of Service</Text> and{" "}
<Text className="text-primary">Privacy Policy</Text>
</Text>
</View>
</ScrollView>
</SafeAreaView>
);
}