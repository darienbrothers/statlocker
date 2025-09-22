import React, { useEffect } from 'react';
import { View, Pressable, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';

import { Colors, Spacing, BorderRadius, Shadows, Typography } from '../../shared/theme';

// Import tab screens
import DashboardScreen from '../../features/dashboard/screens/DashboardScreen';
import StatsScreen from '../../features/stats/screens/StatsScreen';
import RecruitingScreen from '../../features/recruiting/screens/RecruitingScreen';
import SkillsScreen from '../../features/skills/screens/SkillsScreen';

const Tab = createBottomTabNavigator();
const { width: screenWidth } = Dimensions.get('window');

// Premium FAB Component with breathing animation
const FloatingActionButton = ({ onPress }: { onPress: () => void }) => {
  const breathingScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.3);
  const bounceScale = useSharedValue(1);

  useEffect(() => {
    // Breathing animation - continuous subtle scale
    breathingScale.value = withRepeat(
      withTiming(1.05, {
        duration: 2000,
        easing: Easing.inOut(Easing.sine),
      }),
      -1,
      true
    );

    // Pulse animation - continuous opacity pulse
    pulseOpacity.value = withRepeat(
      withTiming(0.8, {
        duration: 1500,
        easing: Easing.inOut(Easing.sine),
      }),
      -1,
      true
    );
  }, []);

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    // Bounce animation on press
    bounceScale.value = withSpring(0.9, {
      damping: 15,
      stiffness: 300,
    }, () => {
      bounceScale.value = withSpring(1, {
        damping: 15,
        stiffness: 300,
      });
    });

    onPress();
  };

  const breathingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathingScale.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bounceScale.value }],
  }));

  return (
    <View style={{
      position: 'absolute',
      bottom: 25,
      left: screenWidth / 2 - 32,
      zIndex: 1000,
    }}>
      {/* Pulse ring effect */}
      <Animated.View style={[
        pulseStyle,
        {
          position: 'absolute',
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: Colors.brand.primary,
          top: -8,
          left: -8,
        }
      ]} />

      {/* Main FAB */}
      <Animated.View style={[breathingStyle, bounceStyle]}>
        <Pressable onPress={handlePress}>
          <LinearGradient
            colors={[Colors.brand.primary, Colors.brand.primaryTint]}
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              justifyContent: 'center',
              alignItems: 'center',
              ...Shadows.fab,
            }}
          >
            <Ionicons 
              name="add" 
              size={28} 
              color={Colors.text.inverse} 
            />
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </View>
  );
};

// Custom Tab Bar Component
const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <View style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: Colors.surface.elevated,
      borderTopWidth: 1,
      borderTopColor: Colors.border.primary,
      paddingBottom: 34, // Safe area padding
      paddingTop: 12,
    }}>
      <LinearGradient
        colors={[Colors.surface.elevated + '00', Colors.surface.elevated]}
        style={{
          position: 'absolute',
          top: -20,
          left: 0,
          right: 0,
          height: 20,
        }}
      />
      
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
      }}>
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

          // Tab icons
          const getTabIcon = (routeName: string, focused: boolean) => {
            const iconColor = focused ? Colors.brand.primary : Colors.text.secondary;
            const iconSize = 24;

            switch (routeName) {
              case 'Dashboard':
                return <Ionicons name={focused ? 'home' : 'home-outline'} size={iconSize} color={iconColor} />;
              case 'Stats':
                return <Ionicons name={focused ? 'bar-chart' : 'bar-chart-outline'} size={iconSize} color={iconColor} />;
              case 'Recruiting':
                return <Ionicons name={focused ? 'school' : 'school-outline'} size={iconSize} color={iconColor} />;
              case 'Skills':
                return <Ionicons name={focused ? 'fitness' : 'fitness-outline'} size={iconSize} color={iconColor} />;
              default:
                return <Ionicons name="ellipse" size={iconSize} color={iconColor} />;
            }
          };

          return (
            <MotiView
              key={route.key}
              animate={{
                scale: isFocused ? 1.1 : 1,
              }}
              transition={{
                type: 'spring',
                damping: 15,
                stiffness: 300,
              }}
            >
              <Pressable
                onPress={onPress}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  minWidth: 60,
                }}
              >
                {/* Active indicator */}
                {isFocused && (
                  <MotiView
                    from={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                      position: 'absolute',
                      top: -2,
                      width: 4,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: Colors.brand.primary,
                    }}
                  />
                )}

                {getTabIcon(route.name, isFocused)}
                
                <MotiView
                  animate={{
                    opacity: isFocused ? 1 : 0.7,
                  }}
                  style={{ marginTop: 4 }}
                >
                  <Animated.Text style={{
                    ...Typography.styles.caption,
                    color: isFocused ? Colors.brand.primary : Colors.text.secondary,
                    fontSize: 11,
                    fontWeight: isFocused ? '600' : '400',
                  }}>
                    {label}
                  </Animated.Text>
                </MotiView>
              </Pressable>
            </MotiView>
          );
        })}
      </View>
    </View>
  );
};

export default function MainTabNavigator() {
  const handleFABPress = () => {
    // TODO: Navigate to game logging modal
    console.log('Log Game pressed');
  };

  return (
    <>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' }, // Hide default tab bar
        }}
      >
        <Tab.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{ title: 'Locker' }}
        />
        <Tab.Screen 
          name="Stats" 
          component={StatsScreen}
        />
        <Tab.Screen 
          name="Recruiting" 
          component={RecruitingScreen}
        />
        <Tab.Screen 
          name="Skills" 
          component={SkillsScreen}
        />
      </Tab.Navigator>

      {/* Floating Action Button */}
      <FloatingActionButton onPress={handleFABPress} />
    </>
  );
}
