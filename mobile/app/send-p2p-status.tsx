import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Share, ActivityIndicator } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

const SafeAreaView = RNSafeAreaView as React.ComponentType<
  React.ComponentProps<typeof RNSafeAreaView> & { className?: string }
>;
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CheckCircle, Download, Copy, Send, Home, Users, Wallet, Gift, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import { transactionsApi, type TransactionResponse } from '@/lib/api';

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

  // Fallback mock when no transactionId or API failed
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
      await Share.share({ message: shareMessage });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadReceipt = () => {
    console.log('Download receipt');
  };

  const handleSendAnother = () => {
    router.push('/send-p2p');
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="text-muted-foreground mt-3">Loading transaction...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center px-6">
        <Text className="text-destructive text-center mb-4">{error}</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-primary font-semibold">Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
{/* Success Header with Gradient */}
<LinearGradient
colors={['#667eea', '#764ba2']}
style={{ paddingVertical: 40, paddingHorizontal: 24, alignItems: 'center' }}
>
<View style={{
width: 80,
height: 80,
borderRadius: 40,
backgroundColor: 'rgba(255, 255, 255, 0.2)',
alignItems: 'center',
justifyContent: 'center',
marginBottom: 16,
}}>
<CheckCircle color="#ffffff" size={48} strokeWidth={2.5} />
</View>

<Text style={{ fontSize: 28, fontWeight: 'bold', color: '#ffffff', marginBottom: 8 }}>
Payment Sent!
</Text>
<Text style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.9)', textAlign: 'center' }}>
Your money is on its way
</Text>
</LinearGradient>

{/* Elegant Transaction Receipt Card */}
<View className="px-6 -mt-6 mb-6">
<View className="bg-card rounded-3xl border border-border overflow-hidden shadow-lg">
{/* Amount Display - Hero Section */}
<View className="items-center py-8 border-b border-border">
<Text className="text-sm font-medium text-muted-foreground mb-2 tracking-wide uppercase">
Amount Sent
</Text>
<Text className="text-5xl font-bold text-foreground tracking-tight">
${display.amount}
</Text>
<Text className="text-base text-muted-foreground mt-1">{display.currency}</Text>
</View>

{/* Progress Timeline - Sleek Design */}
<View className="px-8 py-6 bg-muted/30">
<View className="flex-row items-center justify-between">
{/* Processing */}
<View className="items-center" style={{ width: 70 }}>
<View style={{
width: 32,
height: 32,
borderRadius: 16,
backgroundColor: '#667eea',
alignItems: 'center',
justifyContent: 'center',
marginBottom: 8,
}}>
<CheckCircle color="#ffffff" size={18} strokeWidth={3} />
</View>
<Text className="text-xs font-semibold text-green-600">Processing</Text>
</View>

{/* Connector Line */}
<View style={{ flex: 1, height: 2, backgroundColor: '#667eea', marginHorizontal: 8, marginBottom: 20 }} />

{/* In Transit */}
<View className="items-center" style={{ width: 70 }}>
<View style={{
width: 32,
height: 32,
borderRadius: 16,
backgroundColor: '#10b981',
alignItems: 'center',
justifyContent: 'center',
marginBottom: 8,
}}>
<CheckCircle color="#ffffff" size={18} strokeWidth={3} />
</View>
<Text className="text-xs font-semibold text-green-600">In Transit</Text>
</View>

{/* Connector Line */}
<View style={{ flex: 1, height: 2, backgroundColor: '#667eea', marginHorizontal: 8, marginBottom: 20 }} />

{/* Complete */}
<View className="items-center" style={{ width: 70 }}>
<View style={{
width: 32,
height: 32,
borderRadius: 16,
backgroundColor: '#10b981',
alignItems: 'center',
justifyContent: 'center',
marginBottom: 8,
}}>
<CheckCircle color="#ffffff" size={18} strokeWidth={3} />
</View>
<Text className="text-xs font-semibold text-green-600">Complete</Text>
</View>
</View>
</View>

{/* Transaction Details - Clean Layout */}
<View className="px-6 py-6">
{/* Sender */}
<View className="mb-4">
<Text className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">From</Text>
<Text className="text-base font-semibold text-foreground">{display.sender.name}</Text>
<Text className="text-sm text-muted-foreground">{display.sender.email}</Text>
</View>

{/* Recipient */}
<View className="mb-4 pb-4 border-b border-border">
<Text className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">To</Text>
<Text className="text-base font-semibold text-foreground">{display.recipient.name}</Text>
<Text className="text-sm text-muted-foreground">{display.recipient.email}</Text>
</View>

{/* Transaction Meta */}
<View className="space-y-3">
<View className="flex-row justify-between items-center">
<Text className="text-sm text-muted-foreground">Transaction ID</Text>
<Text className="text-sm font-mono font-medium text-foreground">{display.transactionId}</Text>
</View>

<View className="flex-row justify-between items-center">
<Text className="text-sm text-muted-foreground">Date</Text>
<Text className="text-sm font-medium text-foreground">{display.date}</Text>
</View>

<View className="flex-row justify-between items-center">
<Text className="text-sm text-muted-foreground">Time</Text>
<Text className="text-sm font-medium text-foreground">{display.time}</Text>
</View>

<View className="flex-row justify-between items-center">
<Text className="text-sm text-muted-foreground">Payment Method</Text>
<View className="flex-row items-center">
<Text className="text-sm font-medium text-foreground mr-2">{display.paymentMethod}</Text>
<TouchableOpacity onPress={handleDownloadReceipt} className="p-1">
<Download className="text-primary" size={18} />
</TouchableOpacity>
</View>
</View>
</View>
</View>
</View>
</View>

{/* Rewards Earned - After Receipt */}
<View className="px-6 mb-6">
<LinearGradient
colors={['#667eea', '#764ba2']}
style={{ borderRadius: 20, padding: 20 }}
>
<View className="flex-row items-center justify-between">
<View className="flex-row items-center flex-1">
<View style={{
width: 48,
height: 48,
borderRadius: 24,
backgroundColor: 'rgba(255, 255, 255, 0.2)',
alignItems: 'center',
justifyContent: 'center',
marginRight: 16,
}}>
<Gift color="#ffffff" size={24} />
</View>
<View className="flex-1">
<Text style={{ fontSize: 18, fontWeight: 'bold', color: '#ffffff' }}>
Rewards Earned!
</Text>
<Text style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.9)', marginTop: 2 }}>
Keep sending to earn more
</Text>
</View>
</View>
<Text style={{ fontSize: 32, fontWeight: 'bold', color: '#ffffff' }}>
+{display.rewardsEarned}
</Text>
</View>
</LinearGradient>
</View>

{/* Share Message - Friendly & Casual */}
<View className="px-6 mb-6">
<Text className="text-lg font-bold text-foreground mb-3">
Share with {display.recipient.name.split(' ')[0]} 💬
</Text>

<View className="bg-card rounded-2xl border border-border p-4 mb-4">
<Text className="text-foreground leading-6 text-base">{shareMessage}</Text>
</View>

<View className="flex-row gap-3">
<TouchableOpacity
onPress={handleCopyMessage}
className="flex-1 bg-muted rounded-xl p-4 flex-row items-center justify-center"
style={{ minHeight: 56 }}
>
<Copy className="text-foreground mr-2" size={20} />
<Text className="font-semibold text-foreground text-base">
{copied ? 'Copied!' : 'Copy'}
</Text>
</TouchableOpacity>

<TouchableOpacity
onPress={handleShareMessage}
style={{ minHeight: 56 }}
>
<LinearGradient
colors={['#667eea', '#764ba2']}
style={{ flex: 1, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
>
<Send color="#ffffff" size={20} style={{ marginRight: 8 }} />
<Text style={{ fontSize: 16, fontWeight: '600', color: '#ffffff' }}>Share</Text>
</LinearGradient>
</TouchableOpacity>
</View>
</View>

{/* Send Another Transfer - Modern Button */}
<View className="px-6 mb-6">
<TouchableOpacity onPress={handleSendAnother}>
<LinearGradient
colors={['#3b82f6', '#2563eb']}
style={{ 
borderRadius: 16, 
padding: 18, 
flexDirection: 'row', 
alignItems: 'center', 
justifyContent: 'center',
shadowColor: '#3b82f6',
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.3,
shadowRadius: 8,
elevation: 8,
}}
>
<Text style={{ fontSize: 17, fontWeight: 'bold', color: '#ffffff', marginRight: 8 }}>
Send Another P2P Transfer
</Text>
<ArrowRight color="#ffffff" size={22} />
</LinearGradient>
</TouchableOpacity>
</View>
</ScrollView>

{/* Bottom Navigation Bar - Fixed */}
<View 
style={{ 
position: 'absolute', 
bottom: 0, 
left: 0, 
right: 0,
backgroundColor: '#ffffff',
borderTopWidth: 1,
borderTopColor: '#e5e7eb',
paddingTop: 12,
paddingBottom: 20,
shadowColor: '#000',
shadowOffset: { width: 0, height: -2 },
shadowOpacity: 0.1,
shadowRadius: 8,
elevation: 10,
}}
className="dark:bg-card dark:border-border"
>
<View className="flex-row items-center justify-around px-4">
<TouchableOpacity 
onPress={() => router.push('/home')}
className="items-center py-2"
style={{ minWidth: 60 }}
>
<Home className="text-muted-foreground mb-1" size={24} />
<Text className="text-xs font-medium text-muted-foreground">Home</Text>
</TouchableOpacity>

<TouchableOpacity 
onPress={() => router.push('/contacts')}
className="items-center py-2"
style={{ minWidth: 60 }}
>
<Users className="text-muted-foreground mb-1" size={24} />
<Text className="text-xs font-medium text-muted-foreground">Contacts</Text>
</TouchableOpacity>

<TouchableOpacity 
onPress={() => router.push('/wallet')}
className="items-center py-2"
style={{ minWidth: 60 }}
>
<Wallet className="text-muted-foreground mb-1" size={24} />
<Text className="text-xs font-medium text-muted-foreground">Wallet</Text>
</TouchableOpacity>

<TouchableOpacity 
onPress={() => router.push('/rewards')}
className="items-center py-2"
style={{ minWidth: 60 }}
>
<Gift className="text-muted-foreground mb-1" size={24} />
<Text className="text-xs font-medium text-muted-foreground">Rewards</Text>
</TouchableOpacity>
</View>
</View>
</SafeAreaView>
);
}