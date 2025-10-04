
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@react-navigation/native';
import { useRouter, usePathname } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { colors } from '@/styles/commonStyles';

export interface TabBarItem {
  route: string;
  label: string;
  icon: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  containerWidth?: number;
  borderRadius?: number;
  bottomMargin?: number;
}

export default function FloatingTabBar({
  tabs,
  containerWidth = Dimensions.get('window').width - 32,
  borderRadius = 25,
  bottomMargin = 34,
}: FloatingTabBarProps) {
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  
  const indicatorPosition = useSharedValue(0);
  
  const activeIndex = tabs.findIndex(tab => pathname.startsWith(tab.route));
  
  React.useEffect(() => {
    indicatorPosition.value = withSpring(activeIndex >= 0 ? activeIndex : 0);
  }, [activeIndex, indicatorPosition]);

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      indicatorPosition.value,
      [0, tabs.length - 1],
      [0, containerWidth - (containerWidth / tabs.length)]
    );
    
    return {
      transform: [{ translateX }],
    };
  });

  const handleTabPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <SafeAreaView style={[styles.container, { bottom: bottomMargin }]} edges={['bottom']}>
      <BlurView
        intensity={80}
        tint={theme.dark ? 'dark' : 'light'}
        style={[
          styles.tabBar,
          {
            width: containerWidth,
            borderRadius,
            backgroundColor: Platform.OS === 'android' ? colors.card : 'transparent',
          },
        ]}
      >
        <Animated.View
          style={[
            styles.indicator,
            {
              width: containerWidth / tabs.length,
              borderRadius: borderRadius - 4,
              backgroundColor: colors.primary,
            },
            animatedIndicatorStyle,
          ]}
        />
        
        {tabs.map((tab, index) => {
          const isActive = activeIndex === index;
          
          return (
            <TouchableOpacity
              key={tab.route}
              style={[styles.tab, { width: containerWidth / tabs.length }]}
              onPress={() => handleTabPress(tab.route)}
            >
              <IconSymbol
                name={tab.icon as any}
                size={24}
                color={isActive ? colors.card : colors.text}
              />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive ? colors.card : colors.text,
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 1000,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
    elevation: 8,
  },
  indicator: {
    position: 'absolute',
    height: '80%',
    top: '10%',
    left: 4,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    zIndex: 1,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
});
