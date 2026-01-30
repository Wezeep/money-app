import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Avatar,
  Surface,
  FAB,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { TabParamList, RootStackParamList, Account, Card as CardType } from '../types';
import { theme, gradients } from '../theme';

type WalletScreenNavigationProp = BottomTabNavigationProp<TabParamList, 'Wallet'>;

interface Props {
  navigation: WalletScreenNavigationProp & {
    getParent: () => StackNavigationProp<RootStackParamList>;
  };
}

const { width } = Dimensions.get('window');

const WalletScreen: React.FC<Props> = ({ navigation }) => {
  const [showBalance, setShowBalance] = useState<boolean>(true);

  const accounts: Account[] = [
    {
      id: '1',
      type: 'checking',
      name: 'Main Checking',
      balance: 2450.75,
      accountNumber: '****1234',
      institution: 'Bank of America',
    },
    {
      id: '2',
      type: 'savings',
      name: 'Emergency Fund',
      balance: 12500.00,
      accountNumber: '****5678',
      institution: 'Bank of America',
    },
  ];

  const cards: CardType[] = [
    {
      id: '1',
      type: 'debit',
      lastFour: '1234',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2026,
      isDefault: true,
    },
    {
      id: '2',
      type: 'credit',
      lastFour: '5678',
      brand: 'Mastercard',
      expiryMonth: 8,
      expiryYear: 2025,
      isDefault: false,
    },
  ];

  const quickActions = [
    {
      id: 'add_money',
      title: 'Add Money',
      icon: 'add-circle',
      onPress: () => navigation.getParent()?.navigate('MainTabs', { screen: 'Home' }),
    },
    {
      id: 'transfer',
      title: 'Transfer',
      icon: 'swap-horizontal',
      onPress: () => navigation.getParent()?.navigate('PeerToPeerTransfer'),
    },
    {
      id: 'request',
      title: 'Request',
      icon: 'call-received',
      onPress: () => navigation.getParent()?.navigate('RequestMoney'),
    },
    {
      id: 'pay_bills',
      title: 'Pay Bills',
      icon: 'receipt',
      onPress: () => navigation.getParent()?.navigate('MainTabs', { screen: 'Home' }),
    },
  ];

  const getAccountIcon = (type: string): string => {
    switch (type) {
      case 'checking': return 'account-balance';
      case 'savings': return 'savings';
      default: return 'account-balance';
    }
  };

  const getCardIcon = (brand: string): string => {
    switch (brand.toLowerCase()) {
      case 'visa': return 'credit-card';
      case 'mastercard': return 'credit-card';
      default: return 'credit-card';
    }
  };

  const formatBalance = (balance: number): string => {
    return showBalance ? `$${balance.toFixed(2)}` : '••••••';
  };

  const renderAccount = (account: Account) => (
    <TouchableOpacity key={account.id} style={styles.accountCard}>
      <LinearGradient
        colors={gradients.card}
        style={styles.accountGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.accountHeader}>
          <View style={styles.accountIcon}>
            <LinearGradient
              colors={gradients.primary}
              style={styles.iconGradient}
            >
              <MaterialIcons
                name={getAccountIcon(account.type) as any}
                size={24}
                color={theme.colors.onPrimary}
              />
            </LinearGradient>
          </View>
          <View style={styles.accountInfo}>
            <Text style={styles.accountName}>{account.name}</Text>
            <Text style={styles.accountInstitution}>{account.institution}</Text>
          </View>
        </View>

        <View style={styles.accountDetails}>
          <Text style={styles.accountNumber}>{account.accountNumber}</Text>
          <Text style={styles.accountBalance}>{formatBalance(account.balance)}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderCard = (card: CardType) => (
    <TouchableOpacity key={card.id} style={styles.cardItem}>
      <LinearGradient
        colors={card.isDefault ? gradients.primary : gradients.card}
        style={styles.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardIcon}>
            <MaterialIcons
              name={getCardIcon(card.brand) as any}
              size={24}
              color={card.isDefault ? theme.colors.onPrimary : theme.colors.primary}
            />
          </View>
          <View style={styles.cardInfo}>
            <Text style={[
              styles.cardBrand,
              card.isDefault && styles.cardBrandDefault
            ]}>
              {card.brand} •••• {card.lastFour}
            </Text>
            <Text style={[
              styles.cardExpiry,
              card.isDefault && styles.cardExpiryDefault
            ]}>
              Expires {card.expiryMonth.toString().padStart(2, '0')}/{card.expiryYear}
            </Text>
          </View>
          {card.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Default</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderQuickAction = (action: typeof quickActions[0]) => (
    <TouchableOpacity
      key={action.id}
      style={styles.quickActionCard}
      onPress={action.onPress}
    >
      <LinearGradient
        colors={gradients.primary}
        style={styles.quickActionGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <MaterialIcons
          name={action.icon as any}
          size={32}
          color={theme.colors.onPrimary}
        />
        <Text style={styles.quickActionText}>{action.title}</Text>
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
          <Text style={styles.title}>My Wallet</Text>
          <TouchableOpacity
            style={styles.balanceToggle}
            onPress={() => setShowBalance(!showBalance)}
          >
            <MaterialIcons
              name={showBalance ? 'visibility' : 'visibility-off'}
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Total Balance */}
        <View style={styles.totalBalanceContainer}>
          <Surface style={styles.totalBalanceCard} elevation={4}>
            <LinearGradient
              colors={gradients.primary}
              style={styles.totalBalanceGradient}
            >
              <Text style={styles.totalBalanceLabel}>Total Balance</Text>
              <Text style={styles.totalBalanceAmount}>
                {formatBalance(accounts.reduce((sum, account) => sum + account.balance, 0))}
              </Text>
            </LinearGradient>
          </Surface>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Accounts Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bank Accounts</Text>
            {accounts.map(renderAccount)}
          </View>

          {/* Cards Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cards</Text>
            {cards.map(renderCard)}
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              {quickActions.map(renderQuickAction)}
            </View>
          </View>
        </ScrollView>

        {/* FAB for adding new card/account */}
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.getParent()?.navigate('MainTabs', { screen: 'Home' })}
          color={theme.colors.onPrimary}
        />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  balanceToggle: {
    padding: 8,
  },
  totalBalanceContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  totalBalanceCard: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  totalBalanceGradient: {
    padding: 24,
    alignItems: 'center',
  },
  totalBalanceLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  totalBalanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.onPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 16,
  },
  accountCard: {
    marginBottom: 12,
    borderRadius: 16,
    elevation: 4,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  accountGradient: {
    padding: 20,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  accountIcon: {
    marginRight: 16,
  },
  iconGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  accountInstitution: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },
  accountDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountNumber: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },
  accountBalance: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  cardItem: {
    marginBottom: 12,
    borderRadius: 16,
    elevation: 4,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 20,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardBrand: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  cardBrandDefault: {
    color: theme.colors.onPrimary,
  },
  cardExpiry: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },
  cardExpiryDefault: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  defaultBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.onPrimary,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (width - 48 - 16) / 2,
    marginBottom: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  quickActionGradient: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.onPrimary,
    marginTop: 8,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});

export default WalletScreen;