import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRestaurantStore } from '@/store/restaurantStore';
import { Card, RestaurantCard } from '@/components/common/Card/Card';

export const FavoritesScreen: React.FC = () => {
  const { theme } = useTheme();
  const restaurantStore = useRestaurantStore();

  const handleRestaurantPress = (restaurantId: string) => {
    console.log('Navigate to Restaurant Details:', restaurantId);
  };

  const handleFavoritePress = (restaurant: any) => {
    restaurantStore.toggleFavorite(restaurant);
  };

  const renderRestaurant = ({ item }: { item: any }) => (
    <RestaurantCard
      restaurant={item}
      onPress={() => handleRestaurantPress(item.id)}
      onFavoritePress={() => handleFavoritePress(item)}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.light }]}>
      <View style={[styles.header, { paddingHorizontal: theme.spacing.md }]}>
        <Text style={[styles.title, {
          fontSize: theme.typography.fontSizes.xxl,
          fontWeight: theme.typography.fontWeights.bold,
          color: theme.colors.text.primary,
        }]}>
          我的收藏
        </Text>
      </View>

      <View style={[styles.content, { paddingHorizontal: theme.spacing.md }]}>
        {restaurantStore.favorites.length > 0 ? (
          <FlatList
            data={restaurantStore.favorites}
            renderItem={renderRestaurant}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
          />
        ) : (
          <Card padding="large" style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 64, marginBottom: theme.spacing.md }}>❤️</Text>
            <Text style={[styles.emptyTitle, {
              fontSize: theme.typography.fontSizes.lg,
              fontWeight: theme.typography.fontWeights.semibold,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing.sm,
            }]}>
              還沒有收藏的餐廳
            </Text>
            <Text style={[styles.emptySubtitle, {
              fontSize: theme.typography.fontSizes.md,
              color: theme.colors.text.secondary,
              textAlign: 'center',
            }]}>
              開始收藏您喜愛的餐廳吧！
            </Text>
          </Card>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    // 動態樣式在組件中定義
  },
  content: {
    flex: 1,
  },
  emptyTitle: {
    // 動態樣式在組件中定義
  },
  emptySubtitle: {
    // 動態樣式在組件中定義
  },
}); 