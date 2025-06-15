import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '@/screens/HomeScreen';
import { ShoppingListScreen } from '@/screens/ShoppingListScreen';
import { RestaurantScreen } from '@/screens/RestaurantScreen';
import { FavoritesScreen } from '@/screens/FavoritesScreen';
import { NotificationsScreen } from '@/screens/NotificationsScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { useTheme } from '@/hooks/useTheme';

// Tab Navigator 類型定義
type TabParamList = {
  Home: undefined;
  Shopping: undefined;
  Restaurant: undefined;
  Favorites: undefined;
  Notifications: undefined;
  Profile: undefined;
};

// Stack Navigator 類型定義
type RootStackParamList = {
  MainTabs: undefined;
  ShoppingListDetails: { listId: string };
  RestaurantDetails: { restaurantId: string };
  Reservation: { restaurantId?: string; reservationId?: string };
  CameraScan: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

// 底部導航組件
const BottomTabNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          let iconEmoji = '';
          const iconSize = size || 24;
          
          switch (route.name) {
            case 'Home':
              iconEmoji = '🏠';
              break;
            case 'Shopping':
              iconEmoji = '🛒';
              break;
            case 'Restaurant':
              iconEmoji = '🍽️';
              break;
            case 'Favorites':
              iconEmoji = '❤️';
              break;
            case 'Notifications':
              iconEmoji = '🔔';
              break;
            case 'Profile':
              iconEmoji = '👤';
              break;
            default:
              iconEmoji = '❓';
          }

          return (
            <div style={{
              fontSize: iconSize,
              opacity: focused ? 1 : 0.6,
              transform: focused ? 'scale(1.1)' : 'scale(1)',
            }}>
              {iconEmoji}
            </div>
          );
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text.secondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface.light,
          borderTopWidth: 0,
          elevation: 8,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
        tabBarLabel: ({ focused }) => {
          let label = '';
          switch (route.name) {
            case 'Home':
              label = '首頁';
              break;
            case 'Shopping':
              label = '購物';
              break;
            case 'Restaurant':
              label = '餐廳';
              break;
            case 'Favorites':
              label = '收藏';
              break;
            case 'Notifications':
              label = '通知';
              break;
            case 'Profile':
              label = '個人';
              break;
          }
          return label;
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: '首頁',
        }}
      />
      <Tab.Screen 
        name="Shopping" 
        component={ShoppingListScreen}
        options={{
          tabBarLabel: '購物',
        }}
      />
      <Tab.Screen 
        name="Restaurant" 
        component={RestaurantScreen}
        options={{
          tabBarLabel: '餐廳',
        }}
      />
      <Tab.Screen 
        name="Favorites" 
        component={FavoritesScreen}
        options={{
          tabBarLabel: '收藏',
        }}
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{
          tabBarLabel: '通知',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: '個人',
        }}
      />
    </Tab.Navigator>
  );
};

// 主導航組件
export const AppNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface.light,
        },
        headerTintColor: theme.colors.text.primary,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        headerShadowVisible: true,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={BottomTabNavigator}
        options={{
          headerShown: false,
        }}
      />
      
      {/* 其他堆疊畫面 */}
      <Stack.Screen 
        name="ShoppingListDetails" 
        component={ShoppingListScreen}
        options={{
          title: '購物清單詳情',
          headerBackTitle: '返回',
        }}
      />
      
      <Stack.Screen 
        name="RestaurantDetails" 
        component={RestaurantScreen}
        options={{
          title: '餐廳詳情',
          headerBackTitle: '返回',
        }}
      />
    </Stack.Navigator>
  );
}; 