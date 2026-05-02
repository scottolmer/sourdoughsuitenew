import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

import { theme } from '../../theme';
import Button from '../../components/Button';
import ModernistScreen from '../../components/ModernistScreen';
import FormulaSheet from '../../components/FormulaSheet';
import RuleHeader from '../../components/RuleHeader';
import BasicInput from '../../components/BasicInput';
import SegmentedControl from '../../components/SegmentedControl';
import type { ToolsStackParamList } from '../../navigation/types';
import type { PhotoSubject } from '../../types/photoRescue';
import { analyzePhoto, PhotoRescueFallbackError } from '../../services/photoRescueApi';
import { QUICK_RESCUE_QUESTIONS, runQuickRescue } from '../../utils/quickRescue';
import type { QuickRescueAnswers } from '../../types/photoRescue';

const SAMPLE_DOUGH = require('../../../assets/images/sample-dough.png');

type NavigationProp = NativeStackNavigationProp<ToolsStackParamList>;

const SUBJECT_OPTIONS: { label: string; value: PhotoSubject }[] = [
  { label: 'Dough', value: 'dough' },
  { label: 'Starter', value: 'starter' },
  { label: 'Crumb', value: 'crumb' },
  { label: 'Loaf', value: 'loaf' },
];

const STAGE_CHIPS: Record<PhotoSubject, string[]> = {
  dough: ['Early bulk', 'Late bulk', 'Pre-shape', 'Shaping'],
  starter: ['Just fed', 'Rising', 'Peak', 'Past peak'],
  crumb: ['Just cut', 'After cooling'],
  loaf: ['Just baked', 'After cooling'],
};

type QuickRescueMode = 'input' | 'questions';

function imageUriToBase64(uri: string): Promise<{ base64: string; mimeType: 'image/jpeg' | 'image/png' | 'image/webp' }> {
  if (uri.startsWith('data:')) {
    const [header, data] = uri.split(',');
    const mime = header.match(/data:(image\/\w+);base64/)?.[1] ?? 'image/jpeg';
    return Promise.resolve({ base64: data, mimeType: mime as 'image/jpeg' | 'image/png' | 'image/webp' });
  }
  return fetch(uri)
    .then(r => r.blob())
    .then(blob => new Promise<{ base64: string; mimeType: 'image/jpeg' | 'image/png' | 'image/webp' }>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const [header, data] = dataUrl.split(',');
        const mime = (header.match(/data:(image\/\w+);base64/)?.[1] ?? 'image/jpeg') as 'image/jpeg' | 'image/png' | 'image/webp';
        resolve({ base64: data, mimeType: mime });
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    }));
}

export default function PhotoRescueScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [subject, setSubject] = useState<PhotoSubject>('dough');
  const [stage, setStage] = useState<string>('');
  const [roomTemp, setRoomTemp] = useState<string>('');
  const [hoursElapsed, setHoursElapsed] = useState<string>('');
  const [hydration, setHydration] = useState<string>('');
  const [starterHealth, setStarterHealth] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [quickRescueMode, setQuickRescueMode] = useState<QuickRescueMode>('input');
  const [qrStep, setQrStep] = useState(0);
  const [qrAnswers, setQrAnswers] = useState<Record<string, string | string[]>>({});
  const [qrSelectedSigns, setQrSelectedSigns] = useState<string[]>([]);

  const pickImage = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        base64: false,
      });
      if (!result.canceled && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
        setError(null);
      }
    } catch {
      setError('Could not open the photo picker. Try the sample dough photo instead.');
    }
  }, []);

  const useSamplePhoto = useCallback(() => {
    setImageUri('sample');
    setError(null);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!imageUri) {
      setError('Choose a photo or tap "Use sample dough photo" to continue.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let base64 = '';
      let mimeType: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/jpeg';

      if (imageUri === 'sample') {
        const asset = Image.resolveAssetSource(SAMPLE_DOUGH);
        const result = await imageUriToBase64(asset.uri);
        base64 = result.base64;
        mimeType = result.mimeType;
      } else {
        const result = await imageUriToBase64(imageUri);
        base64 = result.base64;
        mimeType = result.mimeType;
      }

      const elapsedMinutes = hoursElapsed ? parseFloat(hoursElapsed) * 60 : undefined;

      const diagnosis = await analyzePhoto({
        imageBase64: base64,
        mimeType,
        context: {
          subject,
          stage: stage || undefined,
          roomTempF: roomTemp ? parseFloat(roomTemp) : undefined,
          elapsedMinutes,
          hydrationPercent: hydration ? parseFloat(hydration) : undefined,
          notes: starterHealth ? `Starter: ${starterHealth}` : undefined,
        },
      });

      navigation.navigate('DiagnosisResult', {
        diagnosis,
        imageUri: imageUri === 'sample' ? undefined : imageUri,
      });
    } catch (err) {
      if (err instanceof PhotoRescueFallbackError) {
        // Fall back to quick rescue using whatever context the user provided.
        const elapsedMinutes = hoursElapsed ? parseFloat(hoursElapsed) * 60 : undefined;
        const qrInput: QuickRescueAnswers = {
          subject,
          stage: stage || undefined,
          roomTempF: roomTemp ? parseFloat(roomTemp) : undefined,
          elapsedMinutes,
          observedSigns: [],
          hydrationPercent: hydration ? parseFloat(hydration) : undefined,
        };
        const diagnosis = runQuickRescue(qrInput);
        navigation.navigate('DiagnosisResult', { diagnosis, imageUri: undefined, isQuickRescue: true });
      } else {
        setError('Something went wrong. Try again or use the quick rescue checklist below.');
      }
    } finally {
      setLoading(false);
    }
  }, [imageUri, subject, stage, roomTemp, hoursElapsed, hydration, starterHealth, navigation]);

  const handleQuickRescueSingleSelect = (key: string, value: string) => {
    setQrAnswers(prev => ({ ...prev, [key]: value }));
    if (qrStep < QUICK_RESCUE_QUESTIONS.length - 1) {
      setQrStep(s => s + 1);
    } else {
      finishQuickRescue({ ...qrAnswers, [key]: value });
    }
  };

  const handleSignsToggle = (sign: string) => {
    setQrSelectedSigns(prev =>
      prev.includes(sign) ? prev.filter(s => s !== sign) : [...prev, sign]
    );
  };

  const finishQuickRescue = (answers: Record<string, string | string[]>) => {
    const subjectVal = (answers.subject as string || subject) as PhotoSubject;
    const stageVal = answers.stage as string | undefined;
    const signsVal = (answers.signs as string[]) || qrSelectedSigns;

    const elapsed_ = answers.elapsed as string | undefined;
    let elapsedMins: number | undefined;
    if (elapsed_?.includes('2–4')) elapsedMins = 180;
    else if (elapsed_?.includes('4–6')) elapsedMins = 300;
    else if (elapsed_?.includes('6–10')) elapsedMins = 480;
    else if (elapsed_?.includes('Overnight')) elapsedMins = 600;
    else if (elapsed_?.includes('Less')) elapsedMins = 60;

    const tempStr = answers.roomTemp as string | undefined;
    let tempF: number | undefined;
    if (tempStr?.includes('Below 65')) tempF = 63;
    else if (tempStr?.includes('65–70')) tempF = 68;
    else if (tempStr?.includes('71–74')) tempF = 72;
    else if (tempStr?.includes('75–79')) tempF = 77;
    else if (tempStr?.includes('80')) tempF = 82;

    const qrInput: QuickRescueAnswers = {
      subject: subjectVal,
      stage: stageVal && stageVal !== 'Other / not sure' ? stageVal : undefined,
      roomTempF: tempF,
      elapsedMinutes: elapsedMins,
      observedSigns: signsVal,
    };

    const diagnosis = runQuickRescue(qrInput);
    navigation.navigate('DiagnosisResult', { diagnosis, imageUri: undefined, isQuickRescue: true });
  };

  const handleSignsDone = () => {
    const nextAnswers = { ...qrAnswers, signs: qrSelectedSigns };
    setQrAnswers(nextAnswers);
    if (qrStep < QUICK_RESCUE_QUESTIONS.length - 1) {
      setQrStep(s => s + 1);
    } else {
      finishQuickRescue(nextAnswers);
    }
  };

  const triggerQuickRescue = () => {
    setQuickRescueMode('questions');
    setQrStep(0);
    setQrAnswers({ subject });
    setQrSelectedSigns([]);
  };

  // ─────────────────────────────────────────────────────────
  // Quick-rescue checklist mode
  // ─────────────────────────────────────────────────────────
  if (quickRescueMode === 'questions') {
    const q = QUICK_RESCUE_QUESTIONS[qrStep];
    const isSignsStep = q.key === 'signs';

    return (
      <ModernistScreen background="paper">
        <FormulaSheet topRule background="porcelain" padding="md" style={styles.modeBanner}>
          <View style={styles.bannerRow}>
            <Icon name="clipboard-check-outline" size={16} color={theme.colors.modernist.copper} />
            <Text style={styles.bannerText}>Using quick rescue checklist</Text>
          </View>
          <Text style={styles.bannerSub}>Rule-based guidance — your photo was not analyzed.</Text>
        </FormulaSheet>

        <Text style={styles.qrProgress}>
          QUESTION {qrStep + 1} OF {QUICK_RESCUE_QUESTIONS.length}
        </Text>
        <Text style={styles.qrQuestion}>{q.question}</Text>

        {isSignsStep ? (
          <>
            <View style={styles.chipsWrap}>
              {q.options.map((opt, idx) => {
                const display = q.displayLabels?.[idx] ?? opt;
                const active = qrSelectedSigns.includes(opt);
                return (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => handleSignsToggle(opt)}
                    style={[styles.chip, active && styles.chipActive]}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {display}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Button
              title={`Continue with ${qrSelectedSigns.length} selected`}
              onPress={handleSignsDone}
              fullWidth
              style={styles.actionTopGap}
              disabled={qrSelectedSigns.length === 0}
            />
          </>
        ) : (
          <View style={styles.qrOptions}>
            {q.options.map((opt, idx) => {
              const display = q.displayLabels?.[idx] ?? opt;
              return (
                <TouchableOpacity
                  key={opt}
                  onPress={() => handleQuickRescueSingleSelect(q.key, opt)}
                  style={styles.qrOption}
                  activeOpacity={0.85}
                >
                  <Text style={styles.qrOptionText}>{display}</Text>
                  <Icon name="chevron-right" size={18} color={theme.colors.modernist.graphiteMuted} />
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {qrStep > 0 && (
          <TouchableOpacity onPress={() => setQrStep(s => s - 1)} style={styles.backLink}>
            <Icon name="chevron-left" size={16} color={theme.colors.modernist.graphiteMuted} />
            <Text style={styles.backLinkText}>Back</Text>
          </TouchableOpacity>
        )}
      </ModernistScreen>
    );
  }

  // ─────────────────────────────────────────────────────────
  // Main input mode
  // ─────────────────────────────────────────────────────────
  const stageChips = STAGE_CHIPS[subject];

  return (
    <ModernistScreen background="paper">
      <View style={styles.titleBlock}>
        <Text style={styles.title}>Photo Rescue</Text>
        <Text style={styles.subtitle}>
          Pick a subject, share a photo, and add any context you have. We'll diagnose the most likely issue.
        </Text>
      </View>

      {/* Subject control — always at the top so the analysis frame is set first. */}
      <RuleHeader title="SUBJECT" />
      <SegmentedControl
        options={SUBJECT_OPTIONS}
        value={subject}
        onChange={(v) => {
          setSubject(v);
          setStage('');
        }}
      />

      {/* Image input */}
      <View style={styles.section}>
        <RuleHeader title="PHOTO" />
        <FormulaSheet background="porcelain" padding="none" style={styles.imageSheet}>
          {imageUri && imageUri !== 'sample' ? (
            <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" />
          ) : imageUri === 'sample' ? (
            <Image source={SAMPLE_DOUGH} style={styles.preview} resizeMode="cover" />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Icon name="image-outline" size={32} color={theme.colors.modernist.hairlineDark} />
              <Text style={styles.placeholderText}>No photo selected</Text>
            </View>
          )}

          <View style={styles.imageActions}>
            <TouchableOpacity style={styles.imageBtn} onPress={useSamplePhoto} activeOpacity={0.8}>
              <Icon name="grain" size={16} color={theme.colors.modernist.ink} />
              <Text style={styles.imageBtnText}>Use sample dough photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageBtnSecondary} onPress={pickImage} activeOpacity={0.8}>
              <Icon name="image-plus" size={16} color={theme.colors.modernist.ink} />
              <Text style={styles.imageBtnText}>Upload</Text>
            </TouchableOpacity>
          </View>
        </FormulaSheet>
      </View>

      {/* Context — compact rows on a single sheet */}
      <View style={styles.section}>
        <RuleHeader title="CONTEXT" trailing="OPTIONAL" />
        <FormulaSheet background="porcelain" padding="lg">
          <View style={styles.contextRow}>
            <Text style={styles.contextLabel}>Stage</Text>
            <View style={styles.contextValue}>
              <View style={styles.chipsWrap}>
                {stageChips.map(s => {
                  const active = stage === s;
                  return (
                    <TouchableOpacity
                      key={s}
                      onPress={() => setStage(active ? '' : s)}
                      style={[styles.chipSm, active && styles.chipSmActive]}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.chipSmText, active && styles.chipSmTextActive]}>{s}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          <View style={styles.contextSplit}>
            <BasicInput
              label="Hydration %"
              placeholder="e.g. 78"
              value={hydration}
              onChangeText={setHydration}
              keyboardType="numeric"
              containerStyle={styles.contextHalf}
            />
            <BasicInput
              label="Hours bulked"
              placeholder="e.g. 4"
              value={hoursElapsed}
              onChangeText={setHoursElapsed}
              keyboardType="numeric"
              containerStyle={styles.contextHalf}
            />
          </View>

          <View style={styles.contextSplit}>
            <BasicInput
              label="Ambient temp (°F)"
              placeholder="e.g. 72"
              value={roomTemp}
              onChangeText={setRoomTemp}
              keyboardType="numeric"
              containerStyle={styles.contextHalf}
            />
            <BasicInput
              label="Starter health"
              placeholder="weak / okay / strong"
              value={starterHealth}
              onChangeText={setStarterHealth}
              autoCapitalize="none"
              containerStyle={styles.contextHalf}
            />
          </View>
        </FormulaSheet>
      </View>

      {error ? (
        <FormulaSheet background="porcelain" padding="md" style={styles.errorSheet}>
          <View style={styles.bannerRow}>
            <Icon name="alert-circle-outline" size={16} color={theme.colors.modernist.heatRed} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        </FormulaSheet>
      ) : null}

      <View style={styles.actionBlock}>
        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={theme.colors.modernist.copper} />
            <Text style={styles.loadingText}>Analyzing photo…</Text>
          </View>
        ) : null}
        <Button
          title="ANALYZE"
          onPress={handleAnalyze}
          fullWidth
          loading={loading}
          leftIcon="magnify"
        />
        <TouchableOpacity onPress={triggerQuickRescue} style={styles.fallbackLink}>
          <Icon name="clipboard-check-outline" size={14} color={theme.colors.modernist.graphiteMuted} />
          <Text style={styles.fallbackText}>Skip photo — use quick rescue checklist</Text>
        </TouchableOpacity>
      </View>
    </ModernistScreen>
  );
}

const styles = StyleSheet.create({
  titleBlock: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontFamily: theme.typography.roles.display,
    fontSize: theme.typography.sizes['2xl'],
    color: theme.colors.modernist.ink,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontFamily: theme.typography.roles.body,
    fontSize: 14,
    color: theme.colors.modernist.graphiteMuted,
    lineHeight: 20,
  },
  section: {
    marginTop: theme.spacing.lg,
  },

  // image sheet
  imageSheet: {
    overflow: 'hidden',
  },
  preview: {
    width: '100%',
    height: 200,
  },
  imagePlaceholder: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.modernist.paperWarm,
  },
  placeholderText: {
    fontFamily: theme.typography.roles.body,
    fontSize: 12,
    color: theme.colors.modernist.graphiteMuted,
    marginTop: 6,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  imageActions: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.modernist.hairline,
  },
  imageBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.modernist.ink,
    backgroundColor: theme.colors.modernist.paper,
  },
  imageBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.modernist.hairlineDark,
    backgroundColor: theme.colors.modernist.paper,
  },
  imageBtnText: {
    fontFamily: theme.typography.roles.bodySemibold,
    fontSize: 12,
    color: theme.colors.modernist.ink,
    letterSpacing: 0.4,
  },

  // context rows
  contextRow: {
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.modernist.hairline,
    marginBottom: theme.spacing.md,
  },
  contextLabel: {
    fontFamily: theme.typography.roles.bodySemibold,
    fontSize: 11,
    color: theme.colors.modernist.graphiteMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.sm,
  },
  contextValue: {
    width: '100%',
  },
  contextSplit: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  contextHalf: {
    flex: 1,
    marginBottom: theme.spacing.sm,
  },

  // chips
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  chip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.modernist.hairlineDark,
    backgroundColor: theme.colors.modernist.paper,
  },
  chipActive: {
    backgroundColor: theme.colors.modernist.ink,
    borderColor: theme.colors.modernist.ink,
  },
  chipText: {
    fontFamily: theme.typography.roles.bodyMedium,
    fontSize: 13,
    color: theme.colors.modernist.ink,
  },
  chipTextActive: {
    color: theme.colors.modernist.paper,
  },
  chipSm: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.modernist.hairlineDark,
    backgroundColor: theme.colors.modernist.paper,
  },
  chipSmActive: {
    backgroundColor: theme.colors.modernist.ink,
    borderColor: theme.colors.modernist.ink,
  },
  chipSmText: {
    fontFamily: theme.typography.roles.bodyMedium,
    fontSize: 12,
    color: theme.colors.modernist.ink,
  },
  chipSmTextActive: {
    color: theme.colors.modernist.paper,
  },

  // analyze block
  actionBlock: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  loadingText: {
    fontFamily: theme.typography.roles.bodyMedium,
    fontSize: 13,
    color: theme.colors.modernist.graphiteMuted,
  },
  fallbackLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: theme.spacing.md,
  },
  fallbackText: {
    fontFamily: theme.typography.roles.body,
    fontSize: 13,
    color: theme.colors.modernist.graphiteMuted,
  },

  // error sheet
  errorSheet: {
    marginTop: theme.spacing.md,
    borderColor: theme.colors.modernist.heatRed,
  },
  errorText: {
    flex: 1,
    fontFamily: theme.typography.roles.body,
    fontSize: 13,
    color: theme.colors.modernist.heatRed,
    lineHeight: 18,
  },

  // quick rescue mode
  modeBanner: {
    marginBottom: theme.spacing.lg,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  bannerText: {
    fontFamily: theme.typography.roles.bodySemibold,
    fontSize: 13,
    color: theme.colors.modernist.copper,
    letterSpacing: 0.3,
  },
  bannerSub: {
    fontFamily: theme.typography.roles.body,
    fontSize: 12,
    color: theme.colors.modernist.graphiteMuted,
    lineHeight: 16,
  },
  qrProgress: {
    fontFamily: theme.typography.roles.bodySemibold,
    fontSize: 11,
    color: theme.colors.modernist.graphiteMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.sm,
  },
  qrQuestion: {
    fontFamily: theme.typography.roles.display,
    fontSize: 22,
    color: theme.colors.modernist.ink,
    marginBottom: theme.spacing.lg,
    lineHeight: 28,
  },
  qrOptions: {
    gap: theme.spacing.sm,
  },
  qrOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: 8,
    backgroundColor: theme.colors.modernist.porcelain,
    borderWidth: 1,
    borderColor: theme.colors.modernist.hairline,
  },
  qrOptionText: {
    fontFamily: theme.typography.roles.bodyMedium,
    fontSize: 15,
    color: theme.colors.modernist.ink,
  },
  actionTopGap: {
    marginTop: theme.spacing.lg,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    marginTop: theme.spacing.lg,
  },
  backLinkText: {
    fontFamily: theme.typography.roles.body,
    fontSize: 13,
    color: theme.colors.modernist.graphiteMuted,
  },
});
