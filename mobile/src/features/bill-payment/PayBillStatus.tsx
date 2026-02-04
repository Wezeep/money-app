import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CheckCircle, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useBillPayment } from '@components/BillPaymentContext';

export default function PayBillStatusScreen() {
  const router = useRouter();
  const { selectedVendor, paymentType } = useBillPayment();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        {/* Success Icon */}
        <View className="mb-8">
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={{ width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center' }}
          >
            <CheckCircle color="#fff" size={64} />
          </LinearGradient>
        </View>

        {/* Success Message */}
        <Text className="text-3xl font-bold text-foreground text-center mb-3">Payment Successful!</Text>
        <Text className="text-muted-foreground text-center text-base mb-8">
          Your bill payment has been processed successfully
        </Text>

        {/* Payment Details */}
        <View className="bg-card rounded-2xl p-6 w-full border border-border mb-8">
          <View className="flex-row justify-between mb-4 pb-4 border-b border-border">
            <Text className="text-muted-foreground">Paid To</Text>
            <Text className="text-foreground font-semibold">{selectedVendor?.name || 'Vendor'}</Text>
          </View>
          <View className="flex-row justify-between mb-4 pb-4 border-b border-border">
            <Text className="text-muted-foreground">Payment Type</Text>
            <Text className="text-foreground font-semibold capitalize">{paymentType}</Text>
          </View>
          <View className="flex-row justify-between mb-4 pb-4 border-b border-border">
            <Text className="text-muted-foreground">Amount</Text>
            <Text className="text-foreground font-semibold">$125.50</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-muted-foreground">Transaction ID</Text>
            <Text className="text-foreground font-semibold">#TXN123456</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="w-full gap-3">
          <TouchableOpacity onPress={() => router.push('/(tabs)/home')}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ borderRadius: 16, padding: 16 }}
            >
              <Text className="text-white text-center font-bold text-base">Done</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()} className="bg-muted rounded-2xl p-4">
            <Text className="text-foreground text-center font-semibold">Pay Another Bill</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Close Button */}
      <TouchableOpacity onPress={() => router.push('/(tabs)/home')} className="absolute top-12 right-6">
        <X className="text-foreground" size={24} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
