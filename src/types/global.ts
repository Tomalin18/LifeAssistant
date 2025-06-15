import { Theme } from '@/constants/theme';

// 全局類型定義
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'zh-TW' | 'en';
  notifications: {
    shopping: boolean;
    reservations: boolean;
    recommendations: boolean;
  };
  location: {
    latitude?: number;
    longitude?: number;
    address?: string;
  };
}

// 購物相關類型
export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  price?: number;
  completed: boolean;
  addedAt: Date;
  completedAt?: Date | null;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
  createdAt: Date;
  updatedAt: Date;
  totalEstimate?: number;
}

export interface Receipt {
  id: string;
  imageUri: string;
  items: ShoppingItem[];
  total: number;
  merchant: string;
  date: Date;
  processed: boolean;
}

// 餐廳相關類型
export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  address: string;
  phone?: string;
  website?: string;
  imageUrl?: string;
  location: {
    latitude: number;
    longitude: number;
  };
  hours: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  features: string[];
  distance?: number;
  isFavorite: boolean;
}

export interface Reservation {
  id: string;
  restaurantId: string;
  restaurant: Restaurant;
  date: Date;
  time: string;
  partySize: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 通知相關類型
export interface Notification {
  id: string;
  type: 'shopping' | 'reservation' | 'recommendation' | 'system';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: Date;
  scheduledFor?: Date;
}

// API 響應類型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 位置相關類型
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
}

// 搜尋相關類型
export interface SearchFilters {
  cuisine?: string[];
  priceRange?: string[];
  rating?: number;
  distance?: number;
  features?: string[];
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  query: string;
  filters?: SearchFilters;
}

// 錯誤處理類型
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// 主題提供者類型
export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
}

// 導航參數類型
export interface NavigationParams {
  HomeScreen: undefined;
  ShoppingListScreen: undefined;
  RestaurantScreen: undefined;
  FavoritesScreen: undefined;
  NotificationsScreen: undefined;
  ProfileScreen: undefined;
  RestaurantDetailsScreen: {
    restaurantId: string;
  };
  ReservationScreen: {
    restaurantId?: string;
    reservationId?: string;
  };
  ShoppingListDetailsScreen: {
    listId: string;
  };
  CameraScanScreen: undefined;
}

// 動畫類型
export interface AnimationConfig {
  duration: number;
  easing: 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
  delay?: number;
}

// 表單驗證類型
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// 儲存類型
export type StorageKey = 
  | 'user'
  | 'theme'
  | 'language'
  | 'notifications'
  | 'shopping_lists'
  | 'restaurants'
  | 'reservations'
  | 'preferences';

// 權限類型
export type PermissionType = 
  | 'camera'
  | 'location'
  | 'notifications'
  | 'microphone';

export interface PermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
}

// 載入狀態類型
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// 通用回調類型
export type Callback<T = void> = (result: T) => void;
export type AsyncCallback<T = void> = (result: T) => Promise<void>;

// 事件類型
export interface AppEvent {
  type: string;
  payload?: any;
  timestamp: Date;
}

// 支出追蹤類型
export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: Date;
  description?: string;
  location?: string;
  paymentMethod: PaymentMethod;
  tags: string[];
  receiptImage?: string;
  relatedShoppingItemId?: string;
  relatedRestaurantId?: string;
}

export type ExpenseCategory = 
  | 'food' 
  | 'shopping' 
  | 'transport' 
  | 'entertainment' 
  | 'healthcare' 
  | 'utilities' 
  | 'education' 
  | 'other';

export type PaymentMethod = 
  | 'cash' 
  | 'credit_card' 
  | 'debit_card' 
  | 'mobile_payment' 
  | 'bank_transfer';

export interface Budget {
  id: string;
  name: string;
  category: ExpenseCategory;
  limit: number;
  period: 'weekly' | 'monthly' | 'yearly';
  spent: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export interface ExpenseStats {
  totalSpent: number;
  categoryBreakdown: Record<ExpenseCategory, number>;
  monthlySpending: Array<{
    month: string;
    amount: number;
  }>;
  topCategories: Array<{
    category: ExpenseCategory;
    amount: number;
    percentage: number;
  }>;
} 