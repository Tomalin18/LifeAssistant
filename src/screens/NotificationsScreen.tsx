import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Card } from '@/components/common/Card/Card';

export const NotificationsScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.light }]}>
      <View style={[styles.header, { paddingHorizontal: theme.spacing.md }]}>
        <Text style={[styles.title, {
          fontSize: theme.typography.fontSizes.xxl,
          fontWeight: theme.typography.fontWeights.bold,
          color: theme.colors.text.primary,
        }]}>
          通知
        </Text>
      </View>

      <View style={[styles.content, { paddingHorizontal: theme.spacing.md }]}>
        <Card padding="large" style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 64, marginBottom: theme.spacing.md }}>🔔</Text>
          <Text style={[styles.emptyTitle, {
            fontSize: theme.typography.fontSizes.lg,
            fontWeight: theme.typography.fontWeights.semibold,
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.sm,
          }]}>
            暫無通知
          </Text>
          <Text style={[styles.emptySubtitle, {
            fontSize: theme.typography.fontSizes.md,
            color: theme.colors.text.secondary,
            textAlign: 'center',
          }]}>
            我們會在這裡顯示重要的提醒和通知
          </Text>
        </Card>
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