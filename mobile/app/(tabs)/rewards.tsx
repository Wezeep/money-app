import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  Gift,
  Star,
  TrendingUp,
  Award,
  ChevronRight,
  Zap,
  Trophy,
  Clock,
  CheckCircle,
} from "lucide-react-native";
import { ThemeToggle } from "@/components/ThemeToggle";

type RewardTier = {
  name: string;
  points: number;
  color: string;
  gradient: string[];
};

type RewardItem = {
  id: string;
  title: string;
  points: number;
  category: string;
  image: string;
  description: string;
};

type EarningOpportunity = {
  id: string;
  title: string;
  points: number;
  icon: any;
  action: string;
};

type RewardHistory = {
  id: string;
  type: "earned" | "redeemed";
  title: string;
  points: number;
  date: string;
  icon: any;
};

const tiers: RewardTier[] = [
  {
    name: "Bronze",
    points: 0,
    color: "#CD7F32",
    gradient: ["#667eea", "#764ba2"],
  },
  {
    name: "Silver",
    points: 500,
    color: "#C0C0C0",
    gradient: ["#667eea", "#764ba2"],
  },
  {
    name: "Gold",
    points: 1500,
    color: "#FFD700",
    gradient: ["#667eea", "#764ba2"],
  },
  {
    name: "Platinum",
    points: 3000,
    color: "#E5E4E2",
    gradient: ["#667eea", "#764ba2"],
  },
];

const availableRewards: RewardItem[] = [
  {
    id: "1",
    title: "$10 Cashback",
    points: 1000,
    category: "Cashback",
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400",
    description: "Direct cashback to your wallet",
  },
  {
    id: "2",
    title: "Amazon Gift Card",
    points: 1500,
    category: "Gift Cards",
    image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400",
    description: "$15 Amazon gift card",
  },
  {
    id: "3",
    title: "Free Transfer Fee",
    points: 500,
    category: "Benefits",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400",
    description: "Waive one transfer fee",
  },
  {
    id: "4",
    title: "Starbucks Card",
    points: 800,
    category: "Gift Cards",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
    description: "$10 Starbucks gift card",
  },
];

const earningOpportunities: EarningOpportunity[] = [
  {
    id: "1",
    title: "Send Money",
    points: 10,
    icon: Zap,
    action: "Earn 10 pts per transaction",
  },
  {
    id: "2",
    title: "Refer a Friend",
    points: 100,
    icon: Gift,
    action: "Get 100 pts per referral",
  },
  {
    id: "3",
    title: "Complete Profile",
    points: 50,
    icon: CheckCircle,
    action: "One-time bonus",
  },
  {
    id: "4",
    title: "Monthly Challenge",
    points: 200,
    icon: Trophy,
    action: "10 transactions this month",
  },
];

const rewardHistory: RewardHistory[] = [
  {
    id: "1",
    type: "earned",
    title: "Money Transfer",
    points: 15,
    date: "2 hours ago",
    icon: TrendingUp,
  },
  {
    id: "2",
    type: "redeemed",
    title: "Cashback Redeemed",
    points: -500,
    date: "Yesterday",
    icon: Gift,
  },
  {
    id: "3",
    type: "earned",
    title: "Referral Bonus",
    points: 100,
    date: "3 days ago",
    icon: Star,
  },
  {
    id: "4",
    type: "earned",
    title: "Bill Payment",
    points: 10,
    date: "5 days ago",
    icon: Zap,
  },
  {
    id: "5",
    type: "earned",
    title: "Profile Completed",
    points: 50,
    date: "1 week ago",
    icon: CheckCircle,
  },
];

export default function RewardsScreen() {
  const [currentPoints] = useState(1247);
  const currentTier = tiers.reduce((prev, curr) =>
    currentPoints >= curr.points ? curr : prev
  );
  const nextTier = tiers.find((t) => t.points > currentPoints);
  const progressToNext = nextTier
    ? ((currentPoints - currentTier.points) /
        (nextTier.points - currentTier.points)) *
      100
    : 100;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View className="px-6 py-4 flex-row items-center justify-between">
          <View>
            <Text className="text-sm text-muted-foreground">Your Rewards</Text>
            <Text className="text-2xl font-bold text-foreground">
              Wezeep Points
            </Text>
          </View>
          <ThemeToggle />
        </View>

        {/* Points Hero Card */}
        <View className="px-6 mb-6" >
          <LinearGradient
            colors={currentTier.gradient}
            style={{ borderRadius: 24, padding: 24 }}
          >
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-white/80 text-sm font-medium mb-1">
                  Available Points
                </Text>
                <Text className="text-white text-4xl font-bold">
                  {currentPoints.toLocaleString()}
                </Text>
              </View>
              <View className="bg-white/20 rounded-full p-4">
                <Trophy color="white" size={32} />
              </View>
            </View>

            <View className="bg-white/20 rounded-full h-2 mb-2">
              <View
                className="bg-white rounded-full h-2"
                style={{ width: `${progressToNext}%` }}
              />
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-white/90 text-sm font-medium">
                {currentTier.name} Tier
              </Text>
              {nextTier && (
                <Text className="text-white/90 text-sm">
                  {nextTier.points - currentPoints} pts to {nextTier.name}
                </Text>
              )}
            </View>
          </LinearGradient>
        </View>

        {/* Tier Badges */}
        <View className="px-6 mb-8">
          <View className="flex-row justify-between">
            {tiers.map((tier) => (
              <View key={tier.name} className="items-center">
                <View
                  className="w-14 h-14 rounded-full items-center justify-center mb-2"
                  style={{
                    backgroundColor:
                      currentPoints >= tier.points ? tier.color : "#e5e7eb",
                    opacity: currentPoints >= tier.points ? 1 : 0.3,
                  }}
                >
                  <Award color="white" size={24} />
                </View>
                <Text
                  className="text-xs font-medium"
                  style={{
                    color:
                      currentPoints >= tier.points ? tier.color : "#9ca3af",
                  }}
                >
                  {tier.name}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Earning Opportunities */}
        <View className="px-6 mb-8">
          <Text className="text-xl font-bold text-foreground mb-4">
            Earn More Points
          </Text>
          <View className="gap-3">
            {earningOpportunities.map((opp) => {
              const IconComponent = opp.icon;
              return (
                <TouchableOpacity key={opp.id}>
                  <View className="bg-card rounded-2xl p-4 border border-border flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3 flex-1">
                      <LinearGradient
                        colors={["#667eea", "#764ba2"]}
                        style={{ borderRadius: 12, padding: 12 }}
                      >
                        <IconComponent color="white" size={20} />
                      </LinearGradient>
                      <View className="flex-1">
                        <Text className="text-foreground font-semibold mb-1">
                          {opp.title}
                        </Text>
                        <Text className="text-muted-foreground text-xs">
                          {opp.action}
                        </Text>
                      </View>
                    </View>
                    <View className="items-end">
                      <Text className="text-green-600 font-bold text-lg">
                        +{opp.points}
                      </Text>
                      <ChevronRight
                        className="text-muted-foreground"
                        size={20}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Available Rewards */}
        <View className="px-6 mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-foreground">
              Redeem Rewards
            </Text>
            <TouchableOpacity>
              <Text className="text-primary font-medium">View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16 }}
          >
            {availableRewards.map((reward) => (
              <TouchableOpacity key={reward.id}>
                <View
                  className="bg-card rounded-2xl overflow-hidden border border-border"
                  style={{ width: 200 }}
                >
                  <Image
                    source={{ uri: reward.image }}
                    style={{ width: "100%", height: 120 }}
                    resizeMode="cover"
                  />
                  <View className="p-4">
                    <Text className="text-xs text-primary font-medium mb-1">
                      {reward.category}
                    </Text>
                    <Text className="text-foreground font-bold mb-2">
                      {reward.title}
                    </Text>
                    <Text
                      className="text-muted-foreground text-xs mb-3"
                      numberOfLines={2}
                    >
                      {reward.description}
                    </Text>
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-1">
                        <Star color="#f59e0b" size={16} fill="#f59e0b" />
                        <Text className="text-foreground font-bold">
                          {reward.points}
                        </Text>
                      </View>
                      <TouchableOpacity
                        className="bg-primary px-4 py-2 rounded-full"
                        disabled={currentPoints < reward.points}
                        style={{
                          opacity: currentPoints < reward.points ? 0.5 : 1,
                        }}
                      >
                        <Text className="text-primary-foreground text-xs font-semibold">
                          Redeem
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Reward History */}
        <View className="px-6 mb-8">
          <Text className="text-xl font-bold text-foreground mb-4">
            Recent Activity
          </Text>
          <View className="bg-card rounded-2xl border border-border overflow-hidden">
            {rewardHistory.map((item, index) => {
              const HistoryIcon = item.icon;
              return (
                <View key={item.id}>
                  <View className="p-4 flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3 flex-1">
                      <View
                        className="rounded-full p-2"
                        style={{
                          backgroundColor:
                            item.type === "earned" ? "#dcfce7" : "#fee2e2",
                        }}
                      >
                        <HistoryIcon
                          color={item.type === "earned" ? "#16a34a" : "#dc2626"}
                          size={20}
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-foreground font-semibold">
                          {item.title}
                        </Text>
                        <View className="flex-row items-center gap-1 mt-1">
                          <Clock className="text-muted-foreground" size={10} />
                          <Text className="text-muted-foreground text-xs">
                            {item.date}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Text
                      className="font-bold text-lg"
                      style={{
                        color: item.type === "earned" ? "#16a34a" : "#dc2626",
                      }}
                    >
                      {item.points > 0 ? "+" : ""}
                      {item.points}
                    </Text>
                  </View>
                  {index < rewardHistory.length - 1 && (
                    <View className="h-px bg-border mx-4" />
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
