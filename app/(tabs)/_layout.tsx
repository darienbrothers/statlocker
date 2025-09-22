import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Pressable, Dimensions, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors, Shadows, BorderRadius } from '../../shared/theme';
import TabsWithDrawer from '../../components/navigation/TabsWithDrawer';

const { width: screenWidth } = Dimensions.get('window');

// Custom FAB Component
const FloatingActionButton = () => {
  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    // TODO: Navigate to game logging modal
    console.log('Log Game pressed');
  };

  return (
    <View style={{
      position: 'absolute',
      top: -30,
      left: screenWidth / 2 - 30,
      width: 60,
      height: 60,
      zIndex: 1000,
    }}>
      <Pressable onPress={handlePress}>
        <LinearGradient
          colors={[Colors.brand.primary, Colors.brand.primaryTint]}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
            ...Shadows.fab,
          }}
        >
          <Ionicons 
            name="add" 
            size={28} 
            color="#FFFFFF" 
          />
        </LinearGradient>
      </Pressable>
    </View>
  );
};

// Custom Tab Bar
const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  return (
    <View style={{
      position: 'relative',
      backgroundColor: Colors.surface.elevated,
      borderTopWidth: 1,
      borderTopColor: Colors.border.primary,
      paddingBottom: 34, // Safe area
      paddingTop: 20,
      height: 100,
      flexDirection: 'row',
      alignItems: 'center',
      ...Shadows.card,
    }}>
      {/* FAB */}
      <FloatingActionButton />
      
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined 
          ? options.tabBarLabel 
          : options.title !== undefined 
          ? options.title 
          : route.name;

        const isFocused = state.index === index;

        const onPress = async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // Get tab icon
        const getTabIcon = (routeName: string, focused: boolean) => {
          const iconColor = focused ? Colors.brand.primary : Colors.text.secondary;
          const iconSize = 24;

          switch (routeName) {
            case 'dashboard/index':
              return <Ionicons name={focused ? 'home' : 'home-outline'} size={iconSize} color={iconColor} />;
            case 'stats/index':
              return <Ionicons name={focused ? 'bar-chart' : 'bar-chart-outline'} size={iconSize} color={iconColor} />;
            case 'recruiting/index':
              return <Ionicons name={focused ? 'school' : 'school-outline'} size={iconSize} color={iconColor} />;
            case 'skills/index':
              return <Ionicons name={focused ? 'fitness' : 'fitness-outline'} size={iconSize} color={iconColor} />;
            default:
              return <Ionicons name="ellipse" size={iconSize} color={iconColor} />;
          }
        };

        // Create spacing around FAB (center position)
        const isFirstHalf = index < 2; // Home, Stats
        const isSecondHalf = index >= 2; // Recruiting, Skills
        
        return (
          <View
            key={route.key}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              // Add extra margin for FAB spacing
              marginLeft: isSecondHalf && index === 2 ? 40 : 0, // Extra space before Recruiting
              marginRight: isFirstHalf && index === 1 ? 40 : 0, // Extra space after Stats
            }}
          >
            <Pressable
              onPress={onPress}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 8,
                opacity: isFocused ? 1 : 0.7,
                minWidth: 60, // Ensure consistent touch target
              }}
            >
              <View style={{
                alignItems: 'center',
                transform: [{ scale: isFocused ? 1.1 : 1 }],
              }}>
                {getTabIcon(route.name, isFocused)}
                <View style={{ marginTop: 4 }}>
                  <Text style={{
                    fontSize: 11,
                    fontWeight: isFocused ? '600' : '400',
                    color: isFocused ? Colors.brand.primary : Colors.text.secondary,
                  }}>
                    {label}
                  </Text>
                </View>
              </View>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
};

export default function TabsLayout() {
  return (
    <TabsWithDrawer>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="dashboard/index"
          options={{
            title: 'Home',
          }}
        />
        <Tabs.Screen
          name="stats/index"
          options={{
            title: 'Stats',
          }}
        />
        <Tabs.Screen
          name="recruiting/index"
          options={{
            title: 'Recruiting',
          }}
        />
        <Tabs.Screen
          name="skills/index"
          options={{
            title: 'Skills',
          }}
        />
      </Tabs>
    </TabsWithDrawer>
  );
}
