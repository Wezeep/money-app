import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Check,
  User,
  ChevronDown,
  Globe,
  MapPin,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useRequestContext } from "@/components/RequestContext";
import { moneyRequestsApi } from "@/lib/api";

type Contact = {
id: string;
name: string;
phone: string;
avatar: string;
isWezeepUser: boolean;
country: string;
};

const currencies = [
{ code: "USD", symbol: "$", name: "US Dollar" },
{ code: "EUR", symbol: "€", name: "Euro" },
{ code: "GBP", symbol: "£", name: "British Pound" },
{ code: "CAD", symbol: "C$", name: "Canadian Dollar" },
{ code: "MXN", symbol: "$", name: "Mexican Peso" },
{ code: "NGN", symbol: "₦", name: "Nigerian Naira" },
{ code: "INR", symbol: "₹", name: "Indian Rupee" },
{ code: "AUD", symbol: "A$", name: "Australian Dollar" },
];

export default function RequestMoneyDetailsScreen() {
const router = useRouter();
const { selectedContacts, setRequestDetails } = useRequestContext();

// Use only the contacts selected from the previous screen
const contacts = selectedContacts;

const [requestType, setRequestType] = useState<"same" | "custom">("same");
const [showRequestTypeDropdown, setShowRequestTypeDropdown] = useState(false);
const [requestGeo, setRequestGeo] = useState<"international" | "local-p2p" | "">("");
const [showRequestGeoDropdown, setShowRequestGeoDropdown] = useState(false);
const [amount, setAmount] = useState("");
const [currency, setCurrency] = useState("USD");
const [message, setMessage] = useState("");
const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
const [showPreviewOverlay, setShowPreviewOverlay] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

// Custom request states
const [customAmounts, setCustomAmounts] = useState<{ [key: string]: string }>({});
const [customCurrencies, setCustomCurrencies] = useState<{ [key: string]: string }>({});
const [customMessages, setCustomMessages] = useState<{ [key: string]: string }>({});
const [customRequestGeo, setCustomRequestGeo] = useState<{
[key: string]: "international" | "local-p2p" | "";
}>({});
const [activeCurrencyPicker, setActiveCurrencyPicker] = useState<string | null>(null);

const selectedCurrencyObj = currencies.find((c) => c.code === currency);

const handlePreview = () => {
if (requestType === "same" && !amount) {
alert("Please enter an amount");
return;
}
if (requestType === "custom") {
const hasAllAmounts = contacts.every(
(contact) => customAmounts[contact.id] || amount
);
if (!hasAllAmounts) {
alert("Please enter amounts for all contacts");
return;
}
}
setShowPreviewOverlay(true);
};

const handleSendRequest = async () => {
    setRequestDetails({
      requestType,
      amount,
      currency,
      message,
      requestGeo,
      customAmounts,
      customCurrencies,
      customMessages,
      customRequestGeo,
    });
    setSendError(null);
    setSending(true);
    try {
      const responses: { shareableLink?: string }[] = [];
      for (const contact of contacts) {
        const amt = requestType === "same" ? amount : (customAmounts[contact.id] || amount);
        if (!amt || parseFloat(amt) <= 0) continue;
        const res = await moneyRequestsApi.create({
          contactId: contact.id,
          amount: parseFloat(amt).toFixed(2),
          currency,
          isFixedAmount: true,
          notes: message || undefined,
        });
        responses.push(res);
      }
      setShowPreviewOverlay(false);
      router.push({
        pathname: "/request-money-status",
        params: {
          shareableLink: responses[0]?.shareableLink ?? "",
          requestCount: String(responses.length),
        },
      });
    } catch (e: unknown) {
      setSendError(e instanceof Error ? e.message : "Failed to send request(s)");
    } finally {
      setSending(false);
    }
  };

const handleCancel = () => {
setShowPreviewOverlay(false);
};

const getTotalAmount = () => {
if (requestType === "same") {
return parseFloat(amount || "0") * contacts.length;
} else {
let total = 0;
contacts.forEach((contact) => {
const amt = customAmounts[contact.id] || amount || "0";
total += parseFloat(amt);
});
return total;
}
};

return (
<SafeAreaView className="flex-1 bg-background">
<View className="flex-row items-center justify-between px-6 py-4 border-b border-border">
<TouchableOpacity onPress={() => router.back()}>
<ArrowLeft className="text-foreground" size={24} />
</TouchableOpacity>
<Text className="text-xl font-bold text-foreground">Request Details</Text>
<View style={{ width: 24 }} />
</View>

<ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }}>
{/* Selected Contacts Preview */}
<View className="bg-card rounded-2xl p-4 mb-4">
<Text className="text-xs font-semibold text-muted-foreground mb-3">
REQUESTING FROM
</Text>
<View className="flex-row flex-wrap" style={{ gap: 8 }}>
{contacts.map((contact) => (
<View
key={contact.id}
className="flex-row items-center bg-primary/10 rounded-full px-3 py-2"
>
{contact.avatar ? (
<Image
source={{ uri: contact.avatar }}
className="w-6 h-6 rounded-full mr-2"
/>
) : (
<View className="w-6 h-6 rounded-full bg-primary items-center justify-center mr-2">
<User className="text-primary-foreground" size={12} />
</View>
)}
<Text className="text-sm font-semibold text-primary">
{contact.name.split(" ")[0]}
</Text>
</View>
))}
</View>
</View>

{/* Request Type Dropdown */}
{contacts.length > 1 && (
<View className="mb-6">
<Text className="text-sm font-semibold text-foreground mb-2">Request Type</Text>
<Pressable
onPress={() => setShowRequestTypeDropdown(!showRequestTypeDropdown)}
className="bg-card border-2 border-border rounded-2xl p-4"
>
<View className="flex-row items-center justify-between">
<Text className="text-foreground font-semibold text-base">
{requestType === "same" ? "Same Exact" : "Custom"}
</Text>
<ChevronDown className="text-primary" size={20} />
</View>

{/* Dropdown Options */}
{showRequestTypeDropdown && (
<View className="mt-4 pt-4 border-t border-border" style={{ gap: 8 }}>
<TouchableOpacity
onPress={() => {
setRequestType("same");
setShowRequestTypeDropdown(false);
}}
className={`flex-row items-center justify-between p-3 rounded-xl ${
requestType === "same" ? "bg-primary/10" : "bg-background"
}`}
>
<View className="flex-1">
<Text
className={`font-bold text-sm ${
requestType === "same" ? "text-primary" : "text-foreground"
}`}
>
Same Exact
</Text>
<Text className="text-xs text-muted-foreground mt-0.5">
Make a single request for everyone
</Text>
</View>
{requestType === "same" && (
<View className="w-5 h-5 rounded-full bg-primary items-center justify-center">
<Check className="text-white" size={12} />
</View>
)}
</TouchableOpacity>

<TouchableOpacity
onPress={() => {
setRequestType("custom");
setShowRequestTypeDropdown(false);
}}
className={`flex-row items-center justify-between p-3 rounded-xl ${
requestType === "custom" ? "bg-primary/10" : "bg-background"
}`}
>
<View className="flex-1">
<Text
className={`font-bold text-sm ${
requestType === "custom" ? "text-primary" : "text-foreground"
}`}
>
Custom
</Text>
<Text className="text-xs text-muted-foreground mt-0.5">
Make separate request for each person
</Text>
</View>
{requestType === "custom" && (
<View className="w-5 h-5 rounded-full bg-primary items-center justify-center">
<Check className="text-white" size={12} />
</View>
)}
</TouchableOpacity>
</View>
)}
</Pressable>
</View>
)}

{/* Same Request Type - Single Amount & Message */}
{requestType === "same" && (
<>
{/* Request Geo Dropdown */}
<View className="mb-6">
<Text className="text-sm font-semibold text-foreground mb-2">Category</Text>
<Pressable
onPress={() => setShowRequestGeoDropdown(!showRequestGeoDropdown)}
className="bg-card border-2 border-border rounded-2xl p-4"
>
<View className="flex-row items-center justify-between">
{requestGeo === "" ? (
<Text className="text-muted-foreground text-base">
International or P2P request?
</Text>
) : (
<View className="flex-row items-center gap-2">
{requestGeo === "international" ? (
<Globe className="text-primary" size={20} />
) : (
<MapPin className="text-primary" size={20} />
)}
<Text className="text-foreground font-semibold text-base">
{requestGeo === "international" ? "International" : "Local P2P"}
</Text>
</View>
)}
<ChevronDown
className={requestGeo === "" ? "text-muted-foreground" : "text-primary"}
size={20}
/>
</View>

{/* Dropdown Options */}
{showRequestGeoDropdown && (
<View className="mt-4 pt-4 border-t border-border" style={{ gap: 8 }}>
<TouchableOpacity
onPress={() => {
setRequestGeo("international");
setShowRequestGeoDropdown(false);
}}
className={`flex-row items-center justify-between p-3 rounded-xl ${
requestGeo === "international" ? "bg-primary/10" : "bg-background"
}`}
>
<View className="flex-row items-center gap-3">
<View
className={`w-10 h-10 rounded-full items-center justify-center ${
requestGeo === "international" ? "bg-primary/20" : "bg-muted"
}`}
>
<Globe
className={
requestGeo === "international"
? "text-primary"
: "text-muted-foreground"
}
size={20}
/>
</View>
<View>
<Text
className={`font-bold text-sm ${
requestGeo === "international" ? "text-primary" : "text-foreground"
}`}
>
International
</Text>
<Text className="text-xs text-muted-foreground">
Cross-border requests
</Text>
</View>
</View>
{requestGeo === "international" && (
<View className="w-5 h-5 rounded-full bg-primary items-center justify-center">
<Check className="text-white" size={12} />
</View>
)}
</TouchableOpacity>

<TouchableOpacity
onPress={() => {
setRequestGeo("local-p2p");
setShowRequestGeoDropdown(false);
}}
className={`flex-row items-center justify-between p-3 rounded-xl ${
requestGeo === "local-p2p" ? "bg-primary/10" : "bg-background"
}`}
>
<View className="flex-row items-center gap-3">
<View
className={`w-10 h-10 rounded-full items-center justify-center ${
requestGeo === "local-p2p" ? "bg-primary/20" : "bg-muted"
}`}
>
<MapPin
className={
requestGeo === "local-p2p" ? "text-primary" : "text-muted-foreground"
}
size={20}
/>
</View>
<View>
<Text
className={`font-bold text-sm ${
requestGeo === "local-p2p" ? "text-primary" : "text-foreground"
}`}
>
Local P2P
</Text>
<Text className="text-xs text-muted-foreground">
Peer-to-peer requests
</Text>
</View>
</View>
{requestGeo === "local-p2p" && (
<View className="w-5 h-5 rounded-full bg-primary items-center justify-center">
<Check className="text-white" size={12} />
</View>
)}
</TouchableOpacity>
</View>
)}
</Pressable>
</View>

{/* Amount Input */}
<View className="mb-6">
<Text className="text-sm font-semibold text-foreground mb-2">
Amount {contacts.length > 1 && "(per person)"}
</Text>
<View className="bg-card border-2 border-primary rounded-2xl p-4">
<View className="flex-row items-center gap-2">
{/* Currency Selector */}
<Pressable
onPress={() => setShowCurrencyPicker(!showCurrencyPicker)}
className="flex-row items-center gap-1.5 bg-primary/10 px-3 py-2 rounded-xl"
>
<Text className="text-base font-bold text-primary">{currency}</Text>
<ChevronDown className="text-primary" size={14} />
</Pressable>

{/* Amount Input */}
<TextInput
placeholder="0.00"
placeholderTextColor="#9ca3af"
value={amount}
onChangeText={setAmount}
keyboardType="decimal-pad"
className="flex-1 text-3xl font-bold text-foreground"
style={{ outlineStyle: "none" } as any}
/>
</View>

{/* Currency Picker Dropdown */}
{showCurrencyPicker && (
<View className="absolute top-full left-0 right-0 mt-2 border-2 border-primary rounded-xl bg-background max-h-56 z-50 shadow-lg">
<ScrollView showsVerticalScrollIndicator={true}>
{currencies.map((curr) => (
<Pressable
key={curr.code}
onPress={() => {
setCurrency(curr.code);
setShowCurrencyPicker(false);
}}
className={`flex-row items-center justify-between p-3 border-b border-border ${
currency === curr.code ? "bg-primary/10" : ""
}`}
>
<View className="flex-row items-center gap-2">
<Text className="text-lg">{curr.symbol}</Text>
<View>
<Text
className={`font-semibold text-sm ${
currency === curr.code ? "text-primary" : "text-foreground"
}`}
>
{curr.code}
</Text>
<Text className="text-xs text-muted-foreground">{curr.name}</Text>
</View>
</View>
{currency === curr.code && <Check className="text-primary" size={18} />}
</Pressable>
))}
</ScrollView>
</View>
)}
</View>
</View>

{/* Message */}
<View className="mb-6">
<Text className="text-sm font-semibold text-foreground mb-2">
Message (Optional)
</Text>
<TextInput
placeholder="What's this request for?"
placeholderTextColor="#9ca3af"
value={message}
onChangeText={setMessage}
multiline
numberOfLines={4}
className="bg-card border border-border rounded-2xl px-4 py-3.5 text-foreground text-base"
style={{ outlineStyle: "none", textAlignVertical: "top" } as any}
/>
</View>
</>
)}

{/* Custom Request Type - Individual Amount & Message per Contact */}
{requestType === "custom" && (
<View style={{ gap: 16 }}>
{contacts.map((contact) => {
const contactAmount = customAmounts[contact.id] || "";
const contactCurrency = customCurrencies[contact.id] || currency;
const contactMessage = customMessages[contact.id] || "";
const contactRequestGeo = customRequestGeo[contact.id] || "";
const contactCurrencyObj = currencies.find((c) => c.code === contactCurrency);

return (
<View
key={contact.id}
className="bg-card rounded-2xl p-5 border border-border"
>
{/* Contact Header */}
<View className="flex-row items-center mb-5 pb-4 border-b border-border">
{contact.avatar ? (
<Image
source={{ uri: contact.avatar }}
className="w-12 h-12 rounded-full mr-3"
/>
) : (
<View className="w-12 h-12 rounded-full bg-primary items-center justify-center mr-3">
<User className="text-primary-foreground" size={20} />
</View>
)}
<View className="flex-1">
<Text className="text-lg font-bold text-foreground">{contact.name}</Text>
<Text className="text-sm text-muted-foreground">{contact.phone}</Text>
</View>
</View>

{/* Request Geo Dropdown */}
<View className="mb-4">
<Text className="text-sm font-semibold text-foreground mb-2">Category</Text>
<Pressable
onPress={() =>
setActiveCurrencyPicker(
activeCurrencyPicker === `geo-${contact.id}`
? null
: `geo-${contact.id}`
)
}
className="bg-background border-2 border-border rounded-xl p-3"
>
<View className="flex-row items-center justify-between">
{!contactRequestGeo ? (
<Text className="text-muted-foreground text-sm">
International or P2P request?
</Text>
) : (
<View className="flex-row items-center gap-2">
{contactRequestGeo === "international" ? (
<Globe className="text-primary" size={18} />
) : (
<MapPin className="text-primary" size={18} />
)}
<Text className="text-foreground font-semibold text-sm">
{contactRequestGeo === "international"
? "International"
: "Local P2P"}
</Text>
</View>
)}
<ChevronDown
className={
!contactRequestGeo ? "text-muted-foreground" : "text-primary"
}
size={18}
/>
</View>

{/* Dropdown Options */}
{activeCurrencyPicker === `geo-${contact.id}` && (
<View className="mt-3 pt-3 border-t border-border" style={{ gap: 8 }}>
<TouchableOpacity
onPress={() => {
setCustomRequestGeo({
...customRequestGeo,
[contact.id]: "international",
});
setActiveCurrencyPicker(null);
}}
className={`flex-row items-center justify-between p-2.5 rounded-lg ${
contactRequestGeo === "international"
? "bg-primary/10"
: "bg-card"
}`}
>
<View className="flex-row items-center gap-2.5">
<View
className={`w-8 h-8 rounded-full items-center justify-center ${
contactRequestGeo === "international"
? "bg-primary/20"
: "bg-muted"
}`}
>
<Globe
className={
contactRequestGeo === "international"
? "text-primary"
: "text-muted-foreground"
}
size={16}
/>
</View>
<View>
<Text
className={`font-bold text-xs ${
contactRequestGeo === "international"
? "text-primary"
: "text-foreground"
}`}
>
International
</Text>
<Text className="text-xs text-muted-foreground">
Cross-border requests
</Text>
</View>
</View>
{contactRequestGeo === "international" && (
<View className="w-4 h-4 rounded-full bg-primary items-center justify-center">
<Check className="text-white" size={10} />
</View>
)}
</TouchableOpacity>

<TouchableOpacity
onPress={() => {
setCustomRequestGeo({
...customRequestGeo,
[contact.id]: "local-p2p",
});
setActiveCurrencyPicker(null);
}}
className={`flex-row items-center justify-between p-2.5 rounded-lg ${
contactRequestGeo === "local-p2p" ? "bg-primary/10" : "bg-card"
}`}
>
<View className="flex-row items-center gap-2.5">
<View
className={`w-8 h-8 rounded-full items-center justify-center ${
contactRequestGeo === "local-p2p"
? "bg-primary/20"
: "bg-muted"
}`}
>
<MapPin
className={
contactRequestGeo === "local-p2p"
? "text-primary"
: "text-muted-foreground"
}
size={16}
/>
</View>
<View>
<Text
className={`font-bold text-xs ${
contactRequestGeo === "local-p2p"
? "text-primary"
: "text-foreground"
}`}
>
Local P2P
</Text>
<Text className="text-xs text-muted-foreground">
Peer-to-peer requests
</Text>
</View>
</View>
{contactRequestGeo === "local-p2p" && (
<View className="w-4 h-4 rounded-full bg-primary items-center justify-center">
<Check className="text-white" size={10} />
</View>
)}
</TouchableOpacity>
</View>
)}
</Pressable>
</View>

{/* Amount Input */}
<View className="mb-4">
<Text className="text-sm font-semibold text-foreground mb-2">Amount</Text>
<View className="bg-background border-2 border-primary/30 rounded-xl p-3">
<View className="flex-row items-center gap-2">
{/* Currency Selector */}
<Pressable
onPress={() =>
setActiveCurrencyPicker(
activeCurrencyPicker === contact.id ? null : contact.id
)
}
className="flex-row items-center gap-1.5 bg-primary/10 px-3 py-2 rounded-lg"
>
<Text className="text-sm font-bold text-primary">
{contactCurrency}
</Text>
<ChevronDown className="text-primary" size={14} />
</Pressable>

{/* Amount Input */}
<TextInput
placeholder="0.00"
placeholderTextColor="#9ca3af"
value={contactAmount}
onChangeText={(val) =>
setCustomAmounts({
...customAmounts,
[contact.id]: val,
})
}
keyboardType="decimal-pad"
className="flex-1 text-2xl font-bold text-foreground"
style={{ outlineStyle: "none" } as any}
/>
</View>

{/* Currency Picker Dropdown */}
{activeCurrencyPicker === contact.id && (
<View className="absolute top-full left-0 right-0 mt-2 border-2 border-primary rounded-xl bg-background max-h-56 z-50 shadow-lg">
<ScrollView showsVerticalScrollIndicator={true}>
{currencies.map((curr) => (
<Pressable
key={curr.code}
onPress={() => {
setCustomCurrencies({
...customCurrencies,
[contact.id]: curr.code,
});
setActiveCurrencyPicker(null);
}}
className={`flex-row items-center justify-between p-3 border-b border-border ${
contactCurrency === curr.code ? "bg-primary/10" : ""
}`}
>
<View className="flex-row items-center gap-2">
<Text className="text-lg">{curr.symbol}</Text>
<View>
<Text
className={`font-semibold text-sm ${
contactCurrency === curr.code
? "text-primary"
: "text-foreground"
}`}
>
{curr.code}
</Text>
<Text className="text-xs text-muted-foreground">
{curr.name}
</Text>
</View>
</View>
{contactCurrency === curr.code && (
<Check className="text-primary" size={18} />
)}
</Pressable>
))}
</ScrollView>
</View>
)}
</View>
</View>

{/* Message */}
<View>
<Text className="text-sm font-semibold text-foreground mb-2">
Message (Optional)
</Text>
<TextInput
placeholder="What's this request for?"
placeholderTextColor="#9ca3af"
value={contactMessage}
onChangeText={(val) =>
setCustomMessages({
...customMessages,
[contact.id]: val,
})
}
multiline
numberOfLines={3}
className="bg-background border border-border rounded-xl px-4 py-3 text-foreground text-sm"
style={{ outlineStyle: "none", textAlignVertical: "top" } as any}
/>
</View>
</View>
);
})}
</View>
)}
</ScrollView>

{/* Fixed Bottom Button */}
<View className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-background border-t border-border">
<TouchableOpacity onPress={handlePreview}>
<LinearGradient
colors={["#667eea", "#764ba2"]}
style={{
borderRadius: 16,
paddingVertical: 16,
alignItems: "center",
justifyContent: "center",
}}
>
<Text className="text-white font-bold text-base">Preview Request</Text>
</LinearGradient>
</TouchableOpacity>
</View>

{/* Preview Overlay */}
<Modal
visible={showPreviewOverlay}
transparent={true}
animationType="fade"
onRequestClose={handleCancel}
>
<View
style={{
flex: 1,
backgroundColor: "rgba(0, 0, 0, 0.5)",
justifyContent: "center",
alignItems: "center",
}}
>
<View
style={{
backgroundColor: "#ffffff",
borderRadius: 24,
padding: 24,
width: "90%",
maxWidth: 450,
}}
>
<Text className="text-2xl font-bold text-foreground text-center mb-6">
Request Summary
</Text>

{/* Total Amount */}
<View className="bg-primary/5 rounded-2xl p-4 mb-4">
<Text className="text-xs font-semibold text-muted-foreground mb-1">
TOTAL AMOUNT
</Text>
<Text className="text-3xl font-bold text-primary">
{selectedCurrencyObj?.symbol}
{getTotalAmount().toFixed(2)} {currency}
</Text>
{requestType === "same" && contacts.length > 1 && (
<Text className="text-xs text-muted-foreground mt-1">
{selectedCurrencyObj?.symbol}
{amount} × {contacts.length} people
</Text>
)}
</View>

{/* Recipients */}
<View className="mb-4">
<Text className="text-xs font-semibold text-muted-foreground mb-3">
REQUESTING FROM
</Text>
{contacts.map((contact) => {
const displayAmount =
requestType === "custom" ? customAmounts[contact.id] || "0" : amount;
const displayCurrency =
requestType === "custom"
? customCurrencies[contact.id] || currency
: currency;
const displayCurrencyObj = currencies.find((c) => c.code === displayCurrency);

return (
<View
key={contact.id}
className="flex-row items-center justify-between py-2"
>
<View className="flex-row items-center flex-1">
{contact.avatar ? (
<Image
source={{ uri: contact.avatar }}
className="w-8 h-8 rounded-full mr-3"
/>
) : (
<View className="w-8 h-8 rounded-full bg-primary items-center justify-center mr-3">
<User className="text-primary-foreground" size={14} />
</View>
)}
<Text className="text-sm font-semibold text-foreground">
{contact.name}
</Text>
</View>
<Text className="text-sm font-bold text-primary">
{displayCurrencyObj?.symbol}
{displayAmount}
</Text>
</View>
);
})}
</View>

{/* Message */}
{message && requestType === "same" && (
<View className="bg-muted rounded-2xl p-3 mb-4">
<Text className="text-xs font-semibold text-muted-foreground mb-1">MESSAGE</Text>
<Text className="text-sm text-foreground">{message}</Text>
</View>
)}

{/* Action Buttons */}
<View className="gap-3 mt-2">
{sendError ? <Text className="text-red-500 text-sm mb-2 text-center">{sendError}</Text> : null}
<TouchableOpacity onPress={handleSendRequest} disabled={sending}>
<LinearGradient
colors={["#667eea", "#764ba2"]}
style={{
borderRadius: 16,
paddingVertical: 14,
alignItems: "center",
justifyContent: "center",
}}
>
{sending ? <ActivityIndicator color="#fff" size="small" /> : <Text className="text-white font-bold text-base">Send Request</Text>}
</LinearGradient>
</TouchableOpacity>

<TouchableOpacity onPress={handleCancel} disabled={sending}>
<View
style={{
borderWidth: 2,
borderColor: "#e5e7eb",
borderRadius: 16,
paddingVertical: 14,
alignItems: "center",
justifyContent: "center",
}}
>
<Text className="font-bold text-base text-muted-foreground">Cancel</Text>
</View>
</TouchableOpacity>
</View>
</View>
</View>
</Modal>
</SafeAreaView>
);
}