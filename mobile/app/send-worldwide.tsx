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
const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(
null
);
const [overlayMode, setOverlayMode] = useState<
"confirm" | "contacts" | "addNew" | null
>(null);
const [newRecipientName, setNewRecipientName] = useState("");
const [newRecipientPhone, setNewRecipientPhone] = useState("");

const filteredCountries = countryQuery
? allCountries.filter((c) =>
c.name.toLowerCase().startsWith(countryQuery.toLowerCase())
)
: [];

const handleCountrySelect = (country: Country) => {
setCountryQuery("");
setShowCountryDropdown(false);
setSelectedCountry(country);
};

const handleRecentRecipientClick = (recipient: Recipient) => {
if (!selectedCountry) {
alert("Please select a country first");
return;
}
setSelectedRecipient(recipient);
setOverlayMode("confirm");
};

const handleSelectExistingClick = () => {
if (!selectedCountry) {
alert("Please select a country first");
return;
}
setOverlayMode("contacts");
};

const handleAddNewClick = () => {
if (!selectedCountry) {
alert("Please select a country first");
return;
}
setNewRecipientName("");
setNewRecipientPhone("");
setOverlayMode("addNew");
};

const handleContactSelect = (recipient: Recipient) => {
setSelectedRecipient(recipient);
setOverlayMode("confirm");
};

const handleAddNewSubmit = () => {
if (!newRecipientName || !newRecipientPhone) {
alert("Please fill in all fields");
return;
}
const newRecipient: Recipient = {
id: "new",
name: newRecipientName,
phone: newRecipientPhone,
country: selectedCountry!,
avatar: "",
};
setSelectedRecipient(newRecipient);
setOverlayMode("confirm");
};

const handleContinue = () => {
router.push({
pathname: "/send-worldwide-details",
params: {
recipientName: selectedRecipient!.name,
recipientPhone: selectedRecipient!.phone,
recipientCountry: selectedCountry!.name,
recipientCurrency: selectedCountry!.currency,
countryCode: selectedCountry!.code,
},
});
};

return (
<SafeAreaView className="flex-1 bg-background">
{/* Header */}
<View className="flex-row items-center justify-between px-6 py-4 border-b border-border">
<TouchableOpacity onPress={() => router.back()}>
<ArrowLeft className="text-foreground" size={24} />
</TouchableOpacity>
<Text className="text-xl font-bold text-foreground">
Send Worldwide
</Text>
<View style={{ width: 24 }} />
</View>

<ScrollView
contentContainerStyle={{ padding: 24, paddingBottom: 120 }}
showsVerticalScrollIndicator={false}
>
{/* Hero Section with Gradient */}
<LinearGradient
colors={["#667eea", "#764ba2"]}
start={{ x: 0, y: 0 }}
end={{ x: 1, y: 1 }}
style={{
borderRadius: 20,
padding: 20,
marginBottom: 24,
}}
>
<View className="flex-row items-center justify-between mb-2">
<View className="flex-1">
<Text className="text-white/80 text-xs font-bold uppercase tracking-wide mb-1.5">
Fast & Secure
</Text>
<Text className="text-white text-xl font-bold">
Send Money Globally
</Text>
</View>
<View className="w-14 h-14 bg-white/20 rounded-full items-center justify-center">
<Globe className="text-white" size={26} />
</View>
</View>
<Text className="text-white/90 text-sm leading-relaxed">
Transfer to 150+ countries with competitive rates
</Text>
</LinearGradient>

{/* Country Search */}
<View className="mb-6">
<Text className="text-sm font-semibold text-foreground mb-3">
Select Destination
</Text>
<View className="relative z-50">
<View className="flex-row items-center bg-card border-2 border-border rounded-2xl px-4 py-3.5">
<Search className="text-primary mr-3" size={20} />
<TextInput
placeholder="Search countries..."
placeholderTextColor="#9ca3af"
value={countryQuery}
onChangeText={(text) => {
setCountryQuery(text);
setShowCountryDropdown(text.length > 0);
}}
onFocus={() => {
if (countryQuery.length > 0) setShowCountryDropdown(true);
}}
className="flex-1 text-foreground text-base"
style={{ outlineStyle: "none" } as any}
/>
{countryQuery.length > 0 && (
<TouchableOpacity
onPress={() => {
setCountryQuery("");
setShowCountryDropdown(false);
}}
>
<X className="text-muted-foreground" size={18} />
</TouchableOpacity>
)}
</View>

{/* Country Dropdown */}
{showCountryDropdown && filteredCountries.length > 0 && (
<View
className="absolute top-full left-0 right-0 mt-2 bg-card border-2 border-primary rounded-2xl shadow-lg overflow-hidden z-50"
style={{ maxHeight: 300 }}
>
<ScrollView
showsVerticalScrollIndicator={true}
nestedScrollEnabled={true}
keyboardShouldPersistTaps="handled"
contentContainerStyle={{ paddingVertical: 6 }}
>
{filteredCountries.map((country, index) => (
<Pressable
key={country.code}
onPress={() => handleCountrySelect(country)}
className={`flex-row items-center px-4 py-3 ${
index < filteredCountries.length - 1
? "border-b border-border"
: ""
}`}
>
<Image
source={{
uri: `https://flagcdn.com/w80/${country.code.toLowerCase()}.png`,
}}
className="w-12 h-8 rounded mr-3"
resizeMode="cover"
/>
<View className="flex-1">
<Text
className="text-base font-bold text-foreground"
numberOfLines={1}
>
{country.name}
</Text>
<View className="flex-row items-center gap-2 mt-1">
<View className="bg-muted px-2 py-0.5 rounded">
<Text className="text-xs font-semibold text-muted-foreground">
{country.code}
</Text>
</View>
<View className="flex-row items-center bg-primary/10 px-2 py-0.5 rounded">
<DollarSign className="text-primary" size={11} />
<Text className="text-xs text-primary font-bold ml-0.5">
{country.currency}
</Text>
</View>
</View>
</View>
<ChevronDown
className="text-primary"
size={18}
style={{ transform: [{ rotate: "-90deg" }] }}
/>
</Pressable>
))}
</ScrollView>
</View>
)}
</View>
</View>

{/* Popular Destinations - Clean & Minimal */}
<View className="mb-6">
<Text className="text-sm font-semibold text-foreground mb-3">
Popular Destinations
</Text>

<View className="flex-row" style={{ gap: 10 }}>
{[
allCountries.find((c) => c.code === "US"),
allCountries.find((c) => c.code === "GB"),
allCountries.find((c) => c.code === "CA"),
allCountries.find((c) => c.code === "IN"),
].map((country) => (
<TouchableOpacity
key={country!.code}
onPress={() => handleCountrySelect(country!)}
className="active:opacity-70"
style={{ flex: 1 }}
>
<View className="bg-card border border-border rounded-xl p-3 items-center">
{/* Flag */}
<Image
source={{
uri: `https://flagcdn.com/w80/${country!.code.toLowerCase()}.png`,
}}
style={{
width: 40,
height: 28,
borderRadius: 4,
marginBottom: 6,
}}
resizeMode="cover"
/>

{/* Country Code */}
<Text className="text-xs font-bold text-foreground">
{country!.code}
</Text>
</View>
</TouchableOpacity>
))}
</View>
</View>

{/* Recent Recipients */}
<View className="mb-6">
<Text className="text-sm font-semibold text-foreground mb-3">
Recent Recipients
</Text>
<ScrollView
horizontal
showsHorizontalScrollIndicator={false}
contentContainerStyle={{ gap: 16 }}
>
{mockRecipients.slice(0, 4).map((recipient) => (
<TouchableOpacity
key={recipient.id}
onPress={() => handleRecentRecipientClick(recipient)}
className="items-center active:opacity-70"
>
{recipient.avatar ? (
<Image
source={{ uri: recipient.avatar }}
className="w-16 h-16 rounded-full mb-2 border-2 border-primary/20"
/>
) : (
<View className="w-16 h-16 rounded-full bg-primary items-center justify-center mb-2 border-2 border-primary/20">
<Text className="text-2xl font-bold text-primary-foreground">
{recipient.name.charAt(0)}
</Text>
</View>
)}
<Text
className="text-sm font-semibold text-foreground text-center"
numberOfLines={1}
style={{ width: 64 }}
>
{recipient.name.split(" ")[0]}
</Text>
</TouchableOpacity>
))}
</ScrollView>
</View>

{/* Action Buttons */}
<View className="flex-row gap-4">
<TouchableOpacity
onPress={handleAddNewClick}
className="flex-1 bg-card border-2 border-dashed border-primary/40 rounded-2xl p-4 items-center active:opacity-70"
>
<View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mb-3">
<UserPlus className="text-primary" size={22} />
</View>
<Text className="text-sm font-bold text-foreground text-center">
Add New
</Text>
<Text className="text-xs text-muted-foreground text-center mt-0.5">
Recipient
</Text>
</TouchableOpacity>

<TouchableOpacity
onPress={handleSelectExistingClick}
className="flex-1 bg-card border-2 border-dashed border-primary/40 rounded-2xl p-4 items-center active:opacity-70"
>
<View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mb-3">
<Search className="text-primary" size={22} />
</View>
<Text className="text-sm font-bold text-foreground text-center">
Select Contact
</Text>
<Text className="text-xs text-muted-foreground text-center mt-0.5">
From list
</Text>
</TouchableOpacity>
</View>
</ScrollView>

{/* OVERLAYS */}
<Modal
visible={overlayMode !== null}
transparent={true}
animationType="fade"
onRequestClose={() => setOverlayMode(null)}
>
<View
style={{
flex: 1,
backgroundColor: "rgba(0, 0, 0, 0.5)",
justifyContent: "center",
alignItems: "center",
}}
>
{/* CONFIRM OVERLAY */}
{overlayMode === "confirm" &&
selectedCountry &&
selectedRecipient && (
<View
style={{
backgroundColor: "#ffffff",
borderRadius: 24,
padding: 24,
width: "90%",
maxWidth: 450,
}}
>
<View className="items-center mb-6">
<View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-4">
<Globe className="text-primary" size={32} />
</View>
<Text className="text-2xl font-bold text-foreground text-center">
Confirm Transfer
</Text>
</View>

<View className="bg-muted rounded-2xl p-4 mb-4">
<Text className="text-xs font-semibold text-muted-foreground mb-3">
RECIPIENT
</Text>
<View className="flex-row items-center">
{selectedRecipient.avatar ? (
<Image
source={{ uri: selectedRecipient.avatar }}
className="w-12 h-12 rounded-full mr-3"
/>
) : (
<View className="w-12 h-12 rounded-full bg-primary items-center justify-center mr-3">
<Text className="text-xl font-bold text-primary-foreground">
{selectedRecipient.name.charAt(0)}
</Text>
</View>
)}
<View className="flex-1">
<Text className="text-base font-bold text-foreground">
{selectedRecipient.name}
</Text>
<Text className="text-sm text-muted-foreground">
{selectedRecipient.phone}
</Text>
</View>
</View>
</View>

<View className="bg-muted rounded-2xl p-4 mb-6">
<Text className="text-xs font-semibold text-muted-foreground mb-3">
DESTINATION
</Text>
<View className="flex-row items-center">
<Image
source={{
uri: `https://flagcdn.com/w80/${selectedCountry.code.toLowerCase()}.png`,
}}
style={{ width: 36, height: 24, borderRadius: 4 }}
className="mr-3"
/>
<View className="flex-1">
<Text className="text-base font-bold text-foreground">
{selectedCountry.name}
</Text>
<Text className="text-sm text-muted-foreground">
{getCurrencySymbol(selectedCountry.currency)}{" "}
{selectedCountry.currency}
</Text>
</View>
</View>
</View>

<View className="gap-3">
<TouchableOpacity onPress={handleContinue}>
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
<Text className="text-white font-bold text-base">
Continue to Details
</Text>
</LinearGradient>
</TouchableOpacity>

<TouchableOpacity onPress={() => setOverlayMode(null)}>
<View
style={{
borderRadius: 16,
paddingVertical: 16,
borderWidth: 2,
borderColor: "#e5e7eb",
alignItems: "center",
}}
>
<Text className="font-bold text-base text-muted-foreground">
Cancel
</Text>
</View>
</TouchableOpacity>
</View>
</View>
)}

{/* CONTACTS LIST OVERLAY */}
{overlayMode === "contacts" && (
<View
style={{
backgroundColor: "#ffffff",
borderRadius: 24,
padding: 24,
width: "90%",
maxWidth: 450,
maxHeight: "75%",
}}
>
<View className="flex-row items-center justify-between mb-5">
<Text className="text-xl font-bold text-foreground">
Select Recipient
</Text>
<TouchableOpacity onPress={() => setOverlayMode(null)}>
<X className="text-muted-foreground" size={24} />
</TouchableOpacity>
</View>

<ScrollView contentContainerStyle={{ gap: 10 }}>
{mockRecipients.map((recipient) => (
<TouchableOpacity
key={recipient.id}
onPress={() => handleContactSelect(recipient)}
className="flex-row items-center p-4 bg-muted rounded-2xl active:opacity-70"
>
{recipient.avatar ? (
<Image
source={{ uri: recipient.avatar }}
className="w-12 h-12 rounded-full mr-3"
/>
) : (
<View className="w-12 h-12 rounded-full bg-primary items-center justify-center mr-3">
<Text className="text-xl font-bold text-primary-foreground">
{recipient.name.charAt(0)}
</Text>
</View>
)}
<View className="flex-1">
<Text className="text-base font-bold text-foreground">
{recipient.name}
</Text>
<Text className="text-sm text-muted-foreground">
{recipient.phone}
</Text>
</View>
</TouchableOpacity>
))}
</ScrollView>
</View>
)}

{/* ADD NEW RECIPIENT OVERLAY */}
{overlayMode === "addNew" && selectedCountry && (
<View
style={{
backgroundColor: "#ffffff",
borderRadius: 24,
padding: 24,
width: "90%",
maxWidth: 450,
}}
>
<View className="items-center mb-6">
<View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-4">
<UserPlus className="text-primary" size={32} />
</View>
<Text className="text-2xl font-bold text-foreground text-center mb-1">
Add New Recipient
</Text>
<Text className="text-sm text-muted-foreground text-center">
to {selectedCountry.name}
</Text>
</View>

<View className="gap-4 mb-6">
<View>
<Text className="text-sm font-semibold text-foreground mb-2">
Full Name
</Text>
<TextInput
placeholder="Enter full name"
placeholderTextColor="#9ca3af"
value={newRecipientName}
onChangeText={setNewRecipientName}
className="bg-muted border border-border rounded-2xl px-4 py-3.5 text-foreground text-base"
style={{ outlineStyle: "none" } as any}
/>
</View>

<View>
<Text className="text-sm font-semibold text-foreground mb-2">
Phone Number
</Text>
<TextInput
placeholder="Enter phone number"
placeholderTextColor="#9ca3af"
value={newRecipientPhone}
onChangeText={setNewRecipientPhone}
keyboardType="phone-pad"
className="bg-muted border border-border rounded-2xl px-4 py-3.5 text-foreground text-base"
style={{ outlineStyle: "none" } as any}
/>
</View>
</View>

<View className="gap-3">
<TouchableOpacity onPress={handleAddNewSubmit}>
<LinearGradient
colors={["#6366f1", "#8b5cf6"]}
style={{
borderRadius: 16,
paddingVertical: 16,
alignItems: "center",
justifyContent: "center",
}}
>
<Text className="text-white font-bold text-base">
Continue
</Text>
</LinearGradient>
</TouchableOpacity>

<TouchableOpacity onPress={() => setOverlayMode(null)}>
<View
style={{
borderRadius: 16,
paddingVertical: 16,
borderWidth: 2,
borderColor: "#e5e7eb",
alignItems: "center",
}}
>
<Text className="font-bold text-base text-muted-foreground">
Cancel
</Text>
</View>
</TouchableOpacity>
</View>
</View>
)}
</View>
</Modal>
</SafeAreaView>
);
}