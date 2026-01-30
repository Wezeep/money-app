import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Share, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
Check, 
Zap, 
CheckCircle, 
Copy,
Share2,
ArrowLeft,
Wallet,
Shield,
Rocket,
Trophy
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';

type TransferStatus = 
| 'processing' 
| 'in_transit' 
| 'completed';

type StatusStep = {
id: TransferStatus;
label: string;
icon: any;
iconColor: string;
iconBg: string;
description: string;
};

export default function TransferStatusScreen() {
const router = useRouter();
const [currentStatus, setCurrentStatus] = useState<TransferStatus>('processing');

// Mock transfer data (in real app, this would come from route params or API)
const transferData = {
recipientName: 'John Doe',
amount: '500.00',
currency: 'GBP',
receiveAmount: '610.50',
receiveCurrency: 'EUR',
transactionId: 'WZP-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
estimatedTime: '2-5 minutes',
cashoutMethod: 'Wezeep Wallet',
};

const statusSteps: StatusStep[] = [
{
id: 'processing',
label: 'Processing Payment',
icon: Shield,
iconColor: '#667eea',
iconBg: '#eef2ff',
description: 'Verifying your payment details...',
},
{
id: 'in_transit',
label: 'In Transit',
icon: Rocket,
iconColor: '#764ba2',
iconBg: '#f5f3ff',
description: 'Money is on its way...',
},
{
id: 'completed',
label: 'Transfer Complete',
icon: Trophy,
iconColor: '#667eea',
iconBg: '#d1fae5',
description: 'Money delivered successfully!',
},
];

// Simulate status progression
useEffect(() => {
const statusSequence: TransferStatus[] = [
'processing',
'in_transit',
'completed',
];

let currentIndex = 0;
const interval = setInterval(() => {
if (currentIndex < statusSequence.length - 1) {
currentIndex++;
setCurrentStatus(statusSequence[currentIndex]);
} else {
clearInterval(interval);
}
}, 3000); // Change status every 3 seconds

return () => clearInterval(interval);
}, []);

const getCurrentStepIndex = () => {
return statusSteps.findIndex((step) => step.id === currentStatus);
};

const shareMessage = `Hey! 👋

Just sent you ${transferData.currency} ${transferData.amount} (${transferData.receiveCurrency} ${transferData.receiveAmount}) via Wezeep! 💸

Your money is ${currentStatus === 'completed' ? 'ready to use! 🎉' : 'on the way! ⚡'}

Transaction ID: ${transferData.transactionId}

Download the Wezeep app to track your transfer and access your funds instantly! 📱✨

Get Wezeep: [App Link]`;

const handleCopyMessage = async () => {
await Clipboard.setStringAsync(shareMessage);
Alert.alert('Copied!', 'Message copied to clipboard');
};

const handleShare = async () => {
try {
await Share.share({
message: shareMessage,
title: 'Wezeep Transfer Update',
});
} catch (error) {
console.error('Error sharing:', error);
}
};

const isStepCompleted = (stepIndex: number) => {
return stepIndex <= getCurrentStepIndex();
};

const isStepActive = (stepIndex: number) => {
return stepIndex === getCurrentStepIndex();
};

return (
<SafeAreaView className="flex-1 bg-background">
{/* Header */}
<View className="flex-row items-center justify-between px-6 py-4">
<TouchableOpacity
onPress={() => router.back()}
className="w-10 h-10 items-center justify-center rounded-full bg-muted"
>
<ArrowLeft className="text-foreground" size={20} />
</TouchableOpacity>
<Text className="text-lg font-bold text-foreground">Transfer Status</Text>
<View className="w-10" />
</View>

<ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 128 }}>
{/* Status Card */}
<View className="bg-card border border-border rounded-3xl p-6 mb-6">
{/* Transaction ID */}
<View className="items-center mb-6">
<Text className="text-sm text-muted-foreground mb-1">Transaction ID</Text>
<Text className="text-base font-bold text-foreground">
{transferData.transactionId}
</Text>
</View>

{/* Current Status Icon */}
<View className="items-center mb-6">
<LinearGradient
colors={['#667eea', '#764ba2']}
style={{
width: 80,
height: 80,
borderRadius: 40,
alignItems: 'center',
justifyContent: 'center',
marginBottom: 16,
}}
>
{currentStatus === 'completed' ? (
<CheckCircle color="#ffffff" size={40} />
) : (
<Zap color="#ffffff" size={40} />
)}
</LinearGradient>

<Text className="text-2xl font-bold text-foreground text-center mb-2">
{statusSteps.find((s) => s.id === currentStatus)?.label}
</Text>
<Text className="text-sm text-muted-foreground text-center">
{statusSteps.find((s) => s.id === currentStatus)?.description}
</Text>
</View>

{/* Transfer Details */}
<View className="bg-muted/50 rounded-2xl p-4 mb-4">
<View className="flex-row justify-between items-center mb-3">
<Text className="text-sm text-muted-foreground">Sending</Text>
<Text className="text-lg font-bold text-foreground">
{transferData.currency} {transferData.amount}
</Text>
</View>
<View className="flex-row justify-between items-center mb-3">
<Text className="text-sm text-muted-foreground">To</Text>
<Text className="text-base font-semibold text-foreground">
{transferData.recipientName}
</Text>
</View>
<View className="flex-row justify-between items-center">
<Text className="text-sm text-muted-foreground">Receiving</Text>
<Text className="text-lg font-bold text-primary">
{transferData.receiveCurrency} {transferData.receiveAmount}
</Text>
</View>
</View>

{/* Cashout Method */}
<View className="flex-row items-center gap-3 p-3 bg-primary/10 rounded-xl">
<Wallet className="text-primary" size={20} />
<View className="flex-1">
<Text className="text-xs text-muted-foreground">Cashout via</Text>
<Text className="text-sm font-semibold text-foreground">
{transferData.cashoutMethod}
</Text>
</View>
</View>
</View>

{/* Status Timeline */}
<View className="bg-card border border-border rounded-3xl p-6 mb-6">
<Text className="text-lg font-bold text-foreground mb-4">Transfer Timeline</Text>

{statusSteps.map((step, index) => {
const isCompleted = isStepCompleted(index);
const isActive = isStepActive(index);

return (
<View key={step.id} className="flex-row items-start mb-4 last:mb-0">
{/* Timeline Icon */}
<View className="items-center mr-4">
<View
className={`w-16 h-16 rounded-3xl items-center justify-center shadow-lg ${
isCompleted && !isActive ? 'bg-emerald-500' : ''
} ${isActive ? 'border-2 border-primary' : ''} ${
!isCompleted && !isActive ? 'opacity-40' : ''
}`}
style={{
backgroundColor: isCompleted && !isActive ? '#667eea' : step.iconBg,
}}
>
{isCompleted && !isActive ? (
<Check size={32} color="#ffffff" strokeWidth={3} />
) : (
<step.icon 
size={32} 
color={isActive ? step.iconColor : '#9ca3af'} 
strokeWidth={2.5}
/>
)}
</View>
{index < statusSteps.length - 1 && (
<View
className={`w-1 h-10 rounded-full mt-2 ${
isCompleted ? 'bg-primary' : 'bg-border'
}`}
/>
)}
</View>

{/* Step Info */}
<View className="flex-1 pt-2">
<Text
className={`text-base font-semibold ${
isCompleted || isActive ? 'text-foreground' : 'text-muted-foreground'
}`}
>
{step.label}
</Text>
<Text className="text-sm text-muted-foreground mt-1">
{step.description}
</Text>
{isCompleted && !isActive && (
<View className="flex-row items-center mt-1">
<Check size={14} className="text-primary mr-1" />
<Text className="text-xs text-primary font-medium">Completed</Text>
</View>
)}
{isActive && (
<View className="flex-row items-center mt-1">
<View className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse" />
<Text className="text-xs text-primary font-medium">In Progress</Text>
</View>
)}
</View>
</View>
);
})}
</View>

{/* Share Section */}
<View className="bg-card border border-border rounded-3xl p-6 mb-6">
<View className="flex-row items-center justify-between mb-4">
<Text className="text-lg font-bold text-foreground">
Share Transfer Details
</Text>
<Share2 className="text-primary" size={20} />
</View>

{/* Modern Message Card */}
<View className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-5 mb-4 border border-primary/20">
<View className="flex-row items-start mb-3">
<View className="w-8 h-8 rounded-full bg-primary items-center justify-center mr-3">
<Text className="text-white text-lg">💸</Text>
</View>
<View className="flex-1">
<Text className="text-xs font-semibold text-primary mb-1">WEZEEP TRANSFER</Text>
<Text className="text-sm text-foreground font-medium">
Money on the way to {transferData.recipientName}
</Text>
</View>
</View>

<View className="bg-background/50 rounded-xl p-4 mb-3">
<Text className="text-sm text-foreground leading-6" style={{ lineHeight: 22 }}>
{shareMessage}
</Text>
</View>

<View className="flex-row items-center gap-2 px-2">
<View className="flex-1 h-px bg-border" />
<Text className="text-xs text-muted-foreground font-medium">READY TO SHARE</Text>
<View className="flex-1 h-px bg-border" />
</View>
</View>

{/* Action Buttons */}
<View className="flex-row gap-3">
<TouchableOpacity
onPress={handleCopyMessage}
className="flex-1 flex-row items-center justify-center gap-2 p-4 bg-muted rounded-2xl border border-border"
>
<Copy className="text-foreground" size={20} />
<Text className="font-bold text-foreground">Copy</Text>
</TouchableOpacity>

<TouchableOpacity onPress={handleShare} className="flex-1">
<LinearGradient
colors={['#667eea', '#764ba2']}
style={{
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
gap: 8,
padding: 16,
borderRadius: 16,
}}
>
<Share2 color="#ffffff" size={20} />
<Text className="font-bold text-white">Share</Text>
</LinearGradient>
</TouchableOpacity>
</View>
</View>

{/* Complete Button (only show when completed) */}
{currentStatus === 'completed' && (
<TouchableOpacity onPress={() => router.push('/(tabs)/home')}>
<LinearGradient
colors={['#667eea', '#764ba2']}
style={{
borderRadius: 16,
paddingVertical: 16,
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
}}
>
<CheckCircle color="#ffffff" size={20} style={{ marginRight: 8 }} />
<Text className="text-white font-bold text-base">Done</Text>
</LinearGradient>
</TouchableOpacity>
)}
</ScrollView>
</SafeAreaView>
);
}