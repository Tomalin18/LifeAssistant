import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Restaurant, Reservation, SearchFilters } from '@/types/global';

// 生成 UUID 的簡單函數
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 餐廳狀態管理
class RestaurantStore {
  private listeners: Set<() => void> = new Set();
  
  public state = {
    restaurants: [] as Restaurant[],
    favorites: [] as Restaurant[],
    reservations: [] as Reservation[],
    searchResults: [] as Restaurant[],
    currentLocation: null as { latitude: number; longitude: number } | null,
    isLoading: false,
    error: null as string | null,
  };

  // 通知所有監聽者狀態變更
  private notify = () => {
    this.listeners.forEach(listener => listener());
  };

  // 訂閱狀態變更
  public subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  // 載入數據
  public loadData = async () => {
    try {
      this.state.isLoading = true;
      this.notify();

      const restaurantsData = await AsyncStorage.getItem('restaurants');
      const favoritesData = await AsyncStorage.getItem('favorite-restaurants');
      const reservationsData = await AsyncStorage.getItem('reservations');

      if (restaurantsData) {
        this.state.restaurants = JSON.parse(restaurantsData);
      }

      if (favoritesData) {
        this.state.favorites = JSON.parse(favoritesData);
      }

      if (reservationsData) {
        const reservations = JSON.parse(reservationsData);
        this.state.reservations = reservations.map((reservation: any) => ({
          ...reservation,
          date: new Date(reservation.date),
          createdAt: new Date(reservation.createdAt),
          updatedAt: new Date(reservation.updatedAt),
        }));
      }

      this.state.isLoading = false;
      this.state.error = null;
      this.notify();
    } catch (error) {
      this.state.isLoading = false;
      this.state.error = '載入數據失敗';
      this.notify();
    }
  };

  // 保存數據
  private saveData = async () => {
    try {
      await AsyncStorage.setItem('restaurants', JSON.stringify(this.state.restaurants));
      await AsyncStorage.setItem('favorite-restaurants', JSON.stringify(this.state.favorites));
      await AsyncStorage.setItem('reservations', JSON.stringify(this.state.reservations));
    } catch (error) {
      console.error('保存數據失敗:', error);
    }
  };

  // 餐廳操作
  public addRestaurant = (restaurant: Omit<Restaurant, 'id'>) => {
    const newRestaurant: Restaurant = {
      ...restaurant,
      id: generateId(),
    };
    
    this.state.restaurants.push(newRestaurant);
    this.saveData();
    this.notify();
  };

  public updateRestaurant = (restaurantId: string, updates: Partial<Restaurant>) => {
    const restaurant = this.state.restaurants.find(r => r.id === restaurantId);
    if (restaurant) {
      Object.assign(restaurant, updates);
      this.saveData();
      this.notify();
    }
  };

  public deleteRestaurant = (restaurantId: string) => {
    const index = this.state.restaurants.findIndex(r => r.id === restaurantId);
    if (index !== -1) {
      this.state.restaurants.splice(index, 1);
      this.saveData();
      this.notify();
    }
  };

  // 收藏操作
  public toggleFavorite = (restaurant: Restaurant) => {
    const index = this.state.favorites.findIndex(f => f.id === restaurant.id);
    
    if (index !== -1) {
      // 取消收藏
      this.state.favorites.splice(index, 1);
    } else {
      // 添加收藏
      this.state.favorites.push({ ...restaurant, isFavorite: true });
    }
    
    // 更新餐廳列表中的收藏狀態
    const restaurantIndex = this.state.restaurants.findIndex(r => r.id === restaurant.id);
    if (restaurantIndex !== -1) {
      this.state.restaurants[restaurantIndex].isFavorite = index === -1;
    }
    
    this.saveData();
    this.notify();
  };

  // 預訂操作
  public createReservation = (reservation: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newReservation: Reservation = {
      ...reservation,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.state.reservations.push(newReservation);
    this.saveData();
    this.notify();
  };

  public updateReservation = (reservationId: string, updates: Partial<Reservation>) => {
    const reservation = this.state.reservations.find(r => r.id === reservationId);
    if (reservation) {
      Object.assign(reservation, updates, { updatedAt: new Date() });
      this.saveData();
      this.notify();
    }
  };

  public cancelReservation = (reservationId: string) => {
    const reservation = this.state.reservations.find(r => r.id === reservationId);
    if (reservation) {
      reservation.status = 'cancelled';
      reservation.updatedAt = new Date();
      this.saveData();
      this.notify();
    }
  };

  public deleteReservation = (reservationId: string) => {
    const index = this.state.reservations.findIndex(r => r.id === reservationId);
    if (index !== -1) {
      this.state.reservations.splice(index, 1);
      this.saveData();
      this.notify();
    }
  };

  // 搜尋功能
  public searchRestaurants = (query: string, filters?: SearchFilters) => {
    let results = [...this.state.restaurants];
    
    // 文字搜尋
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(restaurant => 
        restaurant.name.toLowerCase().includes(lowerQuery) ||
        restaurant.cuisine.toLowerCase().includes(lowerQuery) ||
        restaurant.address.toLowerCase().includes(lowerQuery)
      );
    }
    
    // 應用篩選器
    if (filters) {
      if (filters.cuisine && filters.cuisine.length > 0) {
        results = results.filter(restaurant => 
          filters.cuisine!.includes(restaurant.cuisine)
        );
      }
      
      if (filters.priceRange && filters.priceRange.length > 0) {
        results = results.filter(restaurant => 
          filters.priceRange!.includes(restaurant.priceRange)
        );
      }
      
      if (filters.rating) {
        results = results.filter(restaurant => 
          restaurant.rating >= filters.rating!
        );
      }
      
      if (filters.features && filters.features.length > 0) {
        results = results.filter(restaurant => 
          filters.features!.some(feature => 
            restaurant.features.includes(feature)
          )
        );
      }
    }
    
    this.state.searchResults = results;
    this.notify();
  };

  // 位置相關
  public setCurrentLocation = (location: { latitude: number; longitude: number }) => {
    this.state.currentLocation = location;
    
    // 計算距離
    this.state.restaurants.forEach(restaurant => {
      restaurant.distance = this.calculateDistance(
        location.latitude,
        location.longitude,
        restaurant.location.latitude,
        restaurant.location.longitude
      );
    });
    
    this.notify();
  };

  private calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // 地球半徑（公里）
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  private deg2rad = (deg: number): number => {
    return deg * (Math.PI/180);
  };

  // 獲取附近餐廳
  public getNearbyRestaurants = (radiusKm: number = 5): Restaurant[] => {
    if (!this.state.currentLocation) return [];
    
    return this.state.restaurants
      .filter(restaurant => restaurant.distance && restaurant.distance <= radiusKm)
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  };

  // 獲取推薦餐廳
  public getRecommendedRestaurants = (): Restaurant[] => {
    return this.state.restaurants
      .filter(restaurant => restaurant.rating >= 4.0)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
  };

  // 清除錯誤
  public clearError = () => {
    this.state.error = null;
    this.notify();
  };

  // 清除搜尋結果
  public clearSearchResults = () => {
    this.state.searchResults = [];
    this.notify();
  };
}

// 創建單例
const restaurantStore = new RestaurantStore();

// React Hook
export const useRestaurantStore = () => {
  const [, forceUpdate] = useState({});
  
  useEffect(() => {
    const unsubscribe = restaurantStore.subscribe(() => {
      forceUpdate({});
    });
    
    // 初始化載入數據
    restaurantStore.loadData();
    
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    // 狀態
    restaurants: restaurantStore.state.restaurants,
    favorites: restaurantStore.state.favorites,
    reservations: restaurantStore.state.reservations,
    searchResults: restaurantStore.state.searchResults,
    currentLocation: restaurantStore.state.currentLocation,
    isLoading: restaurantStore.state.isLoading,
    error: restaurantStore.state.error,

    // 操作
    addRestaurant: restaurantStore.addRestaurant,
    updateRestaurant: restaurantStore.updateRestaurant,
    deleteRestaurant: restaurantStore.deleteRestaurant,
    toggleFavorite: restaurantStore.toggleFavorite,
    createReservation: restaurantStore.createReservation,
    updateReservation: restaurantStore.updateReservation,
    cancelReservation: restaurantStore.cancelReservation,
    deleteReservation: restaurantStore.deleteReservation,
    searchRestaurants: restaurantStore.searchRestaurants,
    setCurrentLocation: restaurantStore.setCurrentLocation,
    getNearbyRestaurants: restaurantStore.getNearbyRestaurants,
    getRecommendedRestaurants: restaurantStore.getRecommendedRestaurants,
    clearError: restaurantStore.clearError,
    clearSearchResults: restaurantStore.clearSearchResults,
  };
}; 