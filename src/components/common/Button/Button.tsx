import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  children,
  ...props
}) => {
  const { theme } = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      borderWidth: 1,
    };

    // Size styles
    const sizeStyles = {
      small: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        minHeight: 36,
      },
      medium: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        minHeight: 44,
      },
      large: {
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.lg,
        minHeight: 52,
      },
    };

    // Variant styles
    const variantStyles = {
      primary: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
      },
      secondary: {
        backgroundColor: theme.colors.secondary,
        borderColor: theme.colors.secondary,
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: theme.colors.primary,
      },
      ghost: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
      },
    };

    // Disabled styles
    const disabledStyle: ViewStyle = disabled || loading ? {
      opacity: 0.5,
    } : {};

    // Full width style
    const fullWidthStyle: ViewStyle = fullWidth ? {
      width: '100%',
    } : {};

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...disabledStyle,
      ...fullWidthStyle,
    };
  };

  const getTextStyle = (): TextStyle => {
    const sizeStyles = {
      small: {
        fontSize: theme.typography.fontSizes.sm,
      },
      medium: {
        fontSize: theme.typography.fontSizes.md,
      },
      large: {
        fontSize: theme.typography.fontSizes.lg,
      },
    };

    const variantStyles = {
      primary: {
        color: theme.colors.text.inverse,
      },
      secondary: {
        color: theme.colors.text.inverse,
      },
      outline: {
        color: theme.colors.primary,
      },
      ghost: {
        color: theme.colors.primary,
      },
    };

    return {
      fontWeight: theme.typography.fontWeights.medium,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  return (
    <TouchableOpacity
      {...props}
      style={[getButtonStyle(), style]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' 
            ? theme.colors.primary 
            : theme.colors.text.inverse
          }
          style={{ marginRight: theme.spacing.sm }}
        />
      )}
      
      {children || (
        <Text style={getTextStyle()}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

// Action Card 組件 - 主頁使用的大型操作卡片
interface ActionCardProps extends TouchableOpacityProps {
  title: string;
  icon: React.ReactNode;
  backgroundColor: string;
  onPress: () => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  icon,
  backgroundColor,
  onPress,
  style,
  ...props
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      {...props}
      style={[
        {
          backgroundColor,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.lg,
          flex: 1,
          marginHorizontal: theme.spacing.xs,
          minHeight: 120,
          justifyContent: 'center',
          alignItems: 'center',
          ...theme.shadows.medium,
        },
        style,
      ]}
      activeOpacity={0.9}
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {icon}
      <Text
        style={{
          color: theme.colors.text.inverse,
          fontSize: theme.typography.fontSizes.lg,
          fontWeight: theme.typography.fontWeights.semibold,
          marginTop: theme.spacing.sm,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // 如果需要固定樣式，可以在這裡定義
}); 