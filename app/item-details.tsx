
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';

// Mock data - in a real app, this would come from a database
const mockItems = {
  '1': {
    id: '1',
    name: 'Blue Denim Jacket',
    description: 'Classic blue denim jacket, perfect for casual wear. Made from high-quality cotton denim with a comfortable fit.',
    category: 'Outerwear',
    color: 'Blue',
    dateAdded: '2024-01-15',
    imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
    nfcTagId: 'nfc_001',
    lastWorn: '2024-01-20',
    timesWorn: 5,
  },
  '2': {
    id: '2',
    name: 'White Cotton T-Shirt',
    description: 'Comfortable white cotton t-shirt, perfect for everyday wear.',
    category: 'Tops',
    color: 'White',
    dateAdded: '2024-01-10',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    lastWorn: '2024-01-18',
    timesWorn: 8,
  },
  '3': {
    id: '3',
    name: 'Black Dress Pants',
    description: 'Formal black dress pants for office wear. Tailored fit with wrinkle-resistant fabric.',
    category: 'Bottoms',
    color: 'Black',
    dateAdded: '2024-01-08',
    imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
    lastWorn: '2024-01-19',
    timesWorn: 3,
  },
};

export default function ItemDetailsScreen() {
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const [item, setItem] = useState(mockItems[itemId as keyof typeof mockItems]);

  if (!item) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Item Not Found',
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
          }}
        />
        <View style={[commonStyles.container, commonStyles.centerContent]}>
          <Text style={commonStyles.text}>Item not found</Text>
        </View>
      </>
    );
  }

  const handleEdit = () => {
    Alert.alert('Edit Item', 'Edit functionality would be implemented here.');
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item from your wardrobe?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            console.log('Deleting item:', item.id);
            router.back();
          },
        },
      ]
    );
  };

  const markAsWorn = () => {
    const today = new Date().toISOString().split('T')[0];
    setItem(prev => ({
      ...prev,
      lastWorn: today,
      timesWorn: prev.timesWorn + 1,
    }));
    Alert.alert('Updated', 'Item marked as worn today!');
  };

  const renderHeaderRight = () => (
    <TouchableOpacity onPress={handleEdit} style={styles.headerButton}>
      <IconSymbol name="pencil" color={colors.primary} size={20} />
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: item.name,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerRight: renderHeaderRight,
        }}
      />
      <View style={commonStyles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Image Section */}
          <View style={styles.imageSection}>
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
            ) : (
              <View style={[styles.itemImage, styles.placeholderImage]}>
                <IconSymbol name="tshirt" size={60} color={colors.textSecondary} />
              </View>
            )}
            {item.nfcTagId && (
              <View style={styles.nfcBadge}>
                <IconSymbol name="wave.3.right" size={16} color={colors.card} />
                <Text style={styles.nfcBadgeText}>NFC</Text>
              </View>
            )}
          </View>

          {/* Item Info */}
          <View style={styles.infoSection}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>

            {/* Details Grid */}
            <View style={styles.detailsGrid}>
              <View style={styles.detailCard}>
                <IconSymbol name="tag" size={20} color={colors.primary} />
                <Text style={styles.detailLabel}>Category</Text>
                <Text style={styles.detailValue}>{item.category}</Text>
              </View>

              <View style={styles.detailCard}>
                <IconSymbol name="paintbrush" size={20} color={colors.primary} />
                <Text style={styles.detailLabel}>Color</Text>
                <Text style={styles.detailValue}>{item.color}</Text>
              </View>

              <View style={styles.detailCard}>
                <IconSymbol name="calendar" size={20} color={colors.primary} />
                <Text style={styles.detailLabel}>Added</Text>
                <Text style={styles.detailValue}>{item.dateAdded}</Text>
              </View>

              <View style={styles.detailCard}>
                <IconSymbol name="clock" size={20} color={colors.primary} />
                <Text style={styles.detailLabel}>Times Worn</Text>
                <Text style={styles.detailValue}>{item.timesWorn}</Text>
              </View>
            </View>

            {/* Last Worn */}
            {item.lastWorn && (
              <View style={styles.lastWornSection}>
                <Text style={styles.lastWornLabel}>Last worn on:</Text>
                <Text style={styles.lastWornDate}>{item.lastWorn}</Text>
              </View>
            )}

            {/* NFC Tag Info */}
            {item.nfcTagId && (
              <View style={styles.nfcSection}>
                <Text style={styles.sectionTitle}>NFC Tag</Text>
                <View style={styles.nfcInfo}>
                  <IconSymbol name="wave.3.right" size={20} color={colors.accent} />
                  <Text style={styles.nfcTagId}>ID: {item.nfcTagId}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <TouchableOpacity style={styles.wornButton} onPress={markAsWorn}>
              <IconSymbol name="checkmark.circle" size={20} color={colors.card} />
              <Text style={styles.wornButtonText}>Mark as Worn</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <IconSymbol name="trash" size={20} color={colors.card} />
              <Text style={styles.deleteButtonText}>Delete Item</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  imageSection: {
    alignItems: 'center',
    padding: 20,
    position: 'relative',
  },
  itemImage: {
    width: 250,
    height: 250,
    borderRadius: 16,
  },
  placeholderImage: {
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nfcBadge: {
    position: 'absolute',
    top: 30,
    right: 30,
    backgroundColor: colors.accent,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  nfcBadgeText: {
    color: colors.card,
    fontSize: 12,
    fontWeight: '600',
  },
  infoSection: {
    padding: 20,
  },
  itemName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 24,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  detailCard: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  lastWornSection: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  lastWornLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  lastWornDate: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  nfcSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  nfcInfo: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  nfcTagId: {
    fontSize: 16,
    color: colors.text,
    fontFamily: 'monospace',
  },
  actionSection: {
    padding: 20,
    gap: 12,
  },
  wornButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  wornButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  deleteButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '600',
  },
  headerButton: {
    padding: 8,
  },
});
