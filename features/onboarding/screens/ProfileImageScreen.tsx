import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  Image,
  Alert,
  Animated,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../../shared/theme';
import InlineStepper from '../../../shared/components/InlineStepper';
import { onboardingSteps, getCurrentStepIndex } from '../../../shared/config/onboardingSteps';
import { OnboardingStepKey } from '../../../shared/types/Onboarding';

export default function ProfileImageScreen() {
  const [firstName, setFirstName] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const isFormValid = profileImage !== null;

  const bounceAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    (async () => {
      const storedName = await AsyncStorage.getItem('onboarding_firstName');
      if (storedName) {
        const val = storedName.trim();
        setFirstName(val.charAt(0).toUpperCase() + val.slice(1));
      }
      const savedProfileImage = await AsyncStorage.getItem('onboarding_profileImage');
      if (savedProfileImage) {
        setProfileImage(savedProfileImage);
      }
    })();

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.4, duration: 1000, useNativeDriver: true }),
      ]),
    );
    pulseAnimation.start();
  }, []);

  useEffect(() => {
    if (profileImage) {
      AsyncStorage.setItem('onboarding_profileImage', profileImage);
    }
  }, [profileImage]);

  const handleContinue = () => {
    if (!isFormValid) return;
    Animated.sequence([
      Animated.timing(bounceAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(bounceAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(async () => {
      // Check if editing from review
      const editingFromReview = await AsyncStorage.getItem('editingFromReview');
      if (editingFromReview === 'true') {
        await AsyncStorage.removeItem('editingFromReview');
        router.push('/onboarding/review');
      } else {
        router.push('/onboarding/basic-info');
      }
    });
  };

    const handleBackPress = () => {
    router.back();
  };


  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to your camera.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Add Your Game Face',
      'Choose how you\'d like to add your profile picture',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  };

  const currentStepIndex = getCurrentStepIndex('profile-image');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.surface.primary }}>
            <InlineStepper
        steps={onboardingSteps}
        currentIndex={currentStepIndex}
        completedSteps={['name']}
        showBack={true}
        onBack={handleBackPress}
      />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: Spacing.xl }}>
        <View style={{ alignItems: 'center', paddingVertical: Spacing.xl }}>
          <Text style={{
            fontSize: 20,
            lineHeight: 28,
            fontFamily: Typography.fonts.bodyMedium,
            color: Colors.brand.primary,
            textAlign: 'center',
            marginBottom: Spacing.sm,
            fontWeight: '600',
          }}>
            Add Your Profile Picture 📸
          </Text>
          <Text
            style={{
              fontSize: 28,
              fontFamily: Typography.fonts.display,
              color: Colors.text.primary,
              textAlign: 'center',
              marginBottom: Spacing.sm,
            }}
          >
            {firstName
              ? `Let’s put a face to your game, ${firstName}!` 
              : 'Let’s put a face to your game!'}
          </Text>

          <Text
            style={{
              ...Typography.styles.bodyLarge,
              color: Colors.text.secondary,
              textAlign: 'center',
              lineHeight: 24,
              marginBottom: Spacing.xl,
              paddingHorizontal: Spacing.md,
            }}
          >
            First impressions matter. Upload a clear headshot so coaches and teammates can easily recognize you.
          </Text>

          <TouchableOpacity onPress={showImageOptions} activeOpacity={0.8}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={{ width: 200, height: 200, borderRadius: 100 }} />
            ) : (
              <Animated.View style={{ width: 200, height: 200, borderRadius: 100, backgroundColor: Colors.surface.elevated, ...Shadows.lg, justifyContent: 'center', alignItems: 'center', opacity: glowAnim }}>
                <Ionicons name="camera" size={48} color={Colors.brand.primary} />
                <Text style={{ ...Typography.styles.body, color: Colors.text.secondary, marginTop: Spacing.sm }}>Tap to Add Photo</Text>
                <Text
                  style={{
                    ...Typography.styles.caption,
                    color: Colors.text.tertiary,
                    marginTop: Spacing.xs,
                  }}
                >
                  A strong first impression starts here
                </Text>
              </Animated.View>
            )}
          </TouchableOpacity>

          {profileImage && (
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity style={{ marginTop: Spacing.lg }} onPress={showImageOptions}>
                <Text style={{ ...Typography.styles.body, color: Colors.brand.primary, fontWeight: '600' }}>Change Photo</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Fixed Button Container */}
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: Spacing.lg,
        paddingHorizontal: Spacing.xl,
        paddingBottom: 34, // Safe area for home indicator
        backgroundColor: Colors.surface.primary,
        borderTopWidth: 0.5,
        borderTopColor: Colors.border.secondary,
      }}>
        {/* Trust Message */}
        <Text style={{
          fontSize: 12,
          lineHeight: 16,
          fontFamily: Typography.fonts.body,
          color: Colors.text.tertiary,
          textAlign: 'center',
          marginBottom: Spacing.md,
          opacity: isFormValid ? 1 : 0.7,
        }}>
          Your photo is private and only visible to you unless you choose to share it.
        </Text>

        <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
          <Pressable
            style={{
              borderRadius: BorderRadius.xl,
              overflow: 'hidden',
              opacity: isFormValid ? 1 : 0.6,
              ...(isFormValid ? Shadows.lg : {}),
            }}
            onPress={handleContinue}
            disabled={!isFormValid}
          >
            <LinearGradient
              colors={isFormValid ? [Colors.brand.primary, `${Colors.brand.primary}DD`] : [Colors.border.secondary, Colors.border.primary]}
              style={{
                paddingVertical: Spacing.lg,
                paddingHorizontal: Spacing.xl,
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 56,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                <Text style={{
                  fontSize: 18,
                  lineHeight: 24,
                  fontFamily: Typography.fonts.bodyMedium,
                  color: isFormValid ? Colors.text.inverse : Colors.text.tertiary,
                  fontWeight: '600',
                }}>
                  Build Profile
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color={isFormValid ? Colors.text.inverse : Colors.text.tertiary}
                />
              </View>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
