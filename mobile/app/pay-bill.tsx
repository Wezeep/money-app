import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, Filter, Plus, ChevronDown, ChevronRight, X, Wallet, CreditCard, Building2 } from 'lucide-react-native';
import { useBillPayment } from '@/components/BillPaymentContext';
import { LinearGradient } from 'expo-linear-gradient';

type Vendor = {
  id: string;
  name: string;
  category: string;
  icon: string;
  color: string;
  lastPaid?: string;
  amount?: string;
};

const vendors: Vendor[] = [
  { id: '1', name: 'Netflix', category: 'Entertainment', icon: '🎬', color: '#E50914', lastPaid: '2024-01-15', amount: '$15.99' },
  { id: '2', name: 'Spotify', category: 'Entertainment', icon: '🎵', color: '#1DB954', lastPaid: '2024-01-10', amount: '$9.99' },
  { id: '3', name: 'Electric Company', category: 'Utilities', icon: '⚡', color: '#FFA500', lastPaid: '2024-01-05', amount: '$125.50' },
  { id: '4', name: 'Water Utility', category: 'Utilities', icon: '💧', color: '#4A90E2' },
  { id: '5', name: 'Internet Provider', category: 'Utilities', icon: '🌐', color: '#00A8E8' },
  { id: '6', name: 'Amazon Prime', category: 'Entertainment', icon: '📦', color: '#FF9900' },
];

export default function PayBillScreen() {
  const router = useRouter();
  const { paymentType, setPaymentType, selectedVendor, setSelectedVendor } = useBillPayment();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showPaymentOverlay, setShowPaymentOverlay] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('wallet');
  const [showPaymentMethodDropdown, setShowPaymentMethodDropdown] = useState(false);
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('monthly');
  const [showFrequencyDropdown, setShowFrequencyDropdown] = useState(false);
  const [note, setNote] = useState('');

  const recentlyPaid = vendors.filter(v => v.lastPaid);
  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paymentMethods = [
    { id: 'wallet', name: 'Wezeep Wallet', icon: Wallet, balance: '$2,450.00' },
    { id: 'card', name: 'Credit Card ****1234', icon: CreditCard },
    { id: 'bank', name: 'Bank Account ****5678', icon: Building2 },
  ];

  const handleVendorSelect = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowPaymentOverlay(true);
  };

  const handleContinueToPay = () => {
    router.push('/pay-bill-status');
  };

  const selectedMethod = paymentMethods.find(m => m.id === selectedPaymentMethod);

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center justify-between border-b border-border">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft className="text-foreground" size={24} />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-foreground">Pay Bills</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 128 }}>
        {/* Search Bar */}
        <View className="px-6 py-4">
          <View className="flex-row items-center bg-muted rounded-full px-4 py-3">
            <Search className="text-muted-foreground mr-3" size={20} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search vendors..."
              placeholderTextColor="#999"
              className="flex-1 text-foreground"
            />
          </View>
        </View>

        {/* Filter Chips */}
        <View className="px-6 mb-4">
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => setShowFilters(true)}
              className="flex-row items-center bg-muted px-4 py-2 rounded-full"
            >
              <Filter className="text-foreground mr-2" size={16} />
              <Text className="text-foreground font-medium">Filters</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Add New Vendor */}
        <View className="px-6 mb-6">
          <TouchableOpacity>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ borderRadius: 16, padding: 16 }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <View className="bg-white/20 p-2 rounded-full">
                    <Plus className="text-white" size={20} />
                  </View>
                  <Text className="text-white font-semibold text-base">Add New Vendor</Text>
                </View>
                <ChevronRight className="text-white" size={20} />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Recently Paid */}
        {recentlyPaid.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-bold text-foreground px-6 mb-3">Recently Paid</Text>
            <View className="px-6 gap-3">
              {recentlyPaid.map(vendor => (
                <TouchableOpacity key={vendor.id} onPress={() => handleVendorSelect(vendor)}>
                  <View className="bg-card rounded-2xl p-4 border border-border">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-3 flex-1">
                        <View style={{ backgroundColor: vendor.color + '20' }} className="w-12 h-12 rounded-full items-center justify-center">
                          <Text className="text-2xl">{vendor.icon}</Text>
                        </View>
                        <View className="flex-1">
                          <Text className="text-foreground font-semibold text-base">{vendor.name}</Text>
                          <Text className="text-muted-foreground text-sm">{vendor.category}</Text>
                        </View>
                      </View>
                      <View className="items-end">
                        <Text className="text-foreground font-bold">{vendor.amount}</Text>
                        <Text className="text-muted-foreground text-xs">{vendor.lastPaid}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* All Vendors */}
        <View>
          <Text className="text-lg font-bold text-foreground px-6 mb-3">All Vendors</Text>
          <View className="px-6 gap-3">
            {filteredVendors.map(vendor => (
              <TouchableOpacity key={vendor.id} onPress={() => handleVendorSelect(vendor)}>
                <View className="bg-card rounded-2xl p-4 border border-border">
                  <View className="flex-row items-center gap-3">
                    <View style={{ backgroundColor: vendor.color + '20' }} className="w-12 h-12 rounded-full items-center justify-center">
                      <Text className="text-2xl">{vendor.icon}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-foreground font-semibold text-base">{vendor.name}</Text>
                      <Text className="text-muted-foreground text-sm">{vendor.category}</Text>
                    </View>
                    <ChevronRight className="text-muted-foreground" size={20} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Payment Details Overlay */}
      <Modal visible={showPaymentOverlay} transparent animationType="slide">
        <View style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} className="flex-1 justify-end">
          <View style={{ backgroundColor: '#fff' }} className="rounded-t-3xl p-6 max-h-[85%]">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-foreground">Payment Details</Text>
              <TouchableOpacity onPress={() => setShowPaymentOverlay(false)}>
                <X className="text-foreground" size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Paying To */}
              {selectedVendor && (
                <View className="bg-gray-50 rounded-2xl p-4 mb-4">
                  <Text className="text-sm text-gray-600 mb-2">Paying To</Text>
                  <View className="flex-row items-center gap-3">
                    <View style={{ backgroundColor: selectedVendor.color + '20' }} className="w-12 h-12 rounded-full items-center justify-center">
                      <Text className="text-2xl">{selectedVendor.icon}</Text>
                    </View>
                    <View>
                      <Text className="text-foreground font-semibold text-base">{selectedVendor.name}</Text>
                      <Text className="text-gray-600 text-sm">{selectedVendor.category}</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Payment Type */}
              <View className="bg-gray-50 rounded-2xl p-4 mb-4">
                <Text className="text-sm text-gray-600 mb-3">Payment Type</Text>
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={() => setPaymentType('one-time')}
                    className={`flex-1 py-3 rounded-xl border-2 ${paymentType === 'one-time' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
                  >
                    <Text className={`text-center font-semibold ${paymentType === 'one-time' ? 'text-purple-600' : 'text-gray-600'}`}>One-Time</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setPaymentType('recurring')}
                    className={`flex-1 py-3 rounded-xl border-2 ${paymentType === 'recurring' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
                  >
                    <Text className={`text-center font-semibold ${paymentType === 'recurring' ? 'text-purple-600' : 'text-gray-600'}`}>Recurring</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Frequency (if recurring) */}
              {paymentType === 'recurring' && (
                <View className="bg-gray-50 rounded-2xl p-4 mb-4">
                  <Text className="text-sm text-gray-600 mb-2">Frequency</Text>
                  <TouchableOpacity onPress={() => setShowFrequencyDropdown(!showFrequencyDropdown)} className="flex-row items-center justify-between bg-white rounded-xl p-3 border border-gray-200">
                    <Text className="text-foreground capitalize">{frequency}</Text>
                    <ChevronDown className="text-gray-600" size={20} />
                  </TouchableOpacity>
                  {showFrequencyDropdown && (
                    <View className="mt-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
                      {['weekly', 'monthly', 'quarterly', 'yearly'].map(freq => (
                        <TouchableOpacity key={freq} onPress={() => { setFrequency(freq); setShowFrequencyDropdown(false); }} className="p-3 border-b border-gray-100">
                          <Text className="text-foreground capitalize">{freq}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              )}

              {/* Amount */}
              <View className="bg-gray-50 rounded-2xl p-4 mb-4">
                <Text className="text-sm text-gray-600 mb-2">Amount</Text>
                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="$0.00"
                  keyboardType="decimal-pad"
                  className="bg-white rounded-xl p-3 text-foreground text-lg font-semibold border border-gray-200"
                />
              </View>

              {/* Payment Method */}
              <View className="bg-gray-50 rounded-2xl p-4 mb-4">
                <Text className="text-sm text-gray-600 mb-2">Payment Method</Text>
                <TouchableOpacity onPress={() => setShowPaymentMethodDropdown(!showPaymentMethodDropdown)} className="bg-white rounded-xl p-3 border border-gray-200">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                      {selectedMethod && <selectedMethod.icon className="text-purple-600" size={20} />}
                      <View>
                        <Text className="text-foreground font-medium">{selectedMethod?.name}</Text>
                        {selectedMethod?.balance && <Text className="text-sm text-gray-600">{selectedMethod.balance}</Text>}
                      </View>
                    </View>
                    <ChevronDown className="text-gray-600" size={20} />
                  </View>
                </TouchableOpacity>
                {showPaymentMethodDropdown && (
                  <View className="mt-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {paymentMethods.map(method => (
                      <TouchableOpacity key={method.id} onPress={() => { setSelectedPaymentMethod(method.id); setShowPaymentMethodDropdown(false); }} className="p-3 border-b border-gray-100">
                        <View className="flex-row items-center gap-3">
                          <method.icon className="text-purple-600" size={20} />
                          <View>
                            <Text className="text-foreground font-medium">{method.name}</Text>
                            {method.balance && <Text className="text-sm text-gray-600">{method.balance}</Text>}
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Note (Optional) */}
              <View className="bg-gray-50 rounded-2xl p-4 mb-6">
                <Text className="text-sm text-gray-600 mb-2">Note (Optional)</Text>
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  placeholder="Add a note..."
                  multiline
                  numberOfLines={3}
                  className="bg-white rounded-xl p-3 text-foreground border border-gray-200"
                  style={{ textAlignVertical: 'top' }}
                />
              </View>

              {/* Continue Button */}
              <TouchableOpacity onPress={handleContinueToPay}>
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ borderRadius: 16, padding: 16 }}
                >
                  <Text className="text-white text-center font-bold text-base">Continue to Pay</Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}