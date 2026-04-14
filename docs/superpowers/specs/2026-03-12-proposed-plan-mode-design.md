# Proposed Plan Mode

## Summary

Add an `isProposed` boolean flag to the parenting plan that enables a single parent to complete the entire plan without co-parent participation. When enabled, sections remain in `draft` state (no review/agreement/signing cycle), the dashboard indicates proposed mode, and the preview/PDF output is labeled "Proposed Parenting Plan."

This is a last-resort path for parents whose co-parent refuses or is unable to participate in the collaborative process. It should be available but not encouraged.

## Context

From team discussion (2026-03-12): Many users signing up report that the other parent will not participate. A solo completion path lets them still produce a court-presentable document. This is a stepping stone — a future merge mode will allow both parents to complete independently and then reconcile differences.

## Data Model

### App-Wide Plan Context

The existing `OnboardingProvider` is scoped to `app/onboarding/layout.tsx` and is not accessible from the dashboard or other pages. To make `isProposed` available app-wide:

- Create a new `PlanContext` provider in `app/PlanContext.tsx` (`'use client'`) with `isProposed: boolean` (default `false`)
- Import `PlanProvider` as a client component wrapper in `app/layout.tsx` (which is a server component) — wrap `{children}` in it, standard Next.js pattern for client providers in server layouts
- Onboarding sets `isProposed` via `PlanContext` when the co-parent checkbox is toggled
- All other components (`page.tsx`, `AsyncSectionView`, etc.) read from `PlanContext`

This keeps `OnboardingData` focused on onboarding form state while `PlanContext` owns plan-level flags that need to be read app-wide.

### Section State

- When `isProposed` is true:
  - Sections use `draft` state when filled out but never progress to `in-review`, `contested`, `agreed`, or `signed`
  - `completedData` is still populated with the user's answers
  - `signatureStatus` is never set

### Progress Calculation

The existing `getCategoryCompletion()` in `section.ts` counts only `agreed` and `signed` as "completed." In proposed mode, sections never reach those states, so progress would show 0% even when every section is filled out.

- Add a `completed-draft` value to the `SectionState` union type in `section.ts`
- In proposed mode, when a user saves/completes a section, it transitions to `completed-draft` instead of staying in `draft`
- Update `getCategoryCompletion()` to count `completed-draft` as completed
- This gives `SectionStatusBadge` a clean state to render a distinct visual (e.g., green draft icon)

## Entry Points

### Onboarding: Co-Parent Step

Modify `app/onboarding/co-parent/page.tsx`:

- Add a checkbox/toggle: "My co-parent will not be completing this with me"
- When checked:
  - Keep name fields (first/last) visible and required
  - Keep address fields visible — many jurisdictions require both parents' addresses on the court filing
  - Hide or disable: email, phone, and invite button (these are only relevant for collaboration)
  - Set `isProposed: true` via `PlanContext`
- When unchecked: current behavior unchanged

No new onboarding step. Solo mode is handled within the existing co-parent page.

### Settings: Family Info Page

Modify `app/family-info/page.tsx`:

- Add a toggle/checkbox to the co-parent card: "Complete this plan without my co-parent"
- When toggled on, show a warning: "Your plan will be marked as a Proposed Parenting Plan. Signatures will not be collected."
- Updates `isProposed` via `PlanContext`
- Contextually placed in the co-parent card — discoverable but not prominent

Note: This page currently uses hardcoded mock data. Wiring it to `PlanContext` for the `isProposed` toggle is part of this feature's scope; wiring the rest of the page to shared state is not.

## Dashboard & Section Behavior

### Persistent Indicator

- Subtle banner or badge near the top of the dashboard when `isProposed` is true
- Text: "Proposed Plan Mode — You are completing this plan without your co-parent"
- Includes a link to settings to turn it off
- Also adapt the dashboard welcome subtitle (currently "Collaborate with your co-parent to complete your parenting plan") to something like "Complete your proposed parenting plan"

### SessionPrompt

- Hide or adapt the `SessionPrompt` component when `isProposed` is true — prompting to "start a session with your co-parent" is misleading in proposed mode

### Co-Parent Online Indicator

- Suppress the "{coParentName} is online" indicator in the dashboard header when `isProposed` is true

### AsyncDraftBanner Changes

- Text changes from "You're drafting this on your own" to "You're completing this as a proposed plan"
- Remove the "Start a live session to work on this together" escape hatch
- Suppress the `onStartSession` callback (don't pass it) when `isProposed` is true, rather than relying on the banner to hide it

### Section State Behavior

- Sections transition from `draft` to `completed-draft` when the user saves (not to `in-review`)
- "Submit for Review" button changes to "Complete" or "Save"
- `SectionStatusBadge` renders a distinct visual for `completed-draft` (e.g., green draft icon)

### Section Click Routing

The `handleSectionClick` function in `app/page.tsx` routes clicks based on section state. In proposed mode:

- `not-started` → Opens the section form (same as collaborative mode)
- `draft` → Opens `AsyncSectionView` for continued editing
- `completed-draft` → Opens `AsyncSectionView` in the `isDrafting` branch (editable, same as `draft`) but with button text "Update" instead of "Submit for Review". This lets users revise their answers at any time. There is no separate read-only view — the user is always in edit mode since there's no approval gate.

### Signing Flow

- `QuickSignModal` is never triggered
- `SectionSigningApproval` is never shown
- No "Ready to sign" badges on the dashboard

### ParentingPlanProgress

- Category completion bars use updated `getCategoryCompletion()` that counts `completed-draft`
- **Important:** `ParentingPlanProgress.tsx` also has an inline completion filter (separate from `getCategoryCompletion()`) for the overall progress bar and celebration message. This must also be updated to count `completed-draft`, or refactored to use `getCategoryCompletion()` to avoid drift.
- Status messages (via `getAsyncStatusMessage`) adapted for proposed mode — remove references to co-parent actions like "Both agreed", "Michael submitted", etc.
- Add a `completed-draft` case to `getAsyncStatusMessage`, e.g., `{ text: 'Completed', color: 'text-green-600', accent: 'border-l-4 border-green-400' }`

## Preview & PDF Output

### ParentingPlanPreviewModal

- Header changes to "Proposed Parenting Plan" when `isProposed` is true
- Disclaimer subtitle: "This parenting plan was prepared by one parent after the other parent declined or was unable to participate in the collaborative process."

### PDF (Future)

- When PDF generation is built, it should respect `isProposed` — title says "Proposed Parenting Plan," includes the disclaimer, and omits signature lines

## Affected Files

| File | Change |
|------|--------|
| `app/PlanContext.tsx` | **New file.** App-wide context with `isProposed` flag |
| `app/layout.tsx` | Wrap app in `PlanProvider` |
| `app/types/section.ts` | Add `completed-draft` to `SectionState`, update `getCategoryCompletion()` |
| `app/onboarding/co-parent/page.tsx` | Add solo mode checkbox, conditional field visibility |
| `app/family-info/page.tsx` | Add proposed mode toggle to co-parent card |
| `app/page.tsx` | Dashboard banner, gate signing flow, adapt click routing, hide co-parent online indicator |
| `app/components/SessionPrompt.tsx` | Hide or adapt when `isProposed` |
| `app/components/AsyncDraftBanner.tsx` | Proposed mode banner text, suppress `onStartSession` |
| `app/components/AsyncSectionView.tsx` | Change submit button text, transition to `completed-draft` |
| `app/components/QuickSignModal.tsx` | Gate: never open when `isProposed` |
| `app/components/SectionSigningApproval.tsx` | Gate: never show when `isProposed` |
| `app/components/SectionStatusBadge.tsx` | Add `completed-draft` visual variant |
| `app/components/ParentingPlanProgress.tsx` | Adapt status messages and completion bars for proposed mode |
| `app/components/ParentingPlanPreviewModal.tsx` | Title and disclaimer changes |

## Out of Scope

- Backend persistence (no backend yet)
- PDF generation (not yet implemented)
- Merge mode (future: both parents complete independently, then reconcile)
- Video/course completion tracking at individual level
- Legal disclaimer review
- Wiring family-info page to shared state beyond the `isProposed` toggle
