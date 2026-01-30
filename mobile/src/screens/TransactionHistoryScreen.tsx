import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import {
  Text,
  Card,
  Chip,
  Surface,
  Searchbar,
  FAB,
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Transaction } from '../types';
import { theme, gradients } from '../theme';

type TransactionHistoryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'TransactionHistory'
>;

interface Props {
  navigation: TransactionHistoryScreenNavigationProp;
}

const { width } = Dimensions.get('window');

const TransactionHistoryScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');

  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'transfer',
      amount: -50.00,
      description: 'Transfer to Alice Johnson',
      date: '2024-01-15T10:30:00Z',
      status: 'completed',
      recipient: 'Alice Johnson',
    },
    {
      id: '2',
      type: 'received',
      amount: 25.00,
      description: 'Money from Bob Smith',
      date: '2024-01-14T14:20:00Z',
      status: 'completed',
      sender: 'Bob Smith',
    },
    {
      id: '3',
      type: 'transfer',
      amount: -100.00,
      description: 'International transfer to Charlie Brown',
      date: '2024-01-13T09:15:00Z',
      status: 'completed',
      recipient: 'Charlie Brown',
    },
    {
      id: '4',
      type: 'received',
      amount: 75.00,
      description: 'Request from Diana Prince',
      date: '2024-01-12T16:45:00Z',
      status: 'completed',
      sender: 'Diana Prince',
    },
    {
      id: '5',
      type: 'transfer',
      amount: -30.00,
      description: 'Transfer to Edward Norton',
      date: '2024-01-11T11:30:00Z',
      status: 'pending',
      recipient: 'Edward Norton',
    },
    {
      id: '6',
      type: 'transfer',
      amount: -200.00,
      description: 'Bill payment - Utilities',
      date: '2024-01-10T08:00:00Z',
      status: 'completed',
      recipient: 'Utility Company',
    },
  ];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (transaction.recipient && transaction.recipient.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (transaction.sender && transaction.sender.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter = filterType === 'all' ||
                         (filterType === 'sent' && transaction.amount < 0) ||
                         (filterType === 'received' && transaction.amount > 0);

    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed': return theme.colors.success;
      case 'pending': return theme.colors.warning;
      case 'failed': return theme.colors.error;
      default: return theme.colors.outline;
    }
  };

  const getTransactionIcon = (type: string, amount: number): string => {
    if (amount > 0) return 'arrow-down';
    switch (type) {
      case 'transfer': return 'arrow-up';
      case 'received': return 'arrow-down';
      default: return 'swap-horizontal';
    }
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <TouchableOpacity style={styles.transactionCard}>
      <LinearGradient
        colors={gradients.card}
        style={styles.transactionGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.transactionContent}>
          <View style={styles.transactionIcon}>
            <LinearGradient
              colors={item.amount > 0 ? gradients.success : gradients.primary}
              style={styles.iconGradient}
            >
              <MaterialIcons
                name={getTransactionIcon(item.type, item.amount) as any}
                size={20}
                color={theme.colors.onPrimary}
              />
            </LinearGradient>
          </View>

          <View style={styles.transactionDetails}>
            <Text style={styles.transactionDescription}>{item.description}</Text>
            <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
          </View>

          <View style={styles.transactionAmount}>
            <Text style={[
              styles.amountText,
              item.amount > 0 ? styles.positiveAmount : styles.negativeAmount
            ]}>
              {item.amount > 0 ? '+' : ''}${Math.abs(item.amount).toFixed(2)}
            </Text>
            <Chip
              mode="outlined"
              style={[
                styles.statusChip,
                { borderColor: getStatusColor(item.status) }
              ]}
              textStyle={[
                styles.statusText,
                { color: getStatusColor(item.status) }
              ]}
            >
              {item.status}
            </Chip>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'sent', label: 'Sent' },
    { key: 'received', label: 'Received' },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradients.background}
        style={styles.backgroundGradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Transaction History</Text>
          <Text style={styles.subtitle}>View all your transactions</Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search transactions..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
            inputStyle={styles.searchInput}
            iconColor={theme.colors.primary}
          />
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.filterChip,
                  filterType === option.key && styles.activeFilterChip
                ]}
                onPress={() => setFilterType(option.key)}
              >
                <LinearGradient
                  colors={filterType === option.key ? gradients.primary : gradients.card}
                  style={styles.filterChipGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={[
                    styles.filterChipText,
                    filterType === option.key && styles.activeFilterChipText
                  ]}>
                    {option.label}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Transactions List */}
        <FlatList
          data={filteredTransactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          style={styles.transactionsList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.transactionsContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons
                name="receipt-long"
                size={64}
                color={theme.colors.outline}
              />
              <Text style={styles.emptyText}>No transactions found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
            </View>
          }
        />

        {/* FAB for new transaction */}
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
  filtersContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  filterChip: {
    marginRight: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  activeFilterChip: {
    elevation: 4,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  filterChipGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.onSurface,
  },
  activeFilterChipText: {
    color: theme.colors.onPrimary,
  },
  transactionsList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  transactionsContainer: {
    paddingBottom: 100,
  },
  transactionCard: {
    marginBottom: 12,
    borderRadius: 16,
    elevation: 4,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  transactionGradient: {
    padding: 16,
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    marginRight: 16,
  },
  iconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  positiveAmount: {
    color: theme.colors.success,
  },
  negativeAmount: {
    color: theme.colors.error,
  },
  statusChip: {
    height: 24,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
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

export default TransactionHistoryScreen;