/**
 * Help & FAQ Screen
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Card from '../../components/Card';
import { theme } from '../../theme';

type FaqItem = {
  question: string;
  answer: string;
};

const faqSections: { title: string; icon: string; items: FaqItem[] }[] = [
  {
    title: 'Getting Started',
    icon: 'rocket-launch',
    items: [
      {
        question: 'How do I create my first starter?',
        answer:
          'Go to the Starters tab and tap the "+" button. Fill in your starter\'s name, type, flour type, and feeding schedule. Once created, you can track feedings and monitor its health.',
      },
      {
        question: 'What is baker\'s percentage?',
        answer:
          'Baker\'s percentage expresses each ingredient as a percentage of the total flour weight. Flour is always 100%. For example, 70% hydration means the water weighs 70% of the flour weight. Use the Baker\'s Percentage calculator in the Tools tab to convert between weights and percentages.',
      },
      {
        question: 'How do I add a recipe?',
        answer:
          'Go to the Recipes tab and tap "Add Recipe". Enter a name, description, and your ingredients with their amounts. You can also use the Baker\'s Percentage calculator to build a formula and send it directly to a new recipe.',
      },
    ],
  },
  {
    title: 'Starters & Feeding',
    icon: 'bacteria',
    items: [
      {
        question: 'How often should I feed my starter?',
        answer:
          'A room-temperature starter typically needs feeding every 12-24 hours. A refrigerated starter can go 1-7 days between feedings. Set your feeding frequency when creating a starter and the app will remind you when it\'s due.',
      },
      {
        question: 'What does the feeding ratio mean?',
        answer:
          'The feeding ratio (e.g., 1:1:1) represents Starter:Flour:Water by weight. A 1:1:1 ratio means equal parts of each. A higher ratio like 1:5:5 is used for building a levain, as it gives the yeast more food and a longer rise time.',
      },
      {
        question: 'What do the health indicators mean?',
        answer:
          'Green (Good) means your starter is active and on schedule. Yellow (Needs Attention) means a feeding is overdue. Red (Critical) means your starter has gone a long time without feeding and may need extra care to revive.',
      },
    ],
  },
  {
    title: 'Calculators & Tools',
    icon: 'calculator',
    items: [
      {
        question: 'What calculators are available?',
        answer:
          'Sourdough Suite includes: Baker\'s Percentage, Hydration Calculator, Timeline Calculator, Recipe Scaler, Temperature Calculator, Levain Builder, Starter Percentage, Preferment Calculator, Dough Weight, Recipe Rescue, and Flour Blend Calculator.',
      },
      {
        question: 'How does the Timeline Calculator work?',
        answer:
          'Enter your desired bake time and the calculator works backwards to give you a full schedule — from mixing to feeding your starter, bulk fermentation, shaping, proofing, and baking.',
      },
      {
        question: 'What is the Recipe Rescue calculator?',
        answer:
          'Recipe Rescue helps you fix a recipe that didn\'t turn out right. Enter what went wrong (too dense, too sour, etc.) and it suggests adjustments to your formula for next time.',
      },
    ],
  },
  {
    title: 'Recipes',
    icon: 'book-open-variant',
    items: [
      {
        question: 'Can I scale a recipe up or down?',
        answer:
          'Yes! Use the Recipe Scaler in the Tools tab. Enter your original recipe amounts and the desired total dough weight, and it will calculate all ingredient amounts for you.',
      },
      {
        question: 'How do I edit or delete a recipe?',
        answer:
          'Open the recipe from the Recipes tab, then use the edit or delete options. You can update any ingredient amounts, instructions, or notes.',
      },
    ],
  },
];

function FaqAccordion({ item }: { item: FaqItem }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      <View style={styles.faqItem}>
        <View style={styles.faqQuestionRow}>
          <Text style={styles.faqQuestion}>{item.question}</Text>
          <Icon
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={theme.colors.text.secondary}
          />
        </View>
        {expanded && <Text style={styles.faqAnswer}>{item.answer}</Text>}
      </View>
    </TouchableOpacity>
  );
}

export default function HelpFaqScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {faqSections.map((section, sectionIndex) => (
        <View key={section.title} style={sectionIndex > 0 ? styles.sectionSpacing : undefined}>
          <View style={styles.sectionHeader}>
            <Icon name={section.icon} size={20} color={theme.colors.primary[600]} />
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
          <Card variant="outlined" padding="none">
            {section.items.map((item, index) => (
              <View key={item.question}>
                {index > 0 && <View style={styles.divider} />}
                <FaqAccordion item={item} />
              </View>
            ))}
          </Card>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.paper,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing['2xl'],
  },
  sectionSpacing: {
    marginTop: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold as any,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  faqItem: {
    padding: theme.spacing.lg,
  },
  faqQuestionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    flex: 1,
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.medium as any,
    color: theme.colors.text.primary,
    marginRight: theme.spacing.sm,
  },
  faqAnswer: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    marginTop: theme.spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border.light,
    marginHorizontal: theme.spacing.lg,
  },
});
