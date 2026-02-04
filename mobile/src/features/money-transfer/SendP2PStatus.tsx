import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Share as RNShare, ActivityIndicator } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

const SafeAreaView = RNSafeAreaView as React.ComponentType<
  React.ComponentProps<typeof RNSafeAreaView> & { className?: string }
>;
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CheckCircle, Download, Copy, Send, Home, Users, Wallet, Gift, ArrowRight, Share } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import { SText } from '@/features/settings';
import { transactionsApi, type TransactionResponse } from '@lib/api';

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export default function SendP2PStatusScreen() {
  const router = useRouter();
  const { transactionId } = useLocalSearchParams<{ transactionId?: string }>();
  const [copied, setCopied] = useState(false);
  const [transaction, setTransaction] = useState<TransactionResponse | null>(null);
  const [loading, setLoading] = useState(!!transactionId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!transactionId) {
      setTransaction(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    transactionsApi.getTransaction(transactionId)
      .then((res) => { if (!cancelled) setTransaction(res); })
      .catch((e) => { if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [transactionId]);

  const display = transaction
    ? {
        amount: transaction.amountSent,
        currency: transaction.sentCurrency,
        sender: { name: transaction.senderName, email: '' },
        recipient: { name: transaction.recipientName, email: transaction.recipientWezeepId ?? '' },
        transactionId: transaction.reference ?? transaction.id,
        date: transaction.createdAt ? formatDate(transaction.createdAt) : '',
        time: transaction.createdAt ? formatTime(transaction.createdAt) : '',
        paymentMethod: transaction.paymentMethod === 'WEEZEEP_WALLET' ? 'Wezeep Wallet' : transaction.paymentMethod,
        rewardsEarned: 15,
      }
    : {
        amount: '150.00',
        currency: 'USD',
        sender: { name: 'John Smith', email: 'john.smith@email.com' },
        recipient: { name: 'Sarah Johnson', email: 'sarah.j@email.com' },
        transactionId: 'WZP-2024-001234',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        paymentMethod: 'Wezeep Wallet',
        rewardsEarned: 15,
      };

  const shareMessage = `Hey ${display.recipient.name}! 💸 I just sent you $${display.amount} via Wezeep! Check your Wezeep account to access your funds instantly. It's super easy and secure! 🚀`;

  const handleCopyMessage = async () => {
    await Clipboard.setStringAsync(shareMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareMessage = async () => {
    try {
      await RNShare.share({ message: shareMessage });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (<SafeAreaView className="flex-1 bg-background items-center justify-center"><ActivityIndicator size="large" /><Text className="text-muted-foreground mt-3">Loading transaction...</Text></SafeAreaView>);
  if (error) return (<SafeAreaView className="flex-1 bg-background items-center justify-center px-6"><Text className="text-destructive text-center mb-4">{error}</Text><TouchableOpacity onPress={() => router.back()}><Text className="text-primary font-semibold">Go back</Text></TouchableOpacity></SafeAreaView>);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <LinearGradient colors={["#667eea", "#764ba2"]} style={{ paddingVertical: 40, paddingHorizontal: 24, alignItems: 'center' }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <CheckCircle color="#ffffff" size={48} strokeWidth={2.5} />
          </View>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#ffffff', marginBottom: 8 }}>Payment Sent!</Text>
          <Text style={{ fontSize: 16, color: 'rgba(255,255,255,0.9)', textAlign: 'center' }}>Your money is on its way</Text>
        </LinearGradient>

        <View className="px-6 -mt-6 mb-6">
          <View className="bg-card rounded-3xl border border-border overflow-hidden shadow-lg">
            <View className="items-center py-8 border-b border-border">
              <Text className="text-sm font-medium text-muted-foreground mb-2 tracking-wide uppercase">Amount Sent</Text>
              <Text className="text-5xl font-bold text-foreground tracking-tight">${display.amount}</Text>
              <Text className="text-base text-muted-foreground mt-1">{display.currency}</Text>
            </View>
            <View className="px-8 py-6 bg-muted/30">
              <View className="flex-row items-center justify-between">
                <View className="items-center" style={{ width: 70 }}>
                  <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#667eea', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                    <CheckCircle color="#ffffff" size={18} strokeWidth={3} />
                  </View>
                  <Text className="text-xs font-semibold text-green-600">Processing</Text>
                </View>

                <View style={{ flex: 1, height: 2, backgroundColor: '#667eea', marginHorizontal: 8, marginBottom: 20 }} />

                <View className="items-center" style={{ width: 70 }}>
                  <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                    <CheckCircle color="#ffffff" size={18} strokeWidth={3} />
                  </View>
                  <Text className="text-xs font-semibold text-green-600">In Transit</Text>
                </View>

                <View style={{ flex: 1, height: 2, backgroundColor: '#667eea', marginHorizontal: 8, marginBottom: 20 }} />

                <View className="items-center" style={{ width: 70 }}>
                  <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                    <CheckCircle color="#ffffff" size={18} strokeWidth={3} />
                  </View>
                  <Text className="text-xs font-semibold text-green-600">Complete</Text>
                </View>
              </View>
            </View>

            <View className="px-6 py-6">
              <View className="mb-4">
                <Text className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">From</Text>
                <Text className="text-base font-semibold text-foreground">{display.sender.name}</Text>
              </View>

              <View className="mb-4">
                <Text className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">To</Text>
                <Text className="text-base font-semibold text-foreground">{display.recipient.name}</Text>
              </View>

              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-xs text-muted-foreground">{display.date}</Text>
                <Text className="text-xs text-muted-foreground">{display.time}</Text>
              </View>

              <View className="bg-background/50 rounded-xl p-4 mb-3">
                <SText className="text-sm text-foreground leading-6">{shareMessage}</SText>
              </View>

              <View className="flex-row items-center gap-2 px-2">
                <View className="flex-1 h-px bg-border" />
                <Text className="text-xs text-muted-foreground font-medium">READY TO SHARE</Text>
                <View className="flex-1 h-px bg-border" />
              </View>

            </View>

            <View className="flex-row gap-3 p-6">
              <TouchableOpacity onPress={handleCopyMessage} className="flex-1 flex-row items-center justify-center gap-2 p-4 bg-muted rounded-2xl border border-border">
                <Copy className="text-foreground" size={20} />
                <Text className="font-bold text-foreground">Copy</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleShareMessage} className="flex-1">
                <LinearGradient colors={["#667eea", "#764ba2"]} style={{ padding: 16, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
                  <Share color="#ffffff" size={18} />
                  <Text className="font-bold text-white">Share</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
