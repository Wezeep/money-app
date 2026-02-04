import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  Dimensions,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Plus,
  ArrowDownToLine,
  Send,
  ArrowLeftRight,
  Filter,
  X,
  Check,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Activity,
  Search,
  Receipt,
  Repeat,
} from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

type Currency = {
  id: string;
  name: string;
  code: string;
  symbol: string;
  balance: number;
  change24h: number;
  gradient: string[];
  icon: string;
  accentColor: string;
};

type Transaction = {
  id: string;
  type: "sent" | "received" | "transfer" | "withdrawal" | "bill";
  to: string;
  amount: number;
  currency: string;
  date: string;
  status: "completed" | "pending" | "failed";
  category: string;
  isRecurring?: boolean;
};

type ActiveTransfer = {
  id: string;
  to: string;
  amount: number;
  currency: string;
  progress: number;
  status: "processing" | "confirming";
};

type ActiveBill = {
  id: string;
  vendor: string;
  amount: number;
  currency: string;
  nextDue: string;
  frequency: string;
  category: string;
};

const mockWallets: Currency[] = [
  {
    id: "1",
    name: "US Dollar",
    code: "USD",
    symbol: "$",
    balance: 12450.75,
    change24h: 2.4,
    gradient: ["#667eea", "#764ba2"],
    icon: "🇺🇸",
    accentColor: "#667eea",
  },
  {
    id: "2",
    name: "Euro",
    code: "EUR",
    symbol: "€",
    balance: 8320.5,
    change24h: -1.2,
    gradient: ["#f093fb", "#f5576c"],
    icon: "🇪🇺",
    accentColor: "#f093fb",
  },
  {
    id: "3",
    name: "British Pound",
    code: "GBP",
    symbol: "£",
    balance: 5670.25,
    change24h: 0.8,
    gradient: ["#4facfe", "#00f2fe"],
    icon: "🇬🇧",
    accentColor: "#4facfe",
  },
  {
    id: "4",
    name: "Japanese Yen",
    code: "JPY",
    symbol: "¥",
    balance: 1250000,
    change24h: 1.5,
    gradient: ["#43e97b", "#38f9d7"],
    icon: "🇯🇵",
    accentColor: "#43e97b",
  },
  {
    id: "5",
    name: "Canadian Dollar",
    code: "CAD",
    symbol: "C$",
    balance: 9840.6,
    change24h: 3.1,
    gradient: ["#fa709a", "#fee140"],
    icon: "🇨🇦",
    accentColor: "#fa709a",
  },
  {
    id: "6",
    name: "Swiss Franc",
    code: "CHF",
    symbol: "CHF",
    balance: 7230.9,
    change24h: -0.5,
    gradient: ["#30cfd0", "#330867"],
    icon: "🇨🇭",
    accentColor: "#30cfd0",
  },
];

const mockActiveTransfers: ActiveTransfer[] = [
  {
    id: "1",
    to: "Sarah Johnson",
    amount: 250,
    currency: "USD",
    progress: 65,
    status: "processing",
  },
  {
    id: "2",
    to: "Mike Chen",
    amount: 180,
    currency: "EUR",
    progress: 40,
    status: "confirming",
  },
];

const mockActiveBills: ActiveBill[] = [
  {
    id: "1",
    vendor: "Electric Company",
    amount: 120,
    currency: "USD",
    nextDue: "2024-02-01",
    frequency: "Monthly",
    category: "Utilities",
  },
  {
    id: "2",
    vendor: "Internet Provider",
    amount: 79.99,
    currency: "USD",
    nextDue: "2024-02-05",
    frequency: "Monthly",
    category: "Internet",
  },
];

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "sent",
    to: "Sarah Johnson",
    amount: 250,
    currency: "USD",
    date: "2024-01-15",
    status: "completed",
    category: "Personal",
  },
  {
    id: "2",
    type: "received",
    to: "John Doe",
    amount: 500,
    currency: "USD",
    date: "2024-01-14",
    status: "completed",
    category: "Business",
  },
  {
    id: "3",
    type: "transfer",
    to: "EUR Wallet",
    amount: 300,
    currency: "USD",
    date: "2024-01-13",
    status: "completed",
    category: "Transfer",
  },
  {
    id: "4",
    type: "withdrawal",
    to: "Bank Account",
    amount: 1000,
    currency: "USD",
    date: "2024-01-12",
    status: "pending",
    category: "Withdrawal",
  },
  {
    id: "5",
    type: "sent",
    to: "Alice Brown",
    amount: 75,
    currency: "EUR",
    date: "2024-01-11",
    status: "completed",
    category: "Shopping",
  },
  {
    id: "6",
    type: "received",
    to: "Robert Smith",
    amount: 420,
    currency: "GBP",
    date: "2024-01-10",
    status: "completed",
    category: "Freelance",
  },
  {
    id: "7",
    type: "sent",
    to: "Emma Wilson",
    amount: 150,
    currency: "USD",
    date: "2024-01-09",
    status: "failed",
    category: "Personal",
  },
  {
    id: "8",
    type: "transfer",
    to: "CAD Wallet",
    amount: 200,
    currency: "USD",
    date: "2024-01-08",
    status: "completed",
    category: "Transfer",
  },
  {
    id: "9",
    type: "bill",
    to: "Joe's Pizza",
    amount: 45.5,
    currency: "USD",
    date: "2024-01-16",
    status: "completed",
    category: "Restaurant",
    isRecurring: false,
  },
  {
    id: "10",
    type: "bill",
    to: "Electric Company",
    amount: 120,
    currency: "USD",
    date: "2024-01-01",
    status: "completed",
    category: "Utilities",
    isRecurring: true,
  },
  {
    id: "11",
    type: "bill",
    to: "Internet Provider",
    amount: 79.99,
    currency: "USD",
    date: "2024-01-05",
    status: "completed",
    category: "Internet",
    isRecurring: true,
  },
];

// Recent bills (paid within 2 days)
const recentBills = mockTransactions.filter(
  (t) => t.type === "bill" && !t.isRecurring
);

export default function WalletScreen() {
  const router = useRouter();
  const [selectedWallet, setSelectedWallet] = React.useState<Currency>(
    mockWallets[0]
  );
  const [sendModalVisible, setSendModalVisible] = React.useState(false);
  const [filterModalVisible, setFilterModalVisible] = React.useState(false);
  const [selectedFilter, setSelectedFilter] = React.useState<
    "all" | "sent" | "received" | "transfer" | "bills" | "requested"
  >("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showAnalytics, setShowAnalytics] = React.useState(false);

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  React.useEffect(() => {
    opacity.value = withTiming(0.7, { duration: 150 }, () => {
      opacity.value = withSpring(1, { damping: 12 });
    });
    scale.value = withTiming(0.97, { duration: 150 }, () => {
      scale.value = withSpring(1, { damping: 12, stiffness: 200 });
    });
  }, [selectedWallet]);

  const handleWalletSelect = (wallet: Currency) => {
    setSelectedWallet(wallet);
  };

  const filteredTransactions = mockTransactions
    .filter(
      (t) =>
        selectedFilter === "all" ||
        (selectedFilter === "bills"
          ? t.type === "bill"
          : t.type === selectedFilter)
    )
    .filter((t) => t.to.toLowerCase().includes(searchQuery.toLowerCase()));

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "sent":
        return ArrowUpRight;
      case "received":
        return ArrowDownLeft;
      case "transfer":
        return ArrowLeftRight;
      case "withdrawal":
        return ArrowDownToLine;
      case "bill":
        return Receipt;
      default:
        return Send;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#10b981";
      case "pending":
        return "#f59e0b";
      case "failed":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const analytics = {
    totalSent: mockTransactions
      .filter((t) => t.type === "sent")
      .reduce((sum, t) => sum + t.amount, 0),
    totalReceived: mockTransactions
      .filter((t) => t.type === "received")
      .reduce((sum, t) => sum + t.amount, 0),
    totalTransfers: mockTransactions.filter((t) => t.type === "transfer")
      .length,
    pendingCount: mockTransactions.filter((t) => t.status === "pending").length,
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Analytics Section - Compact */}
        {showAnalytics && (
          <View className="px-6 mb-6">
            <LinearGradient
              colors={["#667eea", "#764ba2"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 20,
                padding: 16,
                shadowColor: "#667eea",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              <View className="flex-row items-center gap-2 mb-4">
                <View className="bg-white/20 p-2 rounded-xl">
                  <Activity size={18} color="white" />
                </View>
                <Text className="text-white text-lg font-bold">Analytics</Text>
              </View>

              <View className="flex-row gap-2">
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(255,255,255,0.15)",
                    borderRadius: 14,
                    padding: 12,
                  }}
                >
                  <ArrowUpRight size={16} color="white" strokeWidth={3} />
                  <Text className="text-white/70 text-xs font-semibold mt-2">
                    Sent
                  </Text>
                  <Text className="text-white text-lg font-bold">
                    ${analytics.totalSent}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(255,255,255,0.15)",
                    borderRadius: 14,
                    padding: 12,
                  }}
                >
                  <ArrowDownLeft size={16} color="white" strokeWidth={3} />
                  <Text className="text-white/70 text-xs font-semibold mt-2">
                    Received
                  </Text>
                  <Text className="text-white text-lg font-bold">
                    ${analytics.totalReceived}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        )}

        {/* Premium Main Wallet Card - Compact */}
        <View className="px-6 mb-6">
          <Animated.View style={[animatedCardStyle]}>
            <LinearGradient
              colors={selectedWallet.gradient as any}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 24,
                padding: 20,
                shadowColor: selectedWallet.accentColor,
                shadowOffset: { width: 0, height: 16 },
                shadowOpacity: 0.4,
                shadowRadius: 24,
                elevation: 12,
              }}
            >
              {/* Floating Gradient Orbs */}
              <View
                style={{
                  position: "absolute",
                  top: -30,
                  right: -30,
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  opacity: 0.3,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  bottom: -15,
                  left: -20,
                  width: 90,
                  height: 90,
                  borderRadius: 45,
                  backgroundColor: "rgba(255,255,255,0.08)",
                  opacity: 0.4,
                }}
              />

              {/* Card Header */}
              <View className="flex-row items-center justify-between mb-5">
                <View className="flex-row items-center gap-3">
                  <View
                    style={{
                      backgroundColor: "rgba(255,255,255,0.25)",
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 14,
                    }}
                  >
                    <Text className="text-2xl">{selectedWallet.icon}</Text>
                  </View>
                  <View>
                    <Text className="text-white/90 text-xs font-semibold tracking-wide">
                      {selectedWallet.name}
                    </Text>
                    <Text className="text-white text-xl font-black tracking-tight">
                      {selectedWallet.code}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    backgroundColor:
                      selectedWallet.change24h >= 0
                        ? "rgba(67, 233, 123, 0.25)"
                        : "rgba(245, 87, 108, 0.25)",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  {selectedWallet.change24h >= 0 ? (
                    <TrendingUp size={14} color="white" strokeWidth={3} />
                  ) : (
                    <TrendingDown size={14} color="white" strokeWidth={3} />
                  )}
                  <Text className="text-white text-xs font-black">
                    {selectedWallet.change24h > 0 ? "+" : ""}
                    {selectedWallet.change24h}%
                  </Text>
                </View>
              </View>

              {/* Balance */}
              <View className="mb-6">
                <Text className="text-white/70 text-xs font-semibold mb-2 tracking-wide">
                  AVAILABLE BALANCE
                </Text>
                <Text
                  className="text-white text-4xl font-black tracking-tighter"
                  style={{ lineHeight: 44 }}
                >
                  {selectedWallet.symbol}
                  {selectedWallet.balance.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </Text>
              </View>

              {/* Action Buttons */}
              <View className="flex-row gap-2">
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    paddingVertical: 12,
                    borderRadius: 16,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <Plus size={18} color="white" strokeWidth={3} />
                  <Text className="text-white font-bold text-xs tracking-wide">
                    ADD
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    paddingVertical: 12,
                    borderRadius: 16,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <ArrowDownToLine size={18} color="white" strokeWidth={3} />
                  <Text className="text-white font-bold text-xs tracking-wide">
                    OUT
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="flex-row gap-2 mt-2">
                <TouchableOpacity
                  onPress={() => setSendModalVisible(true)}
                  style={{
                    flex: 1,
                    backgroundColor: "white",
                    paddingVertical: 12,
                    borderRadius: 16,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 6,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.15,
                    shadowRadius: 10,
                    elevation: 6,
                  }}
                >
                  <Send
                    size={18}
                    color={selectedWallet.accentColor}
                    strokeWidth={3}
                  />
                  <Text
                    style={{ color: selectedWallet.accentColor }}
                    className="font-bold text-xs tracking-wide"
                  >
                    SEND
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    paddingVertical: 12,
                    borderRadius: 16,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <ArrowLeftRight size={18} color="white" strokeWidth={3} />
                  <Text className="text-white font-bold text-xs tracking-wide">
                    SWAP
                  </Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>
        </View>

        {/* Wallet Carousel - Compact */}
        <View className="mb-6">
          <View className="px-6 mb-3 flex-row items-center justify-between">
            <View>
              <Text className="text-xl font-black text-foreground tracking-tight">
                Your Wallets
              </Text>
              <Text className="text-xs text-muted-foreground mt-0.5">
                {mockWallets.length} currencies
              </Text>
            </View>
            <TouchableOpacity className="bg-primary px-4 py-2 rounded-xl flex-row items-center gap-1.5 shadow-lg">
              <Plus size={16} color="white" strokeWidth={3} />
              <Text className="text-white font-bold text-xs">NEW</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
            decelerationRate="fast"
            snapToInterval={width * 0.38}
          >
            {mockWallets.map((wallet) => {
              const isSelected = wallet.id === selectedWallet.id;
              return (
                <TouchableOpacity
                  key={wallet.id}
                  onPress={() => handleWalletSelect(wallet)}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={
                      (isSelected ? wallet.gradient : ["#f8f9fa", "#e9ecef"]) as any
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      width: width * 0.36,
                      borderRadius: 18,
                      padding: 14,
                      borderWidth: isSelected ? 3 : 0,
                      borderColor: "white",
                      shadowColor: isSelected ? wallet.accentColor : "#000",
                      shadowOffset: { width: 0, height: isSelected ? 12 : 4 },
                      shadowOpacity: isSelected ? 0.35 : 0.08,
                      shadowRadius: isSelected ? 16 : 8,
                      elevation: isSelected ? 10 : 3,
                      transform: [{ scale: isSelected ? 1.03 : 1 }],
                    }}
                  >
                    {isSelected && (
                      <View className="absolute top-3 right-3 bg-white rounded-full p-1 shadow-lg">
                        <Check
                          size={12}
                          color={wallet.accentColor}
                          strokeWidth={4}
                        />
                      </View>
                    )}
                    <View
                      style={{
                        backgroundColor: isSelected
                          ? "rgba(255,255,255,0.25)"
                          : "#ffffff",
                        alignSelf: "flex-start",
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 10,
                        marginBottom: 10,
                      }}
                    >
                      <Text className="text-xl">{wallet.icon}</Text>
                    </View>
                    <Text
                      style={{ color: isSelected ? "white" : "#1a1a1a" }}
                      className="font-black text-base mb-0.5 tracking-tight"
                    >
                      {wallet.code}
                    </Text>
                    <Text
                      style={{
                        color: isSelected
                          ? "rgba(255,255,255,0.85)"
                          : "#6b7280",
                      }}
                      className="text-xs font-semibold mb-2"
                    >
                      {wallet.symbol}
                      {wallet.balance.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </Text>
                    <View
                      style={{
                        backgroundColor: isSelected
                          ? "rgba(255,255,255,0.2)"
                          : wallet.change24h >= 0
                            ? "rgba(67, 233, 123, 0.15)"
                            : "rgba(239, 68, 68, 0.15)",
                        alignSelf: "flex-start",
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                        borderRadius: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      {wallet.change24h >= 0 ? (
                        <TrendingUp
                          size={10}
                          color={isSelected ? "white" : "#10b981"}
                          strokeWidth={3}
                        />
                      ) : (
                        <TrendingDown
                          size={10}
                          color={isSelected ? "white" : "#ef4444"}
                          strokeWidth={3}
                        />
                      )}
                      <Text
                        style={{
                          color: isSelected
                            ? "white"
                            : wallet.change24h >= 0
                              ? "#10b981"
                              : "#ef4444",
                        }}
                        className="text-xs font-black"
                      >
                        {wallet.change24h > 0 ? "+" : ""}
                        {wallet.change24h}%
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Active Transfers & Bills - Compact */}
        {(mockActiveTransfers.length > 0 ||
          mockActiveBills.length > 0 ||
          recentBills.length > 0) && (
          <View className="px-6 mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <View>
                <Text className="text-xl font-black text-foreground tracking-tight">
                  Active Transfers & Bills
                </Text>
                <Text className="text-xs text-muted-foreground mt-0.5">
                  {mockActiveTransfers.length +
                    mockActiveBills.length +
                    recentBills.length}{" "}
                  active
                </Text>
              </View>
            </View>
            <View className="gap-3">
              {mockActiveTransfers.map((transfer) => (
                <LinearGradient
                  key={transfer.id}
                  colors={["#ffffff", "#f8f9fa"]}
                  style={{
                    borderRadius: 18,
                    padding: 14,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.06,
                    shadowRadius: 8,
                    elevation: 3,
                  }}
                >
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center gap-3">
                      <View className="bg-primary/10 p-2 rounded-xl">
                        <Send
                          size={18}
                          className="text-primary"
                          strokeWidth={2.5}
                        />
                      </View>
                      <View>
                        <Text className="font-bold text-foreground text-sm">
                          {transfer.to}
                        </Text>
                        <Text className="text-xs text-muted-foreground font-semibold capitalize mt-0.5">
                          {transfer.status}
                        </Text>
                      </View>
                    </View>
                    <Text className="font-black text-foreground text-base">
                      ${transfer.amount}
                    </Text>
                  </View>
                  <View className="bg-muted/50 rounded-full h-2 overflow-hidden mb-1.5">
                    <LinearGradient
                      colors={["#667eea", "#764ba2"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{
                        height: "100%",
                        width: `${transfer.progress}%`,
                        borderRadius: 999,
                      }}
                    />
                  </View>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs text-muted-foreground font-semibold">
                      {transfer.progress}%
                    </Text>
                    <View className="flex-row items-center gap-1">
                      <View className="w-1 h-1 rounded-full bg-primary" />
                      <Text className="text-xs text-primary font-bold">
                        Processing
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              ))}
            </View>
          </View>
        )}

        {/* Transaction History with Filter - Compact */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <View>
              <Text className="text-xl font-black text-foreground tracking-tight">
                Transactions
              </Text>
              <Text className="text-xs text-muted-foreground mt-0.5">
                {filteredTransactions.length} results
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setFilterModalVisible(true)}
              className="bg-card border border-border p-2 rounded-xl flex-row items-center gap-1.5 shadow-sm"
            >
              <Filter size={16} className="text-foreground" strokeWidth={2.5} />
              <Text className="text-foreground font-bold text-xs capitalize">
                {selectedFilter}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Transaction List */}
          <View className="gap-2">
            {filteredTransactions.slice(0, 5).map((transaction) => {
              const Icon = getTransactionIcon(transaction.type);
              const isNegative =
                transaction.type === "sent" ||
                transaction.type === "withdrawal" ||
                transaction.type === "bill";
              const isBill = transaction.type === "bill";

              return (
                <TouchableOpacity key={transaction.id}>
                  <View className="bg-card border border-border rounded-2xl p-3 flex-row items-center justify-between shadow-sm">
                    <View className="flex-row items-center gap-3 flex-1">
                      <LinearGradient
                        colors={
                          isBill
                            ? ["#dcfce7", "#bbf7d0"]
                            : isNegative
                              ? ["#fef3c7", "#fde68a"]
                              : ["#d1fae5", "#a7f3d0"]
                        }
                        style={{ padding: 8, borderRadius: 14 }}
                      >
                        <Icon
                          size={18}
                          color={
                            isBill
                              ? "#10b981"
                              : isNegative
                                ? "#f59e0b"
                                : "#10b981"
                          }
                          strokeWidth={2.5}
                        />
                      </LinearGradient>
                      <View className="flex-1">
                        <Text className="font-bold text-foreground text-sm mb-0.5">
                          {transaction.to}
                        </Text>
                        <View className="flex-row items-center gap-1.5 flex-wrap">
                          <Text className="text-xs text-muted-foreground font-semibold">
                            {transaction.date}
                          </Text>
                          {isBill && transaction.isRecurring && (
                            <View className="bg-purple-500/10 px-1.5 py-0.5 rounded flex-row items-center gap-0.5">
                              <Repeat size={8} className="text-purple-600" />
                              <Text className="text-xs font-bold text-purple-600">
                                Recurring
                              </Text>
                            </View>
                          )}
                          <View
                            style={{
                              backgroundColor:
                                getStatusColor(transaction.status) + "20",
                              paddingHorizontal: 6,
                              paddingVertical: 1,
                              borderRadius: 6,
                            }}
                          >
                            <Text
                              style={{
                                color: getStatusColor(transaction.status),
                              }}
                              className="text-xs font-black capitalize"
                            >
                              {transaction.status}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View className="items-end">
                      <Text
                        style={{ color: isNegative ? "#ef4444" : "#10b981" }}
                        className="font-black text-base"
                      >
                        {isNegative ? "-" : "+"}${transaction.amount}
                      </Text>
                      <Text className="text-xs text-muted-foreground font-semibold mt-0.5">
                        {transaction.currency}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* View All Button */}
          <TouchableOpacity className="mt-4 bg-primary/10 border-2 border-primary/20 py-3 rounded-2xl items-center">
            <View className="flex-row items-center gap-2">
              <Text className="text-primary font-bold text-sm">View All</Text>
              <ChevronRight
                size={16}
                className="text-primary"
                strokeWidth={3}
              />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Send Modal */}
      <Modal visible={sendModalVisible} transparent animationType="fade">
        <Pressable
          onPress={() => setSendModalVisible(false)}
          className="flex-1 bg-black/70 justify-end"
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <LinearGradient
              colors={["#1a1a1a", "#0a0a0a"]}
              style={{
                borderTopLeftRadius: 40,
                borderTopRightRadius: 40,
                paddingBottom: 48,
              }}
            >
              <View className="items-center py-4">
                <View className="w-16 h-1.5 bg-gray-700 rounded-full" />
              </View>
              <View className="px-6 py-6">
                <Text className="text-3xl font-black text-white mb-8">
                  Send Money
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setSendModalVisible(false);
                    router.push("/send-worldwide");
                  }}
                  style={{
                    backgroundColor: "white",
                    paddingVertical: 18,
                    borderRadius: 24,
                    alignItems: "center",
                    shadowColor: "#fff",
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.3,
                    shadowRadius: 16,
                  }}
                >
                  <Text className="font-black text-gray-900 text-base">
                    Continue
                  </Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Premium Filter Modal */}
      <Modal visible={filterModalVisible} transparent animationType="slide">
        <Pressable
          onPress={() => setFilterModalVisible(false)}
          className="flex-1 bg-black/70 justify-end"
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <LinearGradient
              colors={["#ffffff", "#f8f9fa"]}
              style={{
                borderTopLeftRadius: 32,
                borderTopRightRadius: 32,
                paddingBottom: 48,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -8 },
                shadowOpacity: 0.15,
                shadowRadius: 24,
                elevation: 20,
              }}
            >
              <View className="items-center py-4">
                <View className="w-16 h-1 bg-border rounded-full" />
              </View>

              <View className="px-6 py-4">
                {/* Header */}
                <View className="flex-row items-center justify-between mb-6">
                  <View>
                    <Text className="text-2xl font-black text-foreground tracking-tight">
                      Filter & Search
                    </Text>
                    <Text className="text-xs text-muted-foreground mt-1">
                      Refine your transaction view
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setFilterModalVisible(false)}
                    className="bg-muted/50 p-2 rounded-xl"
                  >
                    <X
                      size={20}
                      className="text-foreground"
                      strokeWidth={2.5}
                    />
                  </TouchableOpacity>
                </View>

                {/* Search Input */}
                <View className="mb-6">
                  <Text className="text-sm font-bold text-foreground mb-2">
                    Search by Name
                  </Text>
                  <View className="bg-card border-2 border-border rounded-2xl px-4 py-3 flex-row items-center gap-3">
                    <Search
                      size={20}
                      className="text-muted-foreground"
                      strokeWidth={2.5}
                    />
                    <TextInput
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      placeholder="Search recipient..."
                      placeholderTextColor="#9ca3af"
                      className="flex-1 text-foreground font-semibold text-base"
                    />
                    {searchQuery.length > 0 && (
                      <TouchableOpacity onPress={() => setSearchQuery("")}>
                        <X size={18} className="text-muted-foreground" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {/* Filter Type */}
                <View>
                  <Text className="text-sm font-bold text-foreground mb-3">
                    Transaction Type
                  </Text>
                  <View className="gap-2">
                    {[
                      "all",
                      "sent",
                      "received",
                      "transfer",
                      "bills",
                      "requested",
                    ].map((filter) => {
                      const isSelected = selectedFilter === filter;
                      return (
                        <TouchableOpacity
                          key={filter}
                          onPress={() => setSelectedFilter(filter as any)}
                          activeOpacity={0.7}
                        >
                          <LinearGradient
                            colors={
                              isSelected
                                ? ["#667eea", "#764ba2"]
                                : ["#ffffff", "#f8f9fa"]
                            }
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{
                              borderRadius: 18,
                              padding: 16,
                              borderWidth: 2,
                              borderColor: isSelected
                                ? "transparent"
                                : "#e5e7eb",
                              shadowColor: isSelected ? "#667eea" : "#000",
                              shadowOffset: {
                                width: 0,
                                height: isSelected ? 8 : 2,
                              },
                              shadowOpacity: isSelected ? 0.3 : 0.05,
                              shadowRadius: isSelected ? 12 : 4,
                              elevation: isSelected ? 8 : 2,
                            }}
                          >
                            <View className="flex-row items-center justify-between">
                              <View className="flex-row items-center gap-3">
                                <View
                                  style={{
                                    backgroundColor: isSelected
                                      ? "rgba(255,255,255,0.25)"
                                      : "#f3f4f6",
                                    padding: 10,
                                    borderRadius: 14,
                                  }}
                                >
                                  {filter === "all" && (
                                    <Activity
                                      size={20}
                                      color={isSelected ? "white" : "#667eea"}
                                      strokeWidth={2.5}
                                    />
                                  )}
                                  {filter === "sent" && (
                                    <ArrowUpRight
                                      size={20}
                                      color={isSelected ? "white" : "#f59e0b"}
                                      strokeWidth={2.5}
                                    />
                                  )}
                                  {filter === "received" && (
                                    <ArrowDownLeft
                                      size={20}
                                      color={isSelected ? "white" : "#10b981"}
                                      strokeWidth={2.5}
                                    />
                                  )}
                                  {filter === "transfer" && (
                                    <ArrowLeftRight
                                      size={20}
                                      color={isSelected ? "white" : "#667eea"}
                                      strokeWidth={2.5}
                                    />
                                  )}
                                  {filter === "requested" && (
                                    <Clock
                                      size={20}
                                      color={isSelected ? "white" : "#8b5cf6"}
                                      strokeWidth={2.5}
                                    />
                                  )}
                                  {filter === "bills" && (
                                    <Receipt
                                      size={20}
                                      color={isSelected ? "white" : "#f97316"}
                                      strokeWidth={2.5}
                                    />
                                  )}
                                </View>
                                <View>
                                  <Text
                                    style={{
                                      color: isSelected ? "white" : "#1f2937",
                                    }}
                                    className="font-black text-base capitalize tracking-tight"
                                  >
                                    {filter === "all"
                                      ? "All Transactions"
                                      : filter}
                                  </Text>
                                  <Text
                                    style={{
                                      color: isSelected
                                        ? "rgba(255,255,255,0.8)"
                                        : "#9ca3af",
                                    }}
                                    className="text-xs font-semibold mt-0.5"
                                  >
                                    {filter === "all"
                                      ? "Show everything"
                                      : `Only ${filter} transactions`}
                                  </Text>
                                </View>
                              </View>
                              {isSelected && (
                                <View className="bg-white/30 p-1.5 rounded-full">
                                  <Check
                                    size={16}
                                    color="white"
                                    strokeWidth={4}
                                  />
                                </View>
                              )}
                            </View>
                          </LinearGradient>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Apply Button */}
                <TouchableOpacity
                  onPress={() => setFilterModalVisible(false)}
                  className="mt-6"
                >
                  <LinearGradient
                    colors={["#667eea", "#764ba2"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      paddingVertical: 16,
                      borderRadius: 20,
                      alignItems: "center",
                      shadowColor: "#667eea",
                      shadowOffset: { width: 0, height: 8 },
                      shadowOpacity: 0.4,
                      shadowRadius: 16,
                      elevation: 10,
                    }}
                  >
                    <Text className="text-white font-black text-base tracking-wide">
                      Apply Filters
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
