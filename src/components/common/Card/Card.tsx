import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';

// 基本卡片組件
interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  shadow?: 'none' | 'small' | 'medium' | 'large';
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  shadow = 'small',
  padding = 'medium',
}) => {
  const { theme } = useTheme();

  const getShadowStyle = () => {
    switch (shadow) {
      case 'none':
        return {};
      case 'small':
        return theme.shadows.small;
      case 'medium':
        return theme.shadows.medium;
      case 'large':
        return theme.shadows.large;
      default:
        return theme.shadows.small;
    }
  };

  const getPaddingStyle = () => {
    switch (padding) {
      case 'none':
        return { padding: 0 };
      case 'small':
        return { padding: theme.spacing.sm };
      case 'medium':
        return { padding: theme.spacing.md };
      case 'large':
        return { padding: theme.spacing.lg };
      default:
        return { padding: theme.spacing.md };
    }
  };

  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.surface.light,
          borderRadius: theme.borderRadius.lg,
          ...getShadowStyle(),
          ...getPaddingStyle(),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

// 資訊卡片組件 (用於購物建議、預訂資訊等)
interface InfoCardProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  subtitle,
  children,
  icon,
  style,
  onPress,
}) => {
  const { theme } = useTheme();

  const CardContent = (
    <View
      style={[
        {
          backgroundColor: theme.colors.surface.light,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.lg,
          marginVertical: theme.spacing.sm,
          ...theme.shadows.small,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        {icon && (
          <View style={{ marginRight: theme.spacing.md }}>
            {icon}
          </View>
        )}
        
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: theme.typography.fontSizes.lg,
              fontWeight: theme.typography.fontWeights.semibold,
              color: theme.colors.text.primary,
              marginBottom: subtitle ? theme.spacing.xs : 0,
            }}
          >
            {title}
          </Text>
          
          {subtitle && (
            <Text
              style={{
                fontSize: theme.typography.fontSizes.sm,
                color: theme.colors.text.secondary,
                marginBottom: children ? theme.spacing.sm : 0,
              }}
            >
              {subtitle}
            </Text>
          )}
          
          {children}
        </View>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.95}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
};

// 餐廳卡片組件
interface RestaurantCardProps extends TouchableOpacityProps {
  restaurant: {
    id: string;
    name: string;
    cuisine: string;
    rating: number;
    priceRange: string;
    imageUrl?: string;
    distance?: number;
    isFavorite: boolean;
  };
  onPress: () => void;
  onFavoritePress?: () => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onPress,
  onFavoritePress,
  style,
  ...props
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      {...props}
      style={[
        {
          backgroundColor: theme.colors.surface.light,
          borderRadius: theme.borderRadius.lg,
          overflow: 'hidden',
          marginVertical: theme.spacing.sm,
          ...theme.shadows.medium,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.95}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${restaurant.name} 餐廳`}
    >
      {restaurant.imageUrl && (
        <Image
          source={{ uri: restaurant.imageUrl }}
          style={{
            width: '100%',
            height: 120,
            resizeMode: 'cover',
          }}
        />
      )}
      
      <View style={{ padding: theme.spacing.md }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: theme.typography.fontSizes.lg,
                fontWeight: theme.typography.fontWeights.semibold,
                color: theme.colors.text.primary,
              }}
            >
              {restaurant.name}
            </Text>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: theme.spacing.xs }}>
              <Text
                style={{
                  fontSize: theme.typography.fontSizes.sm,
                  color: theme.colors.text.secondary,
                }}
              >
                {restaurant.cuisine} • {restaurant.priceRange}
              </Text>
              
              {restaurant.distance && (
                <Text
                  style={{
                    fontSize: theme.typography.fontSizes.sm,
                    color: theme.colors.text.secondary,
                    marginLeft: theme.spacing.sm,
                  }}
                >
                  • {restaurant.distance.toFixed(1)}km
                </Text>
              )}
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: theme.spacing.xs }}>
              <Text
                style={{
                  fontSize: theme.typography.fontSizes.sm,
                  color: theme.colors.status.warning,
                  fontWeight: theme.typography.fontWeights.medium,
                }}
              >
                ⭐ {restaurant.rating.toFixed(1)}
              </Text>
            </View>
          </View>
          
          {onFavoritePress && (
            <TouchableOpacity
              onPress={onFavoritePress}
              style={{
                padding: theme.spacing.sm,
                marginLeft: theme.spacing.sm,
              }}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={restaurant.isFavorite ? '取消收藏' : '加入收藏'}
            >
              <Text style={{ fontSize: 20 }}>
                {restaurant.isFavorite ? '❤️' : '🤍'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

// 購物項目卡片組件
interface ShoppingItemCardProps {
  item: {
    id: string;
    name: string;
    quantity: number;
    category: string;
    price?: number;
    completed: boolean;
  };
  onToggle: () => void;
  onDelete?: () => void;
}

export const ShoppingItemCard: React.FC<ShoppingItemCardProps> = ({
  item,
  onToggle,
  onDelete,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={onToggle}
      style={{
        backgroundColor: theme.colors.surface.light,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        marginVertical: theme.spacing.xs,
        flexDirection: 'row',
        alignItems: 'center',
        opacity: item.completed ? 0.6 : 1,
        ...theme.shadows.small,
      }}
      activeOpacity={0.8}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${item.name}, ${item.completed ? '已完成' : '未完成'}`}
    >
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: item.completed ? theme.colors.accent : theme.colors.text.disabled,
          backgroundColor: item.completed ? theme.colors.accent : 'transparent',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: theme.spacing.md,
        }}
      >
        {item.completed && (
          <Text style={{ color: 'white', fontSize: 16 }}>✓</Text>
        )}
      </View>
      
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: theme.typography.fontSizes.md,
            fontWeight: theme.typography.fontWeights.medium,
            color: theme.colors.text.primary,
            textDecorationLine: item.completed ? 'line-through' : 'none',
          }}
        >
          {item.name}
        </Text>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: theme.spacing.xs }}>
          <Text
            style={{
              fontSize: theme.typography.fontSizes.sm,
              color: theme.colors.text.secondary,
            }}
          >
            數量: {item.quantity} • {item.category}
          </Text>
          
          {item.price && (
            <Text
              style={{
                fontSize: theme.typography.fontSizes.sm,
                color: theme.colors.text.secondary,
                marginLeft: theme.spacing.sm,
              }}
            >
              • NT$ {(item.price * item.quantity).toFixed(0)}
            </Text>
          )}
        </View>
      </View>
      
      {onDelete && (
        <TouchableOpacity
          onPress={onDelete}
          style={{
            padding: theme.spacing.sm,
            marginLeft: theme.spacing.sm,
          }}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="刪除項目"
        >
          <Text style={{ color: theme.colors.status.error, fontSize: 18 }}>
            🗑️
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}; 