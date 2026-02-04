import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Search,
  Check,
  Users,
  User,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useRequestContext } from "@components/RequestContext";

type Contact = {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  isWezeepUser: boolean;
  country: string;
  wezeepId?: string;
};

const mockContacts: Contact[] = [
  { id: "1", name: "Sarah Johnson", phone: "+1 234 567 8900", avatar: "https://i.pravatar.cc/150?img=1", isWezeepUser: true, country: "US", wezeepId: "janesmith" },
  { id: "2", name: "Ahmed Hassan", phone: "+20 123 456 7890", avatar: "", isWezeepUser: true, country: "EG", wezeepId: "alicewong" },
  { id: "3", name: "Maria Garcia", phone: "+52 987 654 3210", avatar: "https://i.pravatar.cc/150?img=9", isWezeepUser: true, country: "MX", wezeepId: "bobmartinez" },
  { id: "4", name: "Mario Garcia", phone: "+52 987 654 3210", avatar: "https://i.pravatar.cc/150?img=3", isWezeepUser: false, country: "MX" },
  { id: "5", name: "John Doe", phone: "+1 555 123 4567", avatar: "https://i.pravatar.cc/150?img=12", isWezeepUser: true, country: "US", wezeepId: "emmajohnson" },
  { id: "6", name: "Emily Chen", phone: "+86 138 0000 0000", avatar: "", isWezeepUser: false, country: "CN" },
];

export default function RequestMoneyScreen() {
  const router = useRouter();
  const { setSelectedContacts: setContextContacts } = useRequestContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);

  const recentContacts = mockContacts.slice(0, 4);

  const filteredContacts = searchQuery
    ? mockContacts.filter(
        (c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery)
      )
    : mockContacts;

  const toggleContact = (contact: Contact) => {
    if (selectedContacts.find((c) => c.id === contact.id)) {
      setSelectedContacts(selectedContacts.filter((c) => c.id !== contact.id));
    } else {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  const handleContinue = () => {
    if (selectedContacts.length === 0) {
      alert("Please select at least one contact");
      return;
    }
    // Store selected contacts in context and navigate
    setContextContacts(selectedContacts);
    router.push("/request-money-details");
  };

  const getContinueText = () => {
    if (selectedContacts.length === 0) return "Continue";
    if (selectedContacts.length === 1) return `Continue with ${selectedContacts[0].name.split(" ")[0]}`;
    return `Continue with Group Request (${selectedContacts.length})`;
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-border">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft className="text-foreground" size={24} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-foreground">Request Money</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View className="px-6 py-6">
          <Text className="text-2xl font-bold text-foreground mb-2">Who do you want to request from?</Text>
          <Text className="text-muted-foreground">Select one or multiple contacts</Text>
        </View>

        {/* Recent Contacts - Bubble Heads */}
        <View className="px-6 mb-6">
          <Text className="text-sm font-semibold text-muted-foreground mb-4">RECENT</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
            {recentContacts.map((contact) => {
              const isSelected = selectedContacts.find((c) => c.id === contact.id);
              return (
                <TouchableOpacity key={contact.id} onPress={() => toggleContact(contact)} className="items-center">
                  <View className="relative">
                    {contact.avatar ? (
                      <Image source={{ uri: contact.avatar }} className="w-16 h-16 rounded-full" style={{ borderWidth: isSelected ? 3 : 0, borderColor: "#667eea" }} />
                    ) : (
                      <View className="w-16 h-16 rounded-full bg-primary items-center justify-center" style={{ borderWidth: isSelected ? 3 : 0, borderColor: "#667eea" }}>
                        <User className="text-primary-foreground" size={24} />
                      </View>
                    )}
                    {isSelected && (
                      <View className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary items-center justify-center border-2 border-background">
                        <Check className="text-primary-foreground" size={14} />
                      </View>
                    )}
                    {contact.isWezeepUser && (
                      <View className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 items-center justify-center border-2 border-background">
                        <Check className="text-white" size={12} />
                      </View>
                    )}
                  </View>
                  <Text className="text-xs font-medium text-foreground text-center mt-2" numberOfLines={1} style={{ width: 64 }}>{contact.name.split(" ")[0]}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Search Bar */}
        <View className="px-6 mb-4">
          <View className="flex-row items-center bg-card border border-border rounded-2xl px-4 py-3.5">
            <Search className="text-primary mr-3" size={22} />
            <TextInput placeholder="Search contacts..." placeholderTextColor="#9ca3af" value={searchQuery} onChangeText={setSearchQuery} className="flex-1 text-foreground text-base font-medium" style={{ outlineStyle: "none" } as any} />
          </View>
        </View>

        {/* All Contacts List */}
        <View className="px-6">
          <Text className="text-sm font-semibold text-muted-foreground mb-4">ALL CONTACTS</Text>
          <View style={{ gap: 12 }}>
            {filteredContacts.map((contact) => {
              const isSelected = selectedContacts.find((c) => c.id === contact.id);
              return (
                <TouchableOpacity key={contact.id} onPress={() => toggleContact(contact)} className="flex-row items-center p-4 bg-card rounded-2xl border-2" style={{ borderColor: isSelected ? "#667eea" : "transparent" }}>
                  <View className="relative mr-3">
                    {contact.avatar ? (
                      <Image source={{ uri: contact.avatar }} className="w-12 h-12 rounded-full" />
                    ) : (
                      <View className="w-12 h-12 rounded-full bg-primary items-center justify-center">
                        <User className="text-primary-foreground" size={20} />
                      </View>
                    )}
                    {contact.isWezeepUser && (
                      <View className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 items-center justify-center border-2 border-background">
                        <Check className="text-white" size={12} />
                      </View>
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-bold text-foreground">{contact.name}</Text>
                    <Text className="text-sm text-muted-foreground">{contact.phone}</Text>
                  </View>
                  {isSelected && (
                    <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                      <Check className="text-primary-foreground" size={16} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-background border-t border-border">
        <TouchableOpacity onPress={handleContinue}>
          <LinearGradient colors={["#667eea", "#764ba2"]} style={{ borderRadius: 16, paddingVertical: 16, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            {selectedContacts.length > 1 && (
              <Users className="text-white mr-2" size={20} />
            )}
            <Text className="text-white font-bold text-base">{getContinueText()}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}