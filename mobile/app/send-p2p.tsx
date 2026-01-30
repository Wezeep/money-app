import React, { useState, useEffect } from "react";
import {
View,
Text,
ScrollView,
TouchableOpacity,
TextInput,
Pressable,
Modal,
Image,
ActivityIndicator,
Alert,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = RNSafeAreaView as React.ComponentType<
  React.ComponentProps<typeof RNSafeAreaView> & { className?: string }
>;
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { transactionsApi } from "@/lib/api";
import {
ArrowLeft,
Wallet,
CreditCard,
Building2,
Clock,
ChevronDown,
Plus,
Check,
Zap,
ArrowDownUp,
AlertCircle,
Users,
CheckCircle,
UserPlus,
Search,
} from "lucide-react-native";

// Mock contacts
const mockContacts = [
{
id: "1",
name: "Sarah Johnson",
wezeepId: "@sarahj",
phone: "+1 234 567 8900",
avatar:
"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=900&auto=format&fit=crop&q=60",
},
{
id: "2",
name: "Michael Chen",
wezeepId: "@mchen",
phone: "+1 555 123 4567",
avatar:
"https://images.unsplash.com/photo-1722929606674-73c6e0bf7b17?w=900&auto=format&fit=crop&q=60",
},
{
id: "3",
name: "Emma Wilson",
wezeepId: "@emmaw",
phone: "+1 777 888 9999",
avatar: "https://i.pravatar.cc/150?img=9",
},
{
id: "4",
name: "David Martinez",
wezeepId: "@davidm",
phone: "+1 444 555 6666",
avatar: "https://i.pravatar.cc/150?img=12",
},
];

// Recent recipients (first 2 contacts)
const recentRecipients = mockContacts.slice(0, 2);

// Mock user wallets
const userWallets = [
{ currency: "USD", balance: 1234.56, symbol: "$", name: "US Dollar" },
{ currency: "GBP", balance: 890.25, symbol: "£", name: "British Pound" },
{ currency: "EUR", balance: 450.0, symbol: "€", name: "Euro" },
{ currency: "CAD", balance: 0, symbol: "C$", name: "Canadian Dollar" },
];

// All available currencies
const allCurrencies = [
{ code: "USD", symbol: "$", name: "US Dollar" },
{ code: "GBP", symbol: "£", name: "British Pound" },
{ code: "EUR", symbol: "€", name: "Euro" },
{ code: "CAD", symbol: "C$", name: "Canadian Dollar" },
{ code: "INR", symbol: "₹", name: "Indian Rupee" },
{ code: "JPY", symbol: "¥", name: "Japanese Yen" },
{ code: "AUD", symbol: "A$", name: "Australian Dollar" },
{ code: "CHF", symbol: "Fr", name: "Swiss Franc" },
];

// Exchange rates
const exchangeRates: { [key: string]: number } = {
"USD-USD": 1,
"USD-GBP": 0.79,
"USD-EUR": 0.92,
"USD-CAD": 1.35,
"USD-INR": 83.12,
"GBP-USD": 1.27,
"GBP-GBP": 1,
"GBP-EUR": 1.17,
"GBP-CAD": 1.71,
"GBP-INR": 105.5,
"EUR-USD": 1.09,
"EUR-GBP": 0.85,
"EUR-EUR": 1,
"EUR-CAD": 1.47,
"EUR-INR": 90.35,
"CAD-USD": 0.74,
"CAD-GBP": 0.58,
"CAD-EUR": 0.68,
"CAD-CAD": 1,
"CAD-INR": 61.57,
"INR-USD": 0.012,
"INR-GBP": 0.0095,
"INR-EUR": 0.011,
"INR-CAD": 0.016,
"INR-INR": 1,
};

// Payment method item: wallet entries have balance/recommended/badge; card/bank have lastFour; all may have exchangeNote
type PaymentMethodItem = {
  id: string;
  name: string;
  icon: string;
  fee: number;
  speed: string;
  currency: string;
  lastFour?: string;
  balance?: number;
  recommended?: boolean;
  badge?: string;
  exchangeNote?: string;
};

const paymentMethods: PaymentMethodItem[] = [
  { id: "card", name: "Credit/Debit Card", icon: "credit", lastFour: "•••• 4242", fee: 1.99, speed: "Instant", currency: "USD" },
  { id: "bank", name: "Bank Account", icon: "building", lastFour: "•••• 7890", fee: 0.99, speed: "1-2 days", currency: "USD" },
];

export default function SendP2PScreen() {
const router = useRouter();
const [selectedRecipient, setSelectedRecipient] = useState<any>(null);
const [amount, setAmount] = useState("");
const [selectedCurrency, setSelectedCurrency] = useState("USD");
const [selectedPayment, setSelectedPayment] = useState("");
const [note, setNote] = useState("");
const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
const [showRecipientMessage, setShowRecipientMessage] = useState(false);
const [showPaymentOverlay, setShowPaymentOverlay] = useState(false);
const [showContactsOverlay, setShowContactsOverlay] = useState(false);
const [showConfirmation, setShowConfirmation] = useState(false);
const [contactSearch, setContactSearch] = useState("");
const [sending, setSending] = useState(false);
const [sendError, setSendError] = useState<string | null>(null);

// Find matching wallet
const matchingWallet = userWallets.find(
(w) => w.currency === selectedCurrency
);
const hasMatchingWallet = matchingWallet && matchingWallet.balance > 0;
const selectedCurrencyObj = allCurrencies.find(
(c) => c.code === selectedCurrency
);

// Auto-select payment method when currency changes
useEffect(() => {
if (hasMatchingWallet) {
setSelectedPayment(`wallet-${selectedCurrency}`);
} else {
setSelectedPayment("");
}
}, [selectedCurrency]);

// Build dynamic payment methods list
const availablePaymentMethods: PaymentMethodItem[] = [
  ...(hasMatchingWallet
    ? [{
        id: `wallet-${selectedCurrency}`,
        name: `${selectedCurrency} Wallet`,
        icon: "wallet",
        balance: matchingWallet!.balance,
        fee: 0,
        speed: "Instant",
        recommended: true,
        badge: "Best Choice - No Fees",
        currency: selectedCurrency,
      }]
    : []),
  ...userWallets
    .filter((w) => w.currency !== selectedCurrency && w.balance > 0)
    .map((w) => ({
      id: `wallet-${w.currency}`,
      name: `${w.currency} Wallet`,
      icon: "wallet",
      balance: w.balance,
      fee: 2.5,
      speed: "Instant",
      recommended: false,
      currency: w.currency,
      exchangeNote: "Exchange fee applies",
    })),
  ...paymentMethods.map((m) => ({
    ...m,
    id: m.id,
    exchangeNote: m.currency !== selectedCurrency ? "Exchange fee applies" : undefined,
  })),
];

const selectedPaymentMethod = availablePaymentMethods.find(
(m) => m.id === selectedPayment
);

// Calculate fees and exchange
const totalFee = selectedPaymentMethod?.fee || 0;
const needsExchange = selectedPaymentMethod?.currency !== selectedCurrency;
const exchangeRate = needsExchange
? exchangeRates[`${selectedPaymentMethod?.currency}-${selectedCurrency}`] ||
1
: 1;
const amountInPaymentCurrency = needsExchange
? parseFloat(amount || "0") / exchangeRate
: parseFloat(amount || "0");
const totalCost = amountInPaymentCurrency + totalFee;

const renderMethodIcon = (icon: string, isSelected: boolean) => {
const color = isSelected ? "text-primary" : "text-foreground";
switch (icon) {
case "wallet":
return <Wallet className={color} size={20} />;
case "building":
return <Building2 className={color} size={20} />;
case "credit":
return <CreditCard className={color} size={20} />;
default:
return <Wallet className={color} size={20} />;
}
};

const canCreateWallet = !matchingWallet;

const filteredContacts = contactSearch
? mockContacts.filter(
(c) =>
c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
c.wezeepId.toLowerCase().includes(contactSearch.toLowerCase()) ||
c.phone.includes(contactSearch)
)
: mockContacts;

return (
<SafeAreaView className="flex-1 bg-background">
{/* Header */}
<View className="flex-row items-center px-5 py-3 border-b border-border">
<Pressable onPress={() => router.back()} className="mr-3">
<ArrowLeft className="text-foreground" size={22} />
</Pressable>
<View className="flex-1">
<Text className="text-lg font-bold text-foreground">
P2P Transfer
</Text>
<Text className="text-xs text-muted-foreground">
Send to friends & family
</Text>
</View>
</View>

<ScrollView
contentContainerStyle={{ padding: 20, paddingBottom: 128, gap: 20 }}
>
{/* Recipient Section */}
<View>
<Text className="text-lg font-bold text-foreground mb-3">
Select Recipient
</Text>

{/* Recent Recipients Row */}
<View className="flex-row gap-3 mb-3">
{recentRecipients.map((recipient) => (
<Pressable
key={recipient.id}
onPress={() => setSelectedRecipient(recipient)}
className={`items-center gap-2 ${
selectedRecipient?.id === recipient.id
? "opacity-100"
: "opacity-70"
}`}
>
<View className="relative">
<View
className={`w-16 h-16 rounded-full overflow-hidden border-2 ${
selectedRecipient?.id === recipient.id
? "border-primary"
: "border-border"
}`}
>
<Image
source={{ uri: recipient.avatar }}
className="w-full h-full"
resizeMode="cover"
/>
</View>
{/* Recent Badge */}
<View className="absolute -top-1 -right-1 bg-primary px-1.5 py-0.5 rounded-full">
<Text className="text-white text-[9px] font-bold">
Recent
</Text>
</View>
</View>
<Text
className="text-xs font-semibold text-foreground text-center"
numberOfLines={1}
style={{ width: 64 }}
>
{recipient.name.split(" ")[0]}
</Text>
</Pressable>
))}

{/* Select from Contacts */}
<Pressable
onPress={() => setShowContactsOverlay(true)}
className="items-center gap-2"
>
<View className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/30 items-center justify-center">
<Users className="text-primary" size={24} />
</View>
<Text
className="text-xs font-semibold text-primary text-center"
style={{ width: 64 }}
>
Contacts
</Text>
</Pressable>

{/* Add New Contact */}
<Pressable
onPress={() => {
/* Add new contact logic */
}}
className="items-center gap-2"
>
<View className="w-16 h-16 rounded-full bg-primary/10 border-2 border-dashed border-primary/50 items-center justify-center">
<UserPlus className="text-primary" size={24} />
</View>
<Text
className="text-xs font-semibold text-primary text-center"
style={{ width: 64 }}
>
Add New
</Text>
</Pressable>
</View>

{/* Selected Recipient Display */}
{selectedRecipient && (
<View className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex-row items-center gap-3">
<View className="w-12 h-12 rounded-full overflow-hidden">
<Image
source={{ uri: selectedRecipient.avatar }}
className="w-full h-full"
resizeMode="cover"
/>
</View>
<View className="flex-1">
<Text className="font-bold text-foreground">
{selectedRecipient.name}
</Text>
<Text className="text-xs text-muted-foreground">
{selectedRecipient.wezeepId}
</Text>
</View>
<CheckCircle className="text-primary" size={40} />
</View>
)}
</View>

{/* Amount & Currency Section */}
<View>
<Text className="text-lg font-bold text-foreground mb-3">Amount</Text>
<View className="bg-card border-2 border-primary rounded-xl p-3">
<Text className="text-xs text-muted-foreground mb-1.5">
You Send
</Text>
<View className="flex-row items-center justify-between">
{/* Amount Input - Takes most space */}
<TextInput
value={amount}
onChangeText={setAmount}
onBlur={() => {
if (amount && parseFloat(amount) > 0) {
setShowRecipientMessage(true);
}
}}
keyboardType="numeric"
placeholder="0.00"
placeholderTextColor="#a8a29e"
className="text-2xl font-bold text-primary flex-1"
style={{ maxWidth: 180 }}
/>

{/* Currency Selector - Far Right */}
<Pressable
onPress={() => setShowCurrencyPicker(!showCurrencyPicker)}
className="bg-primary px-2 py-3 rounded-lg flex-row items-center gap-1 ml-2"
style={{ width: 70 }}
>
<Text className="font-bold text-primary-foreground text-sm tracking-wide">
{selectedCurrency}
</Text>
<ChevronDown className="text-primary-foreground" size={14} />
</Pressable>
</View>
</View>

{/* Info Note - Only show when amount is entered AND user finished typing */}
{showRecipientMessage && amount && parseFloat(amount) > 0 && (
<View className="mt-3 bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 flex-row items-start gap-2">
<AlertCircle className="text-blue-600" size={16} />
<Text className="text-xs text-blue-700 flex-1">
Recipient gets {selectedCurrencyObj?.symbol}
{parseFloat(amount).toFixed(2)} {selectedCurrency}; cash out in
other currency subject to exchange rates
</Text>
</View>
)}

{/* Wallet Status Alert - Only if no matching wallet */}
{!hasMatchingWallet && (
<View className="mt-3 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex-row items-start gap-2">
<AlertCircle className="text-amber-600" size={18} />
<View className="flex-1">
<Text className="text-sm font-semibold text-amber-700 mb-1">
No {selectedCurrency} Wallet
</Text>
<Text className="text-xs text-amber-600 mb-2">
{canCreateWallet
? `Create a ${selectedCurrency} wallet to save on exchange fees`
: `Your ${selectedCurrency} wallet is empty. Add funds or use another payment method.`}
</Text>
{canCreateWallet && (
<Pressable className="bg-amber-600 px-3 py-1.5 rounded-lg self-start">
<Text className="text-xs font-bold text-white">
Create {selectedCurrency} Wallet
</Text>
</Pressable>
)}
</View>
</View>
)}
</View>

{/* Payment Method Selector */}
<View>
<Text className="text-lg font-bold text-foreground mb-3">
Payment Method
</Text>
<Pressable
onPress={() => setShowPaymentOverlay(true)}
className="bg-card border-2 border-primary rounded-xl p-3"
>
{selectedPaymentMethod ? (
<View className="flex-row items-center justify-between">
<View className="flex-row items-center gap-2 flex-1">
{renderMethodIcon(selectedPaymentMethod.icon, true)}
<View className="flex-1">
<Text className="font-bold text-base text-foreground">
{selectedPaymentMethod.name}
</Text>
<View className="flex-row items-center gap-2 mt-0.5">
<Text className="text-xs text-muted-foreground">
{selectedPaymentMethod.speed}
</Text>
<Text className="text-xs font-semibold text-primary">
Fee: ${selectedPaymentMethod.fee.toFixed(2)}
</Text>
</View>
{selectedPaymentMethod.balance !== undefined && (
<Text className="text-xs font-semibold text-primary mt-0.5">
Balance:{" "}
{selectedPaymentMethod.currency === selectedCurrency
? selectedCurrencyObj?.symbol
: "$"}
{selectedPaymentMethod.balance.toFixed(2)}
</Text>
)}
</View>
</View>
<ChevronDown className="text-primary" size={20} />
</View>
) : (
<View className="flex-row items-center justify-between">
<Text className="text-muted-foreground">
Select payment method
</Text>
<ChevronDown className="text-muted-foreground" size={20} />
</View>
)}
</Pressable>

{/* Dynamic Payment Method Notes */}
{selectedPaymentMethod &&
hasMatchingWallet &&
selectedPayment === `wallet-${selectedCurrency}` && (
<View className="mt-3 bg-green-500/10 border border-green-500/30 rounded-xl p-3 flex-row items-center gap-2">
<CheckCircle className="text-green-600" size={18} />
<Text className="text-sm font-semibold text-green-700">
Using {selectedCurrency} Wallet • No exchange fees
</Text>
</View>
)}

{/* Exchange Rate Warning - Only when using different currency */}
{needsExchange && selectedPaymentMethod && (
<View className="mt-3 bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 flex-row items-center gap-2">
<ArrowDownUp className="text-blue-600" size={18} />
<Text className="text-xs text-blue-700 flex-1">
Exchange: 1 {selectedPaymentMethod.currency} ={" "}
{exchangeRate.toFixed(4)} {selectedCurrency} • Exchange fee
applies
</Text>
</View>
)}
</View>

{/* Note Section */}
<View>
<Text className="text-lg font-bold text-foreground mb-3">
Add a note (optional)
</Text>
<View className="bg-card border-2 border-border rounded-xl p-3">
<TextInput
value={note}
onChangeText={setNote}
placeholder="What's this for?"
placeholderTextColor="#a8a29e"
multiline
numberOfLines={3}
className="text-sm text-foreground"
/>
</View>
</View>

{/* Continue Button */}
<Pressable
onPress={() => setShowConfirmation(true)}
disabled={!selectedRecipient || !amount || !selectedPayment}
className={`py-3.5 rounded-xl items-center ${
!selectedRecipient || !amount || !selectedPayment
? "bg-muted"
: "bg-primary"
}`}
>
<Text
className={`font-bold text-base ${
!selectedRecipient || !amount || !selectedPayment
? "text-muted-foreground"
: "text-primary-foreground"
}`}
>
Review Transfer
</Text>
</Pressable>
</ScrollView>

{/* Currency Picker Overlay - OPAQUE, OVER EVERYTHING */}
{showCurrencyPicker && (
<Pressable
onPress={() => setShowCurrencyPicker(false)}
style={{
position: "absolute",
top: 0,
left: 0,
right: 0,
bottom: 0,
backgroundColor: "rgba(0,0,0,0.5)",
zIndex: 99999,
justifyContent: "center",
alignItems: "center",
}}
>
<Pressable
onPress={(e) => e.stopPropagation()}
style={{
backgroundColor: "#ffffff",
borderRadius: 16,
borderWidth: 2,
borderColor: "#667eea",
width: 140,
maxHeight: 280,
overflow: "hidden",
}}
>
<ScrollView showsVerticalScrollIndicator={true}>
{allCurrencies.map((currency) => (
<Pressable
key={currency.code}
onPress={() => {
setSelectedCurrency(currency.code);
setShowCurrencyPicker(false);
}}
style={{
paddingVertical: 12,
paddingHorizontal: 16,
borderBottomWidth: 1,
borderBottomColor: "#e5e7eb",
backgroundColor:
selectedCurrency === currency.code
? "#f0f0ff"
: "#ffffff",
}}
>
<View className="flex-row items-center justify-between">
<View className="flex-row items-center gap-1.5">
<Text className="text-sm font-medium">
{currency.symbol}
</Text>
<Text
className={`font-bold text-sm ${
selectedCurrency === currency.code
? "text-primary"
: "text-foreground"
}`}
>
{currency.code}
</Text>
</View>
{selectedCurrency === currency.code && (
<CheckCircle className="text-primary" size={16} />
)}
</View>
</Pressable>
))}
</ScrollView>
</Pressable>
</Pressable>
)}

{/* Contacts Overlay */}
<Modal visible={showContactsOverlay} transparent animationType="slide">
<Pressable
style={{
flex: 1,
backgroundColor: "rgba(0,0,0,0.7)",
justifyContent: "flex-end",
}}
onPress={() => setShowContactsOverlay(false)}
>
<Pressable
onPress={(e) => e.stopPropagation()}
style={{
backgroundColor: "#ffffff",
maxHeight: "75%",
borderTopLeftRadius: 24,
borderTopRightRadius: 24,
}}
>
<View className="p-5 border-b border-border">
<Text className="text-xl font-bold text-foreground mb-3">
Select Contact
</Text>

{/* Search Bar */}
<View className="flex-row items-center bg-muted rounded-xl px-3 py-2">
<Search className="text-muted-foreground mr-2" size={18} />
<TextInput
value={contactSearch}
onChangeText={setContactSearch}
placeholder="Search contacts..."
placeholderTextColor="#a8a29e"
className="flex-1 text-sm text-foreground"
/>
</View>
</View>

<ScrollView
contentContainerStyle={{
padding: 20,
paddingBottom: 32,
gap: 12,
}}
showsVerticalScrollIndicator={false}
>
{filteredContacts.map((contact) => (
<Pressable
key={contact.id}
onPress={() => {
setSelectedRecipient(contact);
setShowContactsOverlay(false);
}}
className="flex-row items-center gap-3 bg-card border border-border rounded-xl p-3"
>
<View className="w-12 h-12 rounded-full overflow-hidden">
<Image
source={{ uri: contact.avatar }}
className="w-full h-full"
resizeMode="cover"
/>
</View>
<View className="flex-1">
<Text className="font-bold text-foreground">
{contact.name}
</Text>
<Text className="text-xs text-muted-foreground">
{contact.wezeepId}
</Text>
<Text className="text-xs text-muted-foreground">
{contact.phone}
</Text>
</View>
{selectedRecipient?.id === contact.id && (
<CheckCircle className="text-primary" size={20} />
)}
</Pressable>
))}
</ScrollView>
</Pressable>
</Pressable>
</Modal>

{/* Payment Method Overlay */}
<Modal visible={showPaymentOverlay} transparent animationType="slide">
<Pressable
style={{
flex: 1,
backgroundColor: "rgba(0,0,0,0.7)",
justifyContent: "flex-end",
}}
onPress={() => setShowPaymentOverlay(false)}
>
<Pressable
onPress={(e) => e.stopPropagation()}
style={{
backgroundColor: "#ffffff",
maxHeight: "75%",
borderTopLeftRadius: 24,
borderTopRightRadius: 24,
}}
>
<View className="p-5 border-b border-border">
<Text className="text-xl font-bold text-foreground mb-1">
Select Payment Method
</Text>
<Text className="text-sm text-muted-foreground">
Choose how you'd like to pay
</Text>
</View>

<ScrollView
contentContainerStyle={{
padding: 20,
paddingBottom: 32,
gap: 10,
}}
showsVerticalScrollIndicator={false}
>
{availablePaymentMethods.map((method) => (
<Pressable
key={method.id}
onPress={() => {
setSelectedPayment(method.id);
setShowPaymentOverlay(false);
}}
className={`rounded-xl border-2 overflow-hidden ${
selectedPayment === method.id
? "border-primary bg-primary/5"
: "border-border bg-card"
}`}
>
{method.recommended && method.badge != null && (
<View className="bg-primary px-2.5 py-1 flex-row items-center gap-1">
<Zap className="text-primary-foreground" size={12} />
<Text className="text-xs font-bold text-primary-foreground">
{method.badge}
</Text>
</View>
)}

<View className="p-3">
<View className="flex-row items-center justify-between mb-2">
<View className="flex-row items-center gap-2.5">
{renderMethodIcon(
method.icon,
selectedPayment === method.id
)}
<View>
<Text
className={`font-bold text-base ${
selectedPayment === method.id
? "text-primary"
: "text-foreground"
}`}
>
{method.name}
</Text>
{method.balance !== undefined && (
<Text className="text-xs font-semibold text-primary">
Balance:{" "}
{method.currency === selectedCurrency
? selectedCurrencyObj?.symbol
: "$"}
{method.balance.toFixed(2)} {method.currency}
</Text>
)}
{method.exchangeNote && (
<Text className="text-xs text-amber-600 mt-0.5">
{method.exchangeNote}
</Text>
)}
</View>
</View>
{selectedPayment === method.id && (
<View className="bg-primary rounded-full p-1">
<Check
className="text-primary-foreground"
size={14}
/>
</View>
)}
</View>

<View className="flex-row items-center gap-3 pt-2 border-t border-border">
<View className="flex-row items-center gap-1">
<Clock size={14} className="text-muted-foreground" />
<Text className="text-xs font-medium text-foreground">
{method.speed}
</Text>
</View>
<View className="h-3 w-px bg-border" />
<Text className="text-xs font-bold text-foreground">
Fee: ${method.fee.toFixed(2)}
</Text>
</View>
</View>
</Pressable>
))}

<Pressable className="flex-row items-center justify-center gap-1.5 p-3 border-2 border-dashed border-primary/50 rounded-xl bg-primary/5">
<Plus className="text-primary" size={18} />
<Text className="font-bold text-primary text-sm">
Add New Method
</Text>
</Pressable>
</ScrollView>
</Pressable>
</Pressable>
</Modal>

{/* Confirmation Modal */}
<Modal visible={showConfirmation} transparent animationType="slide">
<View
style={{
flex: 1,
backgroundColor: "rgba(0,0,0,0.7)",
justifyContent: "center",
padding: 20,
}}
>
<View
style={{
backgroundColor: "#ffffff",
borderRadius: 20,
padding: 20,
}}
>
<Text className="text-2xl font-bold text-foreground mb-4">
Confirm P2P Transfer
</Text>

<View className="bg-muted p-3 rounded-xl mb-3">
<Text className="text-xs text-muted-foreground mb-1">
Sending to
</Text>
<Text className="text-base font-bold text-foreground">
{selectedRecipient?.name}
</Text>
<Text className="text-xs text-muted-foreground">
{selectedRecipient?.wezeepId}
</Text>
</View>

<View className="gap-2 mb-5">
<View className="flex-row justify-between">
<Text className="text-sm text-muted-foreground">Amount</Text>
<Text className="font-semibold text-sm text-foreground">
{selectedCurrencyObj?.symbol}
{amount} {selectedCurrency}
</Text>
</View>
<View className="flex-row justify-between">
<Text className="text-sm text-muted-foreground">
Payment method
</Text>
<Text className="font-semibold text-sm text-foreground">
{selectedPaymentMethod?.name}
</Text>
</View>
{needsExchange && (
<View className="flex-row justify-between">
<Text className="text-sm text-muted-foreground">
Exchange rate
</Text>
<Text className="font-semibold text-sm text-foreground">
1 {selectedPaymentMethod?.currency} ={" "}
{exchangeRate.toFixed(4)} {selectedCurrency}
</Text>
</View>
)}
<View className="flex-row justify-between">
<Text className="text-sm text-muted-foreground">Fee</Text>
<Text className="font-semibold text-sm text-foreground">
${totalFee.toFixed(2)}
</Text>
</View>
<View className="h-px bg-border my-1" />
<View className="flex-row justify-between">
<Text className="font-bold text-foreground">Total cost</Text>
<Text className="font-bold text-foreground text-base">
{selectedPaymentMethod?.currency === selectedCurrency
? selectedCurrencyObj?.symbol
: "$"}
{totalCost.toFixed(2)} {selectedPaymentMethod?.currency}
</Text>
</View>
</View>

<View>
<TouchableOpacity
disabled={sending}
onPress={async () => {
if (!selectedRecipient || !amount || !selectedPayment) return;
setSendError(null);
setSending(true);
try {
const res = await transactionsApi.sendP2P({
contactId: selectedRecipient.id,
amount: parseFloat(amount).toFixed(2),
currency: selectedCurrency,
paymentMethod: selectedPayment,
notes: note || undefined,
});
setShowConfirmation(false);
router.replace({ pathname: "/send-p2p-status", params: { transactionId: res.id } });
} catch (e: unknown) {
setSendError(e instanceof Error ? e.message : "Send failed");
} finally {
setSending(false);
}
}}
>
<LinearGradient
colors={["#667eea", "#764ba2"]}
style={{
borderRadius: 12,
paddingVertical: 14,
flexDirection: "row",
alignItems: "center",
justifyContent: "center",
}}
>
{sending ? (
<ActivityIndicator color="#fff" size="small" />
) : (
<Text className="text-white font-bold text-sm">Send Now</Text>
)}
</LinearGradient>
</TouchableOpacity>
{sendError ? (
<Text className="text-red-500 text-sm mt-2 text-center">{sendError}</Text>
) : null}
<View style={{ margin: 4 }} />
<TouchableOpacity onPress={() => setShowConfirmation(false)}>
<LinearGradient
colors={["#ebe9e9ff", "#f4f3f3ff"]}
style={{
borderRadius: 12,
paddingVertical: 14,
flexDirection: "row",
alignItems: "center",
justifyContent: "center",
}}
>
<Text
className="font-bold text-sm"
style={{ color: "#667eea" }}
>
Cancel
</Text>
</LinearGradient>
</TouchableOpacity>
</View>
</View>
</View>
</Modal>
</SafeAreaView>
);
}