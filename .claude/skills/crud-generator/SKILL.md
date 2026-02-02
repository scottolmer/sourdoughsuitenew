---
name: crud-generator
description: Generate CRUD screens for new entities
invocation: manual
---

# CRUD Generator Skill

Generate Add/Edit/Detail screen triplets for new entities in the SourdoughSuite app, following established patterns from Starters and Recipes.

## Purpose

Automates scaffolding of complete CRUD flows for new entities like:
- Future features: Baking Sessions, Flour Inventory, Baking Journal
- Related entities: Equipment, Techniques, Timers
- Data tracking: Fermentation Logs, Scoring Patterns

Generated screens include:
- **Add Screen**: Form with validation and React Query mutation
- **Edit Screen**: Pre-populated form with update mutation
- **Detail Screen**: Display entity with delete action + related data
- **Storage Service**: AsyncStorage-based CRUD operations

## Usage

Invoke with:
```
/crud-generator <config-file-path>
```

Or provide the config inline:
```
/crud-generator
```
Then describe the entity you want to create.

## Config Structure

```json
{
  "entity": {
    "name": "BakingSession",
    "namePlural": "BakingSessions",
    "displayName": "Baking Session",
    "displayNamePlural": "Baking Sessions",
    "icon": "oven",
    "queryKey": "BAKING_SESSIONS"
  },

  "storage": {
    "file": "bakingSessionStorage.ts",
    "interface": "BakingSession",
    "idType": "number"
  },

  "fields": [
    {
      "name": "recipeName",
      "type": "text",
      "label": "Recipe Name",
      "placeholder": "e.g., Country Loaf",
      "required": true,
      "validation": "Recipe name is required"
    },
    {
      "name": "startTime",
      "type": "datetime",
      "label": "Start Time",
      "required": true,
      "validation": "Start time is required"
    },
    {
      "name": "ovenTemp",
      "type": "number",
      "label": "Oven Temperature (°F)",
      "placeholder": "e.g., 475",
      "keyboardType": "numeric",
      "required": false
    },
    {
      "name": "notes",
      "type": "multiline",
      "label": "Notes (Optional)",
      "placeholder": "Session notes...",
      "required": false
    }
  ],

  "labels": {
    "addTitle": "Start New Baking Session",
    "addSubtitle": "Track your bake from start to finish",
    "editTitle": "Edit Baking Session",
    "editSubtitle": "Update session details",
    "detailTitle": "Baking Session"
  },

  "relatedData": [
    {
      "queryKey": "RECIPE",
      "label": "Recipe Used",
      "display": "card",
      "field": "recipeId"
    }
  ],

  "listScreen": {
    "enabled": true,
    "emptyStateMessage": "No baking sessions yet",
    "emptyStateIcon": "oven",
    "sortBy": "startTime",
    "sortOrder": "desc"
  }
}
```

## Config Field Reference

### Entity Schema
- **name** (required): PascalCase entity name (singular)
- **namePlural** (required): PascalCase plural name
- **displayName** (required): Human-readable name
- **displayNamePlural** (required): Human-readable plural
- **icon** (required): MaterialCommunityIcons name
- **queryKey** (required): React Query key (UPPER_SNAKE_CASE)

### Storage Schema
- **file** (required): Storage service file name
- **interface** (required): TypeScript interface name
- **idType** (required): "number" | "string"

### Field Schema
- **name** (required): Field name (camelCase)
- **type** (required): "text" | "number" | "multiline" | "datetime" | "select" | "boolean"
- **label** (required): Display label
- **placeholder** (optional): Placeholder text
- **required** (required): Whether field is required
- **validation** (optional): Error message if validation fails
- **keyboardType** (optional): For number fields: "numeric" | "decimal-pad"
- **options** (for select): Array of { label, value } options

### Labels Schema
- **addTitle**: Title for Add screen
- **addSubtitle**: Subtitle for Add screen
- **editTitle**: Title for Edit screen
- **editSubtitle**: Subtitle for Edit screen
- **detailTitle**: Title for Detail screen

### Related Data Schema
- **queryKey**: Query key for related entity
- **label**: Display label for related section
- **display**: "card" | "list" | "inline"
- **field**: Foreign key field name in entity

### List Screen Schema
- **enabled**: Whether to generate list screen
- **emptyStateMessage**: Message when no items
- **emptyStateIcon**: Icon for empty state
- **sortBy**: Field to sort by
- **sortOrder**: "asc" | "desc"

## Generation Process

When invoked, this skill will:

### 1. Create Type Definition
**File**: `src/types/{entity}.ts`
```typescript
export interface BakingSession {
  id: number;
  recipeName: string;
  startTime: string;
  ovenTemp?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

### 2. Create Storage Service
**File**: `src/services/{entity}Storage.ts`

Implements AsyncStorage-based CRUD:
```typescript
export const bakingSessionStorage = {
  async getAll(): Promise<BakingSession[]> { ... },
  async getById(id: number): Promise<BakingSession | null> { ... },
  async create(data: Omit<BakingSession, 'id' | 'createdAt' | 'updatedAt'>): Promise<BakingSession> { ... },
  async update(id: number, data: Partial<BakingSession>): Promise<BakingSession> { ... },
  async delete(id: number): Promise<void> { ... },
};
```

### 3. Create Add Screen
**File**: `src/screens/{entity}/Add{Entity}Screen.tsx`

Features:
- Form with validation
- React Query create mutation
- Navigation back on success
- Error handling
- Loading states

### 4. Create Edit Screen
**File**: `src/screens/{entity}/Edit{Entity}Screen.tsx`

Features:
- Load existing data with useQuery
- Pre-populate form fields
- React Query update mutation
- Same validation as Add screen

### 5. Create Detail Screen
**File**: `src/screens/{entity}/{Entity}DetailScreen.tsx`

Features:
- Display entity information
- Edit button (navigates to Edit screen)
- Delete confirmation dialog
- Related data sections
- Loading and error states

### 6. Create List Screen (Optional)
**File**: `src/screens/{entity}/{Entity}ListScreen.tsx`

Features:
- FlatList of entities
- Empty state with message
- Pull to refresh
- Navigate to Detail on tap
- Add button in header

### 7. Update Navigation
- Add to `src/navigation/types.ts`
- Create stack navigator or add to existing
- Register all screens

### 8. Update Query Keys
**File**: `src/constants/queryKeys.ts`
```typescript
export const QUERY_KEYS = {
  // ... existing keys
  BAKING_SESSIONS: 'BAKING_SESSIONS',
};
```

## Generated Screen Patterns

### Add Screen Pattern
```typescript
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bakingSessionStorage } from '../../services/bakingSessionStorage';
import { QUERY_KEYS } from '../../constants/queryKeys';

export default function AddBakingSessionScreen({ navigation }: Props) {
  const queryClient = useQueryClient();

  // State for each field
  const [recipeName, setRecipeName] = useState('');
  const [ovenTemp, setOvenTemp] = useState('');

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: Omit<BakingSession, 'id' | 'createdAt' | 'updatedAt'>) => {
      return await bakingSessionStorage.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BAKING_SESSIONS] });
      navigation.goBack();
    },
    onError: (error) => {
      Alert.alert('Error', 'Failed to create baking session. Please try again.');
    },
  });

  const handleSubmit = () => {
    // Validation
    if (!recipeName.trim()) {
      Alert.alert('Validation Error', 'Recipe name is required');
      return;
    }

    // Submit
    createMutation.mutate({
      recipeName: recipeName.trim(),
      ovenTemp: ovenTemp ? parseFloat(ovenTemp) : undefined,
      startTime: new Date().toISOString(),
    });
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Icon name="oven" size={48} color={theme.colors.primary} />
          <Text style={styles.title}>Start New Baking Session</Text>
          <Text style={styles.subtitle}>Track your bake from start to finish</Text>
        </View>

        {/* Form */}
        <Card style={styles.card}>
          <BasicInput
            label="Recipe Name"
            value={recipeName}
            onChangeText={setRecipeName}
            placeholder="e.g., Country Loaf"
          />
          <BasicInput
            label="Oven Temperature (°F)"
            value={ovenTemp}
            onChangeText={setOvenTemp}
            placeholder="e.g., 475"
            keyboardType="numeric"
          />
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={() => navigation.goBack()}
          />
          <Button
            title="Save"
            loading={createMutation.isPending}
            onPress={handleSubmit}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
```

### Edit Screen Pattern
Similar to Add Screen but:
- Uses `useQuery` to load existing data
- Uses `useEffect` to populate form fields
- Uses update mutation instead of create

### Detail Screen Pattern
```typescript
export default function BakingSessionDetailScreen({ route, navigation }: Props) {
  const { sessionId } = route.params;
  const queryClient = useQueryClient();

  const { data: session, isLoading, isError, refetch } = useQuery({
    queryKey: [QUERY_KEYS.BAKING_SESSIONS, sessionId],
    queryFn: () => bakingSessionStorage.getById(sessionId),
  });

  const deleteMutation = useMutation({
    mutationFn: () => bakingSessionStorage.delete(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BAKING_SESSIONS] });
      navigation.goBack();
    },
  });

  const handleDelete = () => {
    Alert.alert(
      'Delete Baking Session?',
      'This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(),
        },
      ]
    );
  };

  if (isLoading) return <LoadingView />;
  if (isError || !session) return <ErrorView onRetry={refetch} />;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{session.recipeName}</Text>
        <Text style={styles.subtitle}>
          Started {new Date(session.startTime).toLocaleDateString()}
        </Text>
      </View>

      {/* Details */}
      <Card style={styles.card}>
        <DetailRow label="Oven Temperature" value={`${session.ovenTemp}°F`} />
        <DetailRow label="Notes" value={session.notes || 'No notes'} />
      </Card>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title="Edit"
          variant="outline"
          onPress={() => navigation.navigate('EditBakingSession', { sessionId })}
        />
        <Button
          title="Delete"
          variant="destructive"
          loading={deleteMutation.isPending}
          onPress={handleDelete}
        />
      </View>
    </ScrollView>
  );
}
```

## Files Generated/Modified

### New Files
1. `src/types/{entity}.ts`
2. `src/services/{entity}Storage.ts`
3. `src/screens/{entity}/Add{Entity}Screen.tsx`
4. `src/screens/{entity}/Edit{Entity}Screen.tsx`
5. `src/screens/{entity}/{Entity}DetailScreen.tsx`
6. `src/screens/{entity}/{Entity}ListScreen.tsx` (optional)

### Modified Files
1. `src/navigation/types.ts` - Add screen params
2. `src/constants/queryKeys.ts` - Add query key
3. `src/navigation/{Entity}Navigator.tsx` - Create or update stack

## Validation After Generation

```bash
# Type check
npx tsc

# Test in app
npm run android # or ios
```

Verify:
- Create → Detail → Edit → Delete flow works
- Form validation works correctly
- Loading states display properly
- Error handling works
- Navigation between screens works
- React Query cache invalidation works

## Example: Baking Journal Entry

```json
{
  "entity": {
    "name": "JournalEntry",
    "namePlural": "JournalEntries",
    "displayName": "Journal Entry",
    "displayNamePlural": "Journal Entries",
    "icon": "book-open-outline",
    "queryKey": "JOURNAL_ENTRIES"
  },
  "storage": {
    "file": "journalEntryStorage.ts",
    "interface": "JournalEntry",
    "idType": "string"
  },
  "fields": [
    {
      "name": "title",
      "type": "text",
      "label": "Title",
      "placeholder": "e.g., Perfect Sourdough",
      "required": true,
      "validation": "Title is required"
    },
    {
      "name": "bakeDate",
      "type": "datetime",
      "label": "Bake Date",
      "required": true
    },
    {
      "name": "rating",
      "type": "select",
      "label": "Rating",
      "options": [
        { "label": "⭐", "value": "1" },
        { "label": "⭐⭐", "value": "2" },
        { "label": "⭐⭐⭐", "value": "3" },
        { "label": "⭐⭐⭐⭐", "value": "4" },
        { "label": "⭐⭐⭐⭐⭐", "value": "5" }
      ],
      "required": true
    },
    {
      "name": "notes",
      "type": "multiline",
      "label": "Notes",
      "placeholder": "What went well? What could improve?",
      "required": false
    }
  ],
  "labels": {
    "addTitle": "New Journal Entry",
    "addSubtitle": "Record your baking experience",
    "editTitle": "Edit Journal Entry",
    "editSubtitle": "Update your notes",
    "detailTitle": "Journal Entry"
  },
  "listScreen": {
    "enabled": true,
    "emptyStateMessage": "Start journaling your bakes",
    "emptyStateIcon": "book-open-outline",
    "sortBy": "bakeDate",
    "sortOrder": "desc"
  }
}
```

## Tips

- **Follow existing patterns**: Study Starters and Recipes implementations
- **Use React Query**: Always use queries and mutations for data management
- **Validate inputs**: Provide clear error messages
- **Handle loading states**: Show spinners during async operations
- **Confirm destructive actions**: Always confirm deletes
- **Invalidate queries**: Ensure cache updates after mutations
- **Type safety**: Generate proper TypeScript interfaces

## Reference Files

Study these for patterns:
- **Starters**: `src/screens/starters/AddStarterScreen.tsx`
- **Recipes**: `src/screens/recipes/RecipeDetailScreen.tsx`
- **Storage**: `src/services/starterStorage.ts`
- **Types**: `src/types/starter.ts`
