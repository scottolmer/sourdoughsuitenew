import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
  Alert,
  TextInput,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

import { theme } from '../../theme';
import Button from '../../components/Button';
import BenchCard from '../../components/BenchCard';
import SegmentedControl from '../../components/SegmentedControl';
import SectionHeader from '../../components/SectionHeader';
import type { ToolsStackParamList } from '../../navigation/types';
import type { PhotoSubject, StarterReadiness, PhotoRescueDiagnosis } from '../../types/photoRescue';
import { analyzePhoto, PhotoRescueFallbackError } from '../../services/photoRescueApi';
import { QUICK_RESCUE_QUESTIONS, runQuickRescue, type QuickRescueQuestion } from '../../utils/quickRescue';
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
  dough: ['Early bulk', 'Late bulk', 'Shaping', 'Pre-shape'],
  starter: ['Just fed', 'Rising', 'Peak', 'Past peak'],
  crumb: ['Just cut', 'After cooling'],
  loaf: ['Just baked', 'After cooling'],
};

type QuickRescueMode = 'input' | 'questions' | 'done';

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
  const [elapsed, setElapsed] = useState<string>('');
  const [hydration, setHydration] = useState<string>('');
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
      setError('Could not open image picker. Try using the sample photo.');
    }
  }, []);

  const useSamplePhoto = useCallback(() => {
    setImageUri('sample');
    setError(null);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!imageUri) {
      setError('Please choose a photo or use the sample dough photo.');
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

      const diagnosis = await analyzePhoto({
        imageBase64: base64,
        mimeType,
        context: {
          subject,
          stage: stage || undefined,
          roomTempF: roomTemp ? parseFloat(roomTemp) : undefined,
          elapsedMinutes: elapsed ? parseFloat(elapsed) : undefined,
          hydrationPercent: hydration ? parseFloat(hydration) : undefined,
        },
      });

      navigation.navigate('DiagnosisResult', {
        diagnosis,
        imageUri: imageUri === 'sample' ? undefined : imageUri,
      });
    } catch (err) {
      if (err instanceof PhotoRescueFallbackError) {
        setQuickRescueMode('questions');
        setQrStep(0);
        setQrAnswers({ subject });
        setQrSelectedSigns([]);
      } else {
        setError('Something went wrong. Try again or use Quick Rescue below.');
      }
    } finally {
      setLoading(false);
    }
  }, [imageUri, subject, stage, roomTemp, elapsed, hydration, navigation]);

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

  if (quickRescueMode === 'questions') {
    const q = QUICK_RESCUE_QUESTIONS[qrStep];
    const isSignsStep = q.key === 'signs';

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <BenchCard variant="filled" style={styles.quickRescueBanner}>
          <View style={styles.bannerRow}>
            <Icon name="clipboard-check-outline" size={20} color={theme.colors.bench.copper} />
            <Text style={styles.bannerText}>Using quick rescue checklist</Text>
          </View>
          <Text style={styles.bannerSub}>No image analysis — rule-based guidance only</Text>
        </BenchCard>

        <Text style={styles.qrProgress}>
          Question {qrStep + 1} of {QUICK_RESCUE_QUESTIONS.length}
        </Text>
        <Text style={styles.qrQuestion}>{q.question}</Text>

        {isSignsStep ? (
          <>
            <View style={styles.chipsWrap}>
              {q.options.map((opt, idx) => {
                const display = q.displayLabels?.[idx] ?? opt;
                return (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => handleSignsToggle(opt)}
                    style={[styles.chip, qrSelectedSigns.includes(opt) && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, qrSelectedSigns.includes(opt) && styles.chipTextActive]}>
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
              style={styles.mt}
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
                >
                  <Text style={styles.qrOptionText}>{display}</Text>
                  <Icon name="chevron-right" size={20} color={theme.colors.bench.border} />
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {qrStep > 0 && (
          <TouchableOpacity onPress={() => setQrStep(s => s - 1)} style={styles.backLink}>
            <Icon name="chevron-left" size={16} color={theme.colors.bench.crumb} />
            <Text style={styles.backLinkText}>Back</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    );
  }

  const stageChips = STAGE_CHIPS[subject];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SectionHeader
        eyebrow="Photo Rescue"
        title="What's going on with your dough?"
        subtitle="Choose a photo, tell us what you're looking at, and we'll help diagnose it."
      />

      <BenchCard variant="default" style={styles.imageCard}>
        {imageUri && imageUri !== 'sample' ? (
          <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" />
        ) : imageUri === 'sample' ? (
          <Image source={SAMPLE_DOUGH} style={styles.preview} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Icon name="camera-outline" size={40} color={theme.colors.bench.border} />
            <Text style={styles.placeholderText}>No photo selected</Text>
          </View>
        )}

        <View style={styles.imageActions}>
          <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
            <Icon name="image-outline" size={18} color={theme.colors.bench.copper} />
            <Text style={styles.imageBtnText}>Choose Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.imageBtn} onPress={useSamplePhoto}>
            <Icon name="grain" size={18} color={theme.colors.bench.copper} />
            <Text style={styles.imageBtnText}>Use sample dough photo</Text>
          </TouchableOpacity>
        </View>
      </BenchCard>

      <View style={styles.section}>
        <Text style={styles.label}>What are you analyzing?</Text>
        <SegmentedControl
          options={SUBJECT_OPTIONS}
          value={subject}
          onChange={(v) => {
            setSubject(v);
            setStage('');
          }}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Stage (optional)</Text>
        <View style={styles.chipsWrap}>
          {stageChips.map(s => (
            <TouchableOpacity
              key={s}
              onPress={() => setStage(stage === s ? '' : s)}
              style={[styles.chip, stage === s && styles.chipActive]}
            >
              <Text style={[styles.chipText, stage === s && styles.chipTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.halfField}>
          <Text style={styles.label}>Room Temp (°F)</Text>
          <BenchCard variant="outlined" padding="md" style={styles.inputCard}>
            <TextInput
              value={roomTemp}
              onChangeText={setRoomTemp}
              placeholder="e.g. 72"
              keyboardType="numeric"
              style={styles.inputText}
              placeholderTextColor={theme.colors.bench.border}
            />
          </BenchCard>
        </View>
        <View style={styles.halfField}>
          <Text style={styles.label}>Time Elapsed (min)</Text>
          <BenchCard variant="outlined" padding="md" style={styles.inputCard}>
            <TextInput
              value={elapsed}
              onChangeText={setElapsed}
              placeholder="e.g. 210"
              keyboardType="numeric"
              style={styles.inputText}
              placeholderTextColor={theme.colors.bench.border}
            />
          </BenchCard>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Hydration % (optional)</Text>
        <BenchCard variant="outlined" padding="md" style={styles.inputCard}>
          <TextInput
            value={hydration}
            onChangeText={setHydration}
            placeholder="e.g. 78"
            keyboardType="numeric"
            style={styles.inputText}
            placeholderTextColor={theme.colors.bench.border}
          />
        </BenchCard>
      </View>

      {error ? (
        <BenchCard variant="outlined" style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
        </BenchCard>
      ) : null}

      <Button
        title={loading ? 'Analyzing...' : 'Analyze Photo'}
        onPress={handleAnalyze}
        fullWidth
        loading={loading}
        leftIcon="magnify"
        style={styles.analyzeBtn}
      />

      <TouchableOpacity onPress={triggerQuickRescue} style={styles.fallbackLink}>
        <Icon name="clipboard-check-outline" size={16} color={theme.colors.bench.crumb} />
        <Text style={styles.fallbackText}>Skip photo — use Quick Rescue checklist instead</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing['2xl'],
  },
  imageCard: {
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
    padding: 0,
  },
  preview: {
    width: '100%',
    height: 220,
  },
  imagePlaceholder: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.bench.linen,
  },
  placeholderText: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.bench.border,
    marginTop: theme.spacing.sm,
  },
  imageActions: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  imageBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.bench.border,
    backgroundColor: theme.colors.background.paper,
  },
  imageBtnText: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.bench.copper,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.bench.crustSoft,
    marginBottom: theme.spacing.sm,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  chip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.bench.border,
    backgroundColor: theme.colors.background.paper,
  },
  chipActive: {
    backgroundColor: theme.colors.bench.copper,
    borderColor: theme.colors.bench.copper,
  },
  chipText: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.bench.crustSoft,
  },
  chipTextActive: {
    color: theme.colors.white,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  halfField: {
    flex: 1,
  },
  inputCard: {
    borderRadius: theme.borderRadius.lg,
  },
  inputText: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.bench.crust,
  },
  errorCard: {
    marginBottom: theme.spacing.md,
    borderColor: theme.colors.error.main,
    backgroundColor: theme.colors.error.light,
  },
  errorText: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.error.dark,
  },
  analyzeBtn: {
    marginBottom: theme.spacing.md,
  },
  fallbackLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.md,
  },
  fallbackText: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.bench.crumb,
  },
  mt: {
    marginTop: theme.spacing.lg,
  },
  quickRescueBanner: {
    marginBottom: theme.spacing.lg,
    borderColor: theme.colors.bench.border,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  bannerText: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.bench.copper,
  },
  bannerSub: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  qrProgress: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.bench.crumb,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.sm,
  },
  qrQuestion: {
    fontFamily: theme.typography.fonts.heading,
    fontSize: theme.typography.sizes['2xl'],
    color: theme.colors.bench.crust,
    marginBottom: theme.spacing.lg,
  },
  qrOptions: {
    gap: theme.spacing.sm,
  },
  qrOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background.paper,
    borderWidth: 1,
    borderColor: theme.colors.bench.borderSoft,
  },
  qrOptionText: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.bench.crust,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
    gap: 2,
  },
  backLinkText: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.bench.crumb,
  },
});
