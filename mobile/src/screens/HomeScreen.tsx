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
  Chip,
  Surface,
} from 'react-native-paper';
import {
  MaterialIcons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { TabParamList, RootStackParamList, Transaction } from '../types';
import { theme, gradients } from '../theme';

type HomeScreenNavigationProp = BottomTabNavigationProp<TabParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp & {
    getParent: () => StackNavigationProp<RootStackParamList>;
  };
}

const { width } = Dimensions.get('window');

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [showBalance, setShowBalance] = useState<boolean>(true);

  const balance: number = 12547.89;
  const recentTransactions: Transaction[] = [
    {
      id: '1',
      type: 'received',
      amount: 500,
      description: 'From Alice Johnson',
      date: 'Today',
      time: '10:30 AM',
      status: 'completed',
      category: 'transfer',
    },
    {
      id: '2',
      type: 'sent',
      amount: 200,
      description: 'To Bob Smith',
      date: 'Yesterday',
      time: '2:15 PM',
      status: 'completed',
      category: 'transfer',

    },
    {
      id: '3',
      type: 'received',
      amount: 1000,
      description: 'Salary Deposit',
      date: '2 days ago',
      time: '9:00 AM',
      status: 'completed',
      category: 'income',
    },
  ];

  const quickActions = [
    {
      title: 'Send Money',
      icon: 'send' as keyof typeof MaterialIcons.glyphMap,
      screen: 'PeerToPeerTransfer' as const,
      gradient: gradients.primary,
    },
    {
      title: 'Request Money',
      icon: 'call-received' as keyof typeof MaterialIcons.glyphMap,
      screen: 'RequestMoney' as const,
      gradient: gradients.secondary,
    },
    {
      title: 'International',
      icon: 'flight-takeoff' as keyof typeof MaterialIcons.glyphMap,
      screen: 'InternationalTransfer' as const,
      gradient: gradients.success,
    },
    {
      title: 'Wallet',
      icon: 'wallet' as keyof typeof MaterialCommunityIcons.glyphMap,
      screen: 'Wallet' as const,
      gradient: gradients.warning,
    },
  ];

  const getTransactionIcon = (category: string) => {
    switch (category) {
      case 'income':
        return 'trending-up';
      case 'expense':
        return 'trending-down';
      case 'refund':
        return 'cash-refund';
      default:
        return 'swap-horizontal';
    }
  };

  const getTransactionColor = (type: string, status: string) => {
    if (status === 'pending') return theme.colors.tertiary;
    return type === 'received' ? theme.colors.primary : theme.colors.error;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={gradients.primary}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <Avatar.Text
              size={50}
              label="JD"
              style={styles.avatar}
              color={theme.colors.onPrimary}
            />
            <View>
              <Text style={styles.greeting}>Good morning,</Text>
              <Text style={styles.userName}>John Doe</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => {}}
          >
            <MaterialIcons
              name="notifications"
              size={28}
              color={theme.colors.onPrimary}
            />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Balance Card */}
      <View style={styles.balanceSection}>
        <Surface style={styles.balanceCard} elevation={4}>
          <LinearGradient
            colors={gradients.card}
            style={styles.balanceGradient}
          >
            <View style={styles.balanceHeader}>
              <Text style={styles.balanceLabel}>Total Balance</Text>
              <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
                <MaterialCommunityIcons
                  name={showBalance ? 'eye' : 'eye-off'}
                  size={24}
                  color={theme.colors.onSurface}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.balanceAmount}>
              {showBalance ? `$${balance.toLocaleString()}` : '••••••'}
            </Text>

            <View style={styles.balanceActions}>
              <Chip
                icon="eye"
                style={styles.chip}
                textStyle={styles.chipText}
              >
                View Details
              </Chip>
              <Chip
                icon="refresh"
                style={styles.chip}
                textStyle={styles.chipText}
              >
                Refresh
              </Chip>
            </View>
          </LinearGradient>
        </Surface>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionCard}
              onPress={() => navigation.getParent()?.navigate(action.screen)}
            >
              <LinearGradient
                colors={action.gradient}
                style={styles.actionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialIcons
                  name={action.icon as any}
                  size={32}
                  color={theme.colors.onPrimary}
                />
                <Text style={styles.actionText}>{action.title}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <Button
            mode="text"
            onPress={() => navigation.navigate('Transactions')}
            labelStyle={styles.viewAllText}
          >
            View All
          </Button>
        </View>

        {recentTransactions.map((transaction) => (
          <Surface key={transaction.id} style={styles.transactionCard} elevation={2}>
            <TouchableOpacity style={styles.transactionContent}>
              <View style={styles.transactionIcon}>
                <MaterialCommunityIcons
                  name={getTransactionIcon(transaction.category || 'transfer')}
                  size={24}
                  color={getTransactionColor(transaction.type, transaction.status)}
                />
              </View>

              <View style={styles.transactionDetails}>
                <Text style={styles.transactionDescription}>
                  {transaction.description}
                </Text>
                <Text style={styles.transactionDate}>
                  {transaction.date} at {transaction.time}
                </Text>
                {transaction.status === 'pending' && (
                  <Chip
                    mode="outlined"
                    style={styles.pendingChip}
                    textStyle={styles.pendingChipText}
                  >
                    Pending
                  </Chip>
                )}
              </View>

              <View style={styles.transactionAmount}>
                <Text
                  style={[
                    styles.amountText,
                    { color: getTransactionColor(transaction.type, transaction.status) }
                  ]}
                >
                  {transaction.type === 'received' ? '+' : '-'}${transaction.amount}
                </Text>
                <MaterialIcons
                  name="chevron-right"
                  size={24}
                  color={theme.colors.onSurfaceVariant}
                />
              </View>
            </TouchableOpacity>
          </Surface>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 16,
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.onPrimary,
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: theme.colors.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: theme.colors.onError,
    fontSize: 12,
    fontWeight: '600',
  },
  balanceSection: {
    paddingHorizontal: 24,
    marginTop: -20,
  },
  balanceCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  balanceGradient: {
    padding: 24,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 16,
    color: theme.colors.onSurface,
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 20,
  },
  balanceActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chip: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderColor: theme.colors.primary,
  },
  chipText: {
    color: theme.colors.primary,
    fontSize: 12,
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  viewAllText: {
    color: theme.colors.primary,
    fontSize: 14,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 48 - 16) / 2,
    height: 120,
    marginBottom: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  actionGradient: {
    flex: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.onPrimary,
    marginTop: 8,
    textAlign: 'center',
  },
  transactionCard: {
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: theme.colors.surface,
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
  },
  pendingChip: {
    marginTop: 8,
    height: 24,
    borderColor: theme.colors.tertiary,
  },
  pendingChipText: {
    color: theme.colors.tertiary,
    fontSize: 10,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;