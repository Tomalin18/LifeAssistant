import { PixelRatio } from 'react-native';

// 響應式字體大小函數
export const scaledFontSize = (size: number): number => {
  const scale = PixelRatio.getFontScale();
  return size * Math.min(scale, 1.3);
};

// 顏色系統
export const colors = {
  primary: '#2563EB',
  primaryLight: '#3B82F6',
  primaryDark: '#1D4ED8',
  secondary: '#F97316',
  accent: '#10B981',
  background: {
    light: '#F8FAFC',
    dark: '#0F172A',
  },
  surface: {
    light: '#FFFFFF',
    dark: '#1E293B',
  },
  text: {
    primary: '#1E293B',
    secondary: '#64748B',
    disabled: '#94A3B8',
    inverse: '#FFFFFF',
  },
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  overlay: 'rgba(0, 0, 0, 0.5)',
  transparent: 'transparent',
} as const;

// 深色主題顏色
export const darkColors = {
  primary: '#2563EB',
  primaryLight: '#3B82F6',
  primaryDark: '#1D4ED8',
  secondary: '#F97316',
  accent: '#10B981',
  background: {
    light: '#0F172A',
    dark: '#020617',
  },
  surface: {
    light: '#1E293B',
    dark: '#0F172A',
  },
  text: {
    primary: '#F1F5F9',
    secondary: '#94A3B8',
    disabled: '#64748B',
    inverse: '#1E293B',
  },
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  overlay: 'rgba(0, 0, 0, 0.5)',
  transparent: 'transparent',
} as const;

// 字體系統
export const typography = {
  fontSizes: {
    xs: scaledFontSize(12),
    sm: scaledFontSize(14),
    md: scaledFontSize(16),
    lg: scaledFontSize(18),
    xl: scaledFontSize(20),
    xxl: scaledFontSize(24),
    xxxl: scaledFontSize(28),
    title: scaledFontSize(32),
  },
  fontWeights: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// 間距系統
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

// 圓角系統
export const borderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
} as const;

// 陰影系統
export const shadows = {
  small: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  large: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;

// 顏色系統類型定義
export interface ColorScheme {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  background: {
    light: string;
    dark: string;
  };
  surface: {
    light: string;
    dark: string;
  };
  text: {
    primary: string;
    secondary: string;
    disabled: string;
    inverse: string;
  };
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  overlay: string;
  transparent: string;
}

// 主題類型定義
export interface Theme {
  colors: ColorScheme;
  typography: typeof typography;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
  dark: boolean;
}

// 淺色主題
export const lightTheme: Theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  dark: false,
};

// 深色主題
export const darkTheme: Theme = {
  colors: darkColors,
  typography,
  spacing,
  borderRadius,
  shadows,
  dark: true,
};

// 預設主題
export const defaultTheme = lightTheme; 