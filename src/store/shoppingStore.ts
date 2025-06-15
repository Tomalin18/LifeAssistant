import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ShoppingList, ShoppingItem, Receipt } from '@/types/global';

// 生成 UUID 的簡單函數
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 購物狀態管理
class ShoppingStore {
  private listeners: Set<() => void> = new Set();
  
  public state = {
    lists: [] as ShoppingList[],
    currentList: null as ShoppingList | null,
    receipts: [] as Receipt[],
    isLoading: false,
    error: null as string | null,
  };

  // 通知所有監聽者狀態變更
  private notify = () => {
    this.listeners.forEach(listener => listener());
  };

  // 訂閱狀態變更
  public subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  // 載入數據
  public loadData = async () => {
    try {
      this.state.isLoading = true;
      this.notify();

      const listsData = await AsyncStorage.getItem('shopping-lists');
      const receiptsData = await AsyncStorage.getItem('shopping-receipts');

      if (listsData) {
        const lists = JSON.parse(listsData);
                 this.state.lists = lists.map((list: any) => ({
           ...list,
           createdAt: new Date(list.createdAt),
           updatedAt: new Date(list.updatedAt),
           items: list.items.map((item: any) => ({
             ...item,
             addedAt: new Date(item.addedAt),
             completedAt: item.completedAt ? new Date(item.completedAt) : null,
           })),
         }));
      }

      if (receiptsData) {
        const receipts = JSON.parse(receiptsData);
        this.state.receipts = receipts.map((receipt: any) => ({
          ...receipt,
          date: new Date(receipt.date),
                     items: receipt.items.map((item: any) => ({
             ...item,
             addedAt: new Date(item.addedAt),
             completedAt: item.completedAt ? new Date(item.completedAt) : null,
           })),
        }));
      }

      this.state.isLoading = false;
      this.state.error = null;
      this.notify();
    } catch (error) {
      this.state.isLoading = false;
      this.state.error = '載入數據失敗';
      this.notify();
    }
  };

  // 保存數據
  private saveData = async () => {
    try {
      await AsyncStorage.setItem('shopping-lists', JSON.stringify(this.state.lists));
      await AsyncStorage.setItem('shopping-receipts', JSON.stringify(this.state.receipts));
    } catch (error) {
      console.error('保存數據失敗:', error);
    }
  };

  // 購物清單操作
  public createList = (name: string) => {
    const newList: ShoppingList = {
      id: generateId(),
      name,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.state.lists.push(newList);
    this.saveData();
    this.notify();
  };

  public deleteList = (listId: string) => {
    const index = this.state.lists.findIndex(list => list.id === listId);
    if (index !== -1) {
      this.state.lists.splice(index, 1);
      if (this.state.currentList?.id === listId) {
        this.state.currentList = null;
      }
      this.saveData();
      this.notify();
    }
  };

  public updateList = (listId: string, updates: Partial<ShoppingList>) => {
    const list = this.state.lists.find(l => l.id === listId);
    if (list) {
      Object.assign(list, updates, { updatedAt: new Date() });
      if (this.state.currentList?.id === listId) {
        Object.assign(this.state.currentList, updates, { updatedAt: new Date() });
      }
      this.saveData();
      this.notify();
    }
  };

  public setCurrentList = (listId: string | null) => {
    if (listId) {
      const list = this.state.lists.find(l => l.id === listId);
      this.state.currentList = list || null;
    } else {
      this.state.currentList = null;
    }
    this.notify();
  };

  // 購物項目操作
  public addItem = (listId: string, item: Omit<ShoppingItem, 'id' | 'addedAt'>) => {
    const list = this.state.lists.find(l => l.id === listId);
    if (list) {
      const newItem: ShoppingItem = {
        ...item,
        id: generateId(),
        addedAt: new Date(),
      };
      
      list.items.push(newItem);
      list.updatedAt = new Date();
      
      if (this.state.currentList?.id === listId) {
        this.state.currentList.items.push(newItem);
        this.state.currentList.updatedAt = new Date();
      }
      
      this.saveData();
      this.notify();
    }
  };

  public toggleItemCompleted = (listId: string, itemId: string) => {
    const list = this.state.lists.find(l => l.id === listId);
    if (list) {
      const item = list.items.find(i => i.id === itemId);
      if (item) {
        item.completed = !item.completed;
                 item.completedAt = item.completed ? new Date() : null;
        list.updatedAt = new Date();
        
        if (this.state.currentList?.id === listId) {
          const currentItem = this.state.currentList.items.find(i => i.id === itemId);
          if (currentItem) {
            currentItem.completed = item.completed;
            currentItem.completedAt = item.completedAt;
            this.state.currentList.updatedAt = new Date();
          }
        }
        
        this.saveData();
        this.notify();
      }
    }
  };

  public deleteItem = (listId: string, itemId: string) => {
    const list = this.state.lists.find(l => l.id === listId);
    if (list) {
      const index = list.items.findIndex(i => i.id === itemId);
      if (index !== -1) {
        list.items.splice(index, 1);
        list.updatedAt = new Date();
        
        if (this.state.currentList?.id === listId) {
          const currentIndex = this.state.currentList.items.findIndex(i => i.id === itemId);
          if (currentIndex !== -1) {
            this.state.currentList.items.splice(currentIndex, 1);
            this.state.currentList.updatedAt = new Date();
          }
        }
        
        this.saveData();
        this.notify();
      }
    }
  };

  // 獲取統計信息
  public getListStats = (listId: string) => {
    const list = this.state.lists.find(l => l.id === listId);
    
    if (!list) {
      return { totalItems: 0, completedItems: 0, estimatedTotal: 0 };
    }
    
    const totalItems = list.items.length;
    const completedItems = list.items.filter(item => item.completed).length;
    const estimatedTotal = list.items.reduce((sum, item) => {
      return sum + (item.price || 0) * item.quantity;
    }, 0);
    
    return { totalItems, completedItems, estimatedTotal };
  };

  // 獲取建議
  public getSuggestions = (): string[] => {
    const itemFrequency: { [key: string]: number } = {};
    
    this.state.lists.forEach(list => {
      list.items.forEach(item => {
        const key = item.name.toLowerCase().trim();
        itemFrequency[key] = (itemFrequency[key] || 0) + 1;
      });
    });
    
    return Object.entries(itemFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name]) => name);
  };

  // 清除錯誤
  public clearError = () => {
    this.state.error = null;
    this.notify();
  };
}

// 創建單例
const shoppingStore = new ShoppingStore();

// React Hook
export const useShoppingStore = () => {
  const [, forceUpdate] = useState({});
  
     useEffect(() => {
     const unsubscribe = shoppingStore.subscribe(() => {
       forceUpdate({});
     });
     
     // 初始化載入數據
     shoppingStore.loadData();
     
     return () => {
       unsubscribe();
     };
   }, []);

  return {
    // 狀態
    lists: shoppingStore.state.lists,
    currentList: shoppingStore.state.currentList,
    receipts: shoppingStore.state.receipts,
    isLoading: shoppingStore.state.isLoading,
    error: shoppingStore.state.error,

    // 操作
    createList: shoppingStore.createList,
    deleteList: shoppingStore.deleteList,
    updateList: shoppingStore.updateList,
    setCurrentList: shoppingStore.setCurrentList,
    addItem: shoppingStore.addItem,
    toggleItemCompleted: shoppingStore.toggleItemCompleted,
    deleteItem: shoppingStore.deleteItem,
    getListStats: shoppingStore.getListStats,
    getSuggestions: shoppingStore.getSuggestions,
    clearError: shoppingStore.clearError,
  };
}; 