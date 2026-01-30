import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Users, DollarSign, User, ChevronDown, Check, Plus, Minus, Globe, MapPin } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRequestContext } from '@/components/RequestContext';

type Contact = {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  isWezeepUser: boolean;
  country: string;
};

type SplitPerson = {
  id: string;
  name: string;
  amount: string;
};

const mockContacts: Contact[] = [
  { id: "1", name: "Sarah Johnson", phone: "+1 555-0101", avatar: "", isWezeepUser: true, country: "US" },
  { id: "2", name: "Mike Chen", phone: "+1 555-0102", avatar: "", isWezeepUser: true, country: "US" },
  { id: "3", name: "Emma Davis", phone: "+1 555-0103", avatar: "", isWezeepUser: false, country: "US" },
  { id: "4", name: "James Wilson", phone: "+1 555-0104", avatar: "", isWezeepUser: true, country: "US" },
];

export default function BillSplitScreen() {
  const router = useRouter();
  const { setSelectedContacts, setRequestDetails } = useRequestContext();
  
  const [step, setStep] = useState<'calculator' | 'contacts'>('calculator');
  const [totalAmount, setTotalAmount] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState('2');
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');
  const [customSplits, setCustomSplits] = useState<SplitPerson[]>([]);
  const [selectedContacts, setLocalSelectedContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<'international' | 'local-p2p' | ''>('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [message, setMessage] = useState('');

  const perPersonAmount = totalAmount && numberOfPeople 
    ? (parseFloat(totalAmount) / parseInt(numberOfPeople)).toFixed(2)
    : '0.00';

  const initializeCustomSplits = () => {
    const people = parseInt(numberOfPeople) || 2;
    const splits: SplitPerson[] = [];
    for (let i = 0; i < people; i++) {
      splits.push({ id: `person-${i}`, name: `Person ${i + 1}`, amount: '' });
    }
    setCustomSplits(splits);
  };

  const handleSplitTypeChange = (type: 'equal' | 'custom') => {
    setSplitType(type);
    if (type === 'custom' && customSplits.length === 0) {
      initializeCustomSplits();
    }
  };

  const updateCustomAmount = (id: string, amount: string) => {
    setCustomSplits(prev => prev.map(p => p.id === id ? { ...p, amount } : p));
  };

  const customTotal = customSplits.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

  const handleContinueToContacts = () => {
    if (!totalAmount || parseFloat(totalAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (splitType === 'custom' && customTotal !== parseFloat(totalAmount)) {
      alert(`Custom splits must equal total amount ($${totalAmount})`);
      return;
    }
    setStep('contacts');
  };

  const toggleContact = (contact: Contact) => {
    setLocalSelectedContacts(prev => {
      const exists = prev.find(c => c.id === contact.id);
      if (exists) {
        return prev.filter(c => c.id !== contact.id);
      } else {
        return [...prev, contact];
      }
    });
  };

  const handleContinueToSplit = () => {
    if (selectedContacts.length === 0) {
      alert('Please select at least one contact');
      return;
    }
    if (!category) {
      alert('Please select a category');
      return;
    }

    // Prepare split details
    const splitDetails = splitType === 'equal' 
      ? selectedContacts.map(c => ({ contactId: c.id, amount: perPersonAmount }))
      : customSplits.slice(0, selectedContacts.length).map((split, idx) => ({
          contactId: selectedContacts[idx].id,
          amount: split.amount
        }));

    setSelectedContacts(selectedContacts);
    setRequestDetails({
      requestType: 'custom',
      amount: totalAmount,
      currency: 'USD',
      message: message || 'Split bill payment',
      requestGeo: category,
      customAmounts: splitDetails.reduce((acc, s) => ({ ...acc, [s.contactId]: s.amount }), {}),
      customCurrencies: {},
      customMessages: {},
      customRequestGeo: {},
    });

    router.push('/bill-split-status');
  };

  const filteredContacts = searchQuery
    ? mockContacts.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : mockContacts;

  if (step === 'contacts') {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="px-6 py-4 flex-row items-center justify-between border-b border-border">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => setStep('calculator')}>
              <ArrowLeft className="text-foreground" size={24} />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-foreground">Select Contacts</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 128 }}>
          {/* Split Summary */}
          <View className="px-6 py-4">
            <View className="bg-card rounded-2xl p-5 border border-border">
              <Text className="text-muted-foreground text-sm mb-2">Total Bill</Text>
              <Text className="text-foreground text-3xl font-bold mb-4">${totalAmount}</Text>
              <View className="flex-row items-center gap-2">
                <Users className="text-primary" size={20} />
                <Text className="text-foreground font-semibold">
                  {splitType === 'equal' ? `$${perPersonAmount} per person` : 'Custom split'}
                </Text>
              </View>
            </View>
          </View>

          {/* Search */}
          <View className="px-6 mb-4">
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search contacts..."
              placeholderTextColor="#999"
              className="bg-muted rounded-full px-4 py-3 text-foreground"
            />
          </View>

          {/* Category */}
          <View className="px-6 mb-4">
            <Text className="text-sm font-semibold text-foreground mb-2">Category</Text>
            <TouchableOpacity
              onPress={() => setShowCategoryModal(true)}
              className="bg-card border-2 border-border rounded-2xl p-4"
            >
              <View className="flex-row items-center justify-between">
                {!category ? (
                  <Text className="text-muted-foreground">Select category</Text>
                ) : (
                  <View className="flex-row items-center gap-2">
                    {category === 'international' ? <Globe className="text-primary" size={20} /> : <MapPin className="text-primary" size={20} />}
                    <Text className="text-foreground font-semibold">{category === 'international' ? 'International' : 'Local P2P'}</Text>
                  </View>
                )}
                <ChevronDown className="text-primary" size={20} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Message */}
          <View className="px-6 mb-4">
            <Text className="text-sm font-semibold text-foreground mb-2">Message (Optional)</Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="What's this split for?"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
              className="bg-card border border-border rounded-2xl px-4 py-3 text-foreground"
              style={{ textAlignVertical: 'top' }}
            />
          </View>

          {/* Contacts List */}
          <View className="px-6">
            <Text className="text-lg font-bold text-foreground mb-3">Contacts</Text>
            {filteredContacts.map((contact) => {
              const isSelected = selectedContacts.find(c => c.id === contact.id);
              return (
                <TouchableOpacity
                  key={contact.id}
                  onPress={() => toggleContact(contact)}
                  className={`flex-row items-center justify-between p-4 rounded-2xl mb-3 ${isSelected ? 'bg-primary/10 border-2 border-primary' : 'bg-card border border-border'}`}
                >
                  <View className="flex-row items-center gap-3 flex-1">
                    {contact.avatar ? (
                      <Image source={{ uri: contact.avatar }} className="w-12 h-12 rounded-full" />
                    ) : (
                      <View className="w-12 h-12 rounded-full bg-primary items-center justify-center">
                        <User className="text-primary-foreground" size={20} />
                      </View>
                    )}
                    <View className="flex-1">
                      <Text className={`font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>{contact.name}</Text>
                      <Text className="text-muted-foreground text-sm">{contact.phone}</Text>
                    </View>
                  </View>
                  {isSelected && (
                    <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                      <Check className="text-white" size={14} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Bottom Button */}
        <View className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-background border-t border-border">
          <TouchableOpacity onPress={handleContinueToSplit} disabled={selectedContacts.length === 0}>
            <LinearGradient colors={['#667eea', '#764ba2']} style={{ borderRadius: 16, paddingVertical: 16, opacity: selectedContacts.length === 0 ? 0.5 : 1 }}>
              <Text className="text-white font-bold text-center text-base">
                Continue to Split ({selectedContacts.length})
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Category Modal */}
        <Modal visible={showCategoryModal} transparent animationType="fade">
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 }}>
            <View style={{ backgroundColor: '#ffffff', borderRadius: 24, padding: 24 }}>
              <Text className="text-xl font-bold text-foreground mb-4">Select Category</Text>
              
              <TouchableOpacity
                onPress={() => { setCategory('international'); setShowCategoryModal(false); }}
                className={`flex-row items-center p-4 rounded-xl mb-3 ${category === 'international' ? 'bg-primary/10' : 'bg-muted'}`}
              >
                <Globe className="text-primary mr-3" size={24} />
                <View className="flex-1">
                  <Text className="font-bold text-foreground">International</Text>
                  <Text className="text-xs text-muted-foreground">Cross-border split</Text>
                </View>
                {category === 'international' && <Check className="text-primary" size={20} />}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => { setCategory('local-p2p'); setShowCategoryModal(false); }}
                className={`flex-row items-center p-4 rounded-xl ${category === 'local-p2p' ? 'bg-primary/10' : 'bg-muted'}`}
              >
                <MapPin className="text-primary mr-3" size={24} />
                <View className="flex-1">
                  <Text className="font-bold text-foreground">Local P2P</Text>
                  <Text className="text-xs text-muted-foreground">Peer-to-peer split</Text>
                </View>
                {category === 'local-p2p' && <Check className="text-primary" size={20} />}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setShowCategoryModal(false)} className="mt-4 bg-muted rounded-xl py-3">
                <Text className="text-center font-semibold text-muted-foreground">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6 py-4 flex-row items-center justify-between border-b border-border">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft className="text-foreground" size={24} />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-foreground">Split Bill</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 128 }}>
        {/* Hero */}
        <LinearGradient colors={['#667eea', '#764ba2']} style={{ borderRadius: 24, padding: 24, marginBottom: 24 }}>
          <Text className="text-white text-2xl font-bold mb-2">💰 Split the Bill</Text>
          <Text className="text-white/90">Sharing is caring! Let's divide it up fairly.</Text>
        </LinearGradient>

        {/* Total Amount */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-foreground mb-2">Total Bill Amount</Text>
          <View className="bg-card border-2 border-primary rounded-2xl p-4">
            <View className="flex-row items-center">
              <DollarSign className="text-primary mr-2" size={28} />
              <TextInput
                value={totalAmount}
                onChangeText={setTotalAmount}
                placeholder="0.00"
                placeholderTextColor="#999"
                keyboardType="decimal-pad"
                className="flex-1 text-3xl font-bold text-foreground"
              />
            </View>
          </View>
        </View>

        {/* Number of People */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-foreground mb-2">Number of People</Text>
          <View className="bg-card rounded-2xl p-4 flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => {
                const num = Math.max(2, parseInt(numberOfPeople) - 1);
                setNumberOfPeople(num.toString());
                if (splitType === 'custom') initializeCustomSplits();
              }}
              className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center"
            >
              <Minus className="text-primary" size={24} />
            </TouchableOpacity>

            <View className="flex-row items-center gap-2">
              <Users className="text-primary" size={28} />
              <Text className="text-4xl font-bold text-foreground">{numberOfPeople}</Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                const num = parseInt(numberOfPeople) + 1;
                setNumberOfPeople(num.toString());
                if (splitType === 'custom') initializeCustomSplits();
              }}
              className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center"
            >
              <Plus className="text-primary" size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Split Type */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-foreground mb-2">Split Type</Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => handleSplitTypeChange('equal')}
              className={`flex-1 p-4 rounded-2xl ${splitType === 'equal' ? 'bg-primary/10 border-2 border-primary' : 'bg-card border border-border'}`}
            >
              <Text className={`font-bold text-center ${splitType === 'equal' ? 'text-primary' : 'text-foreground'}`}>Equal Split</Text>
              {splitType === 'equal' && totalAmount && (
                <Text className="text-center text-sm text-primary mt-1">${perPersonAmount} each</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSplitTypeChange('custom')}
              className={`flex-1 p-4 rounded-2xl ${splitType === 'custom' ? 'bg-primary/10 border-2 border-primary' : 'bg-card border border-border'}`}
            >
              <Text className={`font-bold text-center ${splitType === 'custom' ? 'text-primary' : 'text-foreground'}`}>Custom Split</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Custom Splits */}
        {splitType === 'custom' && customSplits.length > 0 && (
          <View className="mb-6">
            <Text className="text-sm font-semibold text-foreground mb-3">Custom Amounts</Text>
            {customSplits.map((person, idx) => (
              <View key={person.id} className="bg-card rounded-2xl p-4 mb-3 border border-border">
                <Text className="text-muted-foreground text-sm mb-2">{person.name}</Text>
                <View className="flex-row items-center">
                  <DollarSign className="text-primary mr-2" size={24} />
                  <TextInput
                    value={person.amount}
                    onChangeText={(val) => updateCustomAmount(person.id, val)}
                    placeholder="0.00"
                    placeholderTextColor="#999"
                    keyboardType="decimal-pad"
                    className="flex-1 text-2xl font-bold text-foreground"
                  />
                </View>
              </View>
            ))}
            <View className="bg-muted rounded-xl p-3 flex-row justify-between">
              <Text className="text-foreground font-semibold">Custom Total:</Text>
              <Text className={`font-bold ${customTotal === parseFloat(totalAmount) ? 'text-green-600' : 'text-red-600'}`}>
                ${customTotal.toFixed(2)}
              </Text>
            </View>
          </View>
        )}

        {/* Split Breakdown */}
        {splitType === 'equal' && totalAmount && (
          <View className="bg-primary/5 rounded-2xl p-5">
            <Text className="text-primary font-bold text-lg mb-3">📊 Split Breakdown</Text>
            <View className="flex-row justify-between mb-2">
              <Text className="text-foreground">Per Person:</Text>
              <Text className="text-foreground font-bold">${perPersonAmount}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-foreground">Total People:</Text>
              <Text className="text-foreground font-bold">{numberOfPeople}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Button */}
      <View className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-background border-t border-border">
        <TouchableOpacity onPress={handleContinueToContacts}>
          <LinearGradient colors={['#667eea', '#764ba2']} style={{ borderRadius: 16, paddingVertical: 16 }}>
            <Text className="text-white font-bold text-center text-base">Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}