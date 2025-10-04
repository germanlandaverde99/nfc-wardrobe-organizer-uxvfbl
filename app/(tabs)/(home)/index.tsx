
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  Image,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';

export type LocationStatus = 'in-wardrobe' | 'out-of-wardrobe' | 'laundry';

interface ClothingItem {
  id: string;
  name: string;
  description: string;
  category: string;
  color: string;
  nfcTagId?: string;
  imageUrl?: string;
  dateAdded: string;
  locationStatus: LocationStatus;
  timesWorn?: number;
  lastWorn?: string;
}

export default function WardrobeScreen() {
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([
    {
      id: '1',
      name: 'Blue Denim Jacket',
      description: 'Classic blue denim jacket, perfect for casual wear',
      category: 'Outerwear',
      color: 'Blue',
      dateAdded: '2024-01-15',
      imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop',
      locationStatus: 'in-wardrobe',
      timesWorn: 5,
      lastWorn: '2024-01-20',
    },
    {
      id: '2',
      name: 'White Cotton T-Shirt',
      description: 'Comfortable white cotton t-shirt',
      category: 'Tops',
      color: 'White',
      dateAdded: '2024-01-10',
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
      locationStatus: 'out-of-wardrobe',
      timesWorn: 8,
      lastWorn: '2024-01-18',
    },
    {
      id: '3',
      name: 'Black Dress Pants',
      description: 'Formal black dress pants for office wear',
      category: 'Bottoms',
      color: 'Black',
      dateAdded: '2024-01-08',
      imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop',
      locationStatus: 'laundry',
      timesWorn: 3,
      lastWorn: '2024-01-19',
    },
  ]);
  const [isNfcSupported, setIsNfcSupported] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<LocationStatus | 'all'>('all');

  useEffect(() => {
    checkNfcSupport();
    return () => {
      NfcManager.stop();
    };
  }, []);

  const checkNfcSupport = async () => {
    try {
      const supported = await NfcManager.isSupported();
      setIsNfcSupported(supported);
      if (supported) {
        await NfcManager.start();
        console.log('NFC Manager started successfully');
      }
    } catch (error) {
      console.log('NFC not supported or failed to start:', error);
      setIsNfcSupported(false);
    }
  };

  const scanNfcTag = async () => {
    if (!isNfcSupported) {
      Alert.alert('NFC Not Supported', 'Your device does not support NFC functionality.');
      return;
    }

    try {
      setIsScanning(true);
      await NfcManager.requestTechnology(NfcTech.Ndef);
      
      const tag = await NfcManager.getTag();
      console.log('NFC Tag detected:', tag);
      
      if (tag && tag.id) {
        // Check if this tag is already associated with an item
        const existingItem = clothingItems.find(item => item.nfcTagId === tag.id);
        
        if (existingItem) {
          Alert.alert(
            'Item Found!',
            `This NFC tag is associated with: ${existingItem.name}`,
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert(
            'New NFC Tag Detected',
            'Would you like to associate this tag with a new clothing item?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Add Item', onPress: () => addNewItem(tag.id) }
            ]
          );
        }
      }
    } catch (error) {
      console.log('NFC scan error:', error);
      Alert.alert('Scan Failed', 'Failed to scan NFC tag. Please try again.');
    } finally {
      setIsScanning(false);
      NfcManager.cancelTechnologyRequest();
    }
  };

  const addNewItem = (nfcTagId?: string) => {
    router.push({
      pathname: '/add-item',
      params: { nfcTagId: nfcTagId || '' }
    });
  };

  const getLocationIcon = (status: LocationStatus) => {
    switch (status) {
      case 'in-wardrobe':
        return 'house';
      case 'out-of-wardrobe':
        return 'figure.walk';
      case 'laundry':
        return 'drop';
      default:
        return 'questionmark';
    }
  };

  const getLocationColor = (status: LocationStatus) => {
    switch (status) {
      case 'in-wardrobe':
        return '#4CAF50'; // Green
      case 'out-of-wardrobe':
        return '#FF9800'; // Orange
      case 'laundry':
        return '#2196F3'; // Blue
      default:
        return colors.textSecondary;
    }
  };

  const getLocationLabel = (status: LocationStatus) => {
    switch (status) {
      case 'in-wardrobe':
        return 'In Wardrobe';
      case 'out-of-wardrobe':
        return 'Out of Wardrobe';
      case 'laundry':
        return 'In Laundry';
      default:
        return 'Unknown';
    }
  };

  const filteredItems = selectedFilter === 'all' 
    ? clothingItems 
    : clothingItems.filter(item => item.locationStatus === selectedFilter);

  const renderClothingItem = (item: ClothingItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.itemCard}
      onPress={() => router.push({
        pathname: '/item-details',
        params: { itemId: item.id }
      })}
    >
      <View style={styles.itemImageContainer}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
        ) : (
          <View style={[styles.itemImage, styles.placeholderImage]}>
            <IconSymbol name="tshirt" size={40} color={colors.textSecondary} />
          </View>
        )}
        {item.nfcTagId && (
          <View style={styles.nfcBadge}>
            <IconSymbol name="wave.3.right" size={12} color={colors.card} />
          </View>
        )}
        <View style={[styles.locationBadge, { backgroundColor: getLocationColor(item.locationStatus) }]}>
          <IconSymbol name={getLocationIcon(item.locationStatus)} size={12} color={colors.card} />
        </View>
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
        <Text style={styles.itemColor}>{item.color}</Text>
        <Text style={[styles.locationStatus, { color: getLocationColor(item.locationStatus) }]}>
          {getLocationLabel(item.locationStatus)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderHeaderRight = () => (
    <TouchableOpacity
      onPress={() => addNewItem()}
      style={styles.headerButton}
    >
      <IconSymbol name="plus" color={colors.primary} size={24} />
    </TouchableOpacity>
  );

  const renderLocationFilter = () => (
    <View style={styles.filterSection}>
      <Text style={styles.sectionTitle}>Filter by Location</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'all' && styles.filterButtonActive
          ]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text style={[
            styles.filterButtonText,
            selectedFilter === 'all' && styles.filterButtonTextActive
          ]}>
            All ({clothingItems.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'in-wardrobe' && styles.filterButtonActive,
            { borderColor: getLocationColor('in-wardrobe') }
          ]}
          onPress={() => setSelectedFilter('in-wardrobe')}
        >
          <IconSymbol name={getLocationIcon('in-wardrobe')} size={16} color={
            selectedFilter === 'in-wardrobe' ? colors.card : getLocationColor('in-wardrobe')
          } />
          <Text style={[
            styles.filterButtonText,
            selectedFilter === 'in-wardrobe' && styles.filterButtonTextActive
          ]}>
            In Wardrobe ({clothingItems.filter(item => item.locationStatus === 'in-wardrobe').length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'out-of-wardrobe' && styles.filterButtonActive,
            { borderColor: getLocationColor('out-of-wardrobe') }
          ]}
          onPress={() => setSelectedFilter('out-of-wardrobe')}
        >
          <IconSymbol name={getLocationIcon('out-of-wardrobe')} size={16} color={
            selectedFilter === 'out-of-wardrobe' ? colors.card : getLocationColor('out-of-wardrobe')
          } />
          <Text style={[
            styles.filterButtonText,
            selectedFilter === 'out-of-wardrobe' && styles.filterButtonTextActive
          ]}>
            Out ({clothingItems.filter(item => item.locationStatus === 'out-of-wardrobe').length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'laundry' && styles.filterButtonActive,
            { borderColor: getLocationColor('laundry') }
          ]}
          onPress={() => setSelectedFilter('laundry')}
        >
          <IconSymbol name={getLocationIcon('laundry')} size={16} color={
            selectedFilter === 'laundry' ? colors.card : getLocationColor('laundry')
          } />
          <Text style={[
            styles.filterButtonText,
            selectedFilter === 'laundry' && styles.filterButtonTextActive
          ]}>
            Laundry ({clothingItems.filter(item => item.locationStatus === 'laundry').length})
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'My Wardrobe',
          headerRight: renderHeaderRight,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
        }}
      />
      <View style={[commonStyles.container]}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* NFC Scan Section */}
          <View style={styles.scanSection}>
            <Text style={styles.sectionTitle}>Quick Scan</Text>
            <TouchableOpacity
              style={[
                styles.scanButton,
                isScanning && styles.scanButtonActive,
                !isNfcSupported && styles.scanButtonDisabled
              ]}
              onPress={scanNfcTag}
              disabled={isScanning || !isNfcSupported}
            >
              <IconSymbol 
                name={isScanning ? "wave.3.right" : "wave.3.right"} 
                size={24} 
                color={colors.card} 
              />
              <Text style={styles.scanButtonText}>
                {isScanning ? 'Scanning...' : 'Scan NFC Tag'}
              </Text>
            </TouchableOpacity>
            {!isNfcSupported && (
              <Text style={styles.nfcWarning}>
                NFC is not supported on this device
              </Text>
            )}
          </View>

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{clothingItems.length}</Text>
              <Text style={styles.statLabel}>Total Items</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {clothingItems.filter(item => item.locationStatus === 'in-wardrobe').length}
              </Text>
              <Text style={styles.statLabel}>In Wardrobe</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {clothingItems.filter(item => item.locationStatus === 'out-of-wardrobe').length}
              </Text>
              <Text style={styles.statLabel}>Outside Wardrobe</Text>
            </View>
          </View>

          {/* Location Filter */}
          {renderLocationFilter()}

          {/* Clothing Items Grid */}
          <View style={styles.itemsSection}>
            <Text style={styles.sectionTitle}>
              {selectedFilter === 'all' ? 'Your Clothes' : `${getLocationLabel(selectedFilter as LocationStatus)} Items`}
            </Text>
            <View style={styles.itemsGrid}>
              {filteredItems.map(renderClothingItem)}
            </View>
            {filteredItems.length === 0 && (
              <View style={styles.emptyState}>
                <IconSymbol name="tshirt" size={60} color={colors.textSecondary} />
                <Text style={styles.emptyStateText}>
                  No items found in this location
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
  },
  scanSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  scanButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  scanButtonActive: {
    backgroundColor: colors.accent,
  },
  scanButtonDisabled: {
    backgroundColor: colors.textSecondary,
  },
  scanButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '600',
  },
  nfcWarning: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterScroll: {
    flexGrow: 0,
  },
  filterButton: {
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: colors.card,
  },
  itemsSection: {
    marginBottom: 100, // Extra space for floating tab bar
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    width: '48%',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  itemImageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  itemImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  placeholderImage: {
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nfcBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.accent,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {
    gap: 2,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  itemCategory: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  itemColor: {
    fontSize: 12,
    color: colors.primary,
  },
  locationStatus: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  headerButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    color: colors.textSecondary,
    fontSize: 16,
    marginTop: 12,
  },
});
