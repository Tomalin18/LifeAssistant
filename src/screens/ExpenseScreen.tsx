import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { useExpenseStore } from '../store/expenseStore';
import ExpenseCard from '../components/ExpenseCard';
import { Expense, ExpenseCategory } from '../types/global';

const ExpenseScreen: React.FC = () => {
  const { theme } = useTheme();
  const {
    expenses,
    getExpenseStats,
    deleteExpense,
    loadData,
  } = useExpenseStore();

  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'all'>('all');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const stats = getExpenseStats(selectedPeriod);
  
  const filteredExpenses = expenses.filter(expense => 
    selectedCategory === 'all' || expense.category === selectedCategory
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleDeleteExpense = (id: string) => {
    Alert.alert(
      '確認刪除',
      '確定要刪除這筆支出記錄嗎？',
      [
        { text: '取消', style: 'cancel' },
        { text: '刪除', style: 'destructive', onPress: () => deleteExpense(id) },
      ]
    );
  };

  const PeriodSelector = () => (
    <View style={styles.periodSelector}>
      {(['week', 'month', 'year'] as const).map((period) => (
        <TouchableOpacity
          key={period}
          style={[
            styles.periodButton,
            selectedPeriod === period && styles.periodButtonActive,
          ]}
          onPress={() => setSelectedPeriod(period)}
        >
          <Text style={[
            styles.periodButtonText,
            selectedPeriod === period && styles.periodButtonTextActive,
          ]}>
            {period === 'week' ? '本週' : period === 'month' ? '本月' : '本年'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const CategoryFilter = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.categoryFilter}
      contentContainerStyle={styles.categoryFilterContent}
    >
      {(['all', 'food', 'shopping', 'transport', 'entertainment', 'healthcare', 'utilities', 'education', 'other'] as const).map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryButton,
            selectedCategory === category && styles.categoryButtonActive,
          ]}
          onPress={() => setSelectedCategory(category)}
        >
          <Text style={[
            styles.categoryButtonText,
            selectedCategory === category && styles.categoryButtonTextActive,
          ]}>
            {category === 'all' ? '全部' :
             category === 'food' ? '餐飲' :
             category === 'shopping' ? '購物' :
             category === 'transport' ? '交通' :
             category === 'entertainment' ? '娛樂' :
             category === 'healthcare' ? '醫療' :
             category === 'utilities' ? '生活費用' :
             category === 'education' ? '教育' : '其他'}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const StatsCard = () => (
    <View style={styles.statsCard}>
      <View style={styles.statsHeader}>
        <Text style={styles.statsTitle}>支出統計</Text>
        <Text style={styles.totalAmount}>
          NT$ {stats.totalSpent.toLocaleString()}
        </Text>
      </View>
      
      <View style={styles.categoryStats}>
        {stats.topCategories.slice(0, 3).map((item, index) => (
          <View key={item.category} style={styles.categoryStatItem}>
            <View style={styles.categoryStatInfo}>
              <Text style={styles.categoryStatName}>
                {item.category === 'food' ? '餐飲' :
                 item.category === 'shopping' ? '購物' :
                 item.category === 'transport' ? '交通' :
                 item.category === 'entertainment' ? '娛樂' :
                 item.category === 'healthcare' ? '醫療' :
                 item.category === 'utilities' ? '生活費用' :
                 item.category === 'education' ? '教育' : '其他'}
              </Text>
              <Text style={styles.categoryStatAmount}>
                NT$ {item.amount.toLocaleString()}
              </Text>
            </View>
            <View style={styles.categoryStatBar}>
              <View 
                style={[
                  styles.categoryStatBarFill,
                  { width: `${item.percentage}%` }
                ]}
              />
            </View>
            <Text style={styles.categoryStatPercentage}>
              {item.percentage.toFixed(1)}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.light,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: theme.colors.surface.light,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.text.disabled,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text.primary,
    },
    addButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
    },
    addButtonText: {
      color: theme.colors.text.inverse,
      fontWeight: '600',
      fontSize: 14,
    },
    periodSelector: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface.light,
      margin: 16,
      borderRadius: 12,
      padding: 4,
    },
    periodButton: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    periodButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    periodButtonText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text.secondary,
    },
    periodButtonTextActive: {
      color: theme.colors.text.inverse,
    },
    categoryFilter: {
      marginHorizontal: 16,
      marginBottom: 8,
    },
    categoryFilterContent: {
      paddingRight: 16,
    },
    categoryButton: {
      backgroundColor: theme.colors.surface.light,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 8,
      borderWidth: 1,
      borderColor: theme.colors.text.disabled,
    },
    categoryButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    categoryButtonText: {
      fontSize: 12,
      fontWeight: '500',
      color: theme.colors.text.secondary,
    },
    categoryButtonTextActive: {
      color: theme.colors.text.inverse,
    },
    statsCard: {
      backgroundColor: theme.colors.surface.light,
      margin: 16,
      borderRadius: 16,
      padding: 20,
      shadowColor: theme.colors.text.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    statsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    statsTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    totalAmount: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    categoryStats: {
      marginTop: 8,
    },
    categoryStatItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    categoryStatInfo: {
      flex: 1,
      marginRight: 12,
    },
    categoryStatName: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text.primary,
      marginBottom: 2,
    },
    categoryStatAmount: {
      fontSize: 12,
      color: theme.colors.text.secondary,
    },
    categoryStatBar: {
      flex: 2,
      height: 6,
      backgroundColor: theme.colors.text.disabled,
      borderRadius: 3,
      marginRight: 12,
    },
    categoryStatBarFill: {
      height: '100%',
      backgroundColor: theme.colors.primary,
      borderRadius: 3,
    },
    categoryStatPercentage: {
      fontSize: 12,
      fontWeight: '500',
      color: theme.colors.text.secondary,
      minWidth: 35,
      textAlign: 'right',
    },
    expensesList: {
      flex: 1,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 48,
    },
    emptyStateText: {
      fontSize: 16,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      marginTop: 16,
    },
    emptyStateEmoji: {
      fontSize: 48,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>支出追蹤</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAddModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ 記帳</Text>
        </TouchableOpacity>
      </View>

      <PeriodSelector />
      <CategoryFilter />
      <StatsCard />

      <View style={styles.expensesList}>
        {filteredExpenses.length > 0 ? (
          <FlatList
            data={filteredExpenses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ExpenseCard
                expense={item}
                onPress={() => {/* TODO: 編輯功能 */}}
                onLongPress={() => handleDeleteExpense(item.id)}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateEmoji}>💰</Text>
            <Text style={styles.emptyStateText}>
              {selectedCategory === 'all' 
                ? '還沒有支出記錄\n點擊右上角「記帳」開始記錄'
                : '此類別沒有支出記錄'
              }
            </Text>
          </View>
        )}
      </View>

      {/* TODO: 添加支出記錄的 Modal */}
    </SafeAreaView>
  );
};

export default ExpenseScreen; 