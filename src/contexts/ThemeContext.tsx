import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, Theme } from '@/constants/theme';
import type { ThemeContextType } from '@/types/global';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeSetting, setThemeSetting] = useState<'light' | 'dark' | 'auto'>('auto');
  const [theme, setTheme] = useState<Theme>(lightTheme);

  // 載入儲存的主題設定
  useEffect(() => {
    const loadThemeSettings = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
          setThemeSetting(savedTheme as 'light' | 'dark' | 'auto');
        }
      } catch (error) {
        console.error('載入主題設定失敗:', error);
      }
    };

    loadThemeSettings();
  }, []);

  // 根據設定和系統主題更新當前主題
  useEffect(() => {
    let currentTheme: Theme;

    switch (themeSetting) {
      case 'light':
        currentTheme = lightTheme;
        break;
      case 'dark':
        currentTheme = darkTheme;
        break;
      case 'auto':
      default:
        currentTheme = systemColorScheme === 'dark' ? darkTheme : lightTheme;
        break;
    }

    setTheme(currentTheme);
  }, [themeSetting, systemColorScheme]);

  // 儲存主題設定
  const saveThemeSettings = async (newTheme: 'light' | 'dark' | 'auto') => {
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('儲存主題設定失敗:', error);
    }
  };

  // 切換主題
  const toggleTheme = () => {
    const newTheme = theme.dark ? 'light' : 'dark';
    setThemeSetting(newTheme);
    saveThemeSettings(newTheme);
  };

  // 設定主題
  const setThemeMode = (newTheme: 'light' | 'dark' | 'auto') => {
    setThemeSetting(newTheme);
    saveThemeSettings(newTheme);
  };

  const contextValue: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme: setThemeMode,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext };

// 自訂 Hook 供組件使用
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 