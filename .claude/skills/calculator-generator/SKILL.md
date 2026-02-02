---
name: calculator-generator
description: Generate new calculator screens from configuration
invocation: manual
---

# Calculator Generator Skill

Generate fully functional calculator screens for the SourdoughSuite app from a minimal configuration file.

## Purpose

Reduces calculator boilerplate from 700 lines to ~50 lines of config. Generates screens that:
- Follow existing design patterns (KeyboardAvoidingView → ScrollView → Header → Content → Info)
- Use theme constants for styling
- Include "Save as Recipe" functionality
- Implement Clear/Reset actions
- Match the visual style of existing calculators
- Use centralized `sourdoughCalculations` utilities

## Usage

Invoke with:
```
/calculator-generator <config-file-path>
```

Or provide the config inline:
```
/calculator-generator
```
Then describe the calculator you want to create.

## Config Structure

Create a JSON config file with this structure:

```json
{
  "name": "Autolyse Calculator",
  "fileName": "AutolyseCalculatorScreen",
  "icon": "water-outline",
  "description": "Calculate autolyse timing and hydration",
  "subtitle": "Optimize your autolyse phase",

  "inputs": [
    {
      "name": "flourWeight",
      "label": "Flour Weight (g)",
      "placeholder": "e.g., 500",
      "keyboardType": "numeric",
      "required": true,
      "leftIcon": "bread-slice"
    },
    {
      "name": "autolyseDuration",
      "label": "Autolyse Duration (minutes)",
      "placeholder": "e.g., 30",
      "keyboardType": "numeric",
      "required": true
    }
  ],

  "calculation": {
    "formula": "autolyseWater = calculateWaterNeeded(flourWeight, 75)",
    "imports": ["calculateWaterNeeded"],
    "description": "Calculates 75% hydration for autolyse"
  },

  "results": [
    {
      "label": "Flour",
      "value": "flourWeight",
      "unit": "g"
    },
    {
      "label": "Water for Autolyse",
      "value": "autolyseWater",
      "unit": "g"
    },
    {
      "label": "Rest Duration",
      "value": "autolyseDuration",
      "unit": "minutes"
    }
  ],

  "infoCard": {
    "title": "What is Autolyse?",
    "content": "Autolyse is a resting period where flour and water are mixed before adding salt and starter. This allows enzymes to break down flour proteins, improving dough extensibility and flavor.\\n\\n• Typical duration: 30-60 minutes\\n• Uses 70-80% of total water\\n• Improves gluten development"
  },

  "saveAsRecipe": true
}
```

## Config Field Reference

### Top-Level Fields
- **name** (required): Display name for the calculator
- **fileName** (required): Component file name (e.g., "AutolyseCalculatorScreen")
- **icon** (required): MaterialCommunityIcons icon name
- **description** (required): Brief description shown in tools list
- **subtitle** (optional): Secondary text shown below title
- **saveAsRecipe** (optional): Enable "Save as Recipe" button (default: true)

### Input Field Schema
- **name** (required): Variable name for state
- **label** (required): Display label
- **placeholder** (optional): Placeholder text
- **keyboardType** (optional): "numeric" | "default" | "email-address" | "phone-pad"
- **required** (optional): Whether field is required for calculation
- **leftIcon** (optional): Icon name for left side of input

### Calculation Schema
- **formula** (required): JavaScript expression(s) for calculation (semicolon-separated)
- **imports** (required): Array of function names to import from sourdoughCalculations
- **description** (optional): Comment describing the calculation

### Result Field Schema
- **label** (required): Display label
- **value** (required): Variable name from calculation
- **unit** (optional): Unit to display (e.g., "g", "minutes", "%")

### Info Card Schema
- **title** (required): Card title
- **content** (required): Markdown-formatted educational content

## Generation Process

When invoked, this skill will:

1. **Validate Config** - Ensure all required fields are present
2. **Generate Component File** (`src/screens/tools/{FileName}.tsx`)
   - Standard React Native imports
   - State hooks for each input field
   - Calculation function using sourdoughCalculations utilities
   - UI layout following existing patterns
   - Styles using theme constants
3. **Update Navigation Types** (`src/navigation/types.ts`)
   - Add screen to ToolsStackParamList
4. **Update Tools Navigator** (`src/navigation/ToolsNavigator.tsx`)
   - Register screen in stack
5. **Update Tools List** (`src/screens/tools/ToolsListScreen.tsx`)
   - Add calculator to tools array

## Generated Component Structure

```typescript
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../components/Button';
import BasicInput from '../../components/BasicInput';
import Card from '../../components/Card';
import { theme } from '../../theme';
import { ToolsStackParamList } from '../../navigation/types';
import { calculateWaterNeeded, roundTo } from '../../utils/sourdoughCalculations';

type Props = NativeStackScreenProps<ToolsStackParamList, 'CalculatorName'>;

export default function CalculatorNameScreen({ navigation }: Props) {
  // State for input fields
  const [flourWeight, setFlourWeight] = useState('');
  const [autolyseDuration, setAutolyseDuration] = useState('');

  // State for results
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<{
    flourWeight: string;
    autolyseWater: string;
    autolyseDuration: string;
  } | null>(null);

  const handleCalculate = () => {
    // Validation
    if (!flourWeight.trim() || !autolyseDuration.trim()) {
      Alert.alert('Validation Error', 'All fields are required');
      return;
    }

    // Parse inputs
    const flourWeightNum = parseFloat(flourWeight);
    const autolyseDurationNum = parseFloat(autolyseDuration);

    // Validation
    if (isNaN(flourWeightNum) || flourWeightNum <= 0) {
      Alert.alert('Validation Error', 'Flour weight must be a positive number');
      return;
    }

    // Calculation
    const autolyseWater = roundTo(calculateWaterNeeded(flourWeightNum, 75), 0);

    // Set results
    setResults({
      flourWeight: flourWeightNum.toFixed(0),
      autolyseWater: autolyseWater.toFixed(0),
      autolyseDuration: autolyseDurationNum.toFixed(0),
    });
    setShowResults(true);
  };

  const handleClear = () => {
    setFlourWeight('');
    setAutolyseDuration('');
    setShowResults(false);
    setResults(null);
  };

  const handleSaveAsRecipe = () => {
    if (!results) return;
    navigation.navigate('AddRecipe', {
      prefillData: {
        name: 'Autolyse Mix',
        ingredients: [
          { name: 'Flour', amount: results.flourWeight, unit: 'g' },
          { name: 'Water', amount: results.autolyseWater, unit: 'g' },
        ],
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Icon name="water-outline" size={48} color={theme.colors.primary} />
          <Text style={styles.title}>Autolyse Calculator</Text>
          <Text style={styles.subtitle}>Optimize your autolyse phase</Text>
        </View>

        {/* Input Fields */}
        <Card style={styles.card}>
          <BasicInput
            label="Flour Weight (g)"
            value={flourWeight}
            onChangeText={setFlourWeight}
            placeholder="e.g., 500"
            keyboardType="numeric"
            leftIcon="bread-slice"
          />
          <BasicInput
            label="Autolyse Duration (minutes)"
            value={autolyseDuration}
            onChangeText={setAutolyseDuration}
            placeholder="e.g., 30"
            keyboardType="numeric"
          />
        </Card>

        {/* Results Card */}
        {showResults && results && (
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Autolyse Recipe</Text>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Flour</Text>
              <Text style={styles.resultValue}>{results.flourWeight}g</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Water for Autolyse</Text>
              <Text style={styles.resultValue}>{results.autolyseWater}g</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Rest Duration</Text>
              <Text style={styles.resultValue}>{results.autolyseDuration} minutes</Text>
            </View>
          </Card>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          {!showResults ? (
            <Button title="Calculate" onPress={handleCalculate} />
          ) : (
            <>
              <Button
                title="Save as Recipe"
                onPress={handleSaveAsRecipe}
                variant="outline"
              />
              <Button title="Clear" onPress={handleClear} variant="outline" />
              <Button title="Recalculate" onPress={handleCalculate} />
            </>
          )}
        </View>

        {/* Info Card */}
        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>What is Autolyse?</Text>
          <Text style={styles.infoText}>
            Autolyse is a resting period where flour and water are mixed before adding salt and starter...
          </Text>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // Standard styles using theme constants
});
```

## Files Modified

1. **Create**: `src/screens/tools/{FileName}.tsx`
2. **Update**: `src/navigation/types.ts` - Add screen to ToolsStackParamList
3. **Update**: `src/navigation/ToolsNavigator.tsx` - Register screen
4. **Update**: `src/screens/tools/ToolsListScreen.tsx` - Add to tools list

## Validation After Generation

Run these checks:
```bash
# Type check
npx tsc

# Test in app
npm run android
# or
npm run ios
```

Verify:
- Calculator appears in Tools list
- All inputs work correctly
- Calculation produces expected results
- "Save as Recipe" navigates correctly
- Styling matches existing calculators
- Clear/Reset works properly

## Examples

### Simple Percentage Calculator
```json
{
  "name": "Salt Calculator",
  "fileName": "SaltCalculatorScreen",
  "icon": "shaker-outline",
  "description": "Calculate salt amount for dough",
  "subtitle": "2% is standard",
  "inputs": [
    {
      "name": "flourWeight",
      "label": "Flour Weight (g)",
      "placeholder": "e.g., 1000",
      "keyboardType": "numeric",
      "required": true
    },
    {
      "name": "saltPercent",
      "label": "Salt Percentage",
      "placeholder": "e.g., 2",
      "keyboardType": "numeric",
      "required": true
    }
  ],
  "calculation": {
    "formula": "saltAmount = roundTo(calculateAmountFromPercentage(flourWeight, saltPercent), 1)",
    "imports": ["calculateAmountFromPercentage", "roundTo"]
  },
  "results": [
    {
      "label": "Salt Amount",
      "value": "saltAmount",
      "unit": "g"
    }
  ],
  "infoCard": {
    "title": "Salt in Sourdough",
    "content": "Salt strengthens gluten, controls fermentation, and enhances flavor. Standard range is 1.8-2.2% of flour weight."
  }
}
```

### Multi-Step Calculator
```json
{
  "name": "Dough Temperature Calculator",
  "fileName": "DoughTempCalculatorScreen",
  "icon": "thermometer",
  "description": "Calculate water temperature for desired dough temp",
  "inputs": [
    {
      "name": "targetDDT",
      "label": "Target Dough Temperature (°F)",
      "placeholder": "e.g., 78",
      "keyboardType": "numeric",
      "required": true
    },
    {
      "name": "roomTemp",
      "label": "Room Temperature (°F)",
      "placeholder": "e.g., 70",
      "keyboardType": "numeric",
      "required": true
    },
    {
      "name": "flourTemp",
      "label": "Flour Temperature (°F)",
      "placeholder": "e.g., 68",
      "keyboardType": "numeric",
      "required": true
    },
    {
      "name": "starterTemp",
      "label": "Starter Temperature (°F)",
      "placeholder": "e.g., 72",
      "keyboardType": "numeric",
      "required": true
    }
  ],
  "calculation": {
    "formula": "waterTemp = calculateWaterTemperature(targetDDT, roomTemp, flourTemp, starterTemp, 5)",
    "imports": ["calculateWaterTemperature"]
  },
  "results": [
    {
      "label": "Water Temperature",
      "value": "waterTemp",
      "unit": "°F"
    }
  ],
  "infoCard": {
    "title": "Desired Dough Temperature (DDT)",
    "content": "DDT controls fermentation speed. 75-78°F is ideal for most sourdough recipes. Warmer = faster fermentation."
  }
}
```

## Tips

- **Use sourdoughCalculations**: Always import and use functions from the centralized library
- **Keep calculations simple**: Complex logic should be in utility functions
- **Follow patterns**: Generated code matches existing calculator screens
- **Validation**: Include proper input validation for better UX
- **Icons**: Use MaterialCommunityIcons from react-native-vector-icons
- **Info cards**: Provide educational content to help users understand the calculation

## Reference Calculators

Study these existing calculators for patterns:
- `src/screens/tools/BakersCalculatorScreen.tsx` - Comprehensive example
- `src/screens/tools/HydrationCalculatorScreen.tsx` - Simple percentage calc
- `src/screens/tools/LevainCalculatorScreen.tsx` - Multi-step calculation
