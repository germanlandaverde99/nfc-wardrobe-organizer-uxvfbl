
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';

export default function ProfileScreen() {
  const handleSettingPress = (setting: string) => {
    Alert.alert('Coming Soon', `${setting} feature will be available in a future update.`);
  };

  const settingsOptions = [
    { id: 'notifications', title: 'Notifications', icon: 'bell', description: 'Manage your notification preferences' },
    { id: 'backup', title: 'Backup & Sync', icon: 'icloud', description: 'Backup your wardrobe data' },
    { id: 'nfc', title: 'NFC Settings', icon: 'wave.3.right', description: 'Configure NFC tag preferences' },
    { id: 'categories', title: 'Manage Categories', icon: 'folder', description: 'Customize clothing categories' },
    { id: 'export', title: 'Export Data', icon: 'square.and.arrow.up', description: 'Export your wardrobe data' },
    { id: 'help', title: 'Help & Support', icon: 'questionmark.circle', description: 'Get help and support' },
  ];

  const stats = [
    { label: 'Items Added', value: '23', icon: 'plus.circle' },
    { label: 'NFC Tags', value: '8', icon: 'wave.3.right' },
    { label: 'Categories', value: '6', icon: 'folder' },
    { label: 'Days Active', value: '15', icon: 'calendar' },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Profile',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
        }}
      />
      <View style={commonStyles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <IconSymbol name="person.circle.fill" size={80} color={colors.primary} />
            </View>
            <Text style={styles.userName}>Wardrobe Organizer</Text>
            <Text style={styles.userSubtitle}>Keep your style organized</Text>
          </View>

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Your Stats</Text>
            <View style={styles.statsGrid}>
              {stats.map((stat) => (
                <View key={stat.label} style={styles.statCard}>
                  <IconSymbol name={stat.icon as any} size={24} color={colors.primary} />
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Settings Section */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Settings</Text>
            {settingsOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.settingItem}
                onPress={() => handleSettingPress(option.title)}
              >
                <View style={styles.settingIcon}>
                  <IconSymbol name={option.icon as any} size={20} color={colors.primary} />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>{option.title}</Text>
                  <Text style={styles.settingDescription}>{option.description}</Text>
                </View>
                <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>

          {/* App Info */}
          <View style={styles.appInfoSection}>
            <Text style={styles.appInfoTitle}>Wardrobe Organizer</Text>
            <Text style={styles.appInfoVersion}>Version 1.0.0</Text>
            <Text style={styles.appInfoDescription}>
              Organize your wardrobe with NFC technology. Scan, categorize, and track your clothing items effortlessly.
            </Text>
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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  userSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  statsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    width: '48%',
    alignItems: 'center',
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  settingsSection: {
    marginBottom: 32,
  },
  settingItem: {
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  appInfoSection: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 32,
  },
  appInfoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  appInfoVersion: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  appInfoDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});
