import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense, Budget, ExpenseStats, ExpenseCategory, PaymentMethod } from '../types/global';

interface ExpenseState {
  expenses: Expense[];
  budgets: Budget[];
  isLoading: boolean;
  
  // Actions
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  
  // Budget actions
  addBudget: (budget: Omit<Budget, 'id' | 'spent'>) => void;
  updateBudget: (id: string, updates: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  
  // Stats
  getExpenseStats: (period?: 'week' | 'month' | 'year') => ExpenseStats;
  getCategoryExpenses: (category: ExpenseCategory) => Expense[];
  getMonthlyTotal: (year: number, month: number) => number;
  
  // Data persistence
  loadData: () => Promise<void>;
  saveData: () => Promise<void>;
}

export const useExpenseStore = create<ExpenseState>()(
  immer((set, get) => ({
    expenses: [],
    budgets: [],
    isLoading: false,

    addExpense: (expenseData) => {
      set((state) => {
        const newExpense: Expense = {
          ...expenseData,
          id: Date.now().toString(),
        };
        state.expenses.push(newExpense);
        
        // 更新相關預算的已花費金額
        const budget = state.budgets.find(b => 
          b.category === newExpense.category && b.isActive
        );
        if (budget) {
          budget.spent += newExpense.amount;
        }
      });
      get().saveData();
    },

    updateExpense: (id, updates) => {
      set((state) => {
        const expenseIndex = state.expenses.findIndex(e => e.id === id);
        if (expenseIndex !== -1 && state.expenses[expenseIndex]) {
          const oldExpense = state.expenses[expenseIndex];
          
          // 如果金額或類別改變，更新預算
          if ((updates.amount !== undefined && updates.amount !== oldExpense.amount) || 
              (updates.category !== undefined && updates.category !== oldExpense.category)) {
            // 從舊類別預算中減去舊金額
            const oldBudget = state.budgets.find(b => 
              b.category === oldExpense.category && b.isActive
            );
            if (oldBudget) {
              oldBudget.spent -= oldExpense.amount;
            }
            
            // 向新類別預算添加新金額
            const newCategory = updates.category || oldExpense.category;
            const newAmount = updates.amount !== undefined ? updates.amount : oldExpense.amount;
            const newBudget = state.budgets.find(b => 
              b.category === newCategory && b.isActive
            );
            if (newBudget) {
              newBudget.spent += newAmount;
            }
          }
          
          state.expenses[expenseIndex] = { ...oldExpense, ...updates };
        }
      });
      get().saveData();
    },

    deleteExpense: (id) => {
      set((state) => {
        const expenseIndex = state.expenses.findIndex(e => e.id === id);
        if (expenseIndex !== -1 && state.expenses[expenseIndex]) {
          const expense = state.expenses[expenseIndex];
          
          // 從預算中減去金額
          const budget = state.budgets.find(b => 
            b.category === expense.category && b.isActive
          );
          if (budget) {
            budget.spent -= expense.amount;
          }
          
          state.expenses.splice(expenseIndex, 1);
        }
      });
      get().saveData();
    },

    addBudget: (budgetData) => {
      set((state) => {
        const newBudget: Budget = {
          ...budgetData,
          id: Date.now().toString(),
          spent: 0,
        };
        state.budgets.push(newBudget);
      });
      get().saveData();
    },

    updateBudget: (id, updates) => {
      set((state) => {
        const budgetIndex = state.budgets.findIndex(b => b.id === id);
        if (budgetIndex !== -1 && state.budgets[budgetIndex]) {
          const existingBudget = state.budgets[budgetIndex];
          state.budgets[budgetIndex] = { ...existingBudget, ...updates };
        }
      });
      get().saveData();
    },

    deleteBudget: (id) => {
      set((state) => {
        const budgetIndex = state.budgets.findIndex(b => b.id === id);
        if (budgetIndex !== -1) {
          state.budgets.splice(budgetIndex, 1);
        }
      });
      get().saveData();
    },

    getExpenseStats: (period = 'month') => {
      const { expenses } = get();
      const now = new Date();
      let startDate: Date;

      switch (period) {
        case 'week':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      const filteredExpenses = expenses.filter(e => new Date(e.date) >= startDate);
      const totalSpent = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

      const categoryBreakdown: Record<ExpenseCategory, number> = {
        food: 0,
        shopping: 0,
        transport: 0,
        entertainment: 0,
        healthcare: 0,
        utilities: 0,
        education: 0,
        other: 0,
      };

      filteredExpenses.forEach(e => {
        categoryBreakdown[e.category] += e.amount;
      });

      const topCategories = Object.entries(categoryBreakdown)
        .map(([category, amount]) => ({
          category: category as ExpenseCategory,
          amount,
          percentage: totalSpent > 0 ? (amount / totalSpent) * 100 : 0,
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

      // 生成月度支出數據
      const monthlySpending: Array<{ month: string; amount: number }> = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthExpenses = expenses.filter(e => {
          const expenseDate = new Date(e.date);
          return expenseDate.getFullYear() === date.getFullYear() && 
                 expenseDate.getMonth() === date.getMonth();
        });
        const monthTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
        monthlySpending.push({
          month: date.toLocaleDateString('zh-TW', { month: 'short' }),
          amount: monthTotal,
        });
      }

      return {
        totalSpent,
        categoryBreakdown,
        monthlySpending,
        topCategories,
      };
    },

    getCategoryExpenses: (category) => {
      const { expenses } = get();
      return expenses.filter(e => e.category === category);
    },

    getMonthlyTotal: (year, month) => {
      const { expenses } = get();
      return expenses
        .filter(e => {
          const date = new Date(e.date);
          return date.getFullYear() === year && date.getMonth() === month;
        })
        .reduce((sum, e) => sum + e.amount, 0);
    },

    loadData: async () => {
      try {
        set((state) => {
          state.isLoading = true;
        });

        const [expensesData, budgetsData] = await Promise.all([
          AsyncStorage.getItem('@expenses'),
          AsyncStorage.getItem('@budgets'),
        ]);

        set((state) => {
          state.expenses = expensesData ? JSON.parse(expensesData) : [];
          state.budgets = budgetsData ? JSON.parse(budgetsData) : [];
          state.isLoading = false;
        });
      } catch (error) {
        console.error('Failed to load expense data:', error);
        set((state) => {
          state.isLoading = false;
        });
      }
    },

    saveData: async () => {
      try {
        const { expenses, budgets } = get();
        await Promise.all([
          AsyncStorage.setItem('@expenses', JSON.stringify(expenses)),
          AsyncStorage.setItem('@budgets', JSON.stringify(budgets)),
        ]);
      } catch (error) {
        console.error('Failed to save expense data:', error);
      }
    },
  }))
); 