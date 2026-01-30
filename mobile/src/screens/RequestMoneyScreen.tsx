import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  Alert,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  Text,
  Card,
  TextInput,
  Button,
  Avatar,
  Chip,
  Surface,
  Searchbar,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Contact } from '../types';
import { theme, gradients } from '../theme';

type RequestMoneyScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'RequestMoney'
>;

interface Props {
  navigation: RequestMoneyScreenNavigationProp;
}

const { width } = Dimensions.get('window');

const RequestMoneyScreen: React.FC<Props> = ({ navigation }) => {
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const contacts: Contact[] = [
    { id: '1', name: 'Alice Johnson', phone: '+1 234 567 8901', avatar: 'AJ' },
    { id: '2', name: 'Bob Smith', phone: '+1 234 567 8902', avatar: 'BS' },
    { id: '3', name: 'Charlie Brown', phone: '+1 234 567 8903', avatar: 'CB' },
    { id: '4', name: 'Diana Prince', phone: '+1 234 567 8904', avatar: 'DP' },
    { id: '5', name: 'Edward Norton', phone: '+1 234 567 8905', avatar: 'EN' },
    { id: '6', name: 'Fiona Green', phone: '+1 234 567 8906', avatar: 'FG' },
  ];

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );

  const quickAmounts = [10, 25, 50, 100];

  const handleRequest = (): void => {
    if (!selectedContact || !amount) {
      Alert.alert('Error', 'Please select a contact and enter an amount');
      return;
    }
    Alert.alert('Success', `Money request of $${amount} sent to ${selectedContact.name}!`);
    navigation.goBack();
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={[
        styles.contactCard,
        selectedContact?.id === item.id && styles.selectedContactCard
      ]}
      onPress={() => setSelectedContact(item)}
    >
      <LinearGradient
        colors={selectedContact?.id === item.id ? gradients.primary : gradients.card}
        style={styles.contactGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.contactContent}>
          <Avatar.Text
            size={50}
            label={item.avatar}
            style={[
              styles.avatar,
              selectedContact?.id === item.id && styles.selectedAvatar
            ]}
            color={selectedContact?.id === item.id ? theme.colors.onPrimary : theme.colors.primary}
          />
          <View style={styles.contactInfo}>
            <Text style={[
              styles.contactName,
              selectedContact?.id === item.id && styles.selectedContactName
            ]}>
              {item.name}
            </Text>
            <Text style={[
              styles.contactPhone,
              selectedContact?.id === item.id && styles.selectedContactPhone
            ]}>
              {item.phone}
            </Text>
          </View>
          {selectedContact?.id === item.id && (
            <MaterialIcons
              name="check-circle"
              size={24}
              color={theme.colors.onPrimary}
            />
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradients.background}
        style={styles.backgroundGradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Request Money</Text>
          <Text style={styles.subtitle}>Choose a contact to request money from</Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search contacts..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
            inputStyle={styles.searchInput}
            iconColor={theme.colors.primary}
          />
        </View>

        {/* Contacts List */}
        <FlatList
          data={filteredContacts}
          renderItem={renderContact}
          keyExtractor={(item) => item.id}
          style={styles.contactsList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contactsContainer}
        />

        {/* Request Form */}
        {selectedContact && (
          <Surface style={styles.requestCard} elevation={4}>
            <LinearGradient
              colors={gradients.card}
              style={styles.requestGradient}
            >
              <Text style={styles.requestTitle}>Request Details</Text>

              <View style={styles.selectedContact}>
                <Avatar.Text
                  size={40}
                  label={selectedContact.avatar}
                  style={styles.selectedContactAvatar}
                  color={theme.colors.primary}
                />
                <View>
                  <Text style={styles.selectedName}>{selectedContact.name}</Text>
                  <Text style={styles.selectedPhone}>{selectedContact.phone}</Text>
                </View>
              </View>

              <TextInput
                label="Amount"
                value={amount}
                onChangeText={setAmount}
                mode="outlined"
                keyboardType="numeric"
                left={<TextInput.Affix text="$" />}
                style={styles.amountInput}
                theme={{
                  colors: {
                    primary: theme.colors.primary,
                    outline: theme.colors.outline,
                  },
                }}
              />

              <TextInput
                label="Add a note (optional)"
                value={note}
                onChangeText={setNote}
                mode="outlined"
                multiline
                numberOfLines={2}
                style={styles.noteInput}
                theme={{
                  colors: {
                    primary: theme.colors.primary,
                    outline: theme.colors.outline,
                  },
                }}
              />

              <View style={styles.quickAmounts}>
                <Text style={styles.quickAmountLabel}>Quick amounts:</Text>
                <View style={styles.amountChips}>
                  {quickAmounts.map((amt) => (
                    <TouchableOpacity
                      key={amt}
                      style={styles.amountChip}
                      onPress={() => setAmount(amt.toString())}
                    >
                      <LinearGradient
                        colors={gradients.primary}
                        style={styles.amountChipGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Text style={styles.amountChipText}>${amt}</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <Button
                mode="contained"
                onPress={handleRequest}
                style={styles.requestButton}
                contentStyle={styles.requestButtonContent}
                labelStyle={styles.requestButtonLabel}
              >
                Request Money
              </Button>
            </LinearGradient>
          </Surface>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  searchbar: {
    elevation: 4,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
  },
  searchInput: {
    fontSize: 16,
  },
  contactsList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  contactsContainer: {
    paddingBottom: 20,
  },
  contactCard: {
    marginBottom: 12,
    borderRadius: 16,
    elevation: 4,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  selectedContactCard: {
    elevation: 8,
    shadowOpacity: 0.2,
  },
  contactGradient: {
    padding: 16,
  },
  contactContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: theme.colors.surface,
    marginRight: 16,
  },
  selectedAvatar: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  selectedContactName: {
    color: theme.colors.onPrimary,
  },
  contactPhone: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },
  selectedContactPhone: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  requestCard: {
    margin: 24,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  requestGradient: {
    padding: 24,
  },
  requestTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 20,
    textAlign: 'center',
  },
  selectedContact: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  selectedContactAvatar: {
    backgroundColor: theme.colors.primary,
    marginRight: 12,
  },
  selectedName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  selectedPhone: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },
  amountInput: {
    marginBottom: 16,
    backgroundColor: theme.colors.surface,
  },
  noteInput: {
    marginBottom: 20,
    backgroundColor: theme.colors.surface,
  },
  quickAmounts: {
    marginBottom: 24,
  },
  quickAmountLabel: {
    fontSize: 14,
    color: theme.colors.onSurface,
    marginBottom: 12,
    fontWeight: '500',
  },
  amountChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amountChip: {
    marginRight: 12,
    marginBottom: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  amountChipGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  amountChipText: {
    color: theme.colors.onPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  requestButton: {
    borderRadius: 12,
    elevation: 0,
  },
  requestButtonContent: {
    paddingVertical: 16,
  },
  requestButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RequestMoneyScreen;