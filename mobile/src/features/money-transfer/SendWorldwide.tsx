import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Pressable,
  Image,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Search,
  Globe,
  ChevronDown,
  UserPlus,
  X,
  DollarSign,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const getCurrencySymbol = (currencyCode: string): string => {
  const symbols: { [key: string]: string } = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    CNY: "¥",
    INR: "₹",
    CAD: "C$",
    AUD: "A$",
    CHF: "Fr",
    KRW: "₩",
    RUB: "₽",
    BRL: "R$",
    ZAR: "R",
    MXN: "$",
    SGD: "S$",
    HKD: "HK$",
    NGN: "₦",
  };
  return symbols[currencyCode] || currencyCode;
};

type Country = {
  code: string;
  name: string;
  flag: string;
  currency: string;
};

type Recipient = {
  id: string;
  name: string;
  phone: string;
  country: Country;
  avatar: string;
};

const allCountries: Country[] = [
  { code: "US", name: "United States", flag: "🇺🇸", currency: "USD" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", currency: "GBP" },
  { code: "CA", name: "Canada", flag: "🇨🇦", currency: "CAD" },
  { code: "IN", name: "India", flag: "🇮🇳", currency: "INR" },
  { code: "MX", name: "Mexico", flag: "🇲🇽", currency: "MXN" },
  { code: "EG", name: "Egypt", flag: "🇪🇬", currency: "EGP" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", currency: "NGN" },
  { code: "FR", name: "France", flag: "🇫🇷", currency: "EUR" },
  { code: "DE", name: "Germany", flag: "🇩🇪", currency: "EUR" },
  { code: "JP", name: "Japan", flag: "🇯🇵", currency: "JPY" },
];

const mockRecipients: Recipient[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    phone: "+1 234 567 8900",
    country: allCountries.find((c) => c.code === "US")!,
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "2",
    name: "Ahmed Hassan",
    phone: "+20 123 456 7890",
    country: allCountries.find((c) => c.code === "EG")!,
    avatar: "",
  },
  {
    id: "3",
    name: "Maria Garcia",
    phone: "+52 987 654 3210",
    country: allCountries.find((c) => c.code === "MX")!,
    avatar: "https://i.pravatar.cc/150?img=9",
  },
  {
    id: "4",
    name: "Mario Garcia",
    phone: "+52 987 654 3210",
    country: allCountries.find((c) => c.code === "MX")!,
    avatar: "https://i.pravatar.cc/150?img=3",
  },
];

export default function SendWorldwideScreen() {
  const router = useRouter();
  const [countryQuery, setCountryQuery] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(allCountries[0]);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
  const [overlayMode, setOverlayMode] = useState<"confirm" | "contacts" | "addNew" | null>(null);
  const [newRecipientName, setNewRecipientName] = useState("");
  const [newRecipientPhone, setNewRecipientPhone] = useState("");

  const filteredCountries = countryQuery
    ? allCountries.filter((c) => c.name.toLowerCase().startsWith(countryQuery.toLowerCase()))
    : [];

  const handleCountrySelect = (country: Country) => {
    setCountryQuery("");
    setShowCountryDropdown(false);
    setSelectedCountry(country);
  };

  const handleContinue = () => {
    if (!selectedRecipient || !selectedCountry) {
      Alert.alert("Missing info", "Please select a recipient and country before continuing.");
      return;
    }
    router.push({
      pathname: "/send-worldwide-details",
      params: {
        recipientName: selectedRecipient.name,
        recipientPhone: selectedRecipient.phone,
        recipientCountry: selectedCountry.name,
        recipientCurrency: selectedCountry.currency,
        countryCode: selectedCountry.code,
      },
    } as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-border">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft className="text-foreground" size={24} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-foreground">Send Worldwide</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={["#667eea", "#764ba2"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 20, padding: 20, marginBottom: 24 }}>
          <Text className="text-white text-lg font-bold">Send money internationally</Text>
          <Text className="text-white/90 mt-2">Fast, cheap, and secure transfers.</Text>
        </LinearGradient>

        <View className="p-6 bg-card rounded-2xl border border-border">
          <Text className="text-sm font-semibold text-foreground mb-3">Select Country</Text>
          <TextInput
            value={countryQuery}
            onChangeText={(value) => {
              setCountryQuery(value);
              setShowCountryDropdown(true);
            }}
            onFocus={() => setShowCountryDropdown(true)}
            placeholder={selectedCountry ? selectedCountry.name : "Search country"}
            className="bg-background rounded-xl p-3"
          />

          {showCountryDropdown && (
            <View className="mt-4 border-t border-border pt-4">
              {filteredCountries.map(c => (
                <TouchableOpacity key={c.code} onPress={() => handleCountrySelect(c)} className="py-2">
                  <Text className="text-foreground">{c.flag} {c.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text className="text-sm font-semibold text-foreground mt-6 mb-3">Recipients</Text>
          {mockRecipients.map(r => (
            <TouchableOpacity key={r.id} onPress={() => { setSelectedRecipient(r); setOverlayMode('confirm'); }} className="flex-row items-center p-3 rounded-xl">
              <View className="w-10 h-10 rounded-full bg-muted items-center justify-center mr-3">
                <Text>{r.country.flag}</Text>
              </View>
              <View>
                <Text className="font-semibold text-foreground">{r.name}</Text>
                <Text className="text-xs text-muted-foreground">{r.phone}</Text>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            onPress={handleContinue}
            disabled={!selectedRecipient || !selectedCountry}
            className={`mt-6 rounded-2xl p-4 items-center ${!selectedRecipient || !selectedCountry ? "bg-muted" : "bg-primary"}`}
          >
            <Text className={`${!selectedRecipient || !selectedCountry ? "text-muted-foreground" : "text-white"} font-bold`}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
