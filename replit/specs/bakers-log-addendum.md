# Baker's Log Stretch Feature Addendum

## Status

This is a stretch feature. Do not implement it until the core hackathon flow is working:

1. Photo Rescue real Gemini route
2. Photo Rescue result screen
3. Quick Rescue fallback
4. Bake Day Copilot deterministic timeline
5. Browser-demoable Replit flow

## Product Intent

Baker's Log turns SourdoughSuite from a one-time rescue tool into a learning loop.

The user should be able to connect:

- what the dough or starter looked like
- what Photo Rescue diagnosed
- what Bake Day Copilot planned
- what the baker actually did
- how the loaf turned out
- what they want to change next time

The feature should feel like a professional baker's notebook, not a data-entry chore.

## Core Decision

One Baker's Log entry represents **one bake**.

A bake can contain:

- zero or more Photo Rescue diagnoses
- zero or one Bake Day Copilot plan
- optional recipe link
- optional starter link
- final loaf / crumb outcome
- notes and next-time changes

## Navigation

Primary placement:

- Recipes tab / Recipes stack

Optional if cheap:

- Home shortcut card

Do not add a new bottom tab.

## MVP User Flows

### Save From Photo Rescue

1. User views Photo Rescue diagnosis.
2. User taps **Save to Baker's Log**.
3. App creates or updates today's active bake.
4. Diagnosis is attached to the bake.
5. App shows confirmation and link to the log entry.

### Save From Bake Day Copilot

1. User creates a bake plan.
2. User taps **Save Bake Plan**.
3. App creates or updates today's active bake.
4. Bake plan is attached to the bake.
5. App shows confirmation and link to the log entry.

### Add Outcome

1. User opens active bake or past bake.
2. User adds final loaf/crumb photos if available.
3. User records quick structured outcome fields.
4. User adds notes and next-time changes.
5. App saves locally.

## Screens

### Baker's Log List

Purpose: show active bake first, then chronological history.

Sections:

- Active Bake
- Past Bakes

Each row/card should show:

- title
- bake date
- status
- primary diagnosis or plan summary
- outcome snapshot if recorded
- small photo thumbnail if available

Empty state:

> Your baking notes will live here. Save a Photo Rescue diagnosis or Bake Day Copilot plan to start your first log.

### Baker's Log Detail

Purpose: one-page record of a bake.

Sections:

- title/date/status
- linked recipe/starter if present
- Photo Rescue diagnoses
- Bake Day Copilot plan summary
- final outcome
- notes
- next-time changes

Primary actions:

- Add Outcome
- Edit Notes
- Create Bake Plan if missing
- Reflect on This Bake if AI reflection stretch is implemented

### Add Outcome

Use quick controls:

- final loaf photo URI
- crumb photo URI
- oven spring: poor / okay / good / great
- crumb: dense / even / open / wild
- crust: pale / golden / dark / burnt
- flavor: bland / balanced / tangy / too sour
- freeform notes
- next time changes

Only title/date are required for the overall log entry. Outcome fields are optional.

## Data Model

```ts
export type BakeLogStatus = 'planned' | 'in-progress' | 'baked' | 'reviewed';
export type BakeLogSource = 'manual' | 'photo-rescue' | 'bake-plan';
export type OvenSpringRating = 'poor' | 'okay' | 'good' | 'great';
export type CrumbRating = 'dense' | 'even' | 'open' | 'wild';
export type CrustRating = 'pale' | 'golden' | 'dark' | 'burnt';
export type FlavorRating = 'bland' | 'balanced' | 'tangy' | 'too-sour';

export interface BakeOutcome {
  loafPhotoUri?: string;
  crumbPhotoUri?: string;
  ovenSpring?: OvenSpringRating;
  crumb?: CrumbRating;
  crust?: CrustRating;
  flavor?: FlavorRating;
  notes?: string;
  nextTimeChanges?: string;
  recordedAt: string;
}

export interface BakerLogEntry {
  id: string;
  title: string;
  bakeDate: string;
  createdAt: string;
  updatedAt: string;
  status: BakeLogStatus;
  source: BakeLogSource;
  recipeId?: string;
  starterId?: number;
  primaryPhotoUri?: string;
  diagnosisIds: string[];
  diagnoses: PhotoRescueDiagnosis[];
  bakePlanId?: string;
  bakePlan?: BakePlan;
  outcome?: BakeOutcome;
  notes?: string;
  nextTimeChanges?: string;
}
```

## Storage

Use AsyncStorage, following existing storage service patterns.

Suggested file:

- `src/services/bakersLogStorage.ts`

Suggested key:

- `@sourdough_bakers_log`

Required service methods:

```ts
getAll(): Promise<BakerLogEntry[]>
getById(id: string): Promise<BakerLogEntry | null>
getActiveBake(): Promise<BakerLogEntry | null>
create(input: Partial<BakerLogEntry> & Pick<BakerLogEntry, 'title' | 'bakeDate'>): Promise<BakerLogEntry>
update(id: string, updates: Partial<BakerLogEntry>): Promise<BakerLogEntry | null>
delete(id: string): Promise<boolean>
attachDiagnosis(entryId: string, diagnosis: PhotoRescueDiagnosis): Promise<BakerLogEntry | null>
attachBakePlan(entryId: string, bakePlan: BakePlan): Promise<BakerLogEntry | null>
addOutcome(entryId: string, outcome: BakeOutcome): Promise<BakerLogEntry | null>
```

When saving from Photo Rescue or Bake Day Copilot:

- If there is an active bake today, offer to attach to it.
- If not, create a new entry with an auto title such as `Bake - May 1`.

For hackathon speed, it is acceptable to auto-attach to today's active bake without a modal.

## Photo Storage

MVP:

- Store local image URIs.
- Do not store large base64 images in AsyncStorage.
- Do not add remote file uploads.

Future App Store polish:

- Use `expo-file-system` to copy selected images into app document storage before saving URIs.

## AI Reflection Stretch

Only implement after core logging works.

Button:

- **Reflect on This Bake**

Input:

- diagnoses
- bake plan summary
- outcome fields
- notes
- next-time changes

Output:

- what likely happened
- what worked
- what to change next time
- one professional baker tip

Rules:

- Use the same backend/Gemini pattern as Photo Rescue.
- Do not call Gemini from the client.
- If Gemini is unavailable, hide the reflection action or show a fail-soft message.

## Acceptance Criteria

- User can save a Photo Rescue diagnosis to Baker's Log.
- User can save a Bake Day Copilot plan to Baker's Log.
- User can view active bake above past bakes.
- User can open a log detail screen.
- User can add structured final outcome fields.
- User can add notes and next-time changes.
- All data persists locally.
- Existing Recipes, Tools, and Home flows still work.
- No account/auth dependency is introduced.

## Do Not Do

- Do not add a new bottom tab.
- Do not require a recipe or starter link.
- Do not store base64 images in AsyncStorage.
- Do not add remote photo storage.
- Do not make AI reflection part of the core logging requirement.
- Do not block Photo Rescue or Bake Day Copilot completion on Baker's Log.
