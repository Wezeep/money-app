import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = RNSafeAreaView as React.ComponentType<
  React.ComponentProps<typeof RNSafeAreaView> & { className?: string }
>;
import { ThemeToggle } from "@components/ThemeToggle";
import {
  ArrowLeft,
  ChevronDown,
  ArrowDownUp,
  TrendingUp,
  CreditCard,
  Landmark,
  Wallet,
  Smartphone,
  Bitcoin,
  Building2,
  Banknote,
  DollarSign,
} from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "nativewind";
import { transactionsApi } from "@lib/api";

type Currency = {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  rate: number;
};

type PaymentMethod = {
  id: string;
  name: string;
  icon: any;
  details: string;
  fee: string;
};

const currencies: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸", rate: 1 },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺", rate: 0.8505 },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧", rate: 0.7312 },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵", rate: 110.25 },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺", rate: 1.3542 },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦", rate: 1.2456 },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr", flag: "🇨🇭", rate: 0.9234 },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳", rate: 6.4521 },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳", rate: 74.52 },
  { code: "MXN", name: "Mexican Peso", symbol: "$", flag: "🇲🇽", rate: 20.15 },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", flag: "🇧🇷", rate: 5.42 },
  { code: "ZAR", name: "South African Rand", symbol: "R", flag: "🇿🇦", rate: 14.85 },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬", rate: 1.35 },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", flag: "🇭🇰", rate: 7.78 },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", flag: "🇳🇴", rate: 8.65 },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", flag: "🇸🇪", rate: 8.55 },
  { code: "DKK", name: "Danish Krone", symbol: "kr", flag: "🇩🇰", rate: 6.35 },
  { code: "PLN", name: "Polish Zloty", symbol: "zł", flag: "🇵🇱", rate: 3.92 },
  { code: "THB", name: "Thai Baht", symbol: "฿", flag: "🇹🇭", rate: 33.15 },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", flag: "🇮🇩", rate: 14250 },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", flag: "🇲🇾", rate: 4.18 },
  { code: "PHP", name: "Philippine Peso", symbol: "₱", flag: "🇵🇭", rate: 50.85 },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč", flag: "🇨🇿", rate: 21.75 },
  { code: "ILS", name: "Israeli Shekel", symbol: "₪", flag: "🇮🇱", rate: 3.25 },
  { code: "CLP", name: "Chilean Peso", symbol: "$", flag: "🇨🇱", rate: 785 },
  { code: "TRY", name: "Turkish Lira", symbol: "₺", flag: "🇹🇷", rate: 13.45 },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪", rate: 3.67 },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼", flag: "🇸🇦", rate: 3.75 },
  { code: "KRW", name: "South Korean Won", symbol: "₩", flag: "🇰🇷", rate: 1185 },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", flag: "🇳🇿", rate: 1.42 },
  { code: "RUB", name: "Russian Ruble", symbol: "₽", flag: "🇷🇺", rate: 75.5 },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh", flag: "🇰🇪", rate: 110.5 },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", flag: "🇳🇬", rate: 411.5 },
  { code: "EGP", name: "Egyptian Pound", symbol: "£", flag: "🇪🇬", rate: 15.7 },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨", flag: "🇵🇰", rate: 175.5 },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳", flag: "🇧🇩", rate: 85.5 },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫", flag: "🇻🇳", rate: 23050 },
  { code: "ARS", name: "Argentine Peso", symbol: "$", flag: "🇦🇷", rate: 98.5 },
  { code: "COP", name: "Colombian Peso", symbol: "$", flag: "🇨🇴", rate: 3750 },
  { code: "PEN", name: "Peruvian Sol", symbol: "S/", flag: "🇵🇪", rate: 3.95 },
];

export default function SendWorldwideDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    recipientName?: string;
    recipientPhone?: string;
    recipientCountry?: string;
    recipientCurrency?: string;
    countryCode?: string;
  }>();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const [sendAmount, setSendAmount] = useState("1000");
  const [receiveAmount, setReceiveAmount] = useState("850.50");
  const [fromCurrency, setFromCurrency] = useState<Currency>(currencies[0]);
  const [toCurrency, setToCurrency] = useState<Currency>(currencies[1]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (params.recipientCurrency) {
      const match = currencies.find((c) => c.code === params.recipientCurrency);
      if (match) setToCurrency(match);
    }
  }, [params.recipientCurrency]);
  const [showFromModal, setShowFromModal] = useState(false);
  const [showToModal, setShowToModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    { id: "card", name: "Debit Card", icon: CreditCard, details: "•••• 4242", fee: "Instant" },
    { id: "credit", name: "Credit Card", icon: CreditCard, details: "•••• 8888", fee: "Instant" },
    { id: "bank", name: "Bank Transfer", icon: Landmark, details: "Chase Bank", fee: "1-3 days" },
    { id: "paypal", name: "PayPal", icon: Wallet, details: "user@email.com", fee: "Instant" },
    { id: "venmo", name: "Venmo", icon: DollarSign, details: "@username", fee: "Instant" },
    { id: "mpesa", name: "M-Pesa", icon: Smartphone, details: "+254 712 345678", fee: "2-4 hours" },
    { id: "crypto", name: "Bitcoin", icon: Bitcoin, details: "bc1q...xyz", fee: "10-30 min" },
    { id: "western", name: "Western Union", icon: Banknote, details: "Cash pickup", fee: "1 hour" },
    { id: "zelle", name: "Zelle", icon: DollarSign, details: "user@bank.com", fee: "Instant" },
    { id: "wise", name: "Wise", icon: Wallet, details: "wise@email.com", fee: "1-2 days" },
  ];

  const receiveMethods: PaymentMethod[] = [
    { id: "bank", name: "Bank Account", icon: Landmark, details: "Deutsche Bank", fee: "1-2 days" },
    { id: "card", name: "Debit Card", icon: CreditCard, details: "•••• 5678", fee: "Instant" },
    { id: "revolut", name: "Revolut", icon: Wallet, details: "revolut@email.com", fee: "Instant" },
    { id: "paypal", name: "PayPal", icon: Wallet, details: "receiver@email.com", fee: "Instant" },
    { id: "orange", name: "Orange Money", icon: Smartphone, details: "+33 6 12 34 56 78", fee: "1-3 hours" },
    { id: "eth", name: "Ethereum", icon: Bitcoin, details: "0x...abc", fee: "15-45 min" },
    { id: "moneygram", name: "MoneyGram", icon: Banknote, details: "Cash pickup", fee: "30 min" },
    { id: "branch", name: "Bank Branch", icon: Building2, details: "In-person pickup", fee: "Same day" },
    { id: "mpesa", name: "M-Pesa", icon: Smartphone, details: "+254 700 000000", fee: "2 hours" },
    { id: "wise", name: "Wise", icon: Wallet, details: "wise@email.com", fee: "1 day" },
  ];

  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(paymentMethods[0]);
  const [selectedReceive, setSelectedReceive] = useState<PaymentMethod>(receiveMethods[0]);

  const handleSendAmountChange = (value: string) => {
    setSendAmount(value);
    const numValue = parseFloat(value) || 0;
    const converted = (numValue * (toCurrency.rate / fromCurrency.rate)).toFixed(2);
    setReceiveAmount(converted);
  };

  const handleReceiveAmountChange = (value: string) => {
    setReceiveAmount(value);
    const numValue = parseFloat(value) || 0;
    const converted = (numValue / (toCurrency.rate / fromCurrency.rate)).toFixed(2);
    setSendAmount(converted);
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    const tempAmount = sendAmount;
    setSendAmount(receiveAmount);
    setReceiveAmount(tempAmount);
  };

  const selectFromCurrency = (currency: Currency) => {
    setFromCurrency(currency);
    setShowFromModal(false);
    const numValue = parseFloat(sendAmount) || 0;
    const converted = (numValue * (toCurrency.rate / currency.rate)).toFixed(2);
    setReceiveAmount(converted);
  };

  const selectToCurrency = (currency: Currency) => {
    setToCurrency(currency);
    setShowToModal(false);
    const numValue = parseFloat(sendAmount) || 0;
    const converted = (numValue * (currency.rate / fromCurrency.rate)).toFixed(2);
    setReceiveAmount(converted);
  };

  const PaymentIcon = selectedPayment.icon;
  const ReceiveIcon = selectedReceive.icon;

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-5 py-3 flex-row justify-between items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft className="text-foreground" size={24} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-foreground">Transfer Details</Text>
        <ThemeToggle />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {/* Live Rate Banner */}
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          style={{ padding: 12, borderRadius: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}
        >
          <View className="flex-row items-center gap-2">
            <TrendingUp className="text-white" size={18} />
            <Text className="text-white font-bold text-sm">
              1 {fromCurrency.code} = {(toCurrency.rate / fromCurrency.rate).toFixed(4)} {toCurrency.code}
            </Text>
          </View>
          <View className="bg-white/20 px-2.5 py-1 rounded-full">
            <Text className="text-white text-xs font-bold">LIVE</Text>
          </View>
        </LinearGradient>

        {/* Send Section */}
        <View className="mb-4">
          <Text className="text-xs font-bold text-muted-foreground mb-2 ml-1">You Send</Text>

          <View className="bg-card rounded-2xl p-4 border-2 border-border mb-3">
            <View className="flex-row items-center gap-3">
              <TouchableOpacity onPress={() => setShowFromModal(true)}>
                <View className="bg-muted rounded-xl px-3 py-2 flex-row items-center gap-2">
                  <Text className="text-2xl">{fromCurrency.flag}</Text>
                  <Text className="text-foreground font-bold text-sm">{fromCurrency.code}</Text>
                  <ChevronDown className="text-muted-foreground" size={16} />
                </View>
              </TouchableOpacity>

              <TextInput
                value={sendAmount}
                onChangeText={handleSendAmountChange}
                placeholder="0.00"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
                className="text-foreground text-3xl font-bold flex-1"
              />
            </View>
          </View>

          <TouchableOpacity onPress={() => setShowPaymentModal(true)}>
            <View className="bg-muted/60 rounded-xl px-4 py-3 flex-row items-center justify-between">
              <View className="flex-row items-center gap-3 flex-1">
                <View className="bg-primary/10 w-9 h-9 rounded-xl items-center justify-center">
                  <PaymentIcon color="#6366F1" size={18} />
                </View>
                <View className="flex-1">
                  <Text className="text-foreground font-bold text-sm">{selectedPayment.name}</Text>
                  <Text className="text-muted-foreground text-xs" numberOfLines={1}>{selectedPayment.details}</Text>
                </View>
              </View>
              <View className="flex-row items-center gap-2">
                <Text className="text-muted-foreground text-xs font-medium">{selectedPayment.fee}</Text>
                <ChevronDown className="text-muted-foreground" size={16} />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Swap Button */}
        <View className="items-center py-2">
          <TouchableOpacity onPress={swapCurrencies}>
            <LinearGradient
              colors={["#6366F1", "#8B5CF6"]}
              style={{ width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", margin:-16}}
            >
              <ArrowDownUp className="text-white" size={20} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Receive Section */}
        <View className="mb-5">
          <Text className="text-ss font-bold text-muted-foreground mb-2 ml-1">Receiver gets</Text>

          <View className="bg-card rounded-2xl p-4 border-2 border-primary/40 mb-3">
            <View className="flex-row items-center gap-3">
              <TouchableOpacity onPress={() => setShowToModal(true)}>
                <View className="bg-muted rounded-xl px-3 py-2 flex-row items-center gap-2">
                  <Text className="text-2xl">{toCurrency.flag}</Text>
                  <Text className="text-foreground font-bold text-sm">{toCurrency.code}</Text>
                  <ChevronDown className="text-muted-foreground" size={16} />
                </View>
              </TouchableOpacity>

              <TextInput
                value={receiveAmount}
                onChangeText={handleReceiveAmountChange}
                placeholder="0.00"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
                className="text-primary text-3xl font-bold flex-1"
              />
            </View>
          </View>

          <TouchableOpacity onPress={() => setShowReceiveModal(true)}>
            <View className="bg-muted/60 rounded-xl px-4 py-3 flex-row items-center justify-between">
              <View className="flex-row items-center gap-3 flex-1">
                <View className="bg-primary/10 w-9 h-9 rounded-xl items-center justify-center">
                  <ReceiveIcon color="#6366F1" size={18} />
                </View>
                <View className="flex-1">
                  <Text className="text-foreground font-bold text-sm">{selectedReceive.name}</Text>
                  <Text className="text-muted-foreground text-xs" numberOfLines={1}>{selectedReceive.details}</Text>
                </View>
              </View>
              <View className="flex-row items-center gap-2">
                <Text className="text-muted-foreground text-xs font-medium">{selectedReceive.fee}</Text>
                <ChevronDown className="text-muted-foreground" size={16} />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Transaction Details */}
        <View className="bg-muted/50 rounded-2xl p-4 mb-5">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-muted-foreground text-sm">Exchange Rate</Text>
            <Text className="text-foreground font-semibold text-sm">
              1 {fromCurrency.code} = {(toCurrency.rate / fromCurrency.rate).toFixed(4)} {toCurrency.code}
            </Text>
          </View>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-muted-foreground text-sm">Transfer Fee</Text>
            <Text className="text-foreground font-semibold text-sm">$2.50</Text>
          </View>
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-muted-foreground text-sm">Delivery Time</Text>
            <Text className="text-foreground font-semibold text-sm">{selectedReceive.fee}</Text>
          </View>
          <View className="h-px bg-border mb-3" />
          <View className="flex-row justify-between items-center">
            <Text className="text-foreground font-bold text-base">Total to Pay</Text>
            <Text className="text-primary font-bold text-lg">
              {fromCurrency.symbol}{(parseFloat(sendAmount) + 2.5).toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          disabled={sending || !params.recipientName || !params.recipientPhone || !params.countryCode}
          onPress={async () => {
            const recipientName = params.recipientName ?? "";
            const recipientPhone = params.recipientPhone ?? "";
            const countryCode = params.countryCode ?? "";
            if (!recipientName || !recipientPhone || !countryCode) {
              Alert.alert("Error", "Missing recipient or country. Go back and select a recipient.");
              return;
            }
            setSending(true);
            try {
              const res = await transactionsApi.sendWorldwide({
                recipientName,
                recipientPhone,
                countryCode,
                sendAmount: parseFloat(sendAmount).toFixed(2),
                sendCurrency: fromCurrency.code,
                receiveAmount: parseFloat(receiveAmount).toFixed(2),
                receiveCurrency: toCurrency.code,
                paymentMethod: selectedPayment.id,
                deliveryMethod: selectedReceive.id,
              });
              router.replace({
                pathname: "/send-worldwide-status",
                params: { transactionId: res.id },
              });
            } catch (e: unknown) {
              Alert.alert(
                "Send failed",
                e instanceof Error ? e.message : "Could not complete transfer"
              );
            } finally {
              setSending(false);
            }
          }}
        >
          <LinearGradient
            colors={["#667eea", "#764ba2"]}
            style={{ padding: 16, borderRadius: 16, alignItems: "center" }}
          >
            {sending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text className="text-white text-base font-bold">Continue</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* Currency Modal - From */}
      <Modal visible={showFromModal} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: isDark ? "#1f2937" : "#ffffff", maxHeight: "75%", borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
            <View style={{ paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: isDark ? "#374151" : "#E5E7EB" }}>
              <View className="flex-row justify-between items-center">
                <Text style={{ color: isDark ? "#f9fafb" : "#111827", fontSize: 18, fontWeight: "bold" }}>Select Currency</Text>
                <TouchableOpacity onPress={() => setShowFromModal(false)}>
                  <Text style={{ color: "#6366F1", fontSize: 16, fontWeight: "600" }}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>

            <FlatList
              data={currencies}
              keyExtractor={(item) => item.code}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ padding: 16, gap: 10 }}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => selectFromCurrency(item)}>
                  <View
                    style={{
                      backgroundColor: fromCurrency.code === item.code ? (isDark ? "#312e81" : "#EEF2FF") : (isDark ? "#374151" : "#F9FAFB"),
                      borderColor: fromCurrency.code === item.code ? "#6366F1" : "transparent",
                      borderWidth: 2,
                      borderRadius: 16,
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View className="flex-row items-center gap-3">
                      <Text className="text-3xl">{item.flag}</Text>
                      <View>
                        <Text style={{ color: isDark ? "#f9fafb" : "#111827", fontSize: 16, fontWeight: "bold" }}>{item.code}</Text>
                        <Text style={{ color: isDark ? "#9ca3af" : "#6B7280", fontSize: 13 }}>{item.name}</Text>
                      </View>
                    </View>
                    <Text style={{ color: isDark ? "#9ca3af" : "#6B7280", fontSize: 15, fontWeight: "600" }}>{item.symbol}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Currency Modal - To */}
      <Modal visible={showToModal} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: isDark ? "#1f2937" : "#ffffff", maxHeight: "75%", borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
            <View style={{ paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: isDark ? "#374151" : "#E5E7EB" }}>
              <View className="flex-row justify-between items-center">
                <Text style={{ color: isDark ? "#f9fafb" : "#111827", fontSize: 18, fontWeight: "bold" }}>Select Currency</Text>
                <TouchableOpacity onPress={() => setShowToModal(false)}>
                  <Text style={{ color: "#6366F1", fontSize: 16, fontWeight: "600" }}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>

            <FlatList
              data={currencies}
              keyExtractor={(item) => item.code}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ padding: 16, gap: 10 }}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => selectToCurrency(item)}>
                  <View
                    style={{
                      backgroundColor: toCurrency.code === item.code ? (isDark ? "#312e81" : "#EEF2FF") : (isDark ? "#374151" : "#F9FAFB"),
                      borderColor: toCurrency.code === item.code ? "#6366F1" : "transparent",
                      borderWidth: 2,
                      borderRadius: 16,
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View className="flex-row items-center gap-3">
                      <Text className="text-3xl">{item.flag}</Text>
                      <View>
                        <Text style={{ color: isDark ? "#f9fafb" : "#111827", fontSize: 16, fontWeight: "bold" }}>{item.code}</Text>
                        <Text style={{ color: isDark ? "#9ca3af" : "#6B7280", fontSize: 13 }}>{item.name}</Text>
                      </View>
                    </View>
                    <Text style={{ color: isDark ? "#9ca3af" : "#6B7280", fontSize: 15, fontWeight: "600" }}>{item.symbol}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Payment Method Modal */}
      <Modal visible={showPaymentModal} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: isDark ? "#1f2937" : "#ffffff", maxHeight: "75%", borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
            <View style={{ paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: isDark ? "#374151" : "#E5E7EB" }}>
              <View className="flex-row justify-between items-center">
                <Text style={{ color: isDark ? "#f9fafb" : "#111827", fontSize: 18, fontWeight: "bold" }}>How do you want to pay?</Text>
                <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                  <Text style={{ color: "#6366F1", fontSize: 16, fontWeight: "600" }}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>

            <FlatList
              data={paymentMethods}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ padding: 16, gap: 10 }}
              renderItem={({ item }) => {
                const IconComponent = item.icon;
                return (
                  <TouchableOpacity onPress={() => { setSelectedPayment(item); setShowPaymentModal(false); }}>
                    <View
                      style={{
                        backgroundColor: selectedPayment.id === item.id ? (isDark ? "#312e81" : "#EEF2FF") : (isDark ? "#374151" : "#F9FAFB"),
                        borderColor: selectedPayment.id === item.id ? "#6366F1" : "transparent",
                        borderWidth: 2,
                        borderRadius: 16,
                        paddingHorizontal: 16,
                        paddingVertical: 14,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <View className="flex-row items-center gap-3 flex-1">
                        <View
                          style={{
                            backgroundColor: selectedPayment.id === item.id ? "#6366F1" : (isDark ? "#4b5563" : "#E5E7EB"),
                            width: 44,
                            height: 44,
                            borderRadius: 12,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <IconComponent color={selectedPayment.id === item.id ? "#ffffff" : (isDark ? "#9ca3af" : "#6B7280")} size={22} />
                        </View>
                        <View className="flex-1">
                          <Text style={{ color: isDark ? "#f9fafb" : "#111827", fontSize: 15, fontWeight: "bold" }}>{item.name}</Text>
                          <Text style={{ color: isDark ? "#9ca3af" : "#6B7280", fontSize: 12 }} numberOfLines={1}>{item.details}</Text>
                        </View>
                      </View>
                      <View
                        style={{
                          backgroundColor: selectedPayment.id === item.id ? "#6366F1" : (isDark ? "#4b5563" : "#F3F4F6"),
                          paddingHorizontal: 10,
                          paddingVertical: 6,
                          borderRadius: 8,
                        }}
                      >
                        <Text style={{ color: selectedPayment.id === item.id ? "#ffffff" : (isDark ? "#d1d5db" : "#6B7280"), fontSize: 11, fontWeight: "600" }}>
                          {item.fee}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>

      {/* Receive Method Modal */}
      <Modal visible={showReceiveModal} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: isDark ? "#1f2937" : "#ffffff", maxHeight: "75%", borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
            <View style={{ paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: isDark ? "#374151" : "#E5E7EB" }}>
              <View className="flex-row justify-between items-center">
                <Text style={{ color: isDark ? "#f9fafb" : "#111827", fontSize: 18, fontWeight: "bold" }}>How should they receive?</Text>
                <TouchableOpacity onPress={() => setShowReceiveModal(false)}>
                  <Text style={{ color: "#6366F1", fontSize: 16, fontWeight: "600" }}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>

            <FlatList
              data={receiveMethods}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ padding: 16, gap: 10 }}
              renderItem={({ item }) => {
                const IconComponent = item.icon;
                return (
                  <TouchableOpacity onPress={() => { setSelectedReceive(item); setShowReceiveModal(false); }}>
                    <View
                      style={{
                        backgroundColor: selectedReceive.id === item.id ? (isDark ? "#312e81" : "#EEF2FF") : (isDark ? "#374151" : "#F9FAFB"),
                        borderColor: selectedReceive.id === item.id ? "#6366F1" : "transparent",
                        borderWidth: 2,
                        borderRadius: 16,
                        paddingHorizontal: 16,
                        paddingVertical: 14,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <View className="flex-row items-center gap-3 flex-1">
                        <View
                          style={{
                            backgroundColor: selectedReceive.id === item.id ? "#6366F1" : (isDark ? "#4b5563" : "#E5E7EB"),
                            width: 44,
                            height: 44,
                            borderRadius: 12,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <IconComponent color={selectedReceive.id === item.id ? "#ffffff" : (isDark ? "#9ca3af" : "#6B7280")} size={22} />
                        </View>
                        <View className="flex-1">
                          <Text style={{ color: isDark ? "#f9fafb" : "#111827", fontSize: 15, fontWeight: "bold" }}>{item.name}</Text>
                          <Text style={{ color: isDark ? "#9ca3af" : "#6B7280", fontSize: 12 }} numberOfLines={1}>{item.details}</Text>
                        </View>
                      </View>
                      <View
                        style={{
                          backgroundColor: selectedReceive.id === item.id ? "#6366F1" : (isDark ? "#4b5563" : "#F3F4F6"),
                          paddingHorizontal: 10,
                          paddingVertical: 6,
                          borderRadius: 8,
                        }}
                      >
                        <Text style={{ color: selectedReceive.id === item.id ? "#ffffff" : (isDark ? "#d1d5db" : "#6B7280"), fontSize: 11, fontWeight: "600" }}>
                          {item.fee}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
