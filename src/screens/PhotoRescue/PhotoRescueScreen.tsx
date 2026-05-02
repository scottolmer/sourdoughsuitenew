import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../components/Button';
import BasicInput from '../../components/BasicInput';
import FactStrip from '../../components/FactStrip';
import FormulaSheet from '../../components/FormulaSheet';
import ModernistScreen from '../../components/ModernistScreen';
import ModernistSegmentedControl from '../../components/ModernistSegmentedControl';
import RuleHeader from '../../components/RuleHeader';
import { ToolsStackParamList } from '../../navigation/types';
import { photoRescueStorage } from '../../services/photoRescueStorage';
import {
  analyzePhotoRescue,
  createSamplePhotoRequest,
} from '../../services/photoRescueService';
import { PhotoSubject } from '../../types';
import { theme } from '../../theme';

type Props = NativeStackScreenProps<ToolsStackParamList, 'PhotoRescue'>;

const subjectOptions = [
  { label: 'Dough', value: 'dough' },
  { label: 'Starter', value: 'starter' },
  { label: 'Crumb', value: 'crumb' },
  { label: 'Loaf', value: 'loaf' },
] as const;

const signsBySubject: Record<PhotoSubject, string[]> = {
  dough: ['collapsed', 'shiny', 'slack', 'dense', 'few bubbles', 'tight'],
  starter: ['mold', 'hooch', 'collapsed', 'few bubbles', 'acetone', 'pink streaks'],
  crumb: ['dense', 'gummy', 'huge holes', 'tight crumb'],
  loaf: ['flat', 'pale crust', 'blowout', 'no ear'],
};

export default function PhotoRescueScreen({ navigation }: Props) {
  const [subject, setSubject] = useState<PhotoSubject>('dough');
  const [stage, setStage] = useState('bulk');
  const [roomTempF, setRoomTempF] = useState('72');
  const [elapsedMinutes, setElapsedMinutes] = useState('210');
  const [hydrationPercent, setHydrationPercent] = useState('78');
  const [notes, setNotes] = useState('Dough looks slack and glossy.');
  const [selectedSigns, setSelectedSigns] = useState<string[]>(['shiny', 'slack']);
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [imageBase64, setImageBase64] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const context = useMemo(
    () => ({
      subject,
      stage,
      roomTempF: Number(roomTempF) || undefined,
      elapsedMinutes: Number(elapsedMinutes) || undefined,
      hydrationPercent: Number(hydrationPercent) || undefined,
      starterReadiness: 'okay' as const,
      notes,
    }),
    [elapsedMinutes, hydrationPercent, notes, roomTempF, stage, subject]
  );

  const fallbackAnswers = useMemo(
    () => ({
      subject,
      stage,
      roomTempF: Number(roomTempF) || undefined,
      elapsedMinutes: Number(elapsedMinutes) || undefined,
      hydrationPercent: Number(hydrationPercent) || undefined,
      starterReadiness: 'okay' as const,
      observedSigns: selectedSigns,
    }),
    [elapsedMinutes, hydrationPercent, roomTempF, selectedSigns, stage, subject]
  );

  const toggleSign = (sign: string) => {
    setSelectedSigns(current =>
      current.includes(sign)
        ? current.filter(item => item !== sign)
        : [...current, sign]
    );
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.75,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setImageBase64(result.assets[0].base64 || undefined);
    }
  };

  const runAnalysis = async (useSample: boolean) => {
    setLoading(true);
    try {
      const request =
        useSample || !imageBase64
          ? createSamplePhotoRequest(context)
          : {
              imageBase64,
              mimeType: 'image/jpeg' as const,
              context,
            };

      const result = await analyzePhotoRescue(request, fallbackAnswers);
      await photoRescueStorage.save(result.diagnosis, imageUri);
      navigation.navigate('PhotoRescueResult', {
        diagnosisId: result.diagnosis.id,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModernistScreen>
      <View style={styles.header}>
        <Text style={styles.kicker}>PHOTO RESCUE</Text>
        <Text style={styles.title}>Read the dough in front of you.</Text>
        <Text style={styles.subtitle}>
          Use a sample path for the demo, or upload a baking photo. If analysis
          is unavailable, the app switches to an honest checklist.
        </Text>
      </View>

      <RuleHeader title="Subject" />
      <ModernistSegmentedControl
        options={[...subjectOptions]}
        value={subject}
        onChange={(value) => {
          setSubject(value);
          setSelectedSigns(signsBySubject[value].slice(0, 2));
        }}
      />

      <FormulaSheet style={styles.photoSheet} accented>
        <RuleHeader title="Image" meta={imageUri ? 'Uploaded' : 'Demo ready'} />
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.preview} />
        ) : (
          <View style={styles.samplePreview}>
            <Icon
              name="image-search-outline"
              size={42}
              color={theme.colors.modernist.ruleTeal}
            />
            <Text style={styles.sampleTitle}>Sample dough photo</Text>
            <Text style={styles.sampleText}>
              Optimized for the hackathon path: bulk fermentation rescue.
            </Text>
          </View>
        )}
        <View style={styles.photoActions}>
          <Button title="Use Sample" size="small" onPress={() => runAnalysis(true)} />
          <Button
            title="Upload"
            size="small"
            variant="outline"
            leftIcon="image-plus"
            onPress={pickImage}
          />
        </View>
      </FormulaSheet>

      <RuleHeader title="Context" />
      <View style={styles.inputGrid}>
        <BasicInput label="Stage" value={stage} onChangeText={setStage} />
        <BasicInput
          label="Room temp F"
          value={roomTempF}
          keyboardType="numeric"
          onChangeText={setRoomTempF}
        />
        <BasicInput
          label="Elapsed min"
          value={elapsedMinutes}
          keyboardType="numeric"
          onChangeText={setElapsedMinutes}
        />
        <BasicInput
          label="Hydration %"
          value={hydrationPercent}
          keyboardType="numeric"
          onChangeText={setHydrationPercent}
        />
      </View>
      <BasicInput
        label="Notes"
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      <RuleHeader title="Visible Signs" />
      <View style={styles.signs}>
        {signsBySubject[subject].map(sign => {
          const active = selectedSigns.includes(sign);
          return (
            <TouchableOpacity
              key={sign}
              onPress={() => toggleSign(sign)}
              style={[styles.sign, active && styles.signActive]}
            >
              <Text style={[styles.signText, active && styles.signTextActive]}>
                {sign}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FactStrip
        items={[
          { label: 'Mode', value: subject, icon: 'crosshairs-gps', tone: 'teal' },
          { label: 'Fallback', value: 'Checklist ready', icon: 'clipboard-check-outline' },
        ]}
      />

      <Button
        title={loading ? 'Analyzing...' : 'Analyze Photo'}
        fullWidth
        leftIcon="camera-metering-center"
        onPress={() => runAnalysis(false)}
        disabled={loading}
        style={styles.analyzeButton}
      />
      {loading ? (
        <ActivityIndicator
          color={theme.colors.modernist.ruleTeal}
          style={styles.loading}
        />
      ) : null}
    </ModernistScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: theme.spacing.lg,
  },
  kicker: {
    fontFamily: theme.typography.fonts.semibold,
    fontSize: theme.typography.sizes.xs,
    letterSpacing: 0.8,
    color: theme.colors.modernist.ruleTeal,
    marginBottom: theme.spacing.xs,
  },
  title: {
    fontFamily: theme.typography.fonts.heading,
    fontSize: 34,
    color: theme.colors.modernist.ink,
    lineHeight: 40,
  },
  subtitle: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.modernist.graphiteMuted,
    lineHeight: 20,
    marginTop: theme.spacing.sm,
  },
  photoSheet: {
    marginVertical: theme.spacing.lg,
  },
  samplePreview: {
    minHeight: 150,
    borderWidth: 1,
    borderColor: theme.colors.modernist.hairline,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.modernist.paperWarm,
  },
  preview: {
    width: '100%',
    height: 190,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: theme.colors.modernist.hairline,
  },
  sampleTitle: {
    fontFamily: theme.typography.fonts.semibold,
    color: theme.colors.modernist.ink,
    marginTop: theme.spacing.sm,
  },
  sampleText: {
    fontFamily: theme.typography.fonts.regular,
    color: theme.colors.modernist.graphiteMuted,
    textAlign: 'center',
    marginTop: 4,
  },
  photoActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  inputGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  signs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  sign: {
    borderWidth: 1,
    borderColor: theme.colors.modernist.hairlineDark,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.modernist.porcelain,
  },
  signActive: {
    borderColor: theme.colors.modernist.ruleTeal,
    backgroundColor: theme.colors.modernist.tealSoft,
  },
  signText: {
    fontFamily: theme.typography.fonts.medium,
    color: theme.colors.modernist.graphiteMuted,
  },
  signTextActive: {
    color: theme.colors.modernist.ruleTeal,
  },
  analyzeButton: {
    marginTop: theme.spacing.lg,
  },
  loading: {
    marginTop: theme.spacing.md,
  },
});
