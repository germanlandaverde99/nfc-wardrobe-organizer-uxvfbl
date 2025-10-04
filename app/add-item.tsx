
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import * as ImagePicker from 'expo-image-picker';

const categories = ['Tops', 'Bottoms', 'Outerwear', 'Dresses', 'Shoes', 'Accessories'];
const colorOptions = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Purple', 'Pink', 'Gray', 'Brown'];

export default function AddItemScreen() {
  const { nfcTagId } = useLocalSearchParams<{ nfcTagId?: string }>();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: categories[0],
    color: colorOptions[0],
    imageUrl: '',
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to add photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setFormData(prev => ({ ...prev, imageUrl: result.assets[0].uri }));
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Sorry, we need camera permissions to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setFormData(prev => ({ ...prev, imageUrl: result.assets[0].uri }));
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Add Photo',
      'Choose how you want to add a photo',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Photo Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const saveItem = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter a name for the item.');
      return;
    }

    // In a real app, you would save this to a database
    console.log('Saving item:', {
      ...formData,
      nfcTagId: nfcTagId || undefined,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString().split('T')[0],
    });

    Alert.alert(
      'Success',
      'Item added to your wardrobe!',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const renderCategorySelector = () => (
    <View style={styles.selectorContainer}>
      <Text style={styles.label}>Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.selectorButton,
              formData.category === category && styles.selectorButtonActive
            ]}
            onPress={() => setFormData(prev => ({ ...prev, category }))}
          >
            <Text style={[
              styles.selectorButtonText,
              formData.category === category && styles.selectorButtonTextActive
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderColorSelector = () => (
    <View style={styles.selectorContainer}>
      <Text style={styles.label}>Color</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {colorOptions.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.selectorButton,
              formData.color === color && styles.selectorButtonActive
            ]}
            onPress={() => setFormData(prev => ({ ...prev, color }))}
          >
            <Text style={[
              styles.selectorButtonText,
              formData.color === color && styles.selectorButtonTextActive
            ]}>
              {color}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Add New Item',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
        }}
      />
      <View style={commonStyles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* NFC Tag Info */}
          {nfcTagId && (
            <View style={styles.nfcInfo}>
              <IconSymbol name="wave.3.right" size={20} color={colors.accent} />
              <Text style={styles.nfcInfoText}>
                NFC Tag ID: {nfcTagId.substring(0, 8)}...
              </Text>
            </View>
          )}

          {/* Image Section */}
          <View style={styles.imageSection}>
            <Text style={styles.label}>Photo</Text>
            <TouchableOpacity style={styles.imageContainer} onPress={showImageOptions}>
              {formData.imageUrl ? (
                <Image source={{ uri: formData.imageUrl }} style={styles.selectedImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <IconSymbol name="camera" size={40} color={colors.textSecondary} />
                  <Text style={styles.imagePlaceholderText}>Tap to add photo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.formSection}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder="e.g., Blue Denim Jacket"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                placeholder="Add details about this item..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>

            {renderCategorySelector()}
            {renderColorSelector()}
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={saveItem}>
            <Text style={styles.saveButtonText}>Add to Wardrobe</Text>
          </TouchableOpacity>
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
  nfcInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  nfcInfoText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  imageSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  imageContainer: {
    alignItems: 'center',
  },
  selectedImage: {
    width: 150,
    height: 150,
    borderRadius: 12,
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.textSecondary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  imagePlaceholderText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  formSection: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.card,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  selectorContainer: {
    marginBottom: 16,
  },
  horizontalScroll: {
    flexGrow: 0,
  },
  selectorButton: {
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.textSecondary,
  },
  selectorButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  selectorButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  selectorButtonTextActive: {
    color: colors.card,
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
  },
  saveButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '600',
  },
});
