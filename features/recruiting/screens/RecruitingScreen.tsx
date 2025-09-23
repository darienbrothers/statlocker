import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../../shared/theme';

// Types
interface School {
  id: string;
  name: string;
  division: string;
  location: string;
  category: 'reach' | 'realistic' | 'safe';
  website?: string;
  deadline?: string; // ISO date string
  logoUrl?: string;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  category: 'academic' | 'athletic' | 'application';
}

interface AthleteProfile {
  gpa?: number;
  satScore?: number;
  actScore?: number;
  graduationYear: number;
  position: string;
  height?: string;
  weight?: string;
}

// Category Header Component
const CategoryHeader = ({ 
  title, 
  count, 
  color, 
  onAddSchool 
}: { 
  title: string; 
  count: number; 
  color: string; 
  onAddSchool: () => void;
}) => {
  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.md,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{
          width: 12,
          height: 12,
          backgroundColor: color,
          borderRadius: 6,
          marginRight: Spacing.sm,
        }} />
        <Text style={{
          ...Typography.styles.h3,
          color: Colors.text.primary,
          fontWeight: '600',
          fontSize: 18,
          lineHeight: 24,
        }}>
          {title}
        </Text>
        <View style={{
          backgroundColor: Colors.surface.elevated2,
          paddingHorizontal: Spacing.sm,
          paddingVertical: 2,
          borderRadius: BorderRadius.sm,
          marginLeft: Spacing.sm,
        }}>
          <Text style={{
            ...Typography.styles.caption,
            color: Colors.text.secondary,
            fontSize: 12,
            fontWeight: '600',
          }}>
            {count}
          </Text>
        </View>
      </View>

      <Pressable
        onPress={onAddSchool}
        style={{
          backgroundColor: `${color}20`,
          width: 32,
          height: 32,
          borderRadius: 16,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Ionicons name="add" size={20} color={color} />
      </Pressable>
    </View>
  );
};

// School Card Component
const SchoolCard = ({ 
  school, 
  onEdit, 
  onMove, 
  onDelete 
}: { 
  school: School; 
  onEdit: (school: School) => void;
  onMove: (school: School) => void;
  onDelete: (schoolId: string) => void;
}) => {
  const handleLongPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      school.name,
      'What would you like to do?',
      [
        { text: 'Edit', onPress: () => onEdit(school) },
        { text: 'Move Category', onPress: () => onMove(school) },
        { text: 'Delete', onPress: () => onDelete(school.id), style: 'destructive' },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 300 }}
    >
      <Pressable
        onLongPress={handleLongPress}
        style={{
          backgroundColor: Colors.surface.elevated,
          borderRadius: BorderRadius.lg,
          padding: Spacing.lg,
          marginBottom: Spacing.md,
          ...Shadows.card,
        }}
      >
        <Text style={{
          ...Typography.styles.h3,
          color: Colors.text.primary,
          fontWeight: '600',
          fontSize: 16,
          lineHeight: 20,
          marginBottom: Spacing.xs,
        }}>
          {school.name}
        </Text>
        
        <Text style={{
          ...Typography.styles.body,
          color: Colors.text.secondary,
          fontSize: 14,
          lineHeight: 18,
          marginBottom: Spacing.xs,
        }}>
          {school.division}
        </Text>
        
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Ionicons name="location-outline" size={14} color={Colors.text.secondary} />
          <Text style={{
            ...Typography.styles.caption,
            color: Colors.text.secondary,
            fontSize: 12,
            lineHeight: 16,
            marginLeft: 4,
          }}>
            {school.location}
          </Text>
        </View>
      </Pressable>
    </MotiView>
  );
};

// Add School Modal Component
const AddSchoolModal = ({ 
  visible, 
  onClose, 
  onSave, 
  initialCategory,
  editingSchool 
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (school: Omit<School, 'id'>) => void;
  initialCategory: 'reach' | 'realistic' | 'safe';
  editingSchool?: School;
}) => {
  const [name, setName] = useState(editingSchool?.name || '');
  const [division, setDivision] = useState(editingSchool?.division || '');
  const [location, setLocation] = useState(editingSchool?.location || '');
  const [category, setCategory] = useState<'reach' | 'realistic' | 'safe'>(
    editingSchool?.category || initialCategory
  );

  const handleSave = async () => {
    if (!name.trim() || !division.trim() || !location.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSave({ name: name.trim(), division: division.trim(), location: location.trim(), category });
    
    // Reset form
    setName('');
    setDivision('');
    setLocation('');
    setCategory(initialCategory);
    onClose();
  };

  const categories = [
    { id: 'reach', label: 'Reach', color: Colors.status.error },
    { id: 'realistic', label: 'Realistic', color: Colors.brand.primary },
    { id: 'safe', label: 'Safe', color: Colors.status.success },
  ];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.surface.primary }}>
        <View style={{ padding: Spacing.lg }}>
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: Spacing.xl,
          }}>
            <Pressable onPress={onClose}>
              <Text style={{
                ...Typography.styles.body,
                color: Colors.brand.primary,
                fontSize: 16,
                fontWeight: '600',
              }}>
                Cancel
              </Text>
            </Pressable>
            
            <Text style={{
              ...Typography.styles.h2,
              color: Colors.text.primary,
              fontWeight: '600',
              fontSize: 18,
            }}>
              {editingSchool ? 'Edit School' : 'Add School'}
            </Text>
            
            <Pressable onPress={handleSave}>
              <Text style={{
                ...Typography.styles.body,
                color: Colors.brand.primary,
                fontSize: 16,
                fontWeight: '600',
              }}>
                Save
              </Text>
            </Pressable>
          </View>

          {/* Form */}
          <View style={{ gap: Spacing.lg }}>
            {/* School Name */}
            <View>
              <Text style={{
                ...Typography.styles.body,
                color: Colors.text.primary,
                fontWeight: '600',
                marginBottom: Spacing.sm,
              }}>
                School Name
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. Duke University"
                placeholderTextColor={Colors.text.secondary}
                style={{
                  backgroundColor: Colors.surface.elevated,
                  borderRadius: BorderRadius.lg,
                  padding: Spacing.lg,
                  fontSize: 16,
                  color: Colors.text.primary,
                }}
              />
            </View>

            {/* Division */}
            <View>
              <Text style={{
                ...Typography.styles.body,
                color: Colors.text.primary,
                fontWeight: '600',
                marginBottom: Spacing.sm,
              }}>
                Division
              </Text>
              <TextInput
                value={division}
                onChangeText={setDivision}
                placeholder="e.g. NCAA Division I"
                placeholderTextColor={Colors.text.secondary}
                style={{
                  backgroundColor: Colors.surface.elevated,
                  borderRadius: BorderRadius.lg,
                  padding: Spacing.lg,
                  fontSize: 16,
                  color: Colors.text.primary,
                }}
              />
            </View>

            {/* Location */}
            <View>
              <Text style={{
                ...Typography.styles.body,
                color: Colors.text.primary,
                fontWeight: '600',
                marginBottom: Spacing.sm,
              }}>
                Location
              </Text>
              <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder="e.g. Durham, NC"
                placeholderTextColor={Colors.text.secondary}
                style={{
                  backgroundColor: Colors.surface.elevated,
                  borderRadius: BorderRadius.lg,
                  padding: Spacing.lg,
                  fontSize: 16,
                  color: Colors.text.primary,
                }}
              />
            </View>

            {/* Category */}
            <View>
              <Text style={{
                ...Typography.styles.body,
                color: Colors.text.primary,
                fontWeight: '600',
                marginBottom: Spacing.sm,
              }}>
                Category
              </Text>
              <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
                {categories.map((cat) => (
                  <Pressable
                    key={cat.id}
                    onPress={() => setCategory(cat.id as any)}
                    style={{
                      flex: 1,
                      backgroundColor: category === cat.id ? cat.color : Colors.surface.elevated,
                      paddingVertical: Spacing.md,
                      borderRadius: BorderRadius.lg,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{
                      ...Typography.styles.body,
                      color: category === cat.id ? '#FFFFFF' : Colors.text.secondary,
                      fontWeight: '600',
                      fontSize: 14,
                    }}>
                      {cat.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

// Task Checklist Component
const TaskChecklist = ({ tasks, onToggleTask }: { tasks: Task[]; onToggleTask: (taskId: string) => void }) => {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500, delay: 400 }}
      style={{
        backgroundColor: Colors.surface.elevated,
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
        ...Shadows.card,
      }}
    >
      <Text style={{
        ...Typography.styles.h2,
        color: Colors.text.primary,
        marginBottom: Spacing.lg,
        fontWeight: '600',
        fontSize: 20,
        lineHeight: 26,
      }}>
        Recruiting Tasks
      </Text>

      <View style={{ gap: Spacing.sm }}>
        {tasks.map((task, index) => (
          <MotiView
            key={task.id}
            from={{ opacity: 0, translateX: -10 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 300, delay: 500 + (index * 100) }}
          >
            <Pressable
              onPress={() => onToggleTask(task.id)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: Colors.surface.elevated2,
                padding: Spacing.md,
                borderRadius: BorderRadius.lg,
              }}
            >
              <View style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: task.completed ? Colors.status.success : 'transparent',
                borderWidth: 2,
                borderColor: task.completed ? Colors.status.success : Colors.border.secondary,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: Spacing.md,
              }}>
                {task.completed && (
                  <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                )}
              </View>
              
              <Text style={{
                ...Typography.styles.body,
                color: task.completed ? Colors.text.secondary : Colors.text.primary,
                fontSize: 14,
                lineHeight: 18,
                textDecorationLine: task.completed ? 'line-through' : 'none',
              }}>
                {task.title}
              </Text>
            </Pressable>
          </MotiView>
        ))}
      </View>
    </MotiView>
  );
};

// Locked Features Component
const LockedFeaturesSection = () => {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500, delay: 600 }}
      style={{
        backgroundColor: Colors.surface.elevated,
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
        ...Shadows.card,
        borderWidth: 2,
        borderColor: Colors.brand.primary + '20',
      }}
    >
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md,
      }}>
        <Ionicons name="lock-closed" size={20} color={Colors.brand.primary} />
        <Text style={{
          ...Typography.styles.h3,
          color: Colors.text.primary,
          fontWeight: '600',
          fontSize: 18,
          marginLeft: Spacing.sm,
        }}>
          Premium Features
        </Text>
      </View>

      {/* Coach Messaging Preview */}
      <View style={{
        backgroundColor: Colors.surface.elevated2,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        marginBottom: Spacing.md,
        opacity: 0.7,
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: Spacing.sm,
        }}>
          <Ionicons name="mail-outline" size={16} color={Colors.text.secondary} />
          <Text style={{
            ...Typography.styles.body,
            color: Colors.text.primary,
            fontWeight: '600',
            fontSize: 14,
            marginLeft: Spacing.sm,
          }}>
            Direct Coach Messaging
          </Text>
        </View>
        <Text style={{
          ...Typography.styles.caption,
          color: Colors.text.secondary,
          fontSize: 12,
          lineHeight: 16,
        }}>
          Send personalized messages directly to college coaches with built-in templates and tracking.
        </Text>
      </View>

      {/* Other Premium Features */}
      <View style={{ gap: Spacing.sm, marginBottom: Spacing.lg }}>
        {[
          { icon: 'analytics-outline', title: 'Advanced Analytics', desc: 'Compare your stats to college-level benchmarks' },
          { icon: 'document-text-outline', title: 'Recruiting Reports', desc: 'Generate professional reports for coaches' },
          { icon: 'calendar-outline', title: 'Visit Scheduler', desc: 'Coordinate campus visits and meetings' },
        ].map((feature, index) => (
          <View key={index} style={{
            flexDirection: 'row',
            alignItems: 'center',
            opacity: 0.7,
          }}>
            <Ionicons name={feature.icon as any} size={16} color={Colors.text.secondary} />
            <View style={{ marginLeft: Spacing.sm, flex: 1 }}>
              <Text style={{
                ...Typography.styles.caption,
                color: Colors.text.primary,
                fontSize: 12,
                fontWeight: '600',
              }}>
                {feature.title}
              </Text>
              <Text style={{
                ...Typography.styles.caption,
                color: Colors.text.secondary,
                fontSize: 11,
                lineHeight: 14,
              }}>
                {feature.desc}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* CTA Button */}
      <Pressable
        style={{
          backgroundColor: Colors.brand.primary,
          borderRadius: BorderRadius.lg,
          paddingVertical: Spacing.md,
          alignItems: 'center',
        }}
      >
        <Text style={{
          ...Typography.styles.body,
          color: '#FFFFFF',
          fontWeight: '600',
          fontSize: 16,
        }}>
          Upgrade to Premium
        </Text>
      </Pressable>
    </MotiView>
  );
};

// Profile Header Component
const ProfileHeader = ({ 
  profile, 
  showAcademic, 
  onToggleView 
}: { 
  profile: AthleteProfile; 
  showAcademic: boolean; 
  onToggleView: () => void;
}) => {
  return (
    <MotiView
      from={{ opacity: 0, translateY: -20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500 }}
      style={{
        backgroundColor: Colors.surface.elevated,
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
        ...Shadows.card,
      }}
    >
      {/* Toggle Buttons */}
      <View style={{
        flexDirection: 'row',
        backgroundColor: Colors.surface.elevated2,
        borderRadius: BorderRadius.lg,
        padding: 4,
        marginBottom: Spacing.lg,
      }}>
        <Pressable
          onPress={() => !showAcademic && onToggleView()}
          style={{
            flex: 1,
            paddingVertical: Spacing.sm,
            borderRadius: BorderRadius.md,
            backgroundColor: !showAcademic ? Colors.brand.primary : 'transparent',
            alignItems: 'center',
          }}
        >
          <Text style={{
            ...Typography.styles.body,
            color: !showAcademic ? '#FFFFFF' : Colors.text.secondary,
            fontWeight: '600',
            fontSize: 14,
          }}>
            Athletic
          </Text>
        </Pressable>
        <Pressable
          onPress={() => showAcademic && onToggleView()}
          style={{
            flex: 1,
            paddingVertical: Spacing.sm,
            borderRadius: BorderRadius.md,
            backgroundColor: showAcademic ? Colors.brand.primary : 'transparent',
            alignItems: 'center',
          }}
        >
          <Text style={{
            ...Typography.styles.body,
            color: showAcademic ? '#FFFFFF' : Colors.text.secondary,
            fontWeight: '600',
            fontSize: 14,
          }}>
            Academic
          </Text>
        </Pressable>
      </View>

      {/* Profile Content */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {showAcademic ? (
          <>
            <View style={{ flex: 1 }}>
              <Text style={{
                ...Typography.styles.caption,
                color: Colors.text.secondary,
                fontSize: 12,
                marginBottom: 4,
              }}>
                GPA
              </Text>
              <Text style={{
                ...Typography.styles.h3,
                color: Colors.text.primary,
                fontWeight: '600',
                fontSize: 24,
              }}>
                {profile.gpa ? profile.gpa.toFixed(2) : '--'}
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{
                ...Typography.styles.caption,
                color: Colors.text.secondary,
                fontSize: 12,
                marginBottom: 4,
              }}>
                SAT / ACT
              </Text>
              <Text style={{
                ...Typography.styles.h3,
                color: Colors.text.primary,
                fontWeight: '600',
                fontSize: 20,
              }}>
                {profile.satScore || profile.actScore ? 
                  `${profile.satScore || '--'} / ${profile.actScore || '--'}` : 
                  '-- / --'
                }
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text style={{
                ...Typography.styles.caption,
                color: Colors.text.secondary,
                fontSize: 12,
                marginBottom: 4,
              }}>
                Grad Year
              </Text>
              <Text style={{
                ...Typography.styles.h3,
                color: Colors.text.primary,
                fontWeight: '600',
                fontSize: 24,
              }}>
                '{profile.graduationYear.toString().slice(-2)}
              </Text>
            </View>
          </>
        ) : (
          <>
            <View style={{ flex: 1 }}>
              <Text style={{
                ...Typography.styles.caption,
                color: Colors.text.secondary,
                fontSize: 12,
                marginBottom: 4,
              }}>
                Position
              </Text>
              <Text style={{
                ...Typography.styles.h3,
                color: Colors.text.primary,
                fontWeight: '600',
                fontSize: 18,
              }}>
                {profile.position}
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{
                ...Typography.styles.caption,
                color: Colors.text.secondary,
                fontSize: 12,
                marginBottom: 4,
              }}>
                Height
              </Text>
              <Text style={{
                ...Typography.styles.h3,
                color: Colors.text.primary,
                fontWeight: '600',
                fontSize: 18,
              }}>
                {profile.height || '--'}
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text style={{
                ...Typography.styles.caption,
                color: Colors.text.secondary,
                fontSize: 12,
                marginBottom: 4,
              }}>
                Weight
              </Text>
              <Text style={{
                ...Typography.styles.h3,
                color: Colors.text.primary,
                fontWeight: '600',
                fontSize: 18,
              }}>
                {profile.weight || '--'}
              </Text>
            </View>
          </>
        )}
      </View>
    </MotiView>
  );
};

// Main Recruiting Screen
export default function RecruitingScreen() {
  const [schools, setSchools] = useState<School[]>([
    {
      id: '1',
      name: 'Duke University',
      division: 'NCAA Division I',
      location: 'Durham, NC',
      category: 'reach',
      deadline: '2024-12-01',
    },
    {
      id: '2',
      name: 'University of Virginia',
      division: 'NCAA Division I',
      location: 'Charlottesville, VA',
      category: 'realistic',
      deadline: '2024-11-15',
    },
    {
      id: '3',
      name: 'James Madison University',
      division: 'NCAA Division I',
      location: 'Harrisonburg, VA',
      category: 'safe',
      deadline: '2025-01-15',
    },
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Email intro to coaches', completed: false, category: 'athletic', dueDate: '2024-10-15' },
    { id: '2', title: 'Request transcript', completed: true, category: 'academic' },
    { id: '3', title: 'Complete recruiting questionnaires', completed: false, category: 'application', dueDate: '2024-10-30' },
    { id: '4', title: 'Schedule campus visits', completed: false, category: 'application' },
    { id: '5', title: 'Update highlight reel', completed: true, category: 'athletic' },
    { id: '6', title: 'Submit SAT scores', completed: false, category: 'academic', dueDate: '2024-11-01' },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'reach' | 'realistic' | 'safe'>('realistic');
  const [editingSchool, setEditingSchool] = useState<School | undefined>();

  const [profile] = useState<AthleteProfile>({
    gpa: 3.85,
    satScore: 1420,
    actScore: 32,
    graduationYear: 2025,
    position: 'Goalkeeper',
    height: '6\'2"',
    weight: '185 lbs',
  });

  const [showAcademic, setShowAcademic] = useState(false);

  const categoryColors = {
    reach: Colors.status.error,
    realistic: Colors.brand.primary,
    safe: Colors.status.success,
  };

  const getSchoolsByCategory = (category: 'reach' | 'realistic' | 'safe') => {
    return schools.filter(school => school.category === category);
  };

  const handleAddSchool = (category: 'reach' | 'realistic' | 'safe') => {
    setSelectedCategory(category);
    setEditingSchool(undefined);
    setModalVisible(true);
  };

  const handleEditSchool = (school: School) => {
    setEditingSchool(school);
    setSelectedCategory(school.category);
    setModalVisible(true);
  };

  const handleSaveSchool = (schoolData: Omit<School, 'id'>) => {
    if (editingSchool) {
      // Update existing school
      setSchools(prev => prev.map(school => 
        school.id === editingSchool.id 
          ? { ...school, ...schoolData }
          : school
      ));
    } else {
      // Add new school
      const newSchool: School = {
        ...schoolData,
        id: Date.now().toString(),
      };
      setSchools(prev => [...prev, newSchool]);
    }
  };

  const handleMoveSchool = (school: School) => {
    const categories = ['reach', 'realistic', 'safe'] as const;
    const currentIndex = categories.indexOf(school.category);
    const nextCategory = categories[(currentIndex + 1) % categories.length];
    
    setSchools(prev => prev.map(s => 
      s.id === school.id 
        ? { ...s, category: nextCategory }
        : s
    ));
  };

  const handleDeleteSchool = (schoolId: string) => {
    Alert.alert(
      'Delete School',
      'Are you sure you want to remove this school?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => setSchools(prev => prev.filter(s => s.id !== schoolId))
        },
      ]
    );
  };

  const handleToggleTask = async (taskId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const handleToggleView = () => {
    setShowAcademic(!showAcademic);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.surface.primary }} edges={['top']}>
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ 
          padding: Spacing.lg,
          paddingTop: Spacing.md,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <MotiView
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400 }}
        >
          <Text style={{
            ...Typography.styles.h1,
            color: Colors.text.primary,
            fontWeight: '700',
            fontSize: 32,
            lineHeight: 38,
            marginBottom: Spacing.sm,
          }}>
            Recruiting
          </Text>
          <Text style={{
            ...Typography.styles.body,
            color: Colors.text.secondary,
            fontSize: 16,
            lineHeight: 22,
            marginBottom: Spacing.xl,
          }}>
            Track your athlete journey and target schools
          </Text>
        </MotiView>

        {/* Profile Header */}
        <ProfileHeader 
          profile={profile}
          showAcademic={showAcademic}
          onToggleView={handleToggleView}
        />

        {/* School Categories */}
        {(['reach', 'realistic', 'safe'] as const).map((category, categoryIndex) => {
          const categorySchools = getSchoolsByCategory(category);
          const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
          
          return (
            <MotiView
              key={category}
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 500, delay: categoryIndex * 150 }}
              style={{ marginBottom: Spacing.xl }}
            >
              <CategoryHeader
                title={categoryTitle}
                count={categorySchools.length}
                color={categoryColors[category]}
                onAddSchool={() => handleAddSchool(category)}
              />
              
              {categorySchools.length > 0 ? (
                categorySchools.map((school) => (
                  <SchoolCard
                    key={school.id}
                    school={school}
                    onEdit={handleEditSchool}
                    onMove={handleMoveSchool}
                    onDelete={handleDeleteSchool}
                  />
                ))
              ) : (
                <View style={{
                  backgroundColor: Colors.surface.elevated,
                  borderRadius: BorderRadius.lg,
                  padding: Spacing.xl,
                  alignItems: 'center',
                  marginBottom: Spacing.md,
                  borderWidth: 2,
                  borderColor: Colors.border.secondary,
                  borderStyle: 'dashed',
                }}>
                  <Ionicons name="add-circle-outline" size={32} color={Colors.text.secondary} />
                  <Text style={{
                    ...Typography.styles.body,
                    color: Colors.text.secondary,
                    textAlign: 'center',
                    marginTop: Spacing.sm,
                  }}>
                    No {category} schools yet.{'\n'}Tap + to add your first school.
                  </Text>
                </View>
              )}
            </MotiView>
          );
        })}

        {/* Task Checklist */}
        <TaskChecklist tasks={tasks} onToggleTask={handleToggleTask} />

        {/* Locked Features */}
        <LockedFeaturesSection />
      </ScrollView>

      {/* Add School Modal */}
      <AddSchoolModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveSchool}
        initialCategory={selectedCategory}
        editingSchool={editingSchool}
      />
    </SafeAreaView>
  );
}
