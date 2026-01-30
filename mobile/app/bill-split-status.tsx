import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Share, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { CheckCircle, Copy, Share2, MessageCircle, Mail, Home, ChevronDown, User, Check, QrCode } from 'lucide-react-native';
import { useRequestContext } from '@/components/RequestContext';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';

export default function BillSplitStatusScreen() {
  const router = useRouter();
  const { selectedContacts, requestDetails, resetRequest } = useRequestContext();
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(selectedContacts[0]?.id || '');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const selectedContact = selectedContacts.find(c => c.id === selectedContactId);
  const requestLink = `https://wezeep.com/split/${Math.random().toString(36).substring(2, 10)}`;

  const getContactAmount = (contactId: string) => {
    return requestDetails.customAmounts[contactId] || '0';
  };

  const totalAmount = Object.values(requestDetails.customAmounts).reduce((sum, amt) => sum + parseFloat(amt || '0'), 0);

  const getPersonalizedMessage = (contact: typeof selectedContact) => {
    if (!contact) return '';
    const amount = getContactAmount(contact.id);
    const firstName = contact.name.split(' ')[0];
    return `Hey ${firstName}! 👋\n\nLet's split the bill! Your share is $${amount} 💰\n\n${requestDetails.message || 'Thanks for chipping in!'}\n\nPay here:\n${requestLink}\n\nSharing is caring! 🎉`;
  };

  const copyMessage = async () => {
    if (selectedContact) {
      await Clipboard.setStringAsync(getPersonalizedMessage(selectedContact));
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2000);
    }
  };

  const handleShare = async () => {
    if (selectedContact) {
      await Share.share({ message: getPersonalizedMessage(selectedContact) });
    }
  };

  const handleDone = () => {
    resetRequest();
    router.push('/(tabs)/home');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 128 }}>
        {/* Success Header */}
        <LinearGradient colors={['#667eea', '#764ba2']} style={{ padding: 32, alignItems: 'center' }}>
          <View className="bg-white/20 rounded-full p-4 mb-4">
            <CheckCircle color="#ffffff" size={64} />
          </View>
          <Text className="text-white text-3xl font-bold text-center mb-2">Bill Split Created! 🎉</Text>
          <Text className="text-white/90 text-center text-base">Sharing is caring!</Text>
        </LinearGradient>

        {/* Summary */}
        <View className="px-6 py-6">
          <View className="bg-card rounded-2xl p-6 border border-border">
            <Text className="text-muted-foreground text-sm mb-2">Total Bill</Text>
            <Text className="text-foreground text-4xl font-bold mb-6">${totalAmount.toFixed(2)}</Text>

            <Text className="text-foreground font-semibold text-base mb-4">
              Split with {selectedContacts.length} {selectedContacts.length === 1 ? 'person' : 'people'}
            </Text>

            {/* Contact Selector */}
            <TouchableOpacity
              onPress={() => setShowDropdown(!showDropdown)}
              className="bg-background border-2 border-border rounded-xl p-4"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1 gap-3">
                  {selectedContact?.avatar ? (
                    <Image source={{ uri: selectedContact.avatar }} className="w-10 h-10 rounded-full" />
                  ) : (
                    <View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
                      <User className="text-primary-foreground" size={20} />
                    </View>
                  )}
                  <View className="flex-1">
                    <Text className="text-foreground font-semibold text-base">{selectedContact?.name}</Text>
                    <Text className="text-primary font-bold text-sm">${getContactAmount(selectedContactId)}</Text>
                  </View>
                </View>
                <ChevronDown className="text-primary" size={20} style={{ transform: [{ rotate: showDropdown ? '180deg' : '0deg' }] }} />
              </View>

              {/* Dropdown */}
              {showDropdown && (
                <View className="mt-4 pt-4 border-t border-border gap-2">
                  {selectedContacts.filter(c => c.id !== selectedContactId).map(contact => (
                    <TouchableOpacity
                      key={contact.id}
                      onPress={() => { setSelectedContactId(contact.id); setShowDropdown(false); }}
                      className="flex-row items-center justify-between p-3 rounded-xl bg-muted"
                    >
                      <View className="flex-row items-center flex-1 gap-3">
                        {contact.avatar ? (
                          <Image source={{ uri: contact.avatar }} className="w-10 h-10 rounded-full" />
                        ) : (
                          <View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
                            <User className="text-primary-foreground" size={20} />
                          </View>
                        )}
                        <View className="flex-1">
                          <Text className="text-foreground font-semibold text-base">{contact.name}</Text>
                          <Text className="text-primary font-bold text-sm">${getContactAmount(contact.id)}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* QR Code Section */}
        <View className="px-6 mb-6">
          <TouchableOpacity
            onPress={() => setShowQR(!showQR)}
            className="bg-card rounded-2xl p-5 border border-border flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center">
                <QrCode className="text-primary" size={24} />
              </View>
              <View>
                <Text className="text-foreground font-bold text-base">Payment QR Code</Text>
                <Text className="text-muted-foreground text-sm">Tap to {showQR ? 'hide' : 'show'}</Text>
              </View>
            </View>
            <ChevronDown className="text-primary" size={20} style={{ transform: [{ rotate: showQR ? '180deg' : '0deg' }] }} />
          </TouchableOpacity>

          {showQR && selectedContact && (
            <View className="bg-white rounded-2xl p-6 mt-4 items-center border border-border">
              <QRCode value={requestLink} size={200} />
              <Text className="text-muted-foreground text-sm mt-4 text-center">
                {selectedContact.name}'s payment QR
              </Text>
              <Text className="text-primary font-bold text-lg mt-2">${getContactAmount(selectedContactId)}</Text>
            </View>
          )}
        </View>

        {/* Share Message */}
        <View className="px-6 mb-6">
          <Text className="text-foreground text-lg font-bold mb-3">Share Payment Link</Text>
          <View className="bg-card rounded-2xl border border-border overflow-hidden">
            <View className="absolute top-3 right-3 z-10">
              <TouchableOpacity
                onPress={copyMessage}
                className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ backgroundColor: copiedMessage ? '#10b98120' : '#667eea20' }}
              >
                <Copy color={copiedMessage ? '#10b981' : '#667eea'} size={14} />
                <Text className="font-semibold text-xs" style={{ color: copiedMessage ? '#10b981' : '#667eea' }}>
                  {copiedMessage ? 'Copied!' : 'Copy'}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="p-5 pr-20">
              <Text className="text-foreground text-sm leading-5">{selectedContact && getPersonalizedMessage(selectedContact)}</Text>
            </View>

            {/* Social Share */}
            <View className="border-t border-border p-4">
              <View className="flex-row justify-around items-center">
                <TouchableOpacity onPress={handleShare} className="items-center">
                  <View className="w-12 h-12 rounded-full items-center justify-center" style={{ backgroundColor: '#25D36620' }}>
                    <MessageCircle color="#25D366" size={24} />
                  </View>
                  <Text className="text-xs text-muted-foreground mt-1">WhatsApp</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleShare} className="items-center">
                  <View className="w-12 h-12 rounded-full items-center justify-center" style={{ backgroundColor: '#667eea20' }}>
                    <Share2 color="#667eea" size={24} />
                  </View>
                  <Text className="text-xs text-muted-foreground mt-1">More</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="px-6 gap-3 mb-8">
          <TouchableOpacity onPress={() => router.push('/bill-split')}>
            <LinearGradient colors={['#667eea', '#764ba2']} style={{ borderRadius: 16, padding: 18 }}>
              <Text className="text-white text-center font-bold text-base">Split Another Bill</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDone} className="bg-muted rounded-2xl py-4 flex-row items-center justify-center gap-2">
            <Home color="#667eea" size={20} />
            <Text className="font-bold text-base" style={{ color: '#667eea' }}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}