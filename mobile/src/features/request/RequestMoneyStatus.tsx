import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  CheckCircle,
  Copy,
  Share2,
  MessageCircle,
  Send,
  Mail,
  Home,
  ChevronDown,
  MessageSquare,
  User,
  Check,
  Globe,
  MapPin,
} from "lucide-react-native";
import { useRequestContext } from "@components/RequestContext";
import * as Clipboard from "expo-clipboard";

type Contact = {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
};

export default function RequestMoneyStatus() {
  const router = useRouter();
  const params = useLocalSearchParams<{ shareableLink?: string; requestCount?: string }>();
  const { selectedContacts, requestDetails, resetRequest } =
    useRequestContext();
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<string>(
    selectedContacts[0]?.id || ""
  );
  const [showDropdown, setShowDropdown] = useState(false);

  const requestLink = params.shareableLink || `https://wezeep.com/pay/${Math.random().toString(36).substring(2, 10)}`;
  const requestCount = params.requestCount ? parseInt(params.requestCount, 10) : selectedContacts?.length ?? 1;

  // Get expiration date (7 days from now)
  const expirationDate = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Get selected contact
  const selectedContact = selectedContacts.find(
    (c) => c.id === selectedContactId
  );

  // Get amount and currency for selected contact
  const getContactDetails = (contact: Contact) => {
    const {
      requestType,
      amount,
      currency,
      customAmounts,
      customCurrencies,
      customRequestGeo,
      requestGeo,
    } = requestDetails;

    if (requestType === "same") {
      return {
        amount,
        currency,
        requestGeo,
      };
    } else {
      return {
        amount: customAmounts[contact.id] || "0",
        currency: customCurrencies[contact.id] || currency,
        requestGeo: customRequestGeo[contact.id] || requestGeo,
      };
    }
  };

  // Generate compact personalized message for selected contact
  const getPersonalizedMessage = (contact: Contact) => {
    const { message } = requestDetails;
    const firstName = contact.name.split(" ")[0];
    const details = getContactDetails(contact);

    const requestTypeEmoji =
      details.requestGeo === "international"
        ? "≡ƒîì"
        : details.requestGeo === "local-p2p"
          ? "≡ƒôì"
          : "≡ƒÆ╕";

    const messageNote = message ? `\n"${message}"` : "";

    return `Hey ${firstName}! ≡ƒæï\nI sent you a request for ${details.currency} ${details.amount} ${requestTypeEmoji}${messageNote}\n\nPay securely:\n${requestLink}\n\nThanks for being awesome! ≡ƒÖÅ\n\nP.S. Try Wezeep for instant payments! ≡ƒÆ£`;
  };

  const personalizedMessage = selectedContact
    ? getPersonalizedMessage(selectedContact)
    : "";

  // Copy full message to clipboard
  const copyMessage = async () => {
    await Clipboard.setStringAsync(personalizedMessage);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  // Copy link only
  const copyLink = async () => {
    await Clipboard.setStringAsync(requestLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Share via native share sheet
  const handleShare = async () => {
    try {
      await Share.share({
        message: personalizedMessage,
      });
    } catch (error) {
      Alert.alert("Error", "Unable to share");
    }
  };

  // Social media share handlers
  const shareViaWhatsApp = () => {
    Alert.alert(
      "WhatsApp",
      "Opening WhatsApp...\n\nMessage copied to clipboard!"
    );
    copyMessage();
  };

  const shareViaSMS = () => {
    Alert.alert("SMS", "Opening Messages...\n\nMessage copied to clipboard!");
    copyMessage();
  };

  const shareViaEmail = () => {
    Alert.alert("Email", "Opening Email...\n\nMessage copied to clipboard!");
    copyMessage();
  };

  const handleDone = () => {
    resetRequest();
    router.push("/(tabs)/home");
  };

  const handleNewRequest = () => {
    resetRequest();
    router.push("/request-money");
  };

  const totalAmount =
    requestDetails.requestType === "same"
      ? parseFloat(requestDetails.amount) * selectedContacts.length
      : Object.values(requestDetails.customAmounts).reduce(
          (sum, amt) => sum + parseFloat(amt || "0"),
          0
        );

  // Determine if dropdown should be disabled (only 1 contact)
  const isDropdownDisabled = selectedContacts.length === 1;

  // Get recipient label
  const recipientLabel =
    selectedContacts.length === 1
      ? "Solo request (1 person)"
      : `Group Request (${selectedContacts.length} people)`;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 128 }}>
        {/* Success Header */}
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          style={{ padding: 32, alignItems: "center" }}
        >
          <View className="bg-white/20 rounded-full p-4 mb-4">
            <CheckCircle color="#ffffff" size={64} />
          </View>
          <Text className="text-white text-3xl font-bold text-center mb-2">
            Request Sent! ≡ƒÄë
          </Text>
          <Text className="text-white/90 text-center text-base">
            You're ready to get paid, sit tight
          </Text>
        </LinearGradient>

        {/* Request Summary with Dropdown Inside */}
        <View className="px-6 py-6">
          <View className="bg-card rounded-2xl p-6 border border-border">
            <Text className="text-muted-foreground text-sm mb-2">
              Total Requested
            </Text>
            <Text className="text-foreground text-4xl font-bold mb-6">
              {requestDetails.currency} {totalAmount.toFixed(2)}
            </Text>

            <View className="mb-4">
              <Text className="text-foreground font-semibold text-base">
                {recipientLabel}
              </Text>
            </View>

            {/* Contact Selector Dropdown Inside Box */}
            <View>
              <TouchableOpacity
                onPress={() =>
                  !isDropdownDisabled && setShowDropdown(!showDropdown)
                }
                disabled={isDropdownDisabled}
                className={`bg-background border-2 rounded-xl p-4 ${
                  showDropdown
                    ? "border-primary"
                    : isDropdownDisabled
                      ? "border-border opacity-60"
                      : "border-border"
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1 gap-3">
                    {/* Avatar or User Icon */}
                    {selectedContact?.avatar ? (
                      <Image
                        source={{ uri: selectedContact.avatar }}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <View
                        className="w-10 h-10 rounded-full items-center justify-center"
                        style={{ backgroundColor: "#667eea" }}
                      >
                        <User color="#ffffff" size={20} />
                      </View>
                    )}

                    <View className="flex-1">
                      <Text className="text-foreground font-semibold text-base">
                        {selectedContact?.name}
                      </Text>
                      <View className="flex-row items-center gap-2 mt-1">
                        <Text className="text-foreground font-bold text-sm">
                          {(() => {
                            const details = selectedContact
                              ? getContactDetails(selectedContact)
                              : null;
                            return details
                              ? `${details.currency} ${details.amount}`
                              : "";
                          })()}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-1.5 mt-0.5">
                        {(() => {
                          const details = selectedContact
                            ? getContactDetails(selectedContact)
                            : null;
                          if (!details) return null;

                          return details.requestGeo === "international" ? (
                            <>
                              <Globe color="#667eea" size={12} />
                              <Text className="text-xs text-primary">
                                International
                              </Text>
                            </>
                          ) : (
                            <>
                              <MapPin color="#667eea" size={12} />
                              <Text className="text-xs text-primary">
                                Local P2P
                              </Text>
                            </>
                          );
                        })()}
                      </View>
                    </View>
                  </View>

                  {!isDropdownDisabled && (
                    <ChevronDown
                      color="#667eea"
                      size={20}
                      style={{
                        transform: [
                          { rotate: showDropdown ? "180deg" : "0deg" },
                        ],
                      }}
                    />
                  )}
                </View>

                {/* Dropdown List */}
                {showDropdown && !isDropdownDisabled && (
                  <View className="mt-4 pt-4 border-t border-border gap-2">
                    {selectedContacts
                      .filter((c) => c.id !== selectedContactId)
                      .map((contact) => {
                        const details = getContactDetails(contact);
                        const isSelected = contact.id === selectedContactId;

                        return (
                          <TouchableOpacity
                            key={contact.id}
                            onPress={() => {
                              setSelectedContactId(contact.id);
                              setShowDropdown(false);
                            }}
                            className={`flex-row items-center justify-between p-3 rounded-xl ${
                              isSelected ? "bg-primary/10" : "bg-card"
                            }`}
                          >
                            <View className="flex-row items-center flex-1 gap-3">
                              {/* Avatar or User Icon */}
                              {contact.avatar ? (
                                <Image
                                  source={{ uri: contact.avatar }}
                                  className="w-10 h-10 rounded-full"
                                />
                              ) : (
                                <View
                                  className={`w-10 h-10 rounded-full items-center justify-center ${
                                    isSelected ? "bg-primary/20" : "bg-muted"
                                  }`}
                                >
                                  <User
                                    color={isSelected ? "#667eea" : "#9ca3af"}
                                    size={20}
                                  />
                                </View>
                              )}

                              <View className="flex-1">
                                <Text
                                  className={`font-semibold text-base ${
                                    isSelected
                                      ? "text-primary"
                                      : "text-foreground"
                                  }`}
                                >
                                  {contact.name}
                                </Text>
                                <View className="flex-row items-center gap-2 mt-1">
                                  <Text
                                    className={`font-bold text-sm ${
                                      isSelected
                                        ? "text-primary"
                                        : "text-foreground"
                                    }`}
                                  >
                                    {details.currency} {details.amount}
                                  </Text>
                                </View>
                                <View className="flex-row items-center gap-1.5 mt-0.5">
                                  {details.requestGeo === "international" ? (
                                    <>
                                      <Globe
                                        color={isSelected ? "#667eea" : "#9ca3af"}
                                        size={12}
                                      />
                                      <Text
                                        className={`text-xs ${
                                          isSelected
                                            ? "text-primary"
                                            : "text-muted-foreground"
                                        }`}
                                      >
                                        International
                                      </Text>
                                    </>
                                  ) : (
                                    <>
                                      <MapPin
                                        color={isSelected ? "#667eea" : "#9ca3af"}
                                        size={12}
                                      />
                                      <Text
                                        className={`text-xs ${
                                          isSelected
                                            ? "text-primary"
                                            : "text-muted-foreground"
                                        }`}
                                      >
                                        Local P2P
                                      </Text>
                                    </>
                                  )}
                                </View>
                              </View>
                            </View>

                            {isSelected && (
                              <View className="w-5 h-5 rounded-full bg-primary items-center justify-center">
                                <Check color="#ffffff" size={12} />
                              </View>
                            )}
                          </TouchableOpacity>
                        );
                      })}
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Share Direct Message */}
        <View className="px-6 mb-6">
          <Text className="text-foreground text-lg font-bold mb-3">
            Share Direct Message
          </Text>

          <View className="bg-card rounded-2xl border border-border overflow-hidden">
            {/* Copy Button at Top Right */}
            <View className="absolute top-3 right-3 z-10">
              <TouchableOpacity
                onPress={copyMessage}
                className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor: copiedMessage ? "#10b98120" : "#667eea20",
                }}
              >
                <Copy
                  color={copiedMessage ? "#10b981" : "#667eea"}
                  size={14}
                />
                <Text
                  className="font-semibold text-xs"
                  style={{ color: copiedMessage ? "#10b981" : "#667eea" }}
                >
                  {copiedMessage ? "Copied!" : "Copy"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Message Content - More Compact */}
            <View className="p-5 pr-20">
              <Text className="text-foreground text-sm leading-5">
                {personalizedMessage.split("Pay securely:")[0].trim()}
              </Text>

              <Text className="text-foreground font-semibold text-sm mt-2">
                Pay securely:
              </Text>

              {/* Payment Link with Copy Icon */}
              <View className="bg-muted/50 rounded-lg p-3 mt-1 flex-row items-center justify-between">
                <Text
                  className="text-primary text-xs flex-1 mr-2 font-medium"
                  numberOfLines={1}
                  ellipsizeMode="middle"
                >
                  {requestLink}
                </Text>
                <TouchableOpacity onPress={copyLink}>
                  <Copy color={copiedLink ? "#10b981" : "#667eea"} size={16} />
                </TouchableOpacity>
              </View>

              <Text className="text-muted-foreground text-xs mt-2">
                Link expires: {expirationDate}
              </Text>

              <Text className="text-foreground text-sm leading-5 mt-3">
                {personalizedMessage
                  .split("Pay securely:")[1]
                  ?.split(requestLink)[1]
                  ?.replace(`\n\n`, "\n")
                  .trim()}
              </Text>
            </View>

            {/* Social Media Icons in One Row - Removed Messenger */}
            <View className="border-t border-border p-4">
              <View className="flex-row justify-around items-center">
                {/* WhatsApp */}
                <TouchableOpacity
                  onPress={shareViaWhatsApp}
                  className="items-center"
                >
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center"
                    style={{ backgroundColor: "#25D36620" }}
                  >
                    <MessageCircle color="#25D366" size={24} />
                  </View>
                  <Text className="text-xs text-muted-foreground mt-1">
                    WhatsApp
                  </Text>
                </TouchableOpacity>

                {/* SMS */}
                <TouchableOpacity onPress={shareViaSMS} className="items-center">
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center"
                    style={{ backgroundColor: "#34C75920" }}
                  >
                    <MessageSquare color="#34C759" size={24} />
                  </View>
                  <Text className="text-xs text-muted-foreground mt-1">
                    SMS
                  </Text>
                </TouchableOpacity>

                {/* Email */}
                <TouchableOpacity
                  onPress={shareViaEmail}
                  className="items-center"
                >
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center"
                    style={{ backgroundColor: "#EA433520" }}
                  >
                    <Mail color="#EA4335" size={24} />
                  </View>
                  <Text className="text-xs text-muted-foreground mt-1">
                    Email
                  </Text>
                </TouchableOpacity>

                {/* More Options */}
                <TouchableOpacity onPress={handleShare} className="items-center">
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center"
                    style={{ backgroundColor: "#667eea20" }}
                  >
                    <Share2 color="#667eea" size={24} />
                  </View>
                  <Text className="text-xs text-muted-foreground mt-1">
                    More
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="px-6 gap-3 mb-8">
          <TouchableOpacity onPress={handleNewRequest}>
            <LinearGradient
              colors={["#667eea", "#764ba2"]}
              style={{ borderRadius: 16, padding: 18 }}
            >
              <Text className="text-white text-center font-bold text-base">
                Send Another Request
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDone}
            className="bg-muted rounded-2xl py-4 flex-row items-center justify-center gap-2"
          >
            <Home color="#667eea" size={20} />
            <Text className="font-bold text-base" style={{ color: "#667eea" }}>
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
