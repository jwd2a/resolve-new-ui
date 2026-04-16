# Solo Mode Refinements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the proposed/solo mode entry points and UX based on client call feedback — add dashboard entry point with confirmation modal, simplify session prompt in solo mode, make proposed indicator more prominent, and remove the onboarding checkbox.

**Architecture:** A new `SoloModeConfirmModal` component handles both switching on and switching off solo mode with appropriate warnings. The dashboard gets a CTA link that opens this modal. `SessionPrompt` gains a solo mode variant showing a single "Start Session" button. The onboarding co-parent page loses its solo mode checkbox (solo mode is now only accessible from the dashboard and family-info page).

**Tech Stack:** Next.js 14 App Router, React Context (`PlanContext`), TypeScript, Tailwind CSS, Heroicons

---

## Context

This plan implements refinements discussed in the 2026-03-20 client call. The existing solo/proposed mode infrastructure (`PlanContext`, `isProposed` flag, `completed-draft` state, section gating) is already in place. These changes adjust *how users enter and exit* solo mode and improve the dashboard UX when in it.

**Key decisions from the call:**
- Solo mode entry should be on the **dashboard** (not onboarding) via a link that opens a confirmation modal
- **Remove** the solo mode checkbox from onboarding — keep the invite flow as-is
- Session prompt should show a **single "Start Session" button** in solo mode (not hidden entirely)
- Proposed mode indicator on the parenting plan should be **big and prominent** ("put Proposed Draft Mode like big across")
- Switching **back** from solo mode needs a confirmation warning
- Family-info toggle stays but should also confirm before toggling off

## File Structure

| File | Change |
|------|--------|
| `app/components/SoloModeConfirmModal.tsx` | **New.** Confirmation modal for switching solo mode on/off |
| `app/page.tsx` | Add solo mode CTA link on dashboard, open modal, show SessionPrompt in solo mode |
| `app/components/SessionPrompt.tsx` | Add `isSoloMode` prop for simplified single-button variant |
| `app/components/ParentingPlanProgress.tsx` | Make proposed mode banner prominent across the plan section |
| `app/onboarding/co-parent/page.tsx` | Remove solo mode checkbox and related `usePlan` import |
| `app/family-info/page.tsx` | Wire toggle to open confirmation modal instead of directly setting state |

---

### Task 1: Create SoloModeConfirmModal

**Files:**
- Create: `app/components/SoloModeConfirmModal.tsx`

This modal handles both directions: switching TO solo mode (warning + recommend collaboration) and switching FROM solo mode (confirmation + implications). Uses the `isOpen`/`onClose` pattern from existing modals (e.g., `AddHolidayModal`).

- [ ] **Step 1: Create the modal component**

```tsx
// app/components/SoloModeConfirmModal.tsx
'use client';

import { XMarkIcon, ExclamationTriangleIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface SoloModeConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  /** 'enable' = switching to solo mode, 'disable' = switching back to collaborative */
  direction: 'enable' | 'disable';
  coParentName?: string;
}

export default function SoloModeConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  direction,
  coParentName = 'your co-parent',
}: SoloModeConfirmModalProps) {
  if (!isOpen) return null;

  const isEnabling = direction === 'enable';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>

          {isEnabling ? (
            <>
              {/* Enable solo mode content */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-amber-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Switch to Solo Mode?</h2>
              </div>

              <div className="space-y-3 mb-6">
                <p className="text-sm text-gray-600">
                  We strongly recommend completing your parenting plan together with {coParentName}. Plans completed collaboratively are more likely to be accepted by the court and followed by both parents.
                </p>
                <p className="text-sm text-gray-600">
                  If {coParentName} is unable or unwilling to participate, you can complete the plan on your own. Your plan will be marked as a <span className="font-medium text-gray-900">Proposed Parenting Plan</span> and signatures will not be collected.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => { onConfirm(); onClose(); }}
                  className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Switch to Solo Mode
                </button>
                <button
                  onClick={onClose}
                  className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Keep Collaborating
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Disable solo mode content */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <UserGroupIcon className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Switch Back to Collaborative Mode?</h2>
              </div>

              <div className="space-y-3 mb-6">
                <p className="text-sm text-gray-600">
                  Great that {coParentName} is willing to collaborate! Switching back will enable joint sessions, review workflows, and signatures.
                </p>
                <p className="text-sm text-gray-600">
                  Your existing work will be preserved, but the plan will no longer be marked as a proposed draft.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => { onConfirm(); onClose(); }}
                  className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Switch to Collaborative Mode
                </button>
                <button
                  onClick={onClose}
                  className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Stay in Solo Mode
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds (component not yet imported anywhere)

- [ ] **Step 3: Commit**

```bash
git add app/components/SoloModeConfirmModal.tsx
git commit -m "feat: add SoloModeConfirmModal for switching solo mode on/off"
```

---

### Task 2: Add SessionPrompt Solo Mode Variant

**Files:**
- Modify: `app/components/SessionPrompt.tsx`

In solo mode, the session prompt shows a single "Start Session" button instead of the in-person/remote choice. There is no co-parent to coordinate with, so the two-option chooser is irrelevant.

- [ ] **Step 1: Add `isSoloMode` prop and simplified rendering**

Add `isSoloMode?: boolean` to `SessionPromptProps`. When true, render a single "Start Session" button instead of the two-card layout.

In `SessionPrompt.tsx`, add the prop to the interface:

```typescript
interface SessionPromptProps {
  coParentName: string;
  coParentOnline: boolean;
  lastSessionDate?: Date;
  onStartInPerson?: () => void;
  onStartRemote?: () => void;
  canStartCourse?: boolean;
  isSoloMode?: boolean;
  onStartSession?: () => void;
}
```

Add `isSoloMode = false` and `onStartSession` to the destructured props.

Before the existing return statement, add:

```tsx
if (isSoloMode) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Continue Your Plan
        </h3>
        <p className="text-sm text-gray-600">
          Pick up where you left off on your proposed parenting plan.
        </p>
      </div>

      <button
        onClick={onStartSession}
        className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors"
      >
        Start Session
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add app/components/SessionPrompt.tsx
git commit -m "feat: add solo mode variant to SessionPrompt with single Start Session button"
```

---

### Task 3: Make ParentingPlanProgress Proposed Banner Prominent

**Files:**
- Modify: `app/components/ParentingPlanProgress.tsx:89-117`

Currently the proposed mode indicator is only in the overall dashboard banner. Eric wants "Proposed Draft Mode" displayed **big across** the parenting plan section itself. Add a prominent banner inside `ParentingPlanProgress` when `isProposed` is true, between the header and the category sections.

- [ ] **Step 1: Add prominent proposed mode banner**

In `ParentingPlanProgress.tsx`, after the closing `</div>` of the `{/* Header */}` section (after line 117) and before the `{/* Category Sections */}` comment (line 119), add:

```tsx
{/* Proposed Mode Banner */}
{isProposed && !previewMode && (
  <div className="mb-6 py-3 px-4 bg-purple-50 border border-purple-200 rounded-lg">
    <p className="text-center text-sm font-semibold text-purple-800 tracking-wide uppercase">
      Proposed Draft Mode
    </p>
    <p className="text-center text-xs text-purple-600 mt-1">
      You are completing this plan without your co-parent. Signatures will not be collected.
    </p>
  </div>
)}
```

- [ ] **Step 2: Verify build**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add app/components/ParentingPlanProgress.tsx
git commit -m "feat: add prominent Proposed Draft Mode banner inside parenting plan progress"
```

---

### Task 4: Wire Dashboard — Solo Mode CTA, Modal, and SessionPrompt

**Files:**
- Modify: `app/page.tsx`

Three changes in `page.tsx`:
1. Import `SoloModeConfirmModal`, add modal state, render the modal
2. When NOT in solo mode, show a subtle CTA link below the session prompt: "Co-parent unable to participate?" that opens the modal
3. When IN solo mode, show `SessionPrompt` with `isSoloMode` instead of hiding it entirely
4. The existing proposed banner's "Change" link should open the modal (direction: 'disable') instead of navigating to `/family-info`

- [ ] **Step 1: Add imports and modal state**

Add import at the top of `app/page.tsx`:

```typescript
import SoloModeConfirmModal from './components/SoloModeConfirmModal';
```

Change the `usePlan` destructuring to include `setIsProposed`:

```typescript
const { isProposed, setIsProposed } = usePlan();
```

Add state after the existing `useState` calls:

```typescript
const [showSoloModeModal, setShowSoloModeModal] = useState(false);
const [soloModalDirection, setSoloModalDirection] = useState<'enable' | 'disable'>('enable');
```

Add a handler after `handleStartRemote`:

```typescript
const handleOpenSoloModal = (direction: 'enable' | 'disable') => {
  setSoloModalDirection(direction);
  setShowSoloModeModal(true);
};
```

- [ ] **Step 2: Update the proposed mode banner "Change" link**

Replace the existing proposed mode banner (the `{isProposed && (` block with the purple banner, approximately lines 328-340) — change the `<a href="/family-info">` link to a button that opens the modal:

Old:
```tsx
<a href="/family-info" className="text-sm text-purple-600 hover:text-purple-800 underline">
  Change
</a>
```

New:
```tsx
<button
  onClick={() => handleOpenSoloModal('disable')}
  className="text-sm text-purple-600 hover:text-purple-800 underline"
>
  Change
</button>
```

- [ ] **Step 3: Replace hidden SessionPrompt with conditional rendering**

Replace the SessionPrompt block (approximately lines 346-355). Change from:

```tsx
{/* Session Prompt */}
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

To:

```tsx
{/* Session Prompt */}
{isProposed ? (
  <SessionPrompt
    coParentName={userData.coParentName}
    coParentOnline={false}
    isSoloMode
    onStartSession={() => alert('Starting solo session...')}
  />
) : (
  <>
    <SessionPrompt
      coParentName={userData.coParentName}
      coParentOnline={userData.coParentOnline}
      lastSessionDate={new Date('2026-01-01')}
      onStartInPerson={handleStartInPerson}
      onStartRemote={handleStartRemote}
      canStartCourse={!showPreCourse || (preCourseState.inviteStatus === 'accepted' && preCourseState.waiverStatus.you && preCourseState.waiverStatus.them && preCourseState.paymentStatus.you && preCourseState.paymentStatus.them)}
    />
    {/* Solo mode entry point */}
    <div className="text-center">
      <button
        onClick={() => handleOpenSoloModal('enable')}
        className="text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2 transition-colors"
      >
        Co-parent unable to participate? Switch to solo mode
      </button>
    </div>
  </>
)}
```

- [ ] **Step 4: Render the modal**

At the bottom of the JSX, just before the closing `</div>` of the root element (right after the `QuickSignModal` block), add:

```tsx
<SoloModeConfirmModal
  isOpen={showSoloModeModal}
  onClose={() => setShowSoloModeModal(false)}
  onConfirm={() => setIsProposed(soloModalDirection === 'enable')}
  direction={soloModalDirection}
  coParentName={userData.coParentName}
/>
```

- [ ] **Step 5: Verify build**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add solo mode CTA on dashboard with confirmation modal, show SessionPrompt in solo mode"
```

---

### Task 5: Remove Solo Mode Checkbox from Onboarding

**Files:**
- Modify: `app/onboarding/co-parent/page.tsx`

Per the call, solo mode should NOT be toggled during onboarding. Users should go through the normal invite flow, then switch to solo mode from the dashboard if needed. Remove the `usePlan` import and the checkbox that was added.

- [ ] **Step 1: Read the current file to identify exact code to remove**

Read `app/onboarding/co-parent/page.tsx` and identify:
- The `import { usePlan } from '@/app/PlanContext';` line
- The `const { isProposed, setIsProposed } = usePlan();` line (or similar destructuring)
- The checkbox block with "My co-parent will not be completing this with me"
- Any conditional hiding of email/phone/invite fields based on `isProposed`

- [ ] **Step 2: Remove the solo mode checkbox and related code**

Remove:
1. The `usePlan` import
2. The `usePlan()` call
3. The checkbox UI block
4. Any conditional rendering that hides fields based on `isProposed` — restore all fields to always visible

- [ ] **Step 3: Verify build**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add app/onboarding/co-parent/page.tsx
git commit -m "refactor: remove solo mode checkbox from onboarding co-parent page

Solo mode is now only accessible from the dashboard and family-info page,
per client feedback that onboarding should focus on the invite flow."
```

---

### Task 6: Wire Family-Info Toggle to Confirmation Modal

**Files:**
- Modify: `app/family-info/page.tsx`

Currently the family-info page has a bare checkbox that directly sets `isProposed`. It should instead open the `SoloModeConfirmModal` for confirmation before toggling.

- [ ] **Step 1: Import modal and add state**

Add import:

```typescript
import SoloModeConfirmModal from '@/app/components/SoloModeConfirmModal';
```

Add state inside `FamilyInfoPage`:

```typescript
const [showSoloModeModal, setShowSoloModeModal] = useState(false);
```

- [ ] **Step 2: Replace direct checkbox with confirmation flow**

Replace the current proposed mode toggle block (the `<div className="mt-6 pt-4 border-t border-gray-200">` section inside the Parents card, approximately lines 219-238).

Old:
```tsx
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

New:
```tsx
<div className="mt-6 pt-4 border-t border-gray-200">
  <div className="flex items-start space-x-3">
    <input
      type="checkbox"
      checked={isProposed}
      onChange={() => setShowSoloModeModal(true)}
      className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/50 cursor-pointer"
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
  </div>
</div>
```

- [ ] **Step 3: Render the modal**

At the end of the JSX, just before the closing `</main>` tag, add:

```tsx
<SoloModeConfirmModal
  isOpen={showSoloModeModal}
  onClose={() => setShowSoloModeModal(false)}
  onConfirm={() => setIsProposed(!isProposed)}
  direction={isProposed ? 'disable' : 'enable'}
  coParentName="Michael"
/>
```

- [ ] **Step 4: Verify build**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add app/family-info/page.tsx
git commit -m "feat: wire family-info solo mode toggle to confirmation modal"
```

---

### Task 7: Visual Verification

- [ ] **Step 1: Verify full build passes**

Run: `npx next build`
Expected: All routes compile, no TypeScript errors

- [ ] **Step 2: Manual verification checklist**

Open `http://localhost:3000` and verify:

1. **Dashboard (not in solo mode):** Below the session prompt, "Co-parent unable to participate? Switch to solo mode" link is visible
2. **Click the link:** Confirmation modal opens with warning about collaboration being recommended, "Switch to Solo Mode" and "Keep Collaborating" buttons
3. **Confirm solo mode:** Dashboard updates — purple banner visible, session prompt shows single "Start Session" button, "Proposed Draft Mode" banner is prominent across parenting plan section
4. **Click "Change" on banner:** Modal opens in 'disable' direction with "Switch Back to Collaborative Mode?" messaging
5. **Family-info page (`/family-info`):** Clicking the checkbox opens the confirmation modal instead of directly toggling
6. **Onboarding (`/onboarding/co-parent`):** No solo mode checkbox present — just the normal invite flow
