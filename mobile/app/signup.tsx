import React, { useState } from "react";
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
import { Mail, Lock, User, Phone, ArrowRight } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/components/AuthContext";
import { authApi } from "@/lib/api";

const COUNTRY_CODES = ["US", "GB", "NG", "CA", "IN", "MX", "EG", "FR", "DE", "JP"];

export default function SignUpScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [wezeepId, setWezeepId] = useState("");
  const [homeCountry, setHomeCountry] = useState("US");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    if (!email.trim() || !password || !phoneNumber.trim() || !firstName.trim() || !lastName.trim() || !wezeepId.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await authApi.register({
        email: email.trim(),
        password,
        phoneNumber: phoneNumber.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        wezeepId: wezeepId.trim().replace(/^@/, ""),
        homeCountry,
      });
      await register(res.accessToken, res.refreshToken, {
        userId: res.userId,
        email: res.email,
        wezeepId: res.wezeepId,
      });
      router.replace("/(tabs)");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="px-6 py-4 border-b border-border">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-primary font-semibold">← Back</Text>
          </TouchableOpacity>
        </View>
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
        >
          <Text className="text-white text-3xl font-bold mb-2">Create account</Text>
          <Text className="text-white/90 text-base">Join Wezeep and send money easily</Text>
        </LinearGradient>
        <View className="px-6 mt-[-24px]">
          <View className="bg-card rounded-3xl p-6 shadow-lg border border-border">
            <View className="mb-4">
              <Text className="text-sm font-semibold text-foreground mb-2">Email *</Text>
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
                />
              </View>
            </View>
            <View className="mb-4">
              <Text className="text-sm font-semibold text-foreground mb-2">Password (min 8) *</Text>
              <View className="flex-row items-center bg-muted rounded-xl px-4 py-3 border border-border">
                <Lock className="text-muted-foreground mr-3" size={20} />
                <TextInput
                  className="flex-1 text-foreground text-base"
                  placeholder="Password"
                  placeholderTextColor="#a8a29e"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
              </View>
            </View>
            <View className="mb-4">
              <Text className="text-sm font-semibold text-foreground mb-2">Phone *</Text>
              <View className="flex-row items-center bg-muted rounded-xl px-4 py-3 border border-border">
                <Phone className="text-muted-foreground mr-3" size={20} />
                <TextInput
                  className="flex-1 text-foreground text-base"
                  placeholder="+1 234 567 8900"
                  placeholderTextColor="#a8a29e"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
            <View className="mb-4 flex-row gap-3">
              <View className="flex-1">
                <Text className="text-sm font-semibold text-foreground mb-2">First name *</Text>
                <View className="flex-row items-center bg-muted rounded-xl px-4 py-3 border border-border">
                  <User className="text-muted-foreground mr-2" size={18} />
                  <TextInput
                    className="flex-1 text-foreground"
                    placeholder="John"
                    placeholderTextColor="#a8a29e"
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                </View>
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-foreground mb-2">Last name *</Text>
                <View className="flex-row items-center bg-muted rounded-xl px-4 py-3 border border-border">
                  <TextInput
                    className="flex-1 text-foreground"
                    placeholder="Doe"
                    placeholderTextColor="#a8a29e"
                    value={lastName}
                    onChangeText={setLastName}
                  />
                </View>
              </View>
            </View>
            <View className="mb-4">
              <Text className="text-sm font-semibold text-foreground mb-2">Wezeep ID (alphanumeric) *</Text>
              <View className="flex-row items-center bg-muted rounded-xl px-4 py-3 border border-border">
                <Text className="text-muted-foreground mr-2">@</Text>
                <TextInput
                  className="flex-1 text-foreground text-base"
                  placeholder="johndoe"
                  placeholderTextColor="#a8a29e"
                  value={wezeepId}
                  onChangeText={(t) => setWezeepId(t.replace(/[^a-zA-Z0-9]/g, ""))}
                  autoCapitalize="none"
                />
              </View>
            </View>
            <View className="mb-6">
              <Text className="text-sm font-semibold text-foreground mb-2">Home country (ISO 2) *</Text>
              <View className="flex-row flex-wrap gap-2">
                {COUNTRY_CODES.map((code) => (
                  <TouchableOpacity
                    key={code}
                    onPress={() => setHomeCountry(code)}
                    className={`px-4 py-2 rounded-full ${homeCountry === code ? "bg-primary" : "bg-muted"}`}
                  >
                    <Text className={homeCountry === code ? "text-white font-bold" : "text-foreground"}>{code}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            {error ? <Text className="text-red-500 text-sm mb-3 text-center">{error}</Text> : null}
            <TouchableOpacity onPress={handleSignUp} disabled={loading}>
              <LinearGradient
                colors={["#667eea", "#764ba2"]}
                style={{ borderRadius: 16, paddingVertical: 16, flexDirection: "row", alignItems: "center", justifyContent: "center" }}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Text className="text-white font-bold text-base mr-2">Create account</Text>
                    <ArrowRight className="text-white" size={20} />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-row items-center justify-center mt-6 px-6">
          <Text className="text-muted-foreground text-sm">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-primary font-bold text-sm">Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
