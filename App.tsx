import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { HomeScreen } from '@/screens/HomeScreen';
import { ShoppingListScreen } from '@/screens/ShoppingListScreen';
import { RestaurantScreen } from '@/screens/RestaurantScreen';
import { FavoritesScreen } from '@/screens/FavoritesScreen';
import { NotificationsScreen } from '@/screens/NotificationsScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { useTheme } from '@/hooks/useTheme';

// 簡單的錯誤邊界組件
class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <View style={styles.errorCard}>
            <Text style={styles.errorEmoji}>😵</Text>
            <Text style={styles.errorTitle}>應用程式發生錯誤</Text>
            <Text style={styles.errorMessage}>
              很抱歉，應用程式遇到了未預期的錯誤。請重新啟動應用程式。
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                this.setState({ hasError: false, error: null });
              }}
            >
              <Text style={styles.retryButtonText}>重試</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

// 簡單的底部導航組件
const BottomTabBar: React.FC<{
  activeTab: string;
  onTabPress: (tab: string) => void;
}> = ({ activeTab, onTabPress }) => {
  const { theme } = useTheme();

  const tabs = [
    { key: 'home', label: '首頁', icon: '🏠' },
    { key: 'shopping', label: '購物', icon: '🛒' },
    { key: 'restaurant', label: '餐廳', icon: '🍽️' },
    { key: 'favorites', label: '收藏', icon: '❤️' },
    { key: 'notifications', label: '通知', icon: '🔔' },
    { key: 'profile', label: '個人', icon: '👤' },
  ];

  return (
    <View style={[styles.tabBar, { backgroundColor: theme.colors.surface.light }]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={styles.tabItem}
          onPress={() => onTabPress(tab.key)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.tabIcon,
            { opacity: activeTab === tab.key ? 1 : 0.6 }
          ]}>
            {tab.icon}
          </Text>
          <Text style={[
            styles.tabLabel,
            {
              color: activeTab === tab.key ? theme.colors.primary : theme.colors.text.secondary,
              fontWeight: activeTab === tab.key ? '600' : '400',
            }
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// 主導航組件
const AppNavigator: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'shopping':
        return <ShoppingListScreen />;
      case 'restaurant':
        return <RestaurantScreen />;
      case 'favorites':
        return <FavoritesScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {renderScreen()}
      </View>
      <BottomTabBar activeTab={activeTab} onTabPress={setActiveTab} />
    </View>
  );
};

// 主應用程式組件
const App: React.FC = () => {
  return (
    <AppErrorBoundary>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </AppErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    height: 80,
    paddingBottom: 20,
    paddingTop: 10,
    borderTopWidth: 0,
    elevation: 8,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  errorCard: {
    backgroundColor: 'white',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1E293B',
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default App; 