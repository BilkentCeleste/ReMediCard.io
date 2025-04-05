import React from 'react';
import { Tabs } from 'expo-router';
import { Box, HStack, Icon, Pressable, Text, VStack } from '@gluestack-ui/themed';
import { useColorScheme } from 'nativewind';
import { IconSymbol } from './IconSymbol';

export function GluestackBottomTab() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: isDark ? '#333333' : '#E5E5E5',
          height: 80,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: isDark ? '#FFFFFF' : '#000000',
        tabBarInactiveTintColor: isDark ? '#888888' : '#666666',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }: { color: string }) => <IconSymbol size={24} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }: { color: string }) => <IconSymbol size={24} name="person.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }: { color: string }) => <IconSymbol size={24} name="gearshape.fill" color={color} />,
        }}
      />
    </Tabs>
  );
} 