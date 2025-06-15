import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useShoppingStore } from '@/store/shoppingStore';
import { Card, ShoppingItemCard } from '@/components/common/Card/Card';
import { Button } from '@/components/common/Button/Button';

export const ShoppingListScreen: React.FC = () => {
  const { theme } = useTheme();
  const shoppingStore = useShoppingStore();
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('1');

  const currentList = shoppingStore.currentList || shoppingStore.lists[0];

  const handleAddItem = () => {
    if (!newItemName.trim()) {
      Alert.alert('錯誤', '請輸入商品名稱');
      return;
    }

    if (!currentList) {
      shoppingStore.createList('我的購物清單');
      const newList = shoppingStore.lists[0];
      if (newList) {
        shoppingStore.addItem(newList.id, {
          name: newItemName.trim(),
          quantity: parseInt(newItemQuantity) || 1,
          category: '其他',
          completed: false,
        });
      }
    } else {
      shoppingStore.addItem(currentList.id, {
        name: newItemName.trim(),
        quantity: parseInt(newItemQuantity) || 1,
        category: '其他',
        completed: false,
      });
    }

    setNewItemName('');
    setNewItemQuantity('1');
  };

  const handleToggleItem = (itemId: string) => {
    if (currentList) {
      shoppingStore.toggleItemCompleted(currentList.id, itemId);
    }
  };

  const handleDeleteItem = (itemId: string) => {
    if (currentList) {
      Alert.alert(
        '確認刪除',
        '確定要刪除這個項目嗎？',
        [
          { text: '取消', style: 'cancel' },
          { text: '刪除', style: 'destructive', onPress: () => {
            shoppingStore.deleteItem(currentList.id, itemId);
          }},
        ]
      );
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <ShoppingItemCard
      item={item}
      onToggle={() => handleToggleItem(item.id)}
      onDelete={() => handleDeleteItem(item.id)}
    />
  );

  const stats = currentList ? shoppingStore.getListStats(currentList.id) : { totalItems: 0, completedItems: 0, estimatedTotal: 0 };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.light }]}>
      {/* 標題和統計 */}
      <View style={[styles.header, { paddingHorizontal: theme.spacing.md }]}>
        <Text style={[styles.title, {
          fontSize: theme.typography.fontSizes.xxl,
          fontWeight: theme.typography.fontWeights.bold,
          color: theme.colors.text.primary,
        }]}>
          購物清單
        </Text>
        
        {currentList && (
          <View style={[styles.stats, { backgroundColor: theme.colors.surface.light, ...theme.shadows.small }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
                {stats.totalItems}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
                總項目
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.accent }]}>
                {stats.completedItems}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
                已完成
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.secondary }]}>
                NT$ {stats.estimatedTotal.toFixed(0)}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
                預估總額
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* 添加新項目 */}
      <View style={[styles.addSection, { paddingHorizontal: theme.spacing.md }]}>
        <Card padding="medium">
          <Text style={[styles.sectionTitle, {
            fontSize: theme.typography.fontSizes.lg,
            fontWeight: theme.typography.fontWeights.semibold,
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.md,
          }]}>
            添加新項目
          </Text>
          
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.nameInput, {
                borderColor: theme.colors.text.disabled,
                color: theme.colors.text.primary,
                backgroundColor: theme.colors.background.light,
              }]}
              placeholder="商品名稱"
              placeholderTextColor={theme.colors.text.secondary}
              value={newItemName}
              onChangeText={setNewItemName}
              onSubmitEditing={handleAddItem}
              returnKeyType="done"
            />
            
            <TextInput
              style={[styles.quantityInput, {
                borderColor: theme.colors.text.disabled,
                color: theme.colors.text.primary,
                backgroundColor: theme.colors.background.light,
              }]}
              placeholder="數量"
              placeholderTextColor={theme.colors.text.secondary}
              value={newItemQuantity}
              onChangeText={setNewItemQuantity}
              keyboardType="numeric"
              onSubmitEditing={handleAddItem}
              returnKeyType="done"
            />
            
            <Button
              title="添加"
              onPress={handleAddItem}
              size="medium"
              style={styles.addButton}
            />
          </View>
        </Card>
      </View>

      {/* 購物清單項目 */}
      <View style={[styles.listSection, { paddingHorizontal: theme.spacing.md }]}>
        {currentList && currentList.items.length > 0 ? (
          <FlatList
            data={currentList.items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
          />
        ) : (
          <Card padding="large" style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 64, marginBottom: theme.spacing.md }}>🛒</Text>
            <Text style={[styles.emptyTitle, {
              fontSize: theme.typography.fontSizes.lg,
              fontWeight: theme.typography.fontWeights.semibold,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing.sm,
            }]}>
              購物清單是空的
            </Text>
            <Text style={[styles.emptySubtitle, {
              fontSize: theme.typography.fontSizes.md,
              color: theme.colors.text.secondary,
              textAlign: 'center',
            }]}>
              開始添加您需要購買的物品吧！
            </Text>
          </Card>
        )}
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
    marginBottom: 16,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  addSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    // 動態樣式在組件中定義
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nameInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  quantityInput: {
    width: 80,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  addButton: {
    minWidth: 80,
  },
  listSection: {
    flex: 1,
  },
  emptyTitle: {
    // 動態樣式在組件中定義
  },
  emptySubtitle: {
    // 動態樣式在組件中定義
  },
}); 