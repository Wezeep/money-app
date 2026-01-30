import React, { JSX } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from './src/theme';
import { RootStackParamList, TabParamList } from './src/types';
import SignInScreen from './src/screens/SignInScreen';
import HomeScreen from './src/screens/HomeScreen';
import InternationalTransferScreen from './src/screens/InternationalTransferScreen';
import PeerToPeerTransferScreen from './src/screens/PeerToPeerTransferScreen';
import RequestMoneyScreen from './src/screens/RequestMoneyScreen';
import TransactionHistoryScreen from './src/screens/TransactionHistoryScreen';
import WalletScreen from './src/screens/WalletScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function MainTabs(): JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Transactions') {
            iconName = focused ? 'history' : 'history';
          } else if (route.name === 'Wallet') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else {
            iconName = 'home';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outlineVariant,
          elevation: 8,
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        headerStyle: {
          backgroundColor: theme.colors.primary,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: theme.colors.onPrimary,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        headerBackground: () => (
          <LinearGradient
            colors={['#6366f1', '#8b5cf6']}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        ),
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'FinFlow',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 24,
          },
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionHistoryScreen}
        options={{ title: 'Transactions' }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{ title: 'Wallet' }}
      />
    </Tab.Navigator>
  );
}

export default function App(): JSX.Element {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="SignIn"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: theme.colors.background },
          }}
        >
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen
            name="InternationalTransfer"
            component={InternationalTransferScreen}
            options={{
              headerShown: true,
              title: 'International Transfer',
              headerStyle: {
                backgroundColor: theme.colors.primary,
              },
              headerTintColor: theme.colors.onPrimary,
              headerTitleStyle: { fontWeight: '600' },
              headerBackground: () => (
                <LinearGradient
                  colors={['#6366f1', '#8b5cf6']}
                  style={{ flex: 1 }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
              ),
            }}
          />
          <Stack.Screen
            name="PeerToPeerTransfer"
            component={PeerToPeerTransferScreen}
            options={{
              headerShown: true,
              title: 'Send Money',
              headerStyle: {
                backgroundColor: theme.colors.primary,
              },
              headerTintColor: theme.colors.onPrimary,
              headerTitleStyle: { fontWeight: '600' },
              headerBackground: () => (
                <LinearGradient
                  colors={['#6366f1', '#8b5cf6']}
                  style={{ flex: 1 }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
              ),
            }}
          />
          <Stack.Screen
            name="RequestMoney"
            component={RequestMoneyScreen}
            options={{
              headerShown: true,
              title: 'Request Money',
              headerStyle: {
                backgroundColor: theme.colors.primary,
              },
              headerTintColor: theme.colors.onPrimary,
              headerTitleStyle: { fontWeight: '600' },
              headerBackground: () => (
                <LinearGradient
                  colors={['#6366f1', '#8b5cf6']}
                  style={{ flex: 1 }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
              ),
            }}
          />
        </Stack.Navigator>
        <StatusBar style="light" backgroundColor={theme.colors.primary} />
      </NavigationContainer>
    </PaperProvider>
  );
}
