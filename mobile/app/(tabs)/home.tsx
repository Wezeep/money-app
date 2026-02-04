import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  Send,
  Download,
  CreditCard,
  Users,
  Gift,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Globe,
  X,
  Camera,
  Repeat,
} from "lucide-react-native";
import { ThemeToggle } from "@components/ThemeToggle";
import { useRouter } from "expo-router";
import { useBillPaymentContext } from "@components/BillPaymentContext";

type QuickAction = {
  id: string;
  label: string;
  icon: typeof Send;
  color: string;
  description: string;
};

type ForYouCard = {
  id: string;
  title: string;
  description: string;
  icon: typeof Gift;
  color: string;
};

const quickActions: QuickAction[] = [
  {
    id: "1",
    label: "Send Money",
    icon: Send,
    color: "#FB7185",
    description: "Transfer funds anywhere",
  },
  {
    id: "2",
    label: "Request Money",
    icon: Download,
    color: "#60A5FA",
    description: "Request from contacts",
  },
  {
    id: "3",
    label: "Pay Bills",
    icon: CreditCard,
    color: "#34D399",
    description: "Purchases, services & utilities",
  },
  {
    id: "4",
    label: "Split Expenses",
    icon: Users,
    color: "#A78BFA",
    description: "Share with family & friends",
  },
];

const forYouCards: ForYouCard[] = [
  {
    id: "1",
    title: "Invite & Earn",
    description: "Get $10 for each friend who joins",
    icon: Gift,
    color: "#667eea",
  },
  {
    id: "2",
    title: "Cashback Offers",
    description: "5% back on your next bill payment",
    icon: TrendingUp,
    color: "#764ba2",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { setPaymentType } = useBillPaymentContext();
  const [showSendModal, setShowSendModal] = useState(false);
  const [showPayBillModal, setShowPayBillModal] = useState(false);

  const handleQuickAction = (actionId: string) => {
    if (actionId === "1") {
      setShowSendModal(true);
    } else if (actionId === "2") {
      router.push("/request-money");
    } else if (actionId === "3") {
      setShowPayBillModal(true);
    } else if (actionId === "4") {
      router.push("/bill-split");
    }
  };

  const handleSendOption = (type: "worldwide" | "p2p") => {
    setShowSendModal(false);
    if (type === "worldwide") {
      router.push("/send-worldwide");
    } else {
      router.push("/send-p2p");
    }
  };

  const handlePayBillOption = (type: "scan" | "vendor" | "recurring") => {
    setShowPayBillModal(false);
    if (type === "scan") {
      setPaymentType("one-time");
      router.push("/pay-bill-scan");
    } else if (type === "vendor") {
      setPaymentType("one-time");
      router.push("/pay-bill");
    } else if (type === "recurring") {
      setPaymentType("recurring");
      router.push("/pay-bill");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 128 }}>
        {/* Header */}
        <View className="px-6 py-4 flex-row items-center justify-between">
          <View>
            <Text className="text-muted-foreground text-sm">Welcome back,</Text>
            <Text className="text-2xl font-bold text-foreground">Alex</Text>
          </View>
          <ThemeToggle />
        </View>

        {/* Wallet Balance Card */}
        <View className="px-6 mb-6">
          <LinearGradient
            colors={["#667eea", "#764ba2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 20, padding: 24 }}
          >
            <Text className="text-white/80 text-sm mb-2">Total Balance</Text>
            <Text className="text-white text-4xl font-bold mb-4">
              $2,458.50
            </Text>
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-white/80 text-xs">Local Currency</Text>
                <Text className="text-white text-lg font-semibold">
                  ₦980,000
                </Text>
              </View>
              <TouchableOpacity className="bg-white/20 px-4 py-2 rounded-full">
                <Text className="text-white font-medium">Add Funds</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Actions */}
        <View className="px-6 mb-8">
          <Text className="text-xl font-bold text-foreground mb-4">
            What would you like to do today?
          </Text>
          <View className="gap-3">
            {/* First Row */}
            <View className="flex-row gap-3">
              {quickActions.slice(0, 2).map((action) => {
                const Icon = action.icon;
                return (
                  <TouchableOpacity
                    key={action.id}
                    className="flex-1"
                    onPress={() => handleQuickAction(action.id)}
                  >
                    <View className="bg-card rounded-2xl p-4 border border-border">
                      <View
                        className="w-12 h-12 rounded-xl items-center justify-center mb-3"
                        style={{ backgroundColor: action.color + "20" }}
                      >
                        <Icon color={action.color} size={24} />
                      </View>
                      <Text className="text-foreground font-semibold mb-1">
                        {action.label}
                      </Text>
                      <Text className="text-muted-foreground text-xs">
                        {action.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
            {/* Second Row */}
            <View className="flex-row gap-3">
              {quickActions.slice(2, 4).map((action) => {
                const Icon = action.icon;
                return (
                  <TouchableOpacity
                    key={action.id}
                    className="flex-1"
                    onPress={() => handleQuickAction(action.id)}
                  >
                    <View className="bg-card rounded-2xl p-4 border border-border">
                      <View
                        className="w-12 h-12 rounded-xl items-center justify-center mb-3"
                        style={{ backgroundColor: action.color + "20" }}
                      >
                        <Icon color={action.color} size={24} />
                      </View>
                      <Text className="text-foreground font-semibold mb-1">
                        {action.label}
                      </Text>
                      <Text className="text-muted-foreground text-xs">
                        {action.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* For You Section */}
        <View className="px-6 mb-8">
          <Text className="text-xl font-bold text-foreground mb-4">
            For You
          </Text>
          <View className="gap-3">
            {forYouCards.map((card) => {
              const Icon = card.icon;
              return (
                <TouchableOpacity key={card.id}>
                  <View className="bg-card rounded-2xl p-4 flex-row items-center border border-border">
                    <View
                      className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                      style={{ backgroundColor: card.color + "20" }}
                    >
                      <Icon color={card.color} size={24} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-foreground font-semibold mb-1">
                        {card.title}
                      </Text>
                      <Text className="text-muted-foreground text-sm">
                        {card.description}
                      </Text>
                    </View>
                    <ArrowUpRight className="text-muted-foreground" size={20} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Monthly Analytics */}
        <View className="px-6 mb-8">
          <Text className="text-xl font-bold text-foreground mb-4">
            This Month
          </Text>
          <View className="flex-row gap-3">
            <View className="flex-1 bg-card rounded-2xl p-4 border border-border">
              <View className="flex-row items-center mb-2">
                <View className="w-8 h-8 rounded-full bg-green-500/20 items-center justify-center mr-2">
                  <ArrowDownLeft className="text-green-500" size={16} />
                </View>
                <Text className="text-muted-foreground text-sm">Received</Text>
              </View>
              <Text className="text-foreground text-2xl font-bold">$1,240</Text>
              <Text className="text-green-500 text-xs mt-1">
                +12% vs last month
              </Text>
            </View>

            <View className="flex-1 bg-card rounded-2xl p-4 border border-border">
              <View className="flex-row items-center mb-2">
                <View className="w-8 h-8 rounded-full bg-orange-500/20 items-center justify-center mr-2">
                  <ArrowUpRight className="text-orange-500" size={16} />
                </View>
                <Text className="text-muted-foreground text-sm">Sent</Text>
              </View>
              <Text className="text-foreground text-2xl font-bold">$890</Text>
              <Text className="text-orange-500 text-xs mt-1">
                +8% vs last month
              </Text>
            </View>
          </View>
        </View>

        {/* Rewards Teaser */}
        <View className="px-6">
          <TouchableOpacity>
            <LinearGradient
              colors={["#667eea", "#764ba2"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ borderRadius: 20, padding: 20 }}
            >
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-white font-bold text-lg">
                  Rewards Progress
                </Text>
                <Gift className="text-white" size={24} />
              </View>
              <Text className="text-white/90 text-sm mb-3">
                480 points • 20 points to next reward
              </Text>
              <View className="h-2 bg-white/30 rounded-full overflow-hidden">
                <View
                  className="h-full bg-white rounded-full"
                  style={{ width: "75%" }}
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Pay Bills Modal Overlay */}
      <Modal
        visible={showPayBillModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPayBillModal(false)}
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
              width: "85%",
              maxWidth: 400,
            }}
          >
            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setShowPayBillModal(false)}
              style={{ position: "absolute", top: 16, right: 16, zIndex: 10 }}
            >
              <X color="#78716c" size={24} />
            </TouchableOpacity>

            {/* Header */}
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#1c1917",
                marginBottom: 8,
              }}
            >
              Pay Bills
            </Text>
            <Text style={{ fontSize: 14, color: "#78716c", marginBottom: 24 }}>
              Choose how you'd like to pay
            </Text>

            {/* Scan to Pay Option */}
            <TouchableOpacity onPress={() => handlePayBillOption("scan")}>
              <LinearGradient
                colors={["#34D399", "#10B981"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 16, padding: 20, marginBottom: 16 }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 16,
                    }}
                  >
                    <Camera color="#ffffff" size={24} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#ffffff",
                        marginBottom: 4,
                      }}
                    >
                      Scan to Pay
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        color: "rgba(255, 255, 255, 0.9)",
                      }}
                    >
                      Scan QR code to pay instantly
                    </Text>
                  </View>
                  <ArrowUpRight color="#ffffff" size={20} />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Find Payee Option */}
            <TouchableOpacity onPress={() => handlePayBillOption("vendor")}>
              <View
                style={{
                  borderRadius: 16,
                  padding: 20,
                  backgroundColor: "#f5f5f4",
                  borderWidth: 1,
                  borderColor: "#e7e5e4",
                  marginBottom: 16,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: "#60A5FA20",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 16,
                    }}
                  >
                    <CreditCard color="#60A5FA" size={24} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#1c1917",
                        marginBottom: 4,
                      }}
                    >
                      Find Payee
                    </Text>
                    <Text style={{ fontSize: 13, color: "#78716c" }}>
                      Search and select a vendor
                    </Text>
                  </View>
                  <ArrowUpRight color="#78716c" size={20} />
                </View>
              </View>
            </TouchableOpacity>

            {/* Setup Recurring Payment Option */}
            <TouchableOpacity onPress={() => handlePayBillOption("recurring")}>
              <View
                style={{
                  borderRadius: 16,
                  padding: 20,
                  backgroundColor: "#f5f5f4",
                  borderWidth: 1,
                  borderColor: "#e7e5e4",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: "#A78BFA20",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 16,
                    }}
                  >
                    <Repeat color="#A78BFA" size={24} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#1c1917",
                        marginBottom: 4,
                      }}
                    >
                      Setup Recurring Payment
                    </Text>
                    <Text style={{ fontSize: 13, color: "#78716c" }}>
                      Automate regular bill payments
                    </Text>
                  </View>
                  <ArrowUpRight color="#78716c" size={20} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Send Money Modal Overlay */}
      <Modal
        visible={showSendModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSendModal(false)}
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
              width: "85%",
              maxWidth: 400,
            }}
          >
            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setShowSendModal(false)}
              style={{ position: "absolute", top: 16, right: 16, zIndex: 10 }}
            >
              <X color="#78716c" size={24} />
            </TouchableOpacity>

            {/* Header */}
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#1c1917",
                marginBottom: 8,
              }}
            >
              Send Money
            </Text>
            <Text style={{ fontSize: 14, color: "#78716c", marginBottom: 24 }}>
              Choose how you'd like to send
            </Text>

            {/* Send Worldwide Option */}
            <TouchableOpacity onPress={() => handleSendOption("worldwide")}>
              <LinearGradient
                colors={["#667eea", "#764ba2"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 16, padding: 20, marginBottom: 16 }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 16,
                    }}
                  >
                    <Globe color="#ffffff" size={24} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#ffffff",
                        marginBottom: 4,
                      }}
                    >
                      Send Worldwide
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        color: "rgba(255, 255, 255, 0.9)",
                      }}
                    >
                      Transfer money internationally
                    </Text>
                  </View>
                  <ArrowUpRight color="#ffffff" size={20} />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* P2P Transfer Option */}
            <TouchableOpacity onPress={() => handleSendOption("p2p")}>
              <View
                style={{
                  borderRadius: 16,
                  padding: 20,
                  backgroundColor: "#f5f5f4",
                  borderWidth: 1,
                  borderColor: "#e7e5e4",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: "#A78BFA20",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 16,
                    }}
                  >
                    <Users color="#A78BFA" size={24} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#1c1917",
                        marginBottom: 4,
                      }}
                    >
                      P2P Transfer
                    </Text>
                    <Text style={{ fontSize: 13, color: "#78716c" }}>
                      Send to friends & family locally
                    </Text>
                  </View>
                  <ArrowUpRight color="#78716c" size={20} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
