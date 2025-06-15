import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  ScrollView,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRestaurantStore } from '@/store/restaurantStore';
import { Card, RestaurantCard } from '@/components/common/Card/Card';
import { Button } from '@/components/common/Button/Button';

export const RestaurantScreen: React.FC = () => {
  const { theme } = useTheme();
  const restaurantStore = useRestaurantStore();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    restaurantStore.searchRestaurants(searchQuery);
  };

  const handleRestaurantPress = (restaurantId: string) => {
    console.log('Navigate to Restaurant Details:', restaurantId);
  };

  const handleFavoritePress = (restaurant: any) => {
    restaurantStore.toggleFavorite(restaurant);
  };

  const displayRestaurants = searchQuery.trim() && restaurantStore.searchResults.length > 0 
    ? restaurantStore.searchResults 
    : restaurantStore.restaurants;

  const renderRestaurant = ({ item }: { item: any }) => (
    <RestaurantCard
      restaurant={item}
      onPress={() => handleRestaurantPress(item.id)}
      onFavoritePress={() => handleFavoritePress(item)}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.light }]}>
      {/* 標題 */}
      <View style={[styles.header, { paddingHorizontal: theme.spacing.md }]}>
        <Text style={[styles.title, {
          fontSize: theme.typography.fontSizes.xxl,
          fontWeight: theme.typography.fontWeights.bold,
          color: theme.colors.text.primary,
          marginBottom: theme.spacing.md,
        }]}>
          餐廳搜尋
        </Text>

        {/* 搜尋欄 */}
        <View style={styles.searchSection}>
          <TextInput
            style={[styles.searchInput, {
              borderColor: theme.colors.text.disabled,
              color: theme.colors.text.primary,
              backgroundColor: theme.colors.surface.light,
            }]}
            placeholder="搜尋餐廳、料理類型..."
            placeholderTextColor={theme.colors.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <Button
            title="搜尋"
            onPress={handleSearch}
            size="medium"
            style={styles.searchButton}
          />
        </View>
      </View>

      {/* 餐廳列表 */}
      <View style={[styles.listSection, { paddingHorizontal: theme.spacing.md }]}>
        {displayRestaurants.length > 0 ? (
          <FlatList
            data={displayRestaurants}
            renderItem={renderRestaurant}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
          />
        ) : (
          <Card padding="large" style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 64, marginBottom: theme.spacing.md }}>🍽️</Text>
            <Text style={[styles.emptyTitle, {
              fontSize: theme.typography.fontSizes.lg,
              fontWeight: theme.typography.fontWeights.semibold,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing.sm,
            }]}>
              {searchQuery.trim() ? '沒有找到相關餐廳' : '還沒有餐廳資料'}
            </Text>
            <Text style={[styles.emptySubtitle, {
              fontSize: theme.typography.fontSizes.md,
              color: theme.colors.text.secondary,
              textAlign: 'center',
            }]}>
              {searchQuery.trim() ? '試試其他關鍵字' : '開始探索附近的美食吧！'}
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
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  searchButton: {
    minWidth: 80,
  },
  listSection: {
    flex: 1,
  },
  emptyTitle: {
    // 動態樣式在組件中定義
  },
  emptySubtitle: {
    // 動態樣式在組件中定義
  },
}); 