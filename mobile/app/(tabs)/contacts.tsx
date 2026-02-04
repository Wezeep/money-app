import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  Search,
  Plus,
  Filter,
  User,
  Send,
  Download,
  Globe,
  X,
  CheckCircle,
  ArrowLeft,
  Edit,
  Check,
  Camera,
} from "lucide-react-native";
import { ThemeToggle } from "@components/ThemeToggle";
import { useRouter } from "expo-router";

type Contact = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  country: string;
  isWezeepUser: boolean;
  wezeepId?: string;
  avatar?: string;
  lastTransaction?: string;
};

const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    phone: "+1 555-0123",
    email: "sarah.j@email.com",
    country: "USA",
    isWezeepUser: true,
    wezeepId: "@sarahj",
    avatar: "https://i.pravatar.cc/150?img=1",
    lastTransaction: "2 days ago",
  },
  {
    id: "2",
    name: "Michael Chen",
    phone: "+86 138-0000-0000",
    country: "China",
    isWezeepUser: true,
    wezeepId: "@mchen",
    avatar: "https://i.pravatar.cc/150?img=13",
    lastTransaction: "1 week ago",
  },
  {
    id: "3",
    name: "Emma Williams",
    phone: "+44 20 7946 0958",
    email: "emma.w@email.com",
    country: "UK",
    isWezeepUser: false,
  },
  {
    id: "4",
    name: "Carlos Rodriguez",
    phone: "+34 912 345 678",
    country: "Spain",
    isWezeepUser: true,
    wezeepId: "@carlos",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: "5",
    name: "Aisha Patel",
    phone: "+91 98765 43210",
    country: "India",
    isWezeepUser: true,
    wezeepId: "@aisha",
    avatar: "https://i.pravatar.cc/150?img=5",
    lastTransaction: "Today",
  },
  {
    id: "6",
    name: "John Smith",
    phone: "+1 555-9876",
    country: "USA",
    isWezeepUser: false,
  },
  {
    id: "7",
    name: "Yuki Tanaka",
    phone: "+81 90-1234-5678",
    country: "Japan",
    isWezeepUser: true,
    wezeepId: "@yuki",
    avatar: "https://i.pravatar.cc/150?img=9",
  },
  {
    id: "8",
    name: "Sophie Martin",
    phone: "+33 6 12 34 56 78",
    country: "France",
    isWezeepUser: false,
  },
];

const countries = [
  "All Countries",
  "USA",
  "UK",
  "China",
  "India",
  "Spain",
  "Japan",
  "France",
];

// Country code to flag emoji mapping
const countryFlags: { [key: string]: string } = {
  USA: "🇺🇸",
  UK: "🇬🇧",
  China: "🇨🇳",
  India: "🇮🇳",
  Spain: "🇪🇸",
  Japan: "🇯🇵",
  France: "🇫🇷",
};

export default function ContactsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showWezeepOnly, setShowWezeepOnly] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("All Countries");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Edit mode states
  const [editedName, setEditedName] = useState("");
  const [editedPhone, setEditedPhone] = useState("");
  const [editedCountry, setEditedCountry] = useState("");
  const [editedWezeepId, setEditedWezeepId] = useState("");
  const [editedAvatar, setEditedAvatar] = useState("");
  const [isWezeepIdVerified, setIsWezeepIdVerified] = useState(false);

  const filteredContacts = mockContacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery);
    const matchesWezeep = !showWezeepOnly || contact.isWezeepUser;
    const matchesCountry =
      selectedCountry === "All Countries" ||
      contact.country === selectedCountry;

    return matchesSearch && matchesWezeep && matchesCountry;
  });

  const wezeepCount = mockContacts.filter((c) => c.isWezeepUser).length;

  const handleContactPress = (contact: Contact) => {
    setSelectedContact(contact);
    setEditedName(contact.name);
    setEditedPhone(contact.phone);
    setEditedCountry(contact.country);
    setEditedWezeepId(contact.wezeepId || "");
    setEditedAvatar(contact.avatar || "");
    setIsWezeepIdVerified(contact.isWezeepUser);
    setIsEditMode(false);
  };

  const handleEditPress = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    // Reset to original values
    if (selectedContact) {
      setEditedName(selectedContact.name);
      setEditedPhone(selectedContact.phone);
      setEditedCountry(selectedContact.country);
      setEditedWezeepId(selectedContact.wezeepId || "");
      setEditedAvatar(selectedContact.avatar || "");
      setIsWezeepIdVerified(selectedContact.isWezeepUser);
    }
    setIsEditMode(false);
  };

  const handleSaveEdit = () => {
    // In a real app, save to backend/database
    // For now, just exit edit mode
    // You could update mockContacts here if needed
    console.log("Saving contact:", {
      name: editedName,
      phone: editedPhone,
      country: editedCountry,
      wezeepId: editedWezeepId,
      isWezeepUser: isWezeepIdVerified,
    });
    setIsEditMode(false);
  };

  const handleWezeepIdChange = (id: string) => {
    setEditedWezeepId(id);
    // Simulate Wezeep ID verification (in real app, call API)
    if (id.startsWith("@") && id.length > 3) {
      setIsWezeepIdVerified(true);
    } else {
      setIsWezeepIdVerified(false);
    }
  };

  const handleAddPhoto = () => {
    // In real app, open image picker
    console.log("Add photo");
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-bold text-foreground">Contacts</Text>
          <Text className="text-sm text-muted-foreground">
            {wezeepCount} on Wezeep • {mockContacts.length} total
          </Text>
        </View>
        <ThemeToggle />
      </View>

      {/* Search Bar */}
      <View className="px-6 mb-4">
        <View className="bg-card rounded-2xl border border-border flex-row items-center px-4 py-3">
          <Search className="text-muted-foreground mr-3" size={20} />
          <TextInput
            className="flex-1 text-foreground text-base"
            placeholder="Search contacts..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filter Chips */}
      <View className="px-6 mb-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}
        >
          <TouchableOpacity
            onPress={() => setShowFilters(true)}
            className="bg-primary px-4 py-2 rounded-full flex-row items-center gap-2"
          >
            <Filter color="white" size={16} />
            <Text className="text-primary-foreground font-semibold">
              Filters
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowWezeepOnly(!showWezeepOnly)}
            className={`px-4 py-2 rounded-full flex-row items-center gap-2 ${
              showWezeepOnly ? "bg-green-500" : "bg-card border border-border"
            }`}
          >
            {showWezeepOnly && <CheckCircle color="white" size={16} />}
            <Text
              className={
                showWezeepOnly ? "text-white font-semibold" : "text-foreground"
              }
            >
              Wezeep Users
            </Text>
          </TouchableOpacity>

          {selectedCountry !== "All Countries" && (
            <TouchableOpacity
              onPress={() => setSelectedCountry("All Countries")}
              className="bg-blue-500 px-4 py-2 rounded-full flex-row items-center gap-2"
            >
              <Globe color="white" size={16} />
              <Text className="text-white font-semibold">
                {selectedCountry}
              </Text>
              <X color="white" size={16} />
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      {/* Add Contact Button */}
      <View className="px-6 mb-4">
        <TouchableOpacity>
          <LinearGradient
            colors={["#667eea", "#764ba2"]}
            style={{
              borderRadius: 16,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Plus color="white" size={20} />
            <Text className="text-white font-bold text-base">
              Add New Contact
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Contacts List */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
      >
        {filteredContacts.length === 0 ? (
          <View className="items-center justify-center py-12">
            <User className="text-muted-foreground mb-4" size={48} />
            <Text className="text-muted-foreground text-center">
              No contacts found
            </Text>
          </View>
        ) : (
          <View className="gap-3">
            {filteredContacts.map((contact) => (
              <TouchableOpacity
                key={contact.id}
                onPress={() => handleContactPress(contact)}
              >
                <View className="bg-card rounded-2xl p-4 border border-border flex-row items-center gap-3">
                  <View className="relative">
                    {contact.avatar ? (
                      <Image
                        source={{ uri: contact.avatar }}
                        style={{ width: 56, height: 56, borderRadius: 28 }}
                      />
                    ) : (
                      <View className="w-14 h-14 rounded-full bg-muted items-center justify-center">
                        <User className="text-muted-foreground" size={28} />
                      </View>
                    )}
                    {contact.isWezeepUser && (
                      <View
                        className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1"
                        style={{ borderWidth: 2, borderColor: "white" }}
                      >
                        <CheckCircle color="white" size={12} />
                      </View>
                    )}
                  </View>

                  <View className="flex-1">
                    <Text className="text-foreground font-bold text-base mb-1">
                      {contact.name}
                    </Text>
                    <Text className="text-muted-foreground text-sm mb-1">
                      {contact.phone}
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <Globe className="text-muted-foreground" size={12} />
                      <Text className="text-muted-foreground text-xs">
                        {contact.country}
                      </Text>
                      {contact.lastTransaction && (
                        <>
                          <Text className="text-muted-foreground">•</Text>
                          <Text className="text-green-600 text-xs font-medium">
                            {contact.lastTransaction}
                          </Text>
                        </>
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Filters Modal */}
      <Modal
        visible={showFilters}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilters(false)}
      >
        <View
          className="flex-1 justify-end"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <View
            className="rounded-t-3xl p-6"
            style={{ backgroundColor: "#ffffff", maxHeight: "70%" }}
          >
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-foreground">
                Filter Contacts
              </Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <X className="text-foreground" size={24} />
              </TouchableOpacity>
            </View>

            <Text className="text-sm font-semibold text-foreground mb-3">
              Country
            </Text>
            <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 24 }}>
              {countries.map((country) => (
                <TouchableOpacity
                  key={country}
                  onPress={() => {
                    setSelectedCountry(country);
                    setShowFilters(false);
                  }}
                  className={`p-4 rounded-2xl border ${
                    selectedCountry === country
                      ? "bg-primary border-primary"
                      : "bg-card border-border"
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      selectedCountry === country
                        ? "text-primary-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {country}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Contact Detail Modal */}
      <Modal
        visible={selectedContact !== null}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setSelectedContact(null);
          setIsEditMode(false);
        }}
      >
        <View
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
        >
          <View
            className="rounded-3xl p-6 mx-6"
            style={{ backgroundColor: "#ffffff", width: "90%", maxWidth: 400 }}
          >
            {/* Header with Back/Close and Edit/Save buttons */}
            <View className="flex-row items-center justify-between mb-6">
              <TouchableOpacity
                onPress={
                  isEditMode
                    ? handleCancelEdit
                    : () => {
                        setSelectedContact(null);
                        setIsEditMode(false);
                      }
                }
              >
                {isEditMode ? (
                  <X className="text-foreground" size={24} />
                ) : (
                  <ArrowLeft className="text-foreground" size={24} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={isEditMode ? handleSaveEdit : handleEditPress}
              >
                {isEditMode ? (
                  <Check className="text-green-500" size={24} />
                ) : (
                  <Edit className="text-primary" size={24} />
                )}
              </TouchableOpacity>
            </View>

            {selectedContact && (
              <>
                <View className="items-center mb-6">
                  <View className="relative mb-4">
                    {editedAvatar ? (
                      <Image
                        source={{ uri: editedAvatar }}
                        style={{ width: 80, height: 80, borderRadius: 40 }}
                      />
                    ) : (
                      <View className="w-20 h-20 rounded-full bg-muted items-center justify-center">
                        <User className="text-muted-foreground" size={40} />
                      </View>
                    )}
                    
                    {/* Add Photo Button (Edit Mode) */}
                    {isEditMode && (
                      <TouchableOpacity
                        onPress={handleAddPhoto}
                        className="absolute -bottom-1 -right-1 bg-primary rounded-full p-2"
                        style={{ borderWidth: 3, borderColor: "white" }}
                      >
                        <Camera color="white" size={16} />
                      </TouchableOpacity>
                    )}
                    
                    {/* Wezeep Verified Badge */}
                    {!isEditMode && isWezeepIdVerified && (
                      <View
                        className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-2"
                        style={{ borderWidth: 3, borderColor: "white" }}
                      >
                        <CheckCircle color="white" size={16} />
                      </View>
                    )}
                  </View>

                  {/* Name - Editable */}
                  {isEditMode ? (
                    <TextInput
                      value={editedName}
                      onChangeText={setEditedName}
                      className="text-2xl font-bold text-foreground text-center mb-2 border-b border-primary px-4"
                      placeholder="Name"
                    />
                  ) : (
                    <Text className="text-2xl font-bold text-foreground mb-1">
                      {editedName}
                    </Text>
                  )}

                  {/* Wezeep User Badge */}
                  {!isEditMode && isWezeepIdVerified && (
                    <View className="bg-green-100 px-3 py-1 rounded-full">
                      <Text className="text-green-700 text-xs font-semibold">
                        Wezeep User
                      </Text>
                    </View>
                  )}
                </View>

                <View className="bg-gray-50 rounded-2xl p-4 mb-6 gap-3">
                  {/* Phone */}
                  <View className="flex-row items-center gap-3">
                    <Text className="text-muted-foreground text-sm flex-1">
                      Phone
                    </Text>
                    {isEditMode ? (
                      <TextInput
                        value={editedPhone}
                        onChangeText={setEditedPhone}
                        className="text-foreground font-semibold border-b border-primary px-2"
                        placeholder="Phone"
                        keyboardType="phone-pad"
                      />
                    ) : (
                      <Text className="text-foreground font-semibold">
                        {editedPhone}
                      </Text>
                    )}
                  </View>

                  <View className="h-px bg-border" />

                  {/* Country */}
                  <View className="flex-row items-center gap-3">
                    <Text className="text-muted-foreground text-sm flex-1">
                      Country
                    </Text>
                    {isEditMode ? (
                      <TextInput
                        value={editedCountry}
                        onChangeText={setEditedCountry}
                        className="text-foreground font-semibold border-b border-primary px-2"
                        placeholder="Country"
                      />
                    ) : (
                      <View className="flex-row items-center gap-2">
                        <Text className="text-xl">
                          {countryFlags[editedCountry] || "🌍"}
                        </Text>
                        <Text className="text-foreground font-semibold">
                          {editedCountry}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View className="h-px bg-border" />

                  {/* Wezeep ID */}
                  <View className="flex-row items-center gap-3">
                    <Text className="text-muted-foreground text-sm flex-1">
                      Wezeep ID
                    </Text>
                    {isEditMode ? (
                      <View className="flex-row items-center gap-2">
                        <TextInput
                          value={editedWezeepId}
                          onChangeText={handleWezeepIdChange}
                          className="text-foreground font-semibold border-b border-primary px-2"
                          placeholder="@username"
                        />
                        {isWezeepIdVerified && (
                          <CheckCircle color="#10b981" size={16} />
                        )}
                      </View>
                    ) : editedWezeepId ? (
                      <View className="flex-row items-center gap-2">
                        <Text className="text-foreground font-semibold">
                          {editedWezeepId}
                        </Text>
                        {isWezeepIdVerified && (
                          <CheckCircle color="#10b981" size={16} />
                        )}
                      </View>
                    ) : (
                      <Text className="text-muted-foreground text-sm italic">
                        Not set
                      </Text>
                    )}
                  </View>
                </View>

                {/* Action Buttons - Only show when not in edit mode */}
                {!isEditMode && (
                  <View className="gap-3">
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedContact(null);
                        router.push("/send-p2p");
                      }}
                    >
                      <LinearGradient
                        colors={["#667eea", "#764ba2"]}
                        style={{
                          borderRadius: 16,
                          padding: 16,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                        }}
                      >
                        <Send color="white" size={20} />
                        <Text className="text-white font-bold text-base">
                          Send Money
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        setSelectedContact(null);
                        router.push("/request-money");
                      }}
                      className="bg-white border-2 border-primary rounded-2xl p-4 flex-row items-center justify-center gap-2"
                    >
                      <Download className="text-primary" size={20} />
                      <Text className="text-primary font-bold text-base">
                        Request Money
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}