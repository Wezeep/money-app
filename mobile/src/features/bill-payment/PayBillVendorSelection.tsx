import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  Search,
  Filter,
  CheckCircle,
  Store,
  Coffee,
  ShoppingBag,
  Utensils,
  Zap,
  Droplet,
  Home,
  Car,
  Scissors,
  X,
  MapPin,
  Star,
  TrendingUp,
} from "lucide-react-native";

type ServiceCategory =
  | "all"
  | "restaurant"
  | "retail"
  | "utilities"
  | "services"
  | "gas"
  | "grocery";

type Vendor = {
  id: string;
  name: string;
  category: ServiceCategory;
  address: string;
  city: string;
  country: string;
  rating: number;
  logo?: string;
  isPopular?: boolean;
  lastTransaction?: string;
};

const mockVendors: Vendor[] = [
  {
    id: "1",
    name: "Starbucks Coffee",
    category: "restaurant",
    address: "123 Main St",
    city: "New York",
    country: "USA",
    rating: 4.8,
    logo: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400&auto=format&fit=crop&q=60",
    isPopular: true,
    lastTransaction: "2 days ago",
  },
  {
    id: "2",
    name: "Whole Foods Market",
    category: "grocery",
    address: "456 Oak Ave",
    city: "Los Angeles",
    country: "USA",
    rating: 4.6,
    logo: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=60",
    isPopular: true,
    lastTransaction: "1 week ago",
  },
  {
    id: "3",
    name: "Shell Gas Station",
    category: "gas",
    address: "789 Highway 1",
    city: "Chicago",
    country: "USA",
    rating: 4.4,
    logo: "https://images.unsplash.com/photo-1545262810-77515befe149?w=400&auto=format&fit=crop&q=60",
    isPopular: true,
  },
  {
    id: "4",
    name: "Electric Company",
    category: "utilities",
    address: "321 Power Rd",
    city: "Houston",
    country: "USA",
    rating: 4.2,
    isPopular: false,
    lastTransaction: "Today",
  },
  {
    id: "5",
    name: "The Barber Shop",
    category: "services",
    address: "555 Style St",
    city: "Miami",
    country: "USA",
    rating: 4.9,
    logo: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: "6",
    name: "Joe's Pizza",
    category: "restaurant",
    address: "888 Pizza Ln",
    city: "Boston",
    country: "USA",
    rating: 4.7,
    logo: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=60",
    lastTransaction: "3 days ago",
  },
  {
    id: "7",
    name: "Water & Sewage Dept",
    category: "utilities",
    address: "999 Civic Center",
    city: "Seattle",
    country: "USA",
    rating: 4.0,
  },
  {
    id: "8",
    name: "Target",
    category: "retail",
    address: "111 Shopping Plaza",
    city: "Denver",
    country: "USA",
    rating: 4.5,
    logo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&auto=format&fit=crop&q=60",
  },
];

const categories = [
  { id: "all", label: "All", icon: Store },
  { id: "restaurant", label: "Restaurants", icon: Utensils },
  { id: "grocery", label: "Grocery", icon: ShoppingBag },
  { id: "gas", label: "Gas", icon: Car },
  { id: "utilities", label: "Utilities", icon: Zap },
  { id: "services", label: "Services", icon: Scissors },
  { id: "retail", label: "Retail", icon: Store },
];

export default function PayBillVendorSelectionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const isRecurring = params.recurring === "true";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<ServiceCategory>("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredVendors = mockVendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || vendor.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularVendors = mockVendors.filter((v) => v.isPopular);
  const recentVendors = mockVendors.filter((v) => v.lastTransaction);

  const getCategoryIcon = (category: ServiceCategory) => {
    switch (category) {
      case "restaurant":
        return Utensils;
      case "grocery":
        return ShoppingBag;
      case "gas":
        return Car;
      case "utilities":
        return Zap;
      case "services":
        return Scissors;
      case "retail":
        return Store;
      default:
        return Store;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center border-b border-border">
        <Pressable onPress={() => router.back()} className="mr-3">
          <ArrowLeft className="text-foreground" size={22} />
        </Pressable>
        <View className="flex-1">
          <Text className="text-xl font-bold text-foreground">Find Payee</Text>
          <Text className="text-xs text-muted-foreground">
            Search vendors to pay
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 128 }}>
        {/* Search Bar */}
        <View className="px-6 pt-5 pb-4">
          <View className="bg-card rounded-2xl border-2 border-primary/20 flex-row items-center px-4 py-3.5 shadow-sm">
            <Search className="text-primary mr-3" size={22} />
            <TextInput
              className="flex-1 text-foreground text-base font-medium"
              placeholder="Search vendors, services..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <X className="text-muted-foreground" size={20} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Category Filter Chips */}
        <View className="px-6 mb-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10 }}
          >
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.id as ServiceCategory)}
                  className={`px-4 py-2.5 rounded-xl flex-row items-center gap-2 border-2 ${
                    isSelected
                      ? "bg-primary border-primary"
                      : "bg-card border-border"
                  }`}
                >
                  <Icon color={isSelected ? "#ffffff" : "#667eea"} size={18} />
                  <Text
                    className={`font-bold text-sm ${
                      isSelected ? "text-white" : "text-foreground"
                    }`}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Popular Vendors */}
        {popularVendors.length > 0 &&
          selectedCategory === "all" &&
          !searchQuery && (
            <View className="mb-6">
              <View className="px-6 mb-4 flex-row items-center gap-2">
                <TrendingUp className="text-primary" size={20} />
                <Text className="text-lg font-bold text-foreground">
                  Popular Vendors
                </Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24, gap: 14 }}
              >
                {popularVendors.map((vendor) => {
                  const Icon = getCategoryIcon(vendor.category);
                  return (
                    <TouchableOpacity
                      key={vendor.id}
                      onPress={() =>
                        router.push({
                          pathname: "/pay-bill",
                          params: {
                            vendorName: vendor.name,
                            vendorAddress: `${vendor.address}, ${vendor.city}`,
                            vendorCountry: vendor.country,
                            vendorCategory: vendor.category,
                            recurring: isRecurring ? "true" : "false",
                          },
                        })
                      }
                      activeOpacity={0.7}
                    >
                      <LinearGradient
                        colors={["#667eea", "#764ba2"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                          width: 160,
                          borderRadius: 20,
                          padding: 16,
                          shadowColor: "#667eea",
                          shadowOffset: { width: 0, height: 8 },
                          shadowOpacity: 0.3,
                          shadowRadius: 12,
                          elevation: 8,
                        }}
                      >
                        {/* Logo or Icon */}
                        <View className="mb-3">
                          {vendor.logo ? (
                            <View className="w-12 h-12 rounded-xl overflow-hidden bg-white">
                              <Image
                                source={{ uri: vendor.logo }}
                                className="w-full h-full"
                                resizeMode="cover"
                              />
                            </View>
                          ) : (
                            <View className="w-12 h-12 rounded-xl bg-white/20 items-center justify-center">
                              <Icon color="#ffffff" size={24} />
                            </View>
                          )}
                        </View>

                        <Text
                          className="text-white font-bold text-base mb-1"
                          numberOfLines={1}
                        >
                          {vendor.name}
                        </Text>
                        <View className="flex-row items-center gap-1 mb-2">
                          <MapPin color="#ffffff" size={12} />
                          <Text
                            className="text-white/80 text-xs"
                            numberOfLines={1}
                          >
                            {vendor.city}
                          </Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                          <Star color="#fbbf24" size={14} fill="#fbbf24" />
                          <Text className="text-white font-bold text-sm">
                            {vendor.rating}
                          </Text>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

        {/* Recent Vendors */}
        {recentVendors.length > 0 &&
          selectedCategory === "all" &&
          !searchQuery && (
            <View className="px-6 mb-6">
              <View className="flex-row items-center gap-2 mb-4">
                <Coffee className="text-primary" size={20} />
                <Text className="text-lg font-bold text-foreground">
                  Recent Vendors
                </Text>
              </View>
              <View className="gap-3">
                {recentVendors.slice(0, 3).map((vendor) => {
                  const Icon = getCategoryIcon(vendor.category);
                  return (
                    <TouchableOpacity
                      key={vendor.id}
                      onPress={() =>
                        router.push({
                          pathname: "/pay-bill",
                          params: {
                            vendorName: vendor.name,
                            vendorAddress: `${vendor.address}, ${vendor.city}`,
                            vendorCountry: vendor.country,
                            vendorCategory: vendor.category,
                            recurring: isRecurring ? "true" : "false",
                          },
                        })
                      }
                    >
                      <View className="bg-card rounded-2xl p-4 border border-border flex-row items-center gap-3 shadow-sm">
                        {vendor.logo ? (
                          <View className="w-14 h-14 rounded-xl overflow-hidden">
                            <Image
                              source={{ uri: vendor.logo }}
                              className="w-full h-full"
                              resizeMode="cover"
                            />
                          </View>
                        ) : (
                          <View className="w-14 h-14 rounded-xl bg-primary/10 items-center justify-center">
                            <Icon className="text-primary" size={24} />
                          </View>
                        )}

                        <View className="flex-1">
                          <Text className="text-foreground font-bold text-base mb-1">
                            {vendor.name}
                          </Text>
                          <View className="flex-row items-center gap-2">
                            <View className="flex-row items-center gap-1">
                              <MapPin
                                className="text-muted-foreground"
                                size={12}
                              />
                              <Text className="text-muted-foreground text-xs">
                                {vendor.city}
                              </Text>
                            </View>
                            <Text className="text-muted-foreground">•</Text>
                            <Text className="text-green-600 text-xs font-medium">
                              {vendor.lastTransaction}
                            </Text>
                          </View>
                        </View>

                        <View className="items-end">
                          <View className="flex-row items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                            <Star
                              className="text-amber-500"
                              size={12}
                              fill="#f59e0b"
                            />
                            <Text className="text-amber-700 font-bold text-xs">
                              {vendor.rating}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

        {/* All Vendors List */}
        <View className="px-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-foreground">
              {selectedCategory === "all"
                ? "All Vendors"
                : categories.find((c) => c.id === selectedCategory)?.label}
            </Text>
            <Text className="text-sm text-muted-foreground font-medium">
              {filteredVendors.length} results
            </Text>
          </View>

          {filteredVendors.length === 0 ? (
            <View className="items-center justify-center py-16">
              <Store className="text-muted-foreground mb-4" size={56} />
              <Text className="text-muted-foreground text-center text-base">
                No vendors found
              </Text>
              <Text className="text-muted-foreground text-center text-sm mt-2">
                Try adjusting your search or filters
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {filteredVendors.map((vendor) => {
                const Icon = getCategoryIcon(vendor.category);
                return (
                  <TouchableOpacity
                    key={vendor.id}
                    onPress={() =>
                      router.push({
                        pathname: "/pay-bill",
                        params: {
                          vendorName: vendor.name,
                          vendorAddress: `${vendor.address}, ${vendor.city}`,
                          vendorCountry: vendor.country,
                          vendorCategory: vendor.category,
                          recurring: isRecurring ? "true" : "false",
                        },
                      })
                    }
                  >
                    <View className="bg-card rounded-2xl p-4 border border-border flex-row items-center gap-3 shadow-sm">
                      {vendor.logo ? (
                        <View className="w-14 h-14 rounded-xl overflow-hidden">
                          <Image
                            source={{ uri: vendor.logo }}
                            className="w-full h-full"
                            resizeMode="cover"
                          />
                        </View>
                      ) : (
                        <View className="w-14 h-14 rounded-xl bg-primary/10 items-center justify-center">
                          <Icon className="text-primary" size={24} />
                        </View>
                      )}

                      <View className="flex-1">
                        <Text className="text-foreground font-bold text-base mb-1">
                          {vendor.name}
                        </Text>
                        <View className="flex-row items-center gap-2 mb-1">
                          <View className="flex-row items-center gap-1">
                            <MapPin
                              className="text-muted-foreground"
                              size={12}
                            />
                            <Text className="text-muted-foreground text-xs">
                              {vendor.address}, {vendor.city}
                            </Text>
                          </View>
                        </View>
                        <View className="bg-primary/10 px-2 py-1 rounded-md self-start">
                          <Text className="text-primary text-xs font-bold capitalize">
                            {vendor.category}
                          </Text>
                        </View>
                      </View>

                      <View className="items-end gap-2">
                        <View className="flex-row items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                          <Star
                            className="text-amber-500"
                            size={12}
                            fill="#f59e0b"
                          />
                          <Text className="text-amber-700 font-bold text-xs">
                            {vendor.rating}
                          </Text>
                        </View>
                        {vendor.lastTransaction && (
                          <View className="bg-green-50 px-2 py-1 rounded-lg">
                            <Text className="text-green-700 text-xs font-bold">
                              Recent
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
