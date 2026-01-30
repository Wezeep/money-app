import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Camera, X, Zap, AlertCircle } from "lucide-react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function PayBillScanScreen() {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState(true);
  const [scanned, setScanned] = useState(false);
  const { width } = Dimensions.get("window");
  const scannerSize = width * 0.7;

  const handleBarCodeScanned = () => {
    setScanned(true);
    // Simulate QR code scan success
    setTimeout(() => {
      router.push("/pay-bill");
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()}>
          <X color="white" size={28} />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">Scan QR Code</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Camera View Simulation */}
      <View className="flex-1 items-center justify-center">
        {/* Scanner Frame */}
        <View
          className="border-4 border-white rounded-3xl overflow-hidden"
          style={{
            width: scannerSize,
            height: scannerSize,
            backgroundColor: "rgba(255,255,255,0.1)",
          }}
        >
          {/* Corner Markers */}
          <View className="absolute top-0 left-0 w-16 h-16 border-l-4 border-t-4 border-green-400" />
          <View className="absolute top-0 right-0 w-16 h-16 border-r-4 border-t-4 border-green-400" />
          <View className="absolute bottom-0 left-0 w-16 h-16 border-l-4 border-b-4 border-green-400" />
          <View className="absolute bottom-0 right-0 w-16 h-16 border-r-4 border-b-4 border-green-400" />

          {/* Scanning Line Animation */}
          <LinearGradient
            colors={["transparent", "#34D399", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            className="absolute w-full h-1"
            style={{ top: scannerSize / 2 }}
          />

          {/* Center Icon */}
          <View className="flex-1 items-center justify-center">
            <View className="bg-white/20 p-6 rounded-full">
              <Camera color="white" size={48} />
            </View>
          </View>
        </View>

        {/* Instructions */}
        <View className="mt-8 px-8">
          <Text className="text-white text-center text-lg font-semibold mb-2">
            Position QR code within frame
          </Text>
          <Text className="text-white/70 text-center text-sm">
            The QR code will be scanned automatically
          </Text>
        </View>

        {/* Manual Test Button */}
        <TouchableOpacity
          onPress={handleBarCodeScanned}
          className="mt-8"
        >
          <View className="bg-green-500 px-8 py-4 rounded-full flex-row items-center gap-2">
            <Zap color="white" size={20} />
            <Text className="text-white font-bold text-base">
              Simulate Scan
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Help Section */}
      <View className="px-6 pb-8">
        <View className="bg-white/10 rounded-2xl p-4 flex-row gap-3">
          <AlertCircle color="#60A5FA" size={24} />
          <View className="flex-1">
            <Text className="text-white font-semibold mb-1">
              Can't scan QR code?
            </Text>
            <Text className="text-white/70 text-sm">
              Make sure the QR code is well-lit and centered in the frame
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}