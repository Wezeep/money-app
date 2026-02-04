import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Zap, CheckCircle, Copy, Share2 } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { SText } from '@/features/settings';

export default function SendWorldwideStatusScreen() {
  const shareMessage = `Hey! 👋\nI just sent money using Wezeep. It's fast and secure!`;

  const handleCopyMessage = async () => {
    await Clipboard.setStringAsync(shareMessage);
  };

  const handleShare = async () => {
    try {
      await Share2();
    } catch (e) {
      // noop
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 128 }}>
        <View className="px-6 mb-6">
          <LinearGradient colors={["#667eea", "#764ba2"]} style={{ padding: 32, alignItems: 'center' }}>
            <View className="bg-white/20 rounded-full p-4 mb-4">
              <CheckCircle color="#ffffff" size={64} />
            </View>
            <Text className="text-white text-3xl font-bold text-center mb-2">Transfer Sent! 🎉</Text>
            <Text className="text-white/90 text-center text-base">Your transfer is on its way.</Text>
          </LinearGradient>
        </View>

        <View className="px-6">
          <View className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-5 mb-4 border border-primary/20">
            <View className="flex-row items-start mb-3">
              <View className="w-8 h-8 rounded-full bg-primary items-center justify-center mr-3"><Text className="text-white text-lg">💸</Text></View>
              <View className="flex-1">
                <Text className="text-xs font-semibold text-primary mb-1">WEZEEP TRANSFER</Text>
                <Text className="text-sm text-foreground font-medium">Money on the way</Text>
              </View>
            </View>

            <View className="bg-background/50 rounded-xl p-4 mb-3">
              <SText className="text-sm text-foreground leading-6" style={{ lineHeight: 22 }}>{shareMessage}</SText>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity onPress={handleCopyMessage} className="flex-1 flex-row items-center justify-center gap-2 p-4 bg-muted rounded-2xl border border-border"><Copy className="text-foreground" size={20} /><Text className="font-bold text-foreground">Copy</Text></TouchableOpacity>
              <TouchableOpacity onPress={handleShare} className="flex-1"><LinearGradient colors={["#667eea", "#764ba2"]} style={{ padding: 16, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}><Share2 color="#ffffff" size={18} /><Text className="font-bold text-white">Share</Text></LinearGradient></TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
