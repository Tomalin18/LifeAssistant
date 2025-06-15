import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Card } from '@/components/common/Card/Card';
import { Button } from '@/components/common/Button/Button';

export const ProfileScreen: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const profileSections = [
    {
      title: '個人設定',
      items: [
        { label: '編輯個人資料', icon: '👤', onPress: () => console.log('Edit Profile') },
        { label: '通知設定', icon: '🔔', onPress: () => console.log('Notification Settings') },
        { label: '隱私設定', icon: '🔒', onPress: () => console.log('Privacy Settings') },
      ],
    },
    {
      title: '應用程式',
      items: [
        { label: '主題切換', icon: '🎨', onPress: handleThemeToggle },
        { label: '語言設定', icon: '🌐', onPress: () => console.log('Language Settings') },
        { label: '關於我們', icon: 'ℹ️', onPress: () => console.log('About') },
      ],
    },
    {
      title: '數據管理',
      items: [
        { label: '匯出數據', icon: '📤', onPress: () => console.log('Export Data') },
        { label: '清除緩存', icon: '🗑️', onPress: () => console.log('Clear Cache') },
        { label: '重置應用', icon: '🔄', onPress: () => console.log('Reset App') },
      ],
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.light }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 頭像和名稱 */}
        <View style={[styles.header, { paddingHorizontal: theme.spacing.md }]}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={[styles.name, {
            fontSize: theme.typography.fontSizes.xxl,
            fontWeight: theme.typography.fontWeights.bold,
            color: theme.colors.text.primary,
            marginTop: theme.spacing.md,
          }]}>
            使用者
          </Text>
          <Text style={[styles.email, {
            fontSize: theme.typography.fontSizes.md,
            color: theme.colors.text.secondary,
            marginTop: theme.spacing.xs,
          }]}>
            user@example.com
          </Text>
        </View>

        {/* 設定選項 */}
        <View style={[styles.content, { paddingHorizontal: theme.spacing.md }]}>
          {profileSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={{ marginBottom: theme.spacing.lg }}>
              <Text style={[styles.sectionTitle, {
                fontSize: theme.typography.fontSizes.lg,
                fontWeight: theme.typography.fontWeights.semibold,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing.md,
              }]}>
                {section.title}
              </Text>
              
              <Card padding="none">
                {section.items.map((item, itemIndex) => (
                  <TouchableOpacity
                    key={itemIndex}
                    style={[
                      styles.menuItem,
                      {
                        borderBottomWidth: itemIndex < section.items.length - 1 ? 1 : 0,
                        borderBottomColor: theme.colors.text.disabled,
                        paddingVertical: theme.spacing.md,
                        paddingHorizontal: theme.spacing.lg,
                      },
                    ]}
                    onPress={item.onPress}
                    activeOpacity={0.7}
                  >
                    <View style={styles.menuItemLeft}>
                      <Text style={styles.menuIcon}>{item.icon}</Text>
                      <Text style={[styles.menuLabel, {
                        fontSize: theme.typography.fontSizes.md,
                        color: theme.colors.text.primary,
                        marginLeft: theme.spacing.md,
                      }]}>
                        {item.label}
                      </Text>
                    </View>
                    <Text style={[styles.menuArrow, {
                      color: theme.colors.text.secondary,
                    }]}>
                      ›
                    </Text>
                  </TouchableOpacity>
                ))}
              </Card>
            </View>
          ))}
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
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
  },
  name: {
    // 動態樣式在組件中定義
  },
  email: {
    // 動態樣式在組件中定義
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    // 動態樣式在組件中定義
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    fontSize: 20,
  },
  menuLabel: {
    // 動態樣式在組件中定義
  },
  menuArrow: {
    fontSize: 20,
    fontWeight: 'bold',
  },
}); 