import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/hooks/useTheme';
import { useShoppingStore } from '@/store/shoppingStore';
import { useRestaurantStore } from '@/store/restaurantStore';
import { ActionCard } from '@/components/common/Button/Button';
import { Card, InfoCard, RestaurantCard } from '@/components/common/Card/Card';

const { width } = Dimensions.get('window');

export const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const shoppingStore = useShoppingStore();
  const restaurantStore = useRestaurantStore();

  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    // 載入初始數據或模擬數據
    loadMockData();
  }, []);

  const loadMockData = () => {
    // 添加一些示例購物清單數據
    if (shoppingStore.lists.length === 0) {
      shoppingStore.createList('每週購物清單');
      const listId = shoppingStore.lists[0]?.id;
      if (listId) {
        shoppingStore.addItem(listId, {
          name: '蘋果',
          quantity: 6,
          category: '水果',
          price: 120,
          completed: false,
        });
        shoppingStore.addItem(listId, {
          name: '牛奶',
          quantity: 2,
          category: '乳製品',
          price: 85,
          completed: false,
        });
        shoppingStore.addItem(listId, {
          name: '麵包',
          quantity: 1,
          category: '主食',
          price: 45,
          completed: true,
        });
      }
    }

    // 添加一些示例餐廳數據
    if (restaurantStore.restaurants.length === 0) {
      restaurantStore.addRestaurant({
        name: '小籠包天堂',
        cuisine: '台式料理',
        rating: 4.5,
        priceRange: '$$',
        address: '台北市大安區復興南路一段100號',
        location: {
          latitude: 25.0330,
          longitude: 121.5654,
        },
        hours: {
          monday: { open: '11:00', close: '21:00' },
          tuesday: { open: '11:00', close: '21:00' },
          wednesday: { open: '11:00', close: '21:00' },
          thursday: { open: '11:00', close: '21:00' },
          friday: { open: '11:00', close: '22:00' },
          saturday: { open: '11:00', close: '22:00' },
          sunday: { open: '11:00', close: '21:00' },
        },
        features: ['外帶', '內用', '熱門'],
        isFavorite: false,
      });

      restaurantStore.addRestaurant({
        name: '義式風情',
        cuisine: '義式料理',
        rating: 4.2,
        priceRange: '$$$',
        address: '台北市信義區市府路45號',
        location: {
          latitude: 25.0380,
          longitude: 121.5690,
        },
        hours: {
          monday: { open: '17:00', close: '23:00' },
          tuesday: { open: '17:00', close: '23:00' },
          wednesday: { open: '17:00', close: '23:00' },
          thursday: { open: '17:00', close: '23:00' },
          friday: { open: '17:00', close: '24:00' },
          saturday: { open: '12:00', close: '24:00' },
          sunday: { open: '12:00', close: '23:00' },
        },
        features: ['浪漫', '約會', '商務'],
        isFavorite: true,
      });
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    // 模擬重新載入數據
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  const handleShoppingPress = () => {
    // 導航到購物清單頁面
    console.log('Navigate to Shopping List');
  };

  const handleRestaurantPress = () => {
    // 導航到餐廳頁面
    console.log('Navigate to Restaurant');
  };

  const handleRestaurantCardPress = (restaurantId: string) => {
    console.log('Navigate to Restaurant Details:', restaurantId);
  };

  const handleFavoritePress = (restaurant: any) => {
    restaurantStore.toggleFavorite(restaurant);
  };

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return '早安';
    } else if (hour < 18) {
      return '午安';
    } else {
      return '晚安';
    }
  };

  const getActiveShoppingList = () => {
    return shoppingStore.lists.find(list => list.items.length > 0) || shoppingStore.lists[0];
  };

  const getUpcomingReservation = () => {
    const now = new Date();
    return restaurantStore.reservations
      .filter(reservation => reservation.date > now && reservation.status !== 'cancelled')
      .sort((a, b) => a.date.getTime() - b.date.getTime())[0];
  };

  const getFavoriteRestaurant = () => {
    return restaurantStore.favorites[0] || restaurantStore.restaurants[0];
  };

  const activeList = getActiveShoppingList();
  const upcomingReservation = getUpcomingReservation();
  const favoriteRestaurant = getFavoriteRestaurant();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.light }]}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* 頁首 */}
        <View style={[styles.header, { paddingHorizontal: theme.spacing.md }]}>
          <Text
            style={[
              styles.greeting,
              {
                fontSize: theme.typography.fontSizes.title,
                fontWeight: theme.typography.fontWeights.bold,
                color: theme.colors.text.primary,
              },
            ]}
          >
            {getCurrentGreeting()}！
          </Text>
          <Text
            style={[
              styles.subtitle,
              {
                fontSize: theme.typography.fontSizes.lg,
                color: theme.colors.text.secondary,
                marginTop: theme.spacing.xs,
              },
            ]}
          >
            今天想要做什麼呢？
          </Text>
        </View>

        {/* 快速操作卡片 */}
        <View style={[styles.actionCards, { paddingHorizontal: theme.spacing.md }]}>
          <ActionCard
            title="購物清單"
            icon={<Text style={{ fontSize: 32 }}>🛒</Text>}
            backgroundColor={theme.colors.primary}
            onPress={handleShoppingPress}
            style={{ marginRight: theme.spacing.sm }}
          />
          <ActionCard
            title="餐廳預訂"
            icon={<Text style={{ fontSize: 32 }}>🍽️</Text>}
            backgroundColor={theme.colors.secondary}
            onPress={handleRestaurantPress}
            style={{ marginLeft: theme.spacing.sm }}
          />
        </View>

        {/* 智能購物建議 */}
        <View style={[styles.section, { paddingHorizontal: theme.spacing.md }]}>
          <Text
            style={[
              styles.sectionTitle,
              {
                fontSize: theme.typography.fontSizes.xl,
                fontWeight: theme.typography.fontWeights.semibold,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing.md,
              },
            ]}
          >
            智能購物建議
          </Text>
          
          <InfoCard
            title="本週購物提醒"
            subtitle={activeList ? `${activeList.name} - ${activeList.items.length} 項物品` : '還沒有購物清單'}
            icon={<Text style={{ fontSize: 24 }}>🛍️</Text>}
            onPress={handleShoppingPress}
          >
            {activeList && (
              <View>
                <Text
                  style={{
                    fontSize: theme.typography.fontSizes.sm,
                    color: theme.colors.text.secondary,
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  待購買項目：
                </Text>
                {activeList.items.slice(0, 3).map((item, index) => (
                  <Text
                    key={index}
                    style={{
                      fontSize: theme.typography.fontSizes.sm,
                      color: theme.colors.text.primary,
                      marginLeft: theme.spacing.sm,
                      opacity: item.completed ? 0.6 : 1,
                      textDecorationLine: item.completed ? 'line-through' : 'none',
                    }}
                  >
                    • {item.name} x{item.quantity}
                  </Text>
                ))}
                {activeList.items.length > 3 && (
                  <Text
                    style={{
                      fontSize: theme.typography.fontSizes.sm,
                      color: theme.colors.text.secondary,
                      marginLeft: theme.spacing.sm,
                      marginTop: theme.spacing.xs,
                    }}
                  >
                    ...還有 {activeList.items.length - 3} 項
                  </Text>
                )}
              </View>
            )}
          </InfoCard>
        </View>

        {/* 即將到來的預訂 */}
        <View style={[styles.section, { paddingHorizontal: theme.spacing.md }]}>
          <Text
            style={[
              styles.sectionTitle,
              {
                fontSize: theme.typography.fontSizes.xl,
                fontWeight: theme.typography.fontWeights.semibold,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing.md,
              },
            ]}
          >
            即將到來的預訂
          </Text>
          
          {upcomingReservation ? (
            <InfoCard
              title={upcomingReservation.restaurant.name}
              subtitle={`${upcomingReservation.date.toLocaleDateString()} ${upcomingReservation.time} - ${upcomingReservation.partySize} 人`}
              icon={<Text style={{ fontSize: 24 }}>📅</Text>}
              onPress={() => console.log('Navigate to Reservation Details')}
            >
              <View style={{
                backgroundColor: theme.colors.status.info,
                paddingHorizontal: theme.spacing.sm,
                paddingVertical: theme.spacing.xs,
                borderRadius: theme.borderRadius.sm,
                alignSelf: 'flex-start',
                marginTop: theme.spacing.sm,
              }}>
                <Text style={{
                  color: theme.colors.text.inverse,
                  fontSize: theme.typography.fontSizes.xs,
                  fontWeight: theme.typography.fontWeights.medium,
                }}>
                  {upcomingReservation.status === 'confirmed' ? '已確認' : '待確認'}
                </Text>
              </View>
            </InfoCard>
          ) : (
            <InfoCard
              title="暫無預訂"
              subtitle="點擊這裡尋找附近的餐廳"
              icon={<Text style={{ fontSize: 24 }}>🍴</Text>}
              onPress={handleRestaurantPress}
            />
          )}
        </View>

        {/* 我的最愛 */}
        <View style={[styles.section, { paddingHorizontal: theme.spacing.md }]}>
          <Text
            style={[
              styles.sectionTitle,
              {
                fontSize: theme.typography.fontSizes.xl,
                fontWeight: theme.typography.fontWeights.semibold,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing.md,
              },
            ]}
          >
            我的最愛
          </Text>
          
          {favoriteRestaurant && (
            <RestaurantCard
              restaurant={favoriteRestaurant}
              onPress={() => handleRestaurantCardPress(favoriteRestaurant.id)}
              onFavoritePress={() => handleFavoritePress(favoriteRestaurant)}
            />
          )}
        </View>

        {/* 底部間距 */}
        <View style={{ height: theme.spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 24,
  },
  greeting: {
    // 動態樣式在組件中定義
  },
  subtitle: {
    // 動態樣式在組件中定義
  },
  actionCards: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    // 動態樣式在組件中定義
  },
}); 