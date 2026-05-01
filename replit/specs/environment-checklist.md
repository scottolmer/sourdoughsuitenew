# SourdoughSuite Replit Environment Checklist

Use this before demo work and again before final submission.

## Required Secrets

### `GEMINI_API_KEY`

Required for real Photo Rescue.

Rules:

- Store it in Replit Secrets.
- Do not commit it.
- Do not print it in logs.
- Do not send it to the client.

### `GEMINI_MODEL`

Optional.

If unset, the backend should use the chosen fast multimodal Gemini model from `replit/specs/technical-spec.md` or the current Google AI Studio recommendation.

### `PORT`

Optional in most Replit setups.

Express should respect `process.env.PORT` when present.

### `API_BASE_URL`

Client-side base URL for API requests, if this app uses an explicit constant.

Rules:

- Keep it compatible with Expo web.
- Prefer same-origin or Replit preview URL for the web demo.
- Do not hardcode a private local machine URL for the final demo.

## Startup Commands

Check `package.json` first.

Expected app command:

```bash
npm start -- --web
```

Expected test command:

```bash
npm test -- --runInBand
```

Expected typecheck command:

```bash
npx tsc --noEmit
```

If an Express backend is added, document the backend command in the final report. Common options:

```bash
npm run server
```

or:

```bash
node server/index.js
```

## Health Checks

If backend exists, verify:

```bash
curl http://localhost:$PORT/api/health
```

Expected shape:

```json
{
  "ok": true,
  "service": "sourdough-suite-api",
  "geminiConfigured": true
}
```

If `GEMINI_API_KEY` is missing, `geminiConfigured` may be false, but the app must still support Quick Rescue.

## Photo Rescue Checks

Verify real route:

- image and context are sent to backend
- backend calls Gemini
- backend validates structured JSON
- client renders diagnosis
- raw Gemini errors are not exposed to user

Verify missing-key route:

- unset or omit `GEMINI_API_KEY`
- analyze photo
- app switches to Quick Rescue
- UI says `Using quick rescue checklist`

## Web Compatibility

Must work in Replit web preview:

- Home loads
- Photo Rescue opens
- sample photo path works
- upload path works if browser permits
- Diagnosis Result renders
- Bake Day Copilot renders
- landing page opens
- reminder toggle does not crash

Camera/native behavior is optional for the web demo. Sample image and upload are enough.

## Landing Page

Selected page:

- `replit/landing-oven-light.html`
- `replit/landing-oven-light.png`

If deploying static docs, copy/adapt the selected HTML into:

- `docs/index.html`

Keep privacy and terms pages:

- `docs/privacy-policy.html`
- `docs/terms-of-service.html`

## Secret Safety Checklist

Before final commit:

```bash
git diff --cached
git status --short
```

Search for accidental secrets:

```bash
rg -n "GEMINI_API_KEY|AIza|api_key|secret|token" .
```

Expected:

- references in docs/config only
- no actual key values committed

## Final Environment Report Template

```text
Environment:
- Expo web: PASS/FAIL
- Backend: PASS/FAIL
- Health route: PASS/FAIL
- Gemini configured: YES/NO
- Quick Rescue fallback: PASS/FAIL
- Landing page: PASS/FAIL

Commands run:
- ...

Known environment risks:
- ...
```
