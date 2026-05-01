# SourdoughSuite Hackathon Technical Spec

## Architecture

Target architecture:

- Expo / React Native app for UI.
- Express backend in the same Replit project.
- Google AI Studio Gemini API for image analysis.
- Local AsyncStorage for recent diagnoses and bake plans.
- Expo local notifications for reminders when supported.

Official Gemini docs to follow:

- Image input with inline base64 data: https://ai.google.dev/gemini-api/docs/image-understanding
- Structured JSON output: https://ai.google.dev/gemini-api/docs/structured-output

Gemini docs note that inline image data is suitable for smaller requests under 20MB total request size. Use base64 JSON for the hackathon MVP.

## Existing App Anchors

Observed repo structure:

- Navigation: `src/navigation/MainTabNavigator.tsx`, `src/navigation/types.ts`
- Tools entry: `src/screens/Tools/ToolsScreen.tsx`
- Home entry: `src/screens/Home/HomeScreen.tsx`
- API wrapper: `src/services/api.ts`
- Notification service: `src/services/notificationService.ts`
- Theme: `src/theme/*`
- Local storage patterns: `src/services/*Storage.ts`

Prefer existing components:

- `src/components/Card.tsx`
- `src/components/Button.tsx`
- `src/components/Input.tsx`
- `src/components/Picker.tsx`
- `src/components/SkeletonLoader.tsx`

## Dependencies

Allowed additions:

- `expo-image-picker` for image selection on web and mobile.
- `express` for the Replit backend if not already present.
- `cors` for backend CORS if needed.
- `@google/genai` for Gemini API calls, or direct REST `fetch`.

Avoid:

- native-only packages
- UI kits
- camera packages that force a development build
- heavy validation frameworks unless already used

## Environment Variables

Backend:

- `GEMINI_API_KEY`: required for real Photo Rescue.
- `GEMINI_MODEL`: optional. Default to `gemini-3-flash-preview` if available in the account, otherwise allow Replit Agent to choose the current fast Gemini multimodal model from Google AI Studio.
- `PORT`: Express port.

Client:

- `API_BASE_URL`: Replit backend URL. Keep compatible with the existing constants setup.

## API Routes

### `GET /api/health`

Purpose: quick demo check.

Response:

```json
{
  "ok": true,
  "service": "sourdough-suite-api",
  "geminiConfigured": true
}
```

### `POST /api/photo-rescue/analyze`

Purpose: analyze one image and context with Gemini.

Request body:

```json
{
  "imageBase64": "base64-without-data-url-prefix",
  "mimeType": "image/jpeg",
  "context": {
    "subject": "dough",
    "stage": "bulk",
    "roomTempF": 72,
    "elapsedMinutes": 210,
    "hydrationPercent": 78,
    "flourType": "bread flour",
    "starterReadiness": "strong",
    "notes": "Dough looks slack and glossy."
  }
}
```

Success response:

```json
{
  "ok": true,
  "source": "gemini",
  "diagnosis": {
    "id": "diag_1714590000000",
    "createdAt": "2026-05-01T20:00:00.000Z",
    "subject": "dough",
    "stage": "bulk",
    "diagnosis": "Likely underdeveloped gluten with high hydration",
    "confidence": "medium",
    "summary": "The dough appears glossy and slack, with limited visible surface tension.",
    "visualEvidence": [
      "Glossy wet surface",
      "Dough is spreading instead of holding shape",
      "Few visible tension lines"
    ],
    "doNow": [
      {
        "title": "Rest 20 minutes",
        "details": "Let the flour hydrate and the dough relax before handling again.",
        "minutesFromNow": 20
      },
      {
        "title": "Perform two gentle coil folds",
        "details": "Use wet hands and space folds 30 minutes apart.",
        "minutesFromNow": 30
      }
    ],
    "nextBake": [
      "Lower hydration by 3-5 percentage points.",
      "Add one more fold during the first half of bulk.",
      "Track dough temperature more closely."
    ],
    "risk": "Avoid aggressive mixing now because it may tear the developing gluten network.",
    "missingContextQuestions": [
      "How much has the dough risen since mixing?",
      "Does the dough jiggle when you move the bowl?"
    ],
    "bakePlanSeed": {
      "suggestedStyle": "overnight-cold-proof",
      "adjustments": [
        "Add two coil folds before shaping.",
        "Use a conservative bulk check before final shaping."
      ]
    }
  }
}
```

Fallback response:

```json
{
  "ok": false,
  "source": "fallback-required",
  "errorCode": "GEMINI_UNAVAILABLE",
  "message": "Gemini is unavailable. Use Quick Rescue checklist."
}
```

## Client Types

Use these TypeScript shapes as the source of truth.

```ts
export type PhotoSubject = 'dough' | 'starter' | 'crumb' | 'loaf';
export type Confidence = 'low' | 'medium' | 'high';
export type ScheduleStyle = 'same-day' | 'overnight-cold-proof';
export type StarterReadiness = 'weak' | 'okay' | 'strong';

export interface PhotoRescueContext {
  subject: PhotoSubject;
  stage?: string;
  roomTempF?: number;
  elapsedMinutes?: number;
  hydrationPercent?: number;
  flourType?: string;
  starterReadiness?: StarterReadiness;
  notes?: string;
}

export interface PhotoRescueRequest {
  imageBase64: string;
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp';
  context: PhotoRescueContext;
}

export interface RescueAction {
  title: string;
  details: string;
  minutesFromNow?: number;
}

export interface BakePlanSeed {
  suggestedStyle: ScheduleStyle;
  adjustments: string[];
}

export interface PhotoRescueDiagnosis {
  id: string;
  createdAt: string;
  subject: PhotoSubject;
  stage?: string;
  diagnosis: string;
  confidence: Confidence;
  summary: string;
  visualEvidence: string[];
  doNow: RescueAction[];
  nextBake: string[];
  risk: string;
  missingContextQuestions: string[];
  bakePlanSeed?: BakePlanSeed;
}

export interface QuickRescueAnswers {
  subject: PhotoSubject;
  stage?: string;
  roomTempF?: number;
  elapsedMinutes?: number;
  observedSigns: string[];
  hydrationPercent?: number;
  starterReadiness?: StarterReadiness;
}

export interface BakePlanInput {
  targetBakeAt: string;
  roomTempF: number;
  starterReadiness: StarterReadiness;
  scheduleStyle: ScheduleStyle;
  hydrationPercent: number;
  loafCount: number;
  doughWeightG?: number;
  flourType?: string;
  starterPercent?: number;
  diagnosis?: PhotoRescueDiagnosis;
  remindersEnabled: boolean;
}

export type BakeStepType =
  | 'feed-starter'
  | 'mix'
  | 'fold'
  | 'bulk-check'
  | 'shape'
  | 'cold-proof'
  | 'preheat'
  | 'bake'
  | 'uncover'
  | 'cool';

export interface BakePlanStep {
  id: string;
  type: BakeStepType;
  title: string;
  startsAt: string;
  durationMinutes?: number;
  notes: string;
  reminderEnabled: boolean;
}

export interface BakePlan {
  id: string;
  createdAt: string;
  input: BakePlanInput;
  fermentationRisk: 'low' | 'medium' | 'high';
  temperatureNote: string;
  starterNote: string;
  steps: BakePlanStep[];
}

export interface SavedDiagnosisRecord {
  id: string;
  createdAt: string;
  imageUri?: string;
  diagnosis: PhotoRescueDiagnosis;
}

export interface SavedBakePlanRecord {
  id: string;
  createdAt: string;
  plan: BakePlan;
}
```

## Gemini Response Validation

The backend must normalize Gemini output before returning it.

Validation rules:

- `confidence` must be `low`, `medium`, or `high`.
- `subject` must be one of the four supported modes.
- `visualEvidence`, `doNow`, and `nextBake` must be non-empty arrays.
- `diagnosis`, `summary`, and `risk` must be strings.
- Strip markdown fences if Gemini returns them unexpectedly.
- If validation fails, return fallback-required response.
- Never expose raw Gemini errors to the client.

## Bake Day Copilot Timeline Rules

Default overnight cold proof timeline:

- Bake at target time.
- Preheat 45 minutes before bake.
- Cold proof begins after shaping.
- Shape roughly 10-12 hours before bake for overnight path, adjusted by room temperature and starter readiness.
- Bulk check occurs before shaping.
- Mix occurs 3.5-6.5 hours before shaping based on room temperature and starter strength.
- Folds occur at 30, 60, and optionally 90 minutes after mixing.
- Feed starter 4-8 hours before mixing based on starter readiness and room temperature.
- Cool at least 90 minutes after bake.

Temperature adjustment:

- Room under 68F: slower fermentation, extend bulk or warm spot.
- Room 68-74F: normal.
- Room 75-79F: faster fermentation, check earlier.
- Room 80F or higher: high risk of overfermentation; shorten bulk.

Starter adjustment:

- Weak: extend starter build, warn user, check peak before mixing.
- Okay: normal with conservative checks.
- Strong: schedule normal or slightly earlier checks.

Hydration adjustment:

- 75% or higher: prefer coil folds, wet hands, gentle handling.
- 80% or higher: warn that spread risk is higher for beginners.

## Tests

Focused tests only:

- Gemini response normalization and validation.
- Quick Rescue rule mapping.
- Bake Day Copilot timeline generation.
- Notification scheduling wrapper on unsupported platforms.

Avoid snapshot-heavy UI tests for the hackathon.

## Replit Agent Do-Not-Do List

- Do not rebuild navigation.
- Do not replace the theme.
- Do not remove existing tabs or calculators.
- Do not add auth requirements.
- Do not call Gemini from the client.
- Do not hardcode secrets.
- Do not add native-only dependencies.
- Do not require EAS.
- Do not over-polish secondary screens before the vertical slice works.
- Do not fake an AI result when Gemini fails.
