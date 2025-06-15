import { useColorScheme } from 'react-native';
import { useTheme as useThemeContext } from '@/contexts/ThemeContext';
import { lightTheme, darkTheme } from '@/constants/theme';
import type { Theme } from '@/constants/theme';

export const useTheme = () => {
  return useThemeContext();
};

export const useSystemTheme = (): Theme => {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? darkTheme : lightTheme;
};

export const useResponsiveTheme = () => {
  const themeContext = useTheme();
  const systemTheme = useSystemTheme();
  
  // 如果用戶選擇了自動模式，使用系統主題
  const currentTheme = themeContext.theme;
  
  return {
    theme: currentTheme,
    systemTheme,
    isSystemDark: systemTheme.dark,
    colors: currentTheme.colors,
    typography: currentTheme.typography,
    spacing: currentTheme.spacing,
    borderRadius: currentTheme.borderRadius,
    shadows: currentTheme.shadows,
  };
}; 