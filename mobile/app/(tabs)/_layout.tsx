import { Tabs } from 'expo-router';
import { Home, Users, Wallet, Gift } from 'lucide-react-native';
import { cssInterop, useColorScheme } from 'nativewind';

// Enable className styling for icons
cssInterop(Home, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(Users, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(Wallet, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(Gift, { className: { target: 'style', nativeStyleToProp: { color: true } } });

export default function TabsLayout() {
const { colorScheme } = useColorScheme();
const isDark = colorScheme === 'dark';

return (
<Tabs
screenOptions={{
headerShown: false,
tabBarStyle: {
backgroundColor: isDark ? '#0a0a0f' : '#ffffff',
borderTopColor: isDark ? '#1a1a2e' : '#e5e7eb',
height: 70,
paddingBottom: 10,
paddingTop: 10,
},
tabBarActiveTintColor: isDark ? '#667eea' : '#764ba2',
tabBarInactiveTintColor: isDark ? '#6b7280' : '#9ca3af',
}}
>
<Tabs.Screen
name="home"
options={{
title: 'Home',
tabBarIcon: ({ focused }) => (
<Home className={focused ? 'text-primary' : 'text-muted-foreground'} size={24} />
),
}}
/>
<Tabs.Screen
name="contacts"
options={{
title: 'Contacts',
tabBarIcon: ({ focused }) => (
<Users className={focused ? 'text-primary' : 'text-muted-foreground'} size={24} />
),
}}
/>
<Tabs.Screen
name="wallet"
options={{
title: 'Wallet',
tabBarIcon: ({ focused }) => (
<Wallet className={focused ? 'text-primary' : 'text-muted-foreground'} size={24} />
),
}}
/>
<Tabs.Screen
name="rewards"
options={{
title: 'Rewards',
tabBarIcon: ({ focused }) => (
<Gift className={focused ? 'text-primary' : 'text-muted-foreground'} size={24} />
),
}}
/>
</Tabs>
);
}