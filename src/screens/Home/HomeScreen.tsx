/**
 * Home Screen — Command Center
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Linking,
  useWindowDimensions,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { MaterialCommunityIconName } from '../../types/icons';
import BenchCard from '../../components/BenchCard';
import SectionHeader from '../../components/SectionHeader';
import { theme } from '../../theme';
import { starterStorage } from '../../services/starterStorage';
import { getNextFeedingText, isFeedingOverdue } from '../../utils/starterHealth';
import type { Starter } from '../../types';
import type { HomeStackParamList, MainTabParamList } from '../../navigation/types';

type HomeNavProp = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, 'Home'>,
  BottomTabNavigationProp<MainTabParamList>
>;

// Shared card sizing tokens for Home + Tools screens
const SCREEN_HORIZONTAL_PADDING = theme.spacing.lg;
const GRID_GAP = theme.spacing.md;
const QUICK_GRID_COLUMNS = 2;
const FEATURE_CARD_MIN_HEIGHT = 148;
const FEATURE_ICON_WRAP = 48;
const FEATURE_ICON_SIZE = 28;
const QUICK_TILE_MIN_HEIGHT = 124;
const QUICK_ICON_WRAP = 40;
const QUICK_ICON_SIZE = 22;

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [soonestStarter, setSoonestStarter] = useState<Starter | null>(null);
  const { width: windowWidth } = useWindowDimensions();
  // Flex calculation: subtract screen side padding and the (columns - 1) gaps,
  // then divide by the column count so tiles fit flush with the row gap.
  const quickTileWidth =
    (windowWidth - SCREEN_HORIZONTAL_PADDING * 2 - GRID_GAP * (QUICK_GRID_COLUMNS - 1)) /
    QUICK_GRID_COLUMNS;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  useFocusEffect(
    useCallback(() => {
      starterStorage.getAll().then((starters) => {
        if (starters.length === 0) {
          setSoonestStarter(null);
          return;
        }
        const active = starters.filter((s) => s.isActive && s.nextFeedingDue);
        if (active.length === 0) {
          setSoonestStarter(null);
          return;
        }
        const sorted = [...active].sort(
          (a, b) =>
            new Date(a.nextFeedingDue!).getTime() -
            new Date(b.nextFeedingDue!).getTime()
        );
        setSoonestStarter(sorted[0]);
      });
    }, [])
  );

  const handleSocialPress = (url: string) => {
    Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  };

  const socialLinks: { icon: MaterialCommunityIconName; url: string; color: string }[] = [
    { icon: 'youtube', url: 'https://youtube.com/@SourdoughSuite', color: '#FF0000' },
    { icon: 'instagram', url: 'https://instagram.com/sourdoughsuite', color: '#E1306C' },
    { icon: 'facebook', url: 'https://facebook.com/sourdoughsuite', color: '#1877F2' },
    { icon: 'music-note-eighth', url: 'https://tiktok.com/@sourdoughsuite', color: '#000000' },
  ];

  const isOverdue = soonestStarter ? isFeedingOverdue(soonestStarter.nextFeedingDue) : false;
  const nextFeedingText = soonestStarter
    ? getNextFeedingText(soonestStarter.nextFeedingDue)
    : null;

  const quickTools: {
    icon: MaterialCommunityIconName;
    title: string;
    sub: string;
    color: string;
    onPress: () => void;
  }[] = [
    {
      icon: 'calculator',
      title: 'Calculators',
      sub: '11 tools',
      color: theme.colors.primary[600],
      onPress: () => navigation.navigate('ToolsTab' as never),
    },
    {
      icon: 'bacteria',
      title: 'Starters',
      sub: 'Track health',
      color: theme.colors.bench.starterGreen,
      onPress: () => navigation.navigate('StartersTab' as never),
    },
    {
      icon: 'book-open-variant',
      title: 'Recipes',
      sub: 'Saved formulas',
      color: theme.colors.bench.crumb,
      onPress: () => navigation.navigate('RecipesTab' as never),
    },
    {
      icon: 'school',
      title: 'Academy',
      sub: 'Master the craft',
      color: theme.colors.bench.waterBlue,
      onPress: () => navigation.navigate('Learn' as never),
    },
  ];

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Warm Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.appName}>SourdoughSuite</Text>
              <Text style={styles.tagline}>Your baker's workbench</Text>
            </View>
            <View style={styles.logoMark}>
              <Icon name="bread-slice" size={28} color={theme.colors.bench.copper} />
            </View>
          </View>
        </View>

        <View style={styles.content}>

          {/* Next Up Card */}
          <View style={styles.section}>
            <SectionHeader eyebrow="What's next" title="Next Up" />
            {soonestStarter ? (
              <TouchableOpacity
                onPress={() => navigation.navigate('StartersTab' as never)}
                activeOpacity={0.82}
              >
                <BenchCard variant={isOverdue ? 'hero' : 'default'} style={styles.nextUpCard}>
                  <View style={styles.nextUpRow}>
                    <View
                      style={[
                        styles.nextUpIcon,
                        { backgroundColor: isOverdue ? theme.colors.bench.heatRed + '20' : theme.colors.bench.starterGreen + '20' },
                      ]}
                    >
                      <Icon
                        name="bacteria"
                        size={28}
                        color={isOverdue ? theme.colors.bench.heatRed : theme.colors.bench.starterGreen}
                      />
                    </View>
                    <View style={styles.nextUpInfo}>
                      <Text style={styles.nextUpName}>{soonestStarter.name}</Text>
                      <Text
                        style={[
                          styles.nextUpTime,
                          isOverdue && styles.nextUpTimeOverdue,
                        ]}
                      >
                        {nextFeedingText}
                      </Text>
                    </View>
                    <Icon name="chevron-right" size={20} color={theme.colors.text.disabled} />
                  </View>
                </BenchCard>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => navigation.navigate('StartersTab' as never)}
                activeOpacity={0.82}
              >
                <BenchCard variant="filled" style={styles.emptyNextUp}>
                  <Icon name="bacteria-outline" size={32} color={theme.colors.bench.copper} />
                  <Text style={styles.emptyNextUpTitle}>Add your first starter</Text>
                  <Text style={styles.emptyNextUpSub}>
                    Track feedings and monitor health from here
                  </Text>
                </BenchCard>
              </TouchableOpacity>
            )}
          </View>

          {/* Primary Action Buttons */}
          <View style={styles.section}>
            <SectionHeader eyebrow="AI Tools" title="Rescue & Plan" />
            <View style={styles.primaryActions}>
              <TouchableOpacity
                style={styles.primaryActionBtn}
                onPress={() =>
                  navigation.navigate('ToolsTab', { screen: 'PhotoRescue' })
                }
                activeOpacity={0.82}
              >
                <BenchCard variant="hero" padding="lg" style={styles.primaryCard}>
                  <View style={[styles.primaryIconWrap, { backgroundColor: theme.colors.bench.heatRed + '18' }]}>
                    <Icon name="camera-iris" size={FEATURE_ICON_SIZE} color={theme.colors.bench.heatRed} />
                  </View>
                  <Text style={styles.primaryTitle}>Photo Rescue</Text>
                  <Text style={styles.primarySub}>Diagnose your dough from a photo</Text>
                </BenchCard>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.primaryActionBtn}
                onPress={() =>
                  navigation.navigate('ToolsTab', { screen: 'BakeDayCopilot', params: {} })
                }
                activeOpacity={0.82}
              >
                <BenchCard variant="hero" padding="lg" style={styles.primaryCard}>
                  <View style={[styles.primaryIconWrap, { backgroundColor: theme.colors.bench.copper + '18' }]}>
                    <Icon name="calendar-clock" size={FEATURE_ICON_SIZE} color={theme.colors.bench.copper} />
                  </View>
                  <Text style={styles.primaryTitle}>Bake Day Copilot</Text>
                  <Text style={styles.primarySub}>Personalized bake timeline</Text>
                </BenchCard>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Tools Grid */}
          <View style={styles.section}>
            <SectionHeader eyebrow="Navigate" title="Quick Access" />
            <View style={styles.quickGrid}>
              {quickTools.map((tool, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.quickTile, { width: quickTileWidth }]}
                  onPress={tool.onPress}
                  activeOpacity={0.78}
                >
                  <BenchCard variant="default" padding="md" style={styles.quickCard}>
                    <View style={[styles.quickIcon, { backgroundColor: tool.color + '18' }]}>
                      <Icon name={tool.icon} size={QUICK_ICON_SIZE} color={tool.color} />
                    </View>
                    <Text style={styles.quickTitle}>{tool.title}</Text>
                    <Text style={styles.quickSub}>{tool.sub}</Text>
                  </BenchCard>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Social Footer — de-emphasized */}
          <View style={styles.socialFooter}>
            <Text style={styles.socialLabel}>Follow us</Text>
            <View style={styles.socialIcons}>
              {socialLinks.map((link, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.socialButton}
                  onPress={() => handleSocialPress(link.url)}
                >
                  <Icon name={link.icon} size={20} color={link.color} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: theme.colors.background.paper,
    paddingTop: 60,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.bench.borderSoft,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appName: {
    fontSize: theme.typography.sizes['3xl'],
    fontFamily: theme.typography.fonts.heading,
    color: theme.colors.bench.crust,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fonts.regular,
    color: theme.colors.bench.crumb,
    marginTop: 2,
  },
  logoMark: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.colors.bench.parchment,
    borderWidth: 1,
    borderColor: theme.colors.bench.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  nextUpCard: {
    marginBottom: 0,
  },
  nextUpRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextUpIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextUpInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  nextUpName: {
    fontSize: theme.typography.sizes.base,
    fontFamily: theme.typography.fonts.semibold,
    color: theme.colors.bench.crust,
    marginBottom: 2,
  },
  nextUpTime: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fonts.regular,
    color: theme.colors.bench.crumb,
  },
  nextUpTimeOverdue: {
    color: theme.colors.bench.heatRed,
    fontFamily: theme.typography.fonts.semibold,
  },
  emptyNextUp: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  emptyNextUpTitle: {
    fontSize: theme.typography.sizes.base,
    fontFamily: theme.typography.fonts.semibold,
    color: theme.colors.bench.crust,
  },
  emptyNextUpSub: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fonts.regular,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  primaryActions: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: theme.spacing.md,
  },
  primaryActionBtn: {
    flex: 1,
  },
  primaryCard: {
    flex: 1,
    minHeight: FEATURE_CARD_MIN_HEIGHT,
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  primaryIconWrap: {
    width: FEATURE_ICON_WRAP,
    height: FEATURE_ICON_WRAP,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryTitle: {
    fontSize: theme.typography.sizes.base,
    fontFamily: theme.typography.fonts.semibold,
    color: theme.colors.bench.crust,
  },
  primarySub: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.typography.fonts.regular,
    color: theme.colors.text.secondary,
    lineHeight: 16,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
  quickTile: {
    // width is computed at render time from useWindowDimensions so it
    // stays correct on rotation/resize and accounts for the row gap.
  },
  quickCard: {
    flex: 1,
    minHeight: QUICK_TILE_MIN_HEIGHT,
    gap: theme.spacing.xs,
  },
  quickIcon: {
    width: QUICK_ICON_WRAP,
    height: QUICK_ICON_WRAP,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xs,
  },
  quickTitle: {
    fontSize: theme.typography.sizes.base,
    fontFamily: theme.typography.fonts.semibold,
    color: theme.colors.bench.crust,
  },
  quickSub: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.typography.fonts.regular,
    color: theme.colors.text.secondary,
  },
  socialFooter: {
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.bench.borderSoft,
    gap: theme.spacing.md,
  },
  socialLabel: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.typography.fonts.semibold,
    color: theme.colors.text.tertiary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  socialIcons: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.background.paper,
    borderWidth: 1,
    borderColor: theme.colors.bench.borderSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
