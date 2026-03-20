# Proposed Plan Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow a single parent to complete the entire parenting plan without co-parent participation, using an `isProposed` flag that adjusts UI behavior app-wide.

**Architecture:** A new `PlanContext` React context provides the `isProposed` boolean to the entire app. A new `completed-draft` section state tracks sections the solo user has finished. All existing components conditionally adapt their behavior based on `isProposed`.

**Tech Stack:** Next.js 14+ (App Router), React Context, TypeScript, Tailwind CSS, Heroicons

**Spec:** `docs/superpowers/specs/2026-03-12-proposed-plan-mode-design.md`

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `app/PlanContext.tsx` | Create | App-wide context providing `isProposed` + `setIsProposed` |
| `app/layout.tsx` | Modify | Wrap `{children}` in `PlanProvider` |
| `app/types/section.ts` | Modify | Add `completed-draft` to `SectionState`, update `getCategoryCompletion()` |
| `app/onboarding/co-parent/page.tsx` | Modify | Add solo mode checkbox, hide email/phone/invite when checked |
| `app/family-info/page.tsx` | Modify | Add proposed mode toggle to co-parent card |
| `app/page.tsx` | Modify | Dashboard banner, welcome text, co-parent indicator, click routing, signing gates |
| `app/components/SessionPrompt.tsx` | No change | Hidden at call site in `page.tsx` when `isProposed` |
| `app/components/QuickSignModal.tsx` | No change | Gated at call site in `page.tsx` when `isProposed` |
| `app/components/SectionSigningApproval.tsx` | No change | Never invoked when `isProposed` — gated upstream |
| `app/components/AsyncDraftBanner.tsx` | Modify | Add `proposed` banner state, suppress session link |
| `app/components/AsyncSectionView.tsx` | Modify | Proposed mode button text, transition to `completed-draft` |
| `app/components/SectionStatusBadge.tsx` | Modify | Add `completed-draft` badge visual |
| `app/components/ParentingPlanProgress.tsx` | Modify | Update completion calc, status messages, hide signing labels |
| `app/components/ParentingPlanPreviewModal.tsx` | Modify | Title + disclaimer when proposed |

---

### Task 1: Create PlanContext

**Files:**
- Create: `app/PlanContext.tsx`
- Modify: `app/layout.tsx:20-34`

- [ ] **Step 1: Create `app/PlanContext.tsx`**

```tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface PlanContextType {
  isProposed: boolean;
  setIsProposed: (value: boolean) => void;
}

const PlanContext = createContext<PlanContextType | null>(null);

export function PlanProvider({ children }: { children: ReactNode }) {
  const [isProposed, setIsProposed] = useState(false);

  return (
    <PlanContext.Provider value={{ isProposed, setIsProposed }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
}
```

- [ ] **Step 2: Wrap app in PlanProvider**

In `app/layout.tsx`, import `PlanProvider` and wrap `{children}`:

```tsx
import { PlanProvider } from '@/app/PlanContext';

// Inside the return, wrap {children}:
<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
  <PlanProvider>
    {children}
  </PlanProvider>
</body>
```

Note: `layout.tsx` is a server component. Importing a `'use client'` component is fine — Next.js handles the boundary. The layout itself stays as a server component.

- [ ] **Step 3: Verify the app still builds**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add app/PlanContext.tsx app/layout.tsx
git commit -m "feat: add PlanContext with isProposed flag"
```

---

### Task 2: Add `completed-draft` state and fix all exhaustive switches

Adding a new value to `SectionState` will break any exhaustive switch that doesn't handle it. This project uses `strict: true`, so all affected switches must be updated in the same commit to avoid build failures.

**Files:**
- Modify: `app/types/section.ts:2-8,70-81`
- Modify: `app/components/SectionStatusBadge.tsx:13-49`
- Modify: `app/page.tsx:188-205` (handleSectionClick)
- Modify: `app/components/ParentingPlanProgress.tsx:22-45` (getAsyncStatusMessage)

- [ ] **Step 1: Add `completed-draft` to the SectionState union**

In `app/types/section.ts`, update the `SectionState` type:

```typescript
export type SectionState =
  | 'not-started'
  | 'draft'
  | 'completed-draft'
  | 'in-review'
  | 'contested'
  | 'agreed'
  | 'signed'
```

- [ ] **Step 2: Update `getCategoryCompletion()` to count `completed-draft`**

```typescript
export function getCategoryCompletion(sections: Section[], category: SectionCategory): {
  total: number;
  completed: number;
  signed: number;
} {
  const categorySections = sections.filter(s => s.category === category);
  return {
    total: categorySections.length,
    completed: categorySections.filter(s =>
      s.state === 'agreed' || s.state === 'signed' || s.state === 'completed-draft'
    ).length,
    signed: categorySections.filter(s => s.state === 'signed').length,
  };
}
```

- [ ] **Step 3: Add `completed-draft` case to SectionStatusBadge**

In `app/components/SectionStatusBadge.tsx`, add this case between `draft` and `in-review` in the switch:

```typescript
case 'completed-draft':
  return (
    <div className={`${iconSize} rounded-full bg-success-light flex items-center justify-center`}>
      <CheckIcon className={`${innerSize} text-success`} />
    </div>
  );
```

`CheckIcon` is already imported from `@heroicons/react/24/solid` on line 1.

- [ ] **Step 4: Add `completed-draft` case to `handleSectionClick` in `app/page.tsx`**

Add `case 'completed-draft':` to fall through with `draft`:

```typescript
case 'draft':
case 'completed-draft':
case 'in-review':
case 'contested':
  setAsyncViewSection(section);
  break;
```

- [ ] **Step 5: Add `completed-draft` case to `getAsyncStatusMessage` in `ParentingPlanProgress.tsx`**

Add before the `agreed` case:

```typescript
case 'completed-draft':
  return { text: 'Completed', color: 'text-green-600', accent: 'border-l-4 border-green-400' };
```

- [ ] **Step 6: Verify build**

Run: `npm run build`
Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 7: Commit**

```bash
git add app/types/section.ts app/components/SectionStatusBadge.tsx app/page.tsx app/components/ParentingPlanProgress.tsx
git commit -m "feat: add completed-draft section state and update all consumers"
```

---

### Task 3: Update AsyncDraftBanner for proposed mode

**Files:**
- Modify: `app/components/AsyncDraftBanner.tsx`

- [ ] **Step 1: Add `proposed` to the banner state type and config**

Update the interface to accept the new state:

```typescript
interface AsyncDraftBannerProps {
  coParentName: string;
  state: 'drafting' | 'reviewing' | 'contested' | 'proposed';
  editCount?: number;
  onStartSession?: () => void;
}
```

Add the `proposed` config entry to the `config` object:

```typescript
proposed: {
  bg: 'bg-purple-50',
  border: 'border-purple-200',
  iconColor: 'text-purple-500',
  title: "You're completing this as a proposed plan",
  subtitle: 'Your answers will be saved. No co-parent review is required.',
},
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add app/components/AsyncDraftBanner.tsx
git commit -m "feat: add proposed state to AsyncDraftBanner"
```

---

### Task 4: Update AsyncSectionView for proposed mode

**Files:**
- Modify: `app/components/AsyncSectionView.tsx`

- [ ] **Step 1: Add `isProposed` prop to the interface**

```typescript
interface AsyncSectionViewProps {
  section: Section;
  coParentName: string;
  isProposed?: boolean;
  onSave?: (data: Record<string, string>) => void;
  onSubmitForReview?: (data: Record<string, string>) => void;
  onComplete?: (data: Record<string, string>) => void;
  onAccept?: () => void;
  onSubmitChanges?: (data: Record<string, string>, edits: EditEntry[]) => void;
  onStartSession?: () => void;
  onClose?: () => void;
}
```

Add `isProposed` and `onComplete` to the destructured props.

- [ ] **Step 2: Update banner state logic**

Replace the `bannerState` computation (lines 43-47):

```typescript
const bannerState = (() => {
  if (isProposed) return 'proposed' as const;
  if (section.state === 'in-review') return 'reviewing' as const;
  if (section.state === 'contested') return 'contested' as const;
  return 'drafting' as const;
})();
```

- [ ] **Step 3: Update isDrafting to include `completed-draft`**

```typescript
const isDrafting = section.state === 'draft' || section.state === 'not-started' || section.state === 'completed-draft';
```

- [ ] **Step 4: Suppress `onStartSession` when proposed**

In the `AsyncDraftBanner` render (line 90-95), conditionally pass `onStartSession`:

```tsx
<AsyncDraftBanner
  coParentName={coParentName}
  state={bannerState}
  editCount={section.editHistory?.length}
  onStartSession={isProposed ? undefined : onStartSession}
/>
```

- [ ] **Step 5: Update the drafting action bar for proposed mode**

Replace the `isDrafting` block in the action bar (lines 121-135):

```tsx
{isDrafting && (
  <>
    <button
      onClick={() => onSave?.(formData)}
      className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
    >
      Save & Continue Later
    </button>
    {isProposed ? (
      <button
        onClick={() => onComplete?.(formData)}
        className="px-5 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
      >
        {section.state === 'completed-draft' ? 'Update' : 'Complete'}
      </button>
    ) : (
      <button
        onClick={() => onSubmitForReview?.(formData)}
        className="px-5 py-2 text-sm font-semibold text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors"
      >
        Submit for Review
      </button>
    )}
  </>
)}
```

- [ ] **Step 6: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 7: Commit**

```bash
git add app/components/AsyncSectionView.tsx
git commit -m "feat: add proposed mode to AsyncSectionView"
```

---

### Task 5: Update ParentingPlanProgress for proposed mode

**Files:**
- Modify: `app/components/ParentingPlanProgress.tsx`

- [ ] **Step 1: Add `isProposed` prop**

```typescript
interface ParentingPlanProgressProps {
  sections: Section[];
  onSectionClick?: (section: Section) => void;
  previewMode?: boolean;
  coParentName?: string;
  isProposed?: boolean;
}
```

Destructure it in the component signature.

- [ ] **Step 2: Fix the inline completion calculation (line 66)**

```typescript
const completedSections = sections.filter(s =>
  s.state === 'agreed' || s.state === 'signed' || s.state === 'completed-draft'
).length;
```

- [ ] **Step 3: Hide signing-related labels when proposed**

Note: The `completed-draft` case for `getAsyncStatusMessage` was already added in Task 2.

In the section row render (around lines 185-193), wrap the signing/agreed labels:

```tsx
{!isProposed && section.state === 'agreed' && (
  <span className="text-xs text-success font-medium">Ready to sign</span>
)}
{!isProposed && section.state === 'signed' && (
  <span className="text-xs text-success font-medium">Signed</span>
)}
```

- [ ] **Step 4: Update completion celebration message (line 213-218)**

```tsx
{completedSections === totalSections && totalSections > 0 && (
  <div className="mt-6 p-4 bg-success/10 border-2 border-success rounded-lg text-center">
    <p className="text-success font-semibold">
      {isProposed
        ? 'All sections complete! Your proposed parenting plan is ready for review.'
        : 'All sections complete! Ready to sign your parenting plan.'}
    </p>
  </div>
)}
```

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 6: Commit**

```bash
git add app/components/ParentingPlanProgress.tsx
git commit -m "feat: update ParentingPlanProgress for proposed mode"
```

---

### Task 6: Update ParentingPlanPreviewModal

**Files:**
- Modify: `app/components/ParentingPlanPreviewModal.tsx:79-126`

- [ ] **Step 1: Add `isProposed` prop**

```typescript
interface ParentingPlanPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSectionId?: string;
  isProposed?: boolean;
}
```

Destructure `isProposed` in the component.

- [ ] **Step 2: Update the header title (line 119)**

```tsx
<h2 className="text-xl font-bold text-white">
  {isProposed ? 'Proposed Parenting Plan' : 'Parenting Plan Preview'}
</h2>
```

- [ ] **Step 3: Add disclaimer below header when proposed**

Inside the content area, before the section content (around line 171), add:

```tsx
{isProposed && (
  <div className="mx-8 mt-6 mb-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
    <p className="text-sm text-amber-800">
      This parenting plan was prepared by one parent after the other parent
      declined or was unable to participate in the collaborative process.
    </p>
  </div>
)}
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add app/components/ParentingPlanPreviewModal.tsx
git commit -m "feat: add proposed plan title and disclaimer to preview modal"
```

---

### Task 7: Update the dashboard (app/page.tsx)

This is the largest task — it wires everything together on the main page.

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Import and consume PlanContext**

At the top of the component, add:

```tsx
import { usePlan } from '@/app/PlanContext';
```

Inside the `Home` component:

```tsx
const { isProposed } = usePlan();
```

- [ ] **Step 2: Add proposed mode banner**

After the welcome section (after line 315), add:

```tsx
{isProposed && (
  <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 bg-purple-500 rounded-full" />
      <p className="text-sm text-purple-800 font-medium">
        Proposed Plan Mode — You are completing this plan without your co-parent
      </p>
    </div>
    <a href="/family-info" className="text-sm text-purple-600 hover:text-purple-800 underline">
      Change
    </a>
  </div>
)}
```

- [ ] **Step 3: Update welcome subtitle (line 300)**

```tsx
<p className="text-gray-600">
  {isProposed
    ? 'Complete your proposed parenting plan.'
    : 'Collaborate with your co-parent to complete your parenting plan.'}
</p>
```

- [ ] **Step 4: Hide co-parent online indicator (lines 256-260)**

```tsx
{!isOnboarding && !isProposed && userData.coParentOnline && (
  <div className="flex items-center space-x-2">
    <div className="w-2 h-2 bg-success rounded-full" />
    <span className="text-sm text-gray-700">{userData.coParentName} is online</span>
  </div>
)}
```

- [ ] **Step 5: Conditionally hide SessionPrompt (line 321-328)**

Wrap the `SessionPrompt` render:

```tsx
{!isProposed && (
  <SessionPrompt
    coParentName={userData.coParentName}
    coParentOnline={userData.coParentOnline}
    lastSessionDate={new Date('2026-01-01')}
    onStartInPerson={handleStartInPerson}
    onStartRemote={handleStartRemote}
    canStartCourse={!showPreCourse || (preCourseState.inviteStatus === 'accepted' && preCourseState.waiverStatus.you && preCourseState.waiverStatus.them && preCourseState.paymentStatus.you && preCourseState.paymentStatus.them)}
  />
)}
```

- [ ] **Step 6: Pass `isProposed` to ParentingPlanProgress (line 331-336)**

```tsx
<ParentingPlanProgress
  sections={mockSections}
  onSectionClick={handleSectionClick}
  coParentName="Michael"
  isProposed={isProposed}
  previewMode={showPreCourse && !(preCourseState.inviteStatus === 'accepted' && preCourseState.waiverStatus.you && preCourseState.waiverStatus.them && preCourseState.paymentStatus.you && preCourseState.paymentStatus.them)}
/>
```

- [ ] **Step 7: Update `handleSectionClick` for proposed mode (lines 188-205)**

Note: `completed-draft` was already added to the switch in Task 2. Now update the `agreed` case to gate signing:

```typescript
case 'agreed':
  if (isProposed) {
    // In proposed mode, no signing — just view
    setShowPreviewModal(true);
  } else {
    setShowSignModal(true);
  }
  break;
```

- [ ] **Step 8: Pass `isProposed` to AsyncSectionView and add `onComplete` handler**

Update the AsyncSectionView render (lines 376-398):

```tsx
<AsyncSectionView
  section={asyncViewSection}
  coParentName="Michael"
  isProposed={isProposed}
  onSave={(data) => {
    console.log('Saved draft:', data);
    setAsyncViewSection(null);
  }}
  onSubmitForReview={(data) => {
    console.log('Submitted for review:', data);
    setAsyncViewSection(null);
  }}
  onComplete={(data) => {
    console.log('Completed proposed section:', data);
    setAsyncViewSection(null);
  }}
  onAccept={() => {
    console.log('Accepted');
    setAsyncViewSection(null);
  }}
  onSubmitChanges={(data, edits) => {
    console.log('Submitted changes:', data, edits);
    setAsyncViewSection(null);
  }}
  onStartSession={isProposed ? undefined : () => {
    setAsyncViewSection(null);
  }}
  onClose={() => setAsyncViewSection(null)}
/>
```

- [ ] **Step 9: Pass `isProposed` to ParentingPlanPreviewModal (line 368-371)**

```tsx
<ParentingPlanPreviewModal
  isOpen={showPreviewModal}
  onClose={() => setShowPreviewModal(false)}
  isProposed={isProposed}
/>
```

- [ ] **Step 10: Gate the QuickSignModal (lines 404-414)**

```tsx
{showSignModal && !isProposed && (
  <QuickSignModal
    sections={mockSections.filter(s => s.state === 'agreed' && !s.signatureStatus?.you)}
    coParentName="Michael"
    onClose={() => setShowSignModal(false)}
    onSign={(sectionIds, signature) => {
      console.log('Signed sections:', sectionIds, 'with signature:', signature);
      setShowSignModal(false);
    }}
  />
)}
```

- [ ] **Step 11: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 12: Commit**

```bash
git add app/page.tsx
git commit -m "feat: wire proposed mode into dashboard"
```

---

### Task 8: Add solo mode checkbox to onboarding co-parent step

**Files:**
- Modify: `app/onboarding/co-parent/page.tsx`

- [ ] **Step 1: Import PlanContext**

```tsx
import { usePlan } from '@/app/PlanContext';
// Note: PlanProvider wraps the whole app, so this works from onboarding too
```

Inside the component, before the return:

```tsx
const { isProposed, setIsProposed } = usePlan();
```

Note: The onboarding layout is a child of `app/layout.tsx`, which wraps children in `PlanProvider`. However, `OnboardingProvider` wraps `app/onboarding/layout.tsx`. Since `PlanProvider` is at the app root, `usePlan()` will work inside onboarding pages.

- [ ] **Step 2: Add the checkbox above the name fields**

After the subtitle `<p>` tag (line 29) and before the Co-Parent Legal Name section (line 32), add:

```tsx
{/* Solo mode toggle */}
<div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-xl">
  <label className="flex items-start space-x-3 cursor-pointer">
    <input
      type="checkbox"
      checked={isProposed}
      onChange={(e) => setIsProposed(e.target.checked)}
      className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/50"
    />
    <div>
      <span className="text-sm font-medium text-gray-900">
        My co-parent will not be completing this with me
      </span>
      <p className="text-xs text-gray-500 mt-1">
        You&apos;ll create a proposed parenting plan on your own. Your co-parent or a lawyer can review it later.
      </p>
    </div>
  </label>
</div>
```

- [ ] **Step 3: Conditionally hide email, phone, and invite sections**

Wrap the phone field (lines 88-97) with:

```tsx
{!isProposed && (
  // ... phone field
)}
```

Wrap the email field (lines 100-109) with:

```tsx
{!isProposed && (
  // ... email field
)}
```

Wrap the invite section (lines 112-135) with:

```tsx
{!isProposed && (
  // ... invite section
)}
```

Keep the name fields and address fields visible — they're needed for court documents.

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add app/onboarding/co-parent/page.tsx
git commit -m "feat: add solo mode checkbox to onboarding co-parent step"
```

---

### Task 9: Add proposed mode toggle to Family Info page

**Files:**
- Modify: `app/family-info/page.tsx`

- [ ] **Step 1: Import PlanContext**

```tsx
import { usePlan } from '@/app/PlanContext';
```

Inside the component:

```tsx
const { isProposed, setIsProposed } = usePlan();
```

- [ ] **Step 2: Add toggle to the Parents card**

Inside the `<SectionCard id="parents" ...>` content (after the parents grid, around line 215), add:

```tsx
{/* Proposed mode toggle */}
<div className="mt-6 pt-4 border-t border-gray-200">
  <label className="flex items-start space-x-3 cursor-pointer">
    <input
      type="checkbox"
      checked={isProposed}
      onChange={(e) => setIsProposed(e.target.checked)}
      className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/50"
    />
    <div>
      <span className="text-sm font-medium text-gray-900">
        Complete this plan without my co-parent
      </span>
      {isProposed && (
        <p className="text-xs text-amber-600 mt-1">
          Your plan will be marked as a Proposed Parenting Plan. Signatures will not be collected.
        </p>
      )}
    </div>
  </label>
</div>
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add app/family-info/page.tsx
git commit -m "feat: add proposed mode toggle to family info page"
```

---

### Task 10: Visual verification and final build

- [ ] **Step 1: Run full build**

Run: `npm run build`
Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 2: Start dev server and manually verify**

Run: `npm run dev`

Verify the following flows in the browser:

1. **Default mode (isProposed = false):** Dashboard shows co-parent online indicator, SessionPrompt, normal section states, signing flow works. No proposed banner visible.

2. **Enable proposed mode via onboarding:**
   - Navigate to `/onboarding/co-parent`
   - Check "My co-parent will not be completing this with me"
   - Verify: email, phone, invite sections disappear. Name and address remain.

3. **Dashboard in proposed mode:**
   - Purple "Proposed Plan Mode" banner visible at top
   - Welcome subtitle says "Complete your proposed parenting plan"
   - Co-parent online indicator hidden
   - SessionPrompt hidden
   - Section rows don't show "Ready to sign"
   - Clicking a section opens AsyncSectionView with purple proposed banner
   - "Submit for Review" button replaced with "Complete"

4. **Family Info toggle:**
   - Navigate to `/family-info`
   - Toggle visible in Parents card
   - Warning text appears when checked

5. **Preview modal:**
   - Title says "Proposed Parenting Plan"
   - Disclaimer visible

- [ ] **Step 3: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: address visual issues from proposed mode verification"
```
