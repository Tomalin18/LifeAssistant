import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Expense, ExpenseCategory } from '../types/global';
import { useTheme } from '../contexts/ThemeContext';
import { formatDistanceToNow } from 'date-fns';
import { zhTW } from 'date-fns/locale';

interface ExpenseCardProps {
  expense: Expense;
  onPress?: () => void;
  onLongPress?: () => void;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  onPress,
  onLongPress,
}) => {
  const { theme } = useTheme();

  const getCategoryIcon = (category: ExpenseCategory): string => {
    const icons = {
      food: '🍽️',
      shopping: '🛍️',
      transport: '🚗',
      entertainment: '🎬',
      healthcare: '🏥',
      utilities: '💡',
      education: '📚',
      other: '📄',
    };
    return icons[category];
  };

  const getCategoryName = (category: ExpenseCategory): string => {
    const names = {
      food: '餐飲',
      shopping: '購物',
      transport: '交通',
      entertainment: '娛樂',
      healthcare: '醫療',
      utilities: '生活費用',
      education: '教育',
      other: '其他',
    };
    return names[category];
  };

  const getPaymentMethodName = (method: string): string => {
    const names = {
      cash: '現金',
      credit_card: '信用卡',
      debit_card: '金融卡',
      mobile_payment: '行動支付',
      bank_transfer: '銀行轉帳',
    };
    return names[method as keyof typeof names] || method;
  };

  const handleLongPress = () => {
    Alert.alert(
      '操作選項',
      '選擇要進行的操作',
      [
        { text: '取消', style: 'cancel' },
        { text: '編輯', onPress: onPress },
        { text: '刪除', style: 'destructive', onPress: onLongPress },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface.light,
      borderRadius: 12,
      padding: 16,
      marginVertical: 6,
      marginHorizontal: 16,
      shadowColor: theme.colors.text.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.colors.text.disabled,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    titleContainer: {
      flex: 1,
      marginRight: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    categoryContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    categoryIcon: {
      fontSize: 16,
      marginRight: 6,
    },
    categoryText: {
      fontSize: 14,
      color: theme.colors.text.secondary,
    },
    amountContainer: {
      alignItems: 'flex-end',
    },
    amount: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: 2,
    },
    paymentMethod: {
      fontSize: 12,
      color: theme.colors.text.secondary,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: theme.colors.text.disabled,
    },
    date: {
      fontSize: 12,
      color: theme.colors.text.secondary,
    },
    location: {
      fontSize: 12,
      color: theme.colors.text.secondary,
      fontStyle: 'italic',
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 8,
    },
    tag: {
      backgroundColor: theme.colors.primaryLight,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 12,
      marginRight: 6,
      marginBottom: 4,
    },
    tagText: {
      fontSize: 10,
      color: theme.colors.primary,
      fontWeight: '500',
    },
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      onLongPress={handleLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{expense.title}</Text>
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryIcon}>
              {getCategoryIcon(expense.category)}
            </Text>
            <Text style={styles.categoryText}>
              {getCategoryName(expense.category)}
            </Text>
          </View>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.amount}>NT$ {expense.amount.toLocaleString()}</Text>
          <Text style={styles.paymentMethod}>
            {getPaymentMethodName(expense.paymentMethod)}
          </Text>
        </View>
      </View>

      {expense.description && (
        <Text style={[styles.categoryText, { marginBottom: 8 }]}>
          {expense.description}
        </Text>
      )}

      {expense.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {expense.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.date}>
          {formatDistanceToNow(new Date(expense.date), {
            addSuffix: true,
            locale: zhTW,
          })}
        </Text>
        {expense.location && (
          <Text style={styles.location}>📍 {expense.location}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ExpenseCard; 