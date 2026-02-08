/**
 * Flour Blend Calculator
 * Calculate flour blend ratios to achieve target protein percentages
 */

import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../components/Button';
import BasicInput from '../../components/BasicInput';
import Card from '../../components/Card';
import { theme } from '../../theme';
import { roundTo } from '../../utils/sourdoughCalculations';

// Common flour types with typical protein percentages
const FLOUR_PRESETS = [
    { name: 'Cake Flour', protein: 7.5 },
    { name: 'Pastry Flour', protein: 9.0 },
    { name: 'All-Purpose Flour', protein: 10.5 },
    { name: 'Bread Flour', protein: 12.5 },
    { name: 'High-Gluten Flour', protein: 14.0 },
    { name: 'Whole Wheat Flour', protein: 14.0 },
    { name: 'White Whole Wheat', protein: 13.0 },
    { name: 'Rye Flour (Medium)', protein: 9.0 },
    { name: 'Spelt Flour', protein: 12.0 },
    { name: 'Einkorn Flour', protein: 13.5 },
];

// Target protein presets with bread type descriptions
const TARGET_PRESETS = [
    { label: 'Tender Cakes & Pastries', range: '9-10%', target: 9.5 },
    { label: 'Pie Crusts & Crackers', range: '10-11%', target: 10.5 },
    { label: 'Sandwich Bread & Soft Rolls', range: '11-12%', target: 11.5 },
    { label: 'Artisan Sourdough & Country Loaves', range: '12-13%', target: 12.5 },
    { label: 'Bagels, Pizza & Chewy Breads', range: '13-14%', target: 13.5 },
    { label: 'High-Gluten Specialty Breads', range: '14%+', target: 14.5 },
];

interface FlourEntry {
    id: string;
    name: string;
    protein: string;
    ratio: number;
}

export default function FlourBlendCalculatorScreen() {
    const [flours, setFlours] = useState<FlourEntry[]>([
        { id: '1', name: '', protein: '', ratio: 0 },
        { id: '2', name: '', protein: '', ratio: 0 },
    ]);
    const [targetProtein, setTargetProtein] = useState('');
    const [totalWeight, setTotalWeight] = useState('1000');
    const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

    // Derive ratios and error from flours + targetProtein (no state loop)
    const { ratios, error } = useMemo(() => {
        const ratioMap: Record<string, number> = {};
        flours.forEach(f => { ratioMap[f.id] = 0; });

        const validFlours = flours.filter(f => {
            const protein = parseFloat(f.protein);
            return !isNaN(protein) && protein > 0;
        });

        if (validFlours.length < 2) {
            return { ratios: ratioMap, error: null };
        }

        const target = parseFloat(targetProtein);
        if (isNaN(target) || target <= 0) {
            return { ratios: ratioMap, error: null };
        }

        if (validFlours.length === 2) {
            const p1 = parseFloat(validFlours[0].protein);
            const p2 = parseFloat(validFlours[1].protein);

            const minProtein = Math.min(p1, p2);
            const maxProtein = Math.max(p1, p2);

            if (target < minProtein || target > maxProtein) {
                return { ratios: ratioMap, error: `Target must be between ${minProtein}% and ${maxProtein}%` };
            }

            if (p1 === p2) {
                validFlours.forEach(vf => { ratioMap[vf.id] = 50; });
                return { ratios: ratioMap, error: null };
            }

            const ratio1 = ((target - p2) / (p1 - p2)) * 100;
            const ratio2 = 100 - ratio1;
            ratioMap[validFlours[0].id] = roundTo(ratio1, 1);
            ratioMap[validFlours[1].id] = roundTo(ratio2, 1);
            return { ratios: ratioMap, error: null };
        }

        return { ratios: ratioMap, error: 'For 3+ flours, manual ratio adjustment is needed. The calculator shows 2-flour blends.' };
    }, [flours, targetProtein]);

    const addFlour = () => {
        if (flours.length >= 4) return;
        setFlours(prev => [
            ...prev,
            { id: Date.now().toString(), name: '', protein: '', ratio: 0 },
        ]);
    };

    const removeFlour = (id: string) => {
        if (flours.length <= 2) return;
        setFlours(prev => prev.filter(f => f.id !== id));
    };

    const updateFlour = (id: string, field: 'name' | 'protein', value: string) => {
        setFlours(prev => prev.map(f =>
            f.id === id ? { ...f, [field]: value } : f
        ));
    };

    const applyFlourPreset = (id: string, preset: typeof FLOUR_PRESETS[0]) => {
        setFlours(prev => prev.map(f =>
            f.id === id ? { ...f, name: preset.name, protein: preset.protein.toString() } : f
        ));
    };

    const applyTargetPreset = (preset: typeof TARGET_PRESETS[0]) => {
        setTargetProtein(preset.target.toString());
        setSelectedPreset(preset.label);
    };

    const clearAll = () => {
        setFlours([
            { id: '1', name: '', protein: '', ratio: 0 },
            { id: '2', name: '', protein: '', ratio: 0 },
        ]);
        setTargetProtein('');
        setTotalWeight('1000');
        setSelectedPreset(null);
    };

    const getFlourWeight = (ratio: number) => {
        const total = parseFloat(totalWeight);
        if (isNaN(total) || total <= 0 || ratio <= 0) return 0;
        return roundTo((ratio / 100) * total, 0);
    };

    const getResultingProtein = () => {
        const validFlours = flours.filter(f => (ratios[f.id] || 0) > 0 && parseFloat(f.protein) > 0);
        if (validFlours.length === 0) return null;

        let totalProtein = 0;
        validFlours.forEach(f => {
            totalProtein += ((ratios[f.id] || 0) / 100) * parseFloat(f.protein);
        });
        return roundTo(totalProtein, 1);
    };

    const hasValidResult = flours.some(f => (ratios[f.id] || 0) > 0);
    const resultingProtein = getResultingProtein();

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
            >
                <View style={styles.header}>
                    <Icon name="grain" size={48} color={theme.colors.warning.main} />
                    <Text style={styles.headerTitle}>Flour Blend Calculator</Text>
                    <Text style={styles.headerSubtitle}>
                        Mix flours to achieve your target protein percentage
                    </Text>
                </View>

                <View style={styles.content}>
                    {/* Target Protein Section */}
                    <Card variant="elevated">
                        <Text style={styles.sectionTitle}>Target Protein</Text>
                        <Text style={styles.sectionSubtitle}>
                            What are you baking? Select a preset or enter a custom target.
                        </Text>

                        <View style={styles.presetGrid}>
                            {TARGET_PRESETS.map((preset) => (
                                <TouchableOpacity
                                    key={preset.label}
                                    style={[
                                        styles.presetChip,
                                        selectedPreset === preset.label && styles.presetChipSelected,
                                    ]}
                                    onPress={() => applyTargetPreset(preset)}
                                >
                                    <Text style={[
                                        styles.presetChipRange,
                                        selectedPreset === preset.label && styles.presetChipTextSelected,
                                    ]}>
                                        {preset.range}
                                    </Text>
                                    <Text style={[
                                        styles.presetChipLabel,
                                        selectedPreset === preset.label && styles.presetChipTextSelected,
                                    ]} numberOfLines={2}>
                                        {preset.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <BasicInput
                            label="Target Protein %"
                            placeholder="e.g., 12.5"
                            value={targetProtein}
                            onChangeText={(val) => {
                                setTargetProtein(val);
                                setSelectedPreset(null);
                            }}
                            keyboardType="numeric"
                            leftIcon="target"
                        />
                    </Card>

                    {/* Flour Entries */}
                    <Card variant="elevated">
                        <View style={styles.flourHeader}>
                            <Text style={styles.sectionTitle}>Your Flours</Text>
                            {flours.length < 4 && (
                                <TouchableOpacity onPress={addFlour} style={styles.addButton}>
                                    <Icon name="plus" size={20} color={theme.colors.primary[600]} />
                                    <Text style={styles.addButtonText}>Add Flour</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {flours.map((flour, index) => (
                            <View key={flour.id} style={styles.flourEntry}>
                                <View style={styles.flourEntryHeader}>
                                    <Text style={styles.flourEntryTitle}>Flour {index + 1}</Text>
                                    {flours.length > 2 && (
                                        <TouchableOpacity onPress={() => removeFlour(flour.id)}>
                                            <Icon name="close" size={20} color={theme.colors.text.disabled} />
                                        </TouchableOpacity>
                                    )}
                                </View>

                                {/* Flour Presets */}
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    style={styles.flourPresets}
                                >
                                    {FLOUR_PRESETS.map((preset) => (
                                        <TouchableOpacity
                                            key={preset.name}
                                            style={[
                                                styles.flourPresetChip,
                                                flour.name === preset.name && styles.flourPresetChipSelected,
                                            ]}
                                            onPress={() => applyFlourPreset(flour.id, preset)}
                                        >
                                            <Text style={[
                                                styles.flourPresetText,
                                                flour.name === preset.name && styles.flourPresetTextSelected,
                                            ]}>
                                                {preset.name} ({preset.protein}%)
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>

                                <View style={styles.flourInputRow}>
                                    <View style={styles.flourInputName}>
                                        <BasicInput
                                            label="Flour Name"
                                            placeholder="e.g., Bread Flour"
                                            value={flour.name}
                                            onChangeText={(val) => updateFlour(flour.id, 'name', val)}
                                        />
                                    </View>
                                    <View style={styles.flourInputProtein}>
                                        <BasicInput
                                            label="Protein %"
                                            placeholder="e.g., 12.5"
                                            value={flour.protein}
                                            onChangeText={(val) => updateFlour(flour.id, 'protein', val)}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                </View>
                            </View>
                        ))}
                    </Card>

                    {/* Error Message */}
                    {error && (
                        <Card variant="filled" style={styles.errorCard}>
                            <View style={styles.errorContent}>
                                <Icon name="alert-circle" size={20} color={theme.colors.error.main} />
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        </Card>
                    )}

                    {/* Results */}
                    {hasValidResult && (
                        <Card variant="filled" style={styles.resultCard}>
                            <Text style={styles.resultTitle}>Your Blend</Text>

                            <BasicInput
                                label="Total Flour Weight (g)"
                                placeholder="e.g., 1000"
                                value={totalWeight}
                                onChangeText={setTotalWeight}
                                keyboardType="numeric"
                                leftIcon="scale"
                            />

                            <View style={styles.resultBreakdown}>
                                {flours.filter(f => (ratios[f.id] || 0) > 0).map((flour) => (
                                    <View key={flour.id} style={styles.resultRow}>
                                        <View style={styles.resultFlourInfo}>
                                            <Text style={styles.resultFlourName}>
                                                {flour.name || 'Unnamed Flour'}
                                            </Text>
                                            <Text style={styles.resultFlourProtein}>
                                                {flour.protein}% protein
                                            </Text>
                                        </View>
                                        <View style={styles.resultAmounts}>
                                            <Text style={styles.resultRatio}>{ratios[flour.id] || 0}%</Text>
                                            <Text style={styles.resultWeight}>
                                                {getFlourWeight(ratios[flour.id] || 0)}g
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </View>

                            {resultingProtein && (
                                <View style={styles.finalProtein}>
                                    <Text style={styles.finalProteinLabel}>Resulting Protein:</Text>
                                    <Text style={styles.finalProteinValue}>{resultingProtein}%</Text>
                                </View>
                            )}
                        </Card>
                    )}

                    {/* Actions */}
                    <View style={styles.actions}>
                        <Button
                            title="Clear All"
                            variant="outline"
                            onPress={clearAll}
                            fullWidth
                        />
                    </View>

                    {/* Info Card */}
                    <Card variant="outlined">
                        <Text style={styles.infoTitle}>Protein Levels Guide</Text>
                        <Text style={styles.infoText}>
                            <Text style={styles.infoBold}>9-10% (Cake/Pastry):</Text> Tender, delicate crumb{'\n'}
                            <Text style={styles.infoBold}>10-11% (All-Purpose):</Text> Versatile, moderate structure{'\n'}
                            <Text style={styles.infoBold}>11-12% (Bread Flour):</Text> Good gluten development{'\n'}
                            <Text style={styles.infoBold}>12-13% (Artisan):</Text> Chewy, open crumb{'\n'}
                            <Text style={styles.infoBold}>13-14% (High-Gluten):</Text> Maximum chew & elasticity{'\n\n'}
                            <Text style={styles.infoBold}>Tip:</Text> Protein content can vary by brand. Check your flour bag for exact values!
                        </Text>
                    </Card>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background.default,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        padding: theme.spacing.xl,
        backgroundColor: theme.colors.white,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.light,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: theme.typography.sizes['2xl'],
        fontWeight: theme.typography.weights.bold as any,
        color: theme.colors.text.primary,
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.xs,
    },
    headerSubtitle: {
        fontSize: theme.typography.sizes.sm,
        color: theme.colors.text.secondary,
        textAlign: 'center',
    },
    content: {
        padding: theme.spacing.lg,
    },
    sectionTitle: {
        fontSize: theme.typography.sizes.lg,
        fontWeight: theme.typography.weights.semibold as any,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.sm,
    },
    sectionSubtitle: {
        fontSize: theme.typography.sizes.sm,
        fontFamily: theme.typography.fonts.regular,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.md,
    },
    presetGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: theme.spacing.md,
        marginHorizontal: -theme.spacing.xs,
    },
    presetChip: {
        width: '48%',
        margin: '1%',
        padding: theme.spacing.sm,
        backgroundColor: theme.colors.background.default,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border.light,
    },
    presetChipSelected: {
        backgroundColor: theme.colors.primary[600],
        borderColor: theme.colors.primary[600],
    },
    presetChipRange: {
        fontSize: theme.typography.sizes.lg,
        fontFamily: theme.typography.fonts.bold,
        fontWeight: theme.typography.weights.bold as any,
        color: theme.colors.text.primary,
    },
    presetChipLabel: {
        fontSize: theme.typography.sizes.xs,
        fontFamily: theme.typography.fonts.regular,
        color: theme.colors.text.secondary,
        marginTop: 2,
    },
    presetChipTextSelected: {
        color: theme.colors.white,
    },
    flourHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.xs,
    },
    addButtonText: {
        fontSize: theme.typography.sizes.sm,
        fontFamily: theme.typography.fonts.medium,
        color: theme.colors.primary[600],
        marginLeft: theme.spacing.xs,
    },
    flourEntry: {
        marginBottom: theme.spacing.lg,
        paddingBottom: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.light,
    },
    flourEntryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    flourEntryTitle: {
        fontSize: theme.typography.sizes.base,
        fontFamily: theme.typography.fonts.medium,
        fontWeight: theme.typography.weights.medium as any,
        color: theme.colors.text.primary,
    },
    flourPresets: {
        marginBottom: theme.spacing.sm,
    },
    flourPresetChip: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        backgroundColor: theme.colors.background.paper,
        borderRadius: theme.borderRadius.full,
        marginRight: theme.spacing.xs,
        borderWidth: 1,
        borderColor: theme.colors.border.light,
    },
    flourPresetChipSelected: {
        backgroundColor: theme.colors.warning.main + '20',
        borderColor: theme.colors.warning.main,
    },
    flourPresetText: {
        fontSize: theme.typography.sizes.xs,
        fontFamily: theme.typography.fonts.regular,
        color: theme.colors.text.secondary,
    },
    flourPresetTextSelected: {
        color: theme.colors.warning.dark,
        fontFamily: theme.typography.fonts.medium,
    },
    flourInputRow: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },
    flourInputName: {
        flex: 2,
    },
    flourInputProtein: {
        flex: 1,
    },
    errorCard: {
        backgroundColor: theme.colors.error.main + '10',
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.error.main,
    },
    errorContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    errorText: {
        flex: 1,
        fontSize: theme.typography.sizes.sm,
        fontFamily: theme.typography.fonts.regular,
        color: theme.colors.error.main,
        marginLeft: theme.spacing.sm,
    },
    resultCard: {
        backgroundColor: theme.colors.success.main + '10',
    },
    resultTitle: {
        fontSize: theme.typography.sizes.xl,
        fontFamily: theme.typography.fonts.bold,
        fontWeight: theme.typography.weights.bold as any,
        color: theme.colors.success.dark,
        marginBottom: theme.spacing.md,
    },
    resultBreakdown: {
        marginTop: theme.spacing.md,
    },
    resultRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.light,
    },
    resultFlourInfo: {
        flex: 1,
    },
    resultFlourName: {
        fontSize: theme.typography.sizes.base,
        fontFamily: theme.typography.fonts.medium,
        fontWeight: theme.typography.weights.medium as any,
        color: theme.colors.text.primary,
    },
    resultFlourProtein: {
        fontSize: theme.typography.sizes.sm,
        fontFamily: theme.typography.fonts.regular,
        color: theme.colors.text.secondary,
    },
    resultAmounts: {
        alignItems: 'flex-end',
    },
    resultRatio: {
        fontSize: theme.typography.sizes.lg,
        fontFamily: theme.typography.fonts.bold,
        fontWeight: theme.typography.weights.bold as any,
        color: theme.colors.success.dark,
    },
    resultWeight: {
        fontSize: theme.typography.sizes.sm,
        fontFamily: theme.typography.fonts.regular,
        color: theme.colors.text.secondary,
    },
    finalProtein: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: theme.spacing.md,
        paddingTop: theme.spacing.md,
        borderTopWidth: 2,
        borderTopColor: theme.colors.success.main,
    },
    finalProteinLabel: {
        fontSize: theme.typography.sizes.lg,
        fontFamily: theme.typography.fonts.medium,
        fontWeight: theme.typography.weights.medium as any,
        color: theme.colors.text.primary,
    },
    finalProteinValue: {
        fontSize: theme.typography.sizes['2xl'],
        fontFamily: theme.typography.fonts.bold,
        fontWeight: theme.typography.weights.bold as any,
        color: theme.colors.success.dark,
    },
    actions: {
        marginTop: theme.spacing.sm,
    },
    infoTitle: {
        fontSize: theme.typography.sizes.lg,
        fontFamily: theme.typography.fonts.semibold,
        fontWeight: theme.typography.weights.semibold as any,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.sm,
    },
    infoText: {
        fontSize: theme.typography.sizes.base,
        fontFamily: theme.typography.fonts.regular,
        color: theme.colors.text.secondary,
        lineHeight: 24,
    },
    infoBold: {
        fontFamily: theme.typography.fonts.semibold,
        fontWeight: theme.typography.weights.semibold as any,
        color: theme.colors.text.primary,
    },
});
