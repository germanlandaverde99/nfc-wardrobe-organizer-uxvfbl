
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { Stack } from 'expo-router';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Platform } from 'react-native';
import React from 'react';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  const tabs: TabBarItem[] = [
    {
      route: '/(home)',
      label: 'Wardrobe',
      icon: 'tshirt',
    },
    {
      route: '/profile',
      label: 'Profile',
      icon: 'person',
    },
  ];

  if (Platform.OS === 'ios') {
    return (
      <NativeTabs>
        <NativeTabs.Screen
          name="(home)"
          options={{
            title: 'Wardrobe',
            tabBarIcon: ({ color }) => <Icon name="tshirt" color={color} />,
          }}
        />
        <NativeTabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <Icon name="person" color={color} />,
          }}
        />
      </NativeTabs>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(home)" />
        <Stack.Screen name="profile" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
