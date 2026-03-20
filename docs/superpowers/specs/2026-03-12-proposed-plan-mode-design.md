# Proposed Plan Mode

## Summary

Add an `isProposed` boolean flag to the parenting plan that enables a single parent to complete the entire plan without co-parent participation. When enabled, sections remain in `draft` state (no review/agreement/signing cycle), the dashboard indicates proposed mode, and the preview/PDF output is labeled "Proposed Parenting Plan."

This is a last-resort path for parents whose co-parent refuses or is unable to participate in the collaborative process. It should be available but not encouraged.

## Context

From team discussion (2026-03-12): Many users signing up report that the other parent will not participate. A solo completion path lets them still produce a court-presentable document. This is a stepping stone — a future merge mode will allow both parents to complete independently and then reconcile differences.

## Data Model

- Add `isProposed: boolean` (default `false`) to `OnboardingData` in `OnboardingContext.tsx`
- This is the single source of truth — all components read from it
- When `isProposed` is true:
  - Sections use `draft` state when filled out but never progress to `in-review`, `contested`, `agreed`, or `signed`
  - `completedData` is still populated with the user's answers
  - `signatureStatus` is never set

## Entry Points

### Onboarding: Co-Parent Step

Modify `app/onboarding/co-parent/page.tsx`:

- Add a checkbox/toggle: "My co-parent will not be completing this with me"
- When checked:
  - Keep name fields (first/last) visible and required
  - Hide or disable: email, phone, address fields, and invite button
  - Set `isProposed: true` in `OnboardingData`
- When unchecked: current behavior unchanged

No new onboarding step. Solo mode is handled within the existing co-parent page.

### Settings: Family Info Page

Modify `app/family-info/page.tsx`:

- Add a toggle/checkbox to the co-parent card: "Complete this plan without my co-parent"
- When toggled on, show a warning: "Your plan will be marked as a Proposed Parenting Plan. Signatures will not be collected."
- Updates `isProposed` in shared state
- Contextually placed in the co-parent card — discoverable but not prominent

## Dashboard & Section Behavior

### Persistent Indicator

- Subtle banner or badge near the top of the dashboard when `isProposed` is true
- Text: "Proposed Plan Mode — You are completing this plan without your co-parent"
- Includes a link to settings to turn it off

### AsyncDraftBanner Changes

- Text changes from "You're drafting this on your own" to "You're completing this as a proposed plan"
- Remove the "Start a live session to work on this together" escape hatch

### Section State Behavior

- Sections stay in `draft` after the user fills them out — no progression beyond that
- "Submit for Review" button changes to "Save" or "Complete"
- Status badges may need a "completed draft" visual variant so filled-out sections don't look unfinished

### Signing Flow

- `QuickSignModal` is never triggered
- `SectionSigningApproval` is never shown
- No "Ready to sign" badges on the dashboard

## Preview & PDF Output

### ParentingPlanPreviewModal

- Header changes to "Proposed Parenting Plan" when `isProposed` is true
- Disclaimer subtitle: "This parenting plan was prepared by one parent after the other parent declined or was unable to participate in the collaborative process."

### PDF (Future)

- When PDF generation is built, it should respect `isProposed` — title says "Proposed Parenting Plan," includes the disclaimer, and omits signature lines

## Affected Files

| File | Change |
|------|--------|
| `app/onboarding/OnboardingContext.tsx` | Add `isProposed` to `OnboardingData` |
| `app/onboarding/co-parent/page.tsx` | Add solo mode checkbox, conditional field visibility |
| `app/family-info/page.tsx` | Add proposed mode toggle to co-parent card |
| `app/page.tsx` | Dashboard banner, gate signing flow |
| `app/components/AsyncDraftBanner.tsx` | Proposed mode banner text |
| `app/components/AsyncSectionView.tsx` | Change submit button text, skip review flow |
| `app/components/QuickSignModal.tsx` | Gate: never open when `isProposed` |
| `app/components/SectionSigningApproval.tsx` | Gate: never show when `isProposed` |
| `app/components/SectionStatusBadge.tsx` | Possible "completed draft" variant |
| `app/components/ParentingPlanPreviewModal.tsx` | Title and disclaimer changes |
| `app/types/section.ts` | No changes needed — existing states suffice |

## Out of Scope

- Backend persistence (no backend yet)
- PDF generation (not yet implemented)
- Merge mode (future: both parents complete independently, then reconcile)
- Video/course completion tracking at individual level
- Legal disclaimer review
