import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Card,
  TextInput,
  Button,
  Menu,
  Chip,
  Surface,
  Divider,
} from 'react-native-paper';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Currency, PaymentMethod } from '../types';
import { theme, gradients } from '../theme';

type InternationalTransferScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'InternationalTransfer'
>;

interface Props {
  navigation: InternationalTransferScreenNavigationProp;
}

const InternationalTransferScreen: React.FC<Props> = ({ navigation }) => {
  const [amount, setAmount] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [senderCurrency, setSenderCurrency] = useState<string>('USD');
  const [receiverCurrency, setReceiverCurrency] = useState<string>('EUR');
  const [senderMethod, setSenderMethod] = useState<string>('Bank Transfer');
  const [receiverMethod, setReceiverMethod] = useState<string>('Bank Account');
  const [showSenderCurrencyMenu, setShowSenderCurrencyMenu] = useState<boolean>(false);
  const [showReceiverCurrencyMenu, setShowReceiverCurrencyMenu] = useState<boolean>(false);
  const [showSenderMethodMenu, setShowSenderMethodMenu] = useState<boolean>(false);
  const [showReceiverMethodMenu, setShowReceiverMethodMenu] = useState<boolean>(false);

  const currencies: Currency[] = [
    { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  ];

  const senderMethods: PaymentMethod[] = [
    { id: '1', name: 'Bank Transfer', type: 'bank', icon: 'bank', fee: 0 },
    { id: '2', name: 'Credit Card', type: 'card', icon: 'credit-card', fee: 2.99 },
    { id: '3', name: 'Debit Card', type: 'card', icon: 'credit-card-outline', fee: 1.99 },
    { id: '4', name: 'PayPal', type: 'wallet', icon: 'paypal', fee: 0 },
  ];

  const receiverMethods: PaymentMethod[] = [
    { id: '1', name: 'Bank Account', type: 'bank', icon: 'bank', fee: 0 },
    { id: '2', name: 'Mobile Money', type: 'mobile', icon: 'cellphone', fee: 1.5 },
    { id: '3', name: 'Cash Pickup', type: 'cash', icon: 'cash', fee: 3.99 },
    { id: '4', name: 'Digital Wallet', type: 'wallet', icon: 'wallet', fee: 0 },
  ];

  const exchangeRate: number = 0.85;
  const convertedAmount: number = amount ? parseFloat(amount) * exchangeRate : 0;
  const transferFee: number = amount ? parseFloat(amount) * 0.015 : 0;
  const total: number = amount ? parseFloat(amount) + transferFee : 0;

  const handleTransfer = (): void => {
    if (!amount || !recipient) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    Alert.alert('Success', 'International transfer initiated successfully!');
    navigation.goBack();
  };

  const getCurrencyByCode = (code: string): Currency | undefined => {
    return currencies.find(c => c.code === code);
  };

  const getMethodByName = (name: string, methods: PaymentMethod[]): PaymentMethod | undefined => {
    return methods.find(m => m.name === name);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={gradients.background}
        style={styles.backgroundGradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>International Transfer</Text>
          <Text style={styles.subtitle}>Send money across borders securely</Text>
        </View>

        {/* Transfer Form */}
        <Surface style={styles.formCard} elevation={4}>
          {/* Recipient */}
          <TextInput
            label="Recipient Details"
            value={recipient}
            onChangeText={setRecipient}
            mode="outlined"
            placeholder="Enter recipient name or account"
            style={styles.input}
            theme={{
              colors: {
                primary: theme.colors.primary,
                outline: theme.colors.outline,
              },
            }}
          />

          {/* Amount */}
          <TextInput
            label="Amount"
            value={amount}
            onChangeText={setAmount}
            mode="outlined"
            keyboardType="numeric"
            left={
              <TextInput.Affix
                text={getCurrencyByCode(senderCurrency)?.symbol || '$'}
              />
            }
            style={styles.input}
            theme={{
              colors: {
                primary: theme.colors.primary,
                outline: theme.colors.outline,
              },
            }}
          />

          {/* Currency Selection */}
          <View style={styles.currencyRow}>
            <View style={styles.currencyColumn}>
              <Text style={styles.label}>From Currency</Text>
              <Menu
                visible={showSenderCurrencyMenu}
                onDismiss={() => setShowSenderCurrencyMenu(false)}
                anchor={
                  <TouchableOpacity
                    style={styles.currencyButton}
                    onPress={() => setShowSenderCurrencyMenu(true)}
                  >
                    <Text style={styles.currencyText}>
                      {getCurrencyByCode(senderCurrency)?.flag} {senderCurrency}
                    </Text>
                    <MaterialIcons
                      name="arrow-drop-down"
                      size={24}
                      color={theme.colors.onSurface}
                    />
                  </TouchableOpacity>
                }
              >
                {currencies.map((currency) => (
                  <Menu.Item
                    key={currency.code}
                    onPress={() => {
                      setSenderCurrency(currency.code);
                      setShowSenderCurrencyMenu(false);
                    }}
                    title={`${currency.flag} ${currency.name} (${currency.code})`}
                  />
                ))}
              </Menu>
            </View>

            <View style={styles.currencyColumn}>
              <Text style={styles.label}>To Currency</Text>
              <Menu
                visible={showReceiverCurrencyMenu}
                onDismiss={() => setShowReceiverCurrencyMenu(false)}
                anchor={
                  <TouchableOpacity
                    style={styles.currencyButton}
                    onPress={() => setShowReceiverCurrencyMenu(true)}
                  >
                    <Text style={styles.currencyText}>
                      {getCurrencyByCode(receiverCurrency)?.flag} {receiverCurrency}
                    </Text>
                    <MaterialIcons
                      name="arrow-drop-down"
                      size={24}
                      color={theme.colors.onSurface}
                    />
                  </TouchableOpacity>
                }
              >
                {currencies.map((currency) => (
                  <Menu.Item
                    key={currency.code}
                    onPress={() => {
                      setReceiverCurrency(currency.code);
                      setShowReceiverCurrencyMenu(false);
                    }}
                    title={`${currency.flag} ${currency.name} (${currency.code})`}
                  />
                ))}
              </Menu>
            </View>
          </View>

          {/* Exchange Rate Info */}
          <Surface style={styles.exchangeCard} elevation={2}>
            <LinearGradient
              colors={gradients.success}
              style={styles.exchangeGradient}
            >
              <MaterialCommunityIcons
                name="swap-horizontal"
                size={24}
                color={theme.colors.onPrimary}
              />
              <View style={styles.exchangeInfo}>
                <Text style={styles.exchangeText}>
                  1 {senderCurrency} = {exchangeRate.toFixed(4)} {receiverCurrency}
                </Text>
                <Text style={styles.convertedText}>
                  You'll receive: {getCurrencyByCode(receiverCurrency)?.symbol}
                  {convertedAmount.toFixed(2)}
                </Text>
              </View>
            </LinearGradient>
          </Surface>

          <Divider style={styles.divider} />

          {/* Payment Methods */}
          <Text style={styles.sectionTitle}>Payment Methods</Text>

          <View style={styles.methodRow}>
            <View style={styles.methodColumn}>
              <Text style={styles.label}>Send From</Text>
              <Menu
                visible={showSenderMethodMenu}
                onDismiss={() => setShowSenderMethodMenu(false)}
                anchor={
                  <TouchableOpacity
                    style={styles.methodButton}
                    onPress={() => setShowSenderMethodMenu(true)}
                  >
                    <MaterialCommunityIcons
                      name={getMethodByName(senderMethod, senderMethods)?.icon as any || 'bank'}
                      size={20}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.methodText}>{senderMethod}</Text>
                    <MaterialIcons
                      name="arrow-drop-down"
                      size={20}
                      color={theme.colors.onSurface}
                    />
                  </TouchableOpacity>
                }
              >
                {senderMethods.map((method) => (
                  <Menu.Item
                    key={method.id}
                    onPress={() => {
                      setSenderMethod(method.name);
                      setShowSenderMethodMenu(false);
                    }}
                    title={`${method.name} ${method.fee ? `(+$${method.fee})` : '(Free)'}`}
                  />
                ))}
              </Menu>
            </View>

            <View style={styles.methodColumn}>
              <Text style={styles.label}>Receive Via</Text>
              <Menu
                visible={showReceiverMethodMenu}
                onDismiss={() => setShowReceiverMethodMenu(false)}
                anchor={
                  <TouchableOpacity
                    style={styles.methodButton}
                    onPress={() => setShowReceiverMethodMenu(true)}
                  >
                    <MaterialCommunityIcons
                      name={getMethodByName(receiverMethod, receiverMethods)?.icon as any || 'bank'}
                      size={20}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.methodText}>{receiverMethod}</Text>
                    <MaterialIcons
                      name="arrow-drop-down"
                      size={20}
                      color={theme.colors.onSurface}
                    />
                  </TouchableOpacity>
                }
              >
                {receiverMethods.map((method) => (
                  <Menu.Item
                    key={method.id}
                    onPress={() => {
                      setReceiverMethod(method.name);
                      setShowReceiverMethodMenu(false);
                    }}
                    title={`${method.name} ${method.fee ? `(+$${method.fee})` : '(Free)'}`}
                  />
                ))}
              </Menu>
            </View>
          </View>

          {/* Summary */}
          <Surface style={styles.summaryCard} elevation={2}>
            <Text style={styles.summaryTitle}>Transfer Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Amount:</Text>
              <Text style={styles.summaryValue}>
                {getCurrencyByCode(senderCurrency)?.symbol}{amount || '0.00'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Transfer Fee:</Text>
              <Text style={styles.summaryValue}>
                {getCurrencyByCode(senderCurrency)?.symbol}{transferFee.toFixed(2)}
              </Text>
            </View>
            <Divider style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>Total:</Text>
              <Text style={styles.summaryTotalValue}>
                {getCurrencyByCode(senderCurrency)?.symbol}{total.toFixed(2)}
              </Text>
            </View>
          </Surface>

          {/* Transfer Button */}
          <Button
            mode="contained"
            onPress={handleTransfer}
            style={styles.transferButton}
            contentStyle={styles.transferButtonContent}
            labelStyle={styles.transferButtonLabel}
          >
            Send International Transfer
          </Button>
        </Surface>
      </LinearGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  backgroundGradient: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
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
  formCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  input: {
    marginBottom: 20,
    backgroundColor: theme.colors.surface,
  },
  currencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  currencyColumn: {
    flex: 1,
    marginHorizontal: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.onSurface,
    marginBottom: 8,
  },
  currencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
  },
  currencyText: {
    fontSize: 16,
    color: theme.colors.onSurface,
    fontWeight: '500',
  },
  exchangeCard: {
    borderRadius: 12,
    marginVertical: 20,
    overflow: 'hidden',
  },
  exchangeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  exchangeInfo: {
    flex: 1,
    marginLeft: 12,
  },
  exchangeText: {
    fontSize: 14,
    color: theme.colors.onPrimary,
    fontWeight: '500',
  },
  convertedText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onPrimary,
    marginTop: 4,
  },
  divider: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 16,
  },
  methodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  methodColumn: {
    flex: 1,
    marginHorizontal: 5,
  },
  methodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
  },
  methodText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.onSurface,
    fontWeight: '500',
    marginLeft: 8,
  },
  summaryCard: {
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },
  summaryValue: {
    fontSize: 14,
    color: theme.colors.onSurface,
    fontWeight: '500',
  },
  summaryDivider: {
    marginVertical: 8,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  summaryTotalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  transferButton: {
    borderRadius: 12,
    marginTop: 20,
    elevation: 0,
  },
  transferButtonContent: {
    paddingVertical: 16,
  },
  transferButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default InternationalTransferScreen;