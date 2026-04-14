# Async Section Completion Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow parents to complete parenting plan sections independently (draft → review → agree) while keeping sync sessions as the primary experience.

**Architecture:** Extend the existing `SectionState` type from 3 states to 7, add async-related fields to the `Section` interface, update all components that branch on state, then build the new async UI (draft banner, review view, inline diffs, contested view). The dashboard keeps its category grouping with subtle async indicators on affected sections.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, Heroicons v2

**Spec:** `docs/superpowers/specs/2026-03-11-async-completion-design.md`

---

## Chunk 1: Data Model & State Migration

### Task 1: Extend SectionState type and Section interface

**Files:**
- Modify: `app/types/section.ts`

- [ ] **Step 1: Update `SectionState` type**

Replace the existing type (line 2) with the extended version:

```typescript
export type SectionState =
  | 'not-started'
  | 'draft'
  | 'in-review'
  | 'contested'
  | 'agreed'
  | 'signed'
```

Note: `'learning'` is omitted — deferred until learning infrastructure exists. `'completed'` is renamed to `'agreed'`.

- [ ] **Step 2: Add `EditEntry` interface**

Add after the `SignatureStatus` interface (after line 17):

```typescript
export interface EditEntry {
  fieldId: string
  previousValue: any
  newValue: any
  editedBy: 'you' | 'them'
  editedAt: Date
}
```

- [ ] **Step 3: Extend `Section` interface with async fields**

Add these fields to the `Section` interface (after `signatureStatus`, line 36):

```typescript
  draftData?: any
  draftedBy?: 'you' | 'them'
  currentTurn?: 'you' | 'them'
  editHistory?: EditEntry[]
```

- [ ] **Step 4: Update `getCategoryCompletion` helper**

The function (line ~56) currently checks for `'completed'`. Update to check for `'agreed'`:

```typescript
export function getCategoryCompletion(sections: Section[], category: SectionCategory) {
  const categorySections = sections.filter(s => s.category === category)
  return {
    total: categorySections.length,
    completed: categorySections.filter(s => s.state === 'agreed' || s.state === 'signed').length,
    signed: categorySections.filter(s => s.state === 'signed').length,
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add app/types/section.ts
git commit -m "feat: extend SectionState with async states and add EditEntry type"
```

---

### Task 2: Update mock data in page.tsx

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Rename `'completed'` to `'agreed'` in mock sections**

Update mock section data (lines ~161-182). Find-and-replace all `state: 'completed'` to `state: 'agreed'`. The sections with `'completed'` state are:
- "Weekend Schedule" (id: `weekend-schedule`)
- "Transportation & Exchange" (id: `transportation`)
- "Day-to-Day Decisions" (id: `day-to-day`)

- [ ] **Step 2: Add async fields to existing mock sections**

Modify the **existing** mock section objects in-place (do not replace them — keep their existing `id`, `moduleId`, `moduleName`, `estimatedTime`, and `formUrl` fields intact). Add the new async fields:

For the existing "School Breaks" section (find by `id: 'school-breaks'`), add these fields to show a draft waiting for review:
```typescript
  state: 'in-review' as SectionState,
  draftedBy: 'them' as const,
  currentTurn: 'you' as const,
  draftData: {
    springBreak: 'Alternating years',
    winterBreak: 'Split evenly — first half with one parent, second half with other',
    summerBreak: 'Each parent gets two consecutive weeks',
  },
```

For the existing "Healthcare Decisions" section (find by `id: 'healthcare'`), add these fields to show contested state:
```typescript
  state: 'contested' as SectionState,
  draftedBy: 'you' as const,
  currentTurn: 'you' as const,
  draftData: {
    primaryPhysician: 'Both parents must agree on primary physician',
    emergencyDecisions: 'Either parent can authorize emergency treatment',
    mentalHealth: 'Both parents must consent to ongoing therapy',
  },
  editHistory: [
    {
      fieldId: 'mentalHealth',
      previousValue: 'Primary custodial parent decides on therapy',
      newValue: 'Both parents must consent to ongoing therapy',
      editedBy: 'them' as const,
      editedAt: new Date('2026-03-09'),
    },
  ],
```

- [ ] **Step 3: Add state variables for async view and sign modal**

Add these state variables alongside the existing state declarations at the top of the component:

```typescript
const [asyncViewSection, setAsyncViewSection] = useState<Section | null>(null)
const [showSignModal, setShowSignModal] = useState(false)
```

- [ ] **Step 4: Update `handleSectionClick` to handle new states**

Replace the handler (lines ~184-204) with:

```typescript
const handleSectionClick = (section: Section) => {
  switch (section.state) {
    case 'not-started':
      // Would start a session or begin drafting
      console.log('Start section:', section.id)
      break
    case 'draft':
    case 'in-review':
    case 'contested':
      // Open async section view
      setAsyncViewSection(section)
      break
    case 'agreed':
      // Open signing flow
      setShowSignModal(true)
      break
    case 'signed':
      // Show preview
      setShowPreviewModal(true)
      break
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "feat: update mock data and handlers for async section states"
```

---

### Task 3: Update SectionStatusBadge for new states

**Files:**
- Modify: `app/components/SectionStatusBadge.tsx`

- [ ] **Step 1: Add visual states for new section states**

Replace the component body (the return statement, lines ~12-36) with:

```typescript
export default function SectionStatusBadge({ status, size = 'md' }: SectionStatusBadgeProps) {
  const iconSize = size === 'sm' ? 'w-5 h-5' : 'w-6 h-6'
  const innerSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'

  switch (status) {
    case 'not-started':
      return (
        <div className={`${iconSize} rounded-full border-2 border-gray-300 bg-white flex items-center justify-center`}>
        </div>
      )
    case 'draft':
      return (
        <div className={`${iconSize} rounded-full bg-amber-100 flex items-center justify-center`}>
          <PencilIcon className={`${innerSize} text-amber-600`} />
        </div>
      )
    case 'in-review':
      return (
        <div className={`${iconSize} rounded-full bg-blue-100 flex items-center justify-center`}>
          <EyeIcon className={`${innerSize} text-blue-600`} />
        </div>
      )
    case 'contested':
      return (
        <div className={`${iconSize} rounded-full bg-amber-100 flex items-center justify-center`}>
          <ArrowUturnLeftIcon className={`${innerSize} text-amber-600`} />
        </div>
      )
    case 'agreed':
      return (
        <div className={`${iconSize} rounded-full bg-success-light flex items-center justify-center`}>
          <CheckIcon className={`${innerSize} text-success`} />
        </div>
      )
    case 'signed':
      return (
        <div className={`${iconSize} rounded-full bg-success-light flex items-center justify-center`}>
          <PencilSquareIcon className={`${innerSize} text-success`} />
        </div>
      )
  }
}
```

- [ ] **Step 2: Add icon imports**

Update the imports at the top of the file:

```typescript
import { CheckIcon, PencilSquareIcon, PencilIcon, EyeIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/solid'
```

- [ ] **Step 3: Update the Props type to use extended SectionState**

Ensure `SectionStatusBadgeProps` uses `SectionState` from the types file (should already be imported).

- [ ] **Step 4: Commit**

```bash
git add app/components/SectionStatusBadge.tsx
git commit -m "feat: add status badge visuals for draft, in-review, and contested states"
```

---

### Task 4: Update ParentingPlanProgress with async indicators

**Files:**
- Modify: `app/components/ParentingPlanProgress.tsx`

- [ ] **Step 1: Update completion counting logic**

In the component (line ~40), update the completion check from `'completed'` to `'agreed'`:

```typescript
const completedCount = categorySections.filter(
  s => s.state === 'agreed' || s.state === 'signed'
).length
```

- [ ] **Step 2: Add async status message helper**

Add this helper function inside the component, before the return statement:

```typescript
const getAsyncStatusMessage = (section: Section, coParentName: string) => {
  switch (section.state) {
    case 'in-review':
      if (section.currentTurn === 'you') {
        return { text: `${coParentName} submitted a draft for your review`, color: 'text-blue-600', accent: 'border-l-4 border-blue-500' }
      }
      return { text: `Your draft sent · Waiting on ${coParentName}`, color: 'text-gray-500', accent: '' }
    case 'contested':
      if (section.currentTurn === 'you') {
        const editCount = section.editHistory?.length ?? 0
        return { text: `${coParentName} suggested changes · ${editCount} field${editCount !== 1 ? 's' : ''}`, color: 'text-amber-600', accent: 'border-l-4 border-amber-500' }
      }
      return { text: `Your changes sent · Waiting on ${coParentName}`, color: 'text-gray-500', accent: '' }
    case 'draft':
      if (section.draftedBy === 'you') {
        return { text: 'Draft in progress', color: 'text-amber-600', accent: 'border-l-4 border-amber-500' }
      }
      return { text: `${coParentName} is drafting`, color: 'text-gray-500', accent: '' }
    case 'agreed':
      return { text: 'Both agreed', color: 'text-success', accent: 'border-l-4 border-success' }
    default:
      return null
  }
}
```

- [ ] **Step 3: Add `coParentName` prop**

Update the component props interface to include `coParentName`:

```typescript
interface ParentingPlanProgressProps {
  sections: Section[]
  onSectionClick?: (section: Section) => void
  previewMode?: boolean
  coParentName?: string
}
```

- [ ] **Step 4: Update section row rendering to show async indicators**

In the section row JSX (inside the map over `categorySections`), update the row to include async status. Find the existing section row rendering and update it. The section row should show:

1. The existing `SectionStatusBadge`
2. The section title
3. A new subtitle line for async status (if applicable)
4. An action button for actionable states (Review button)
5. The existing status text for agreed/signed states

Update the section item rendering inside `categorySections.map`. **Important:** Preserve the existing `previewMode` conditional rendering path — only modify the non-preview rendering. The existing preview mode JSX (lines ~113-158) must remain untouched. Update only the interactive (non-preview) section rows:

```tsx
{categorySections.map((section) => {
  const asyncStatus = getAsyncStatusMessage(section, coParentName || 'Co-parent')
  const isActionable = (section.state === 'in-review' || section.state === 'contested') && section.currentTurn === 'you'

  return (
    <div
      key={section.id}
      className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${asyncStatus?.accent || ''}`}
      onClick={() => onSectionClick?.(section)}
    >
      <SectionStatusBadge status={section.state} size="sm" />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${section.state === 'not-started' ? 'text-gray-500' : 'text-gray-900'}`}>
          {section.title}
        </p>
        {asyncStatus && (
          <p className={`text-xs mt-0.5 ${asyncStatus.color}`}>
            {asyncStatus.text}
          </p>
        )}
      </div>
      {isActionable && (
        <button
          className="text-xs px-3 py-1.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors font-medium"
          onClick={(e) => { e.stopPropagation(); onSectionClick?.(section) }}
        >
          Review
        </button>
      )}
      {section.state === 'agreed' && (
        <span className="text-xs text-success font-medium">Ready to sign</span>
      )}
      {section.state === 'signed' && (
        <span className="text-xs text-success font-medium">Signed</span>
      )}
      {section.state === 'not-started' && section.estimatedTime && (
        <span className="text-xs text-gray-400">{section.estimatedTime}</span>
      )}
    </div>
  )
})}
```

- [ ] **Step 5: Pass `coParentName` from page.tsx**

In `app/page.tsx`, update the `ParentingPlanProgress` usage to pass `coParentName`:

```tsx
<ParentingPlanProgress
  sections={sections}
  onSectionClick={handleSectionClick}
  coParentName="Michael"
/>
```

- [ ] **Step 6: Commit**

```bash
git add app/components/ParentingPlanProgress.tsx app/page.tsx
git commit -m "feat: add async status indicators to section rows in dashboard"
```

---

## Chunk 2: Async Drafting & Review UI

### Task 5: Create AsyncDraftBanner component

**Files:**
- Create: `app/components/AsyncDraftBanner.tsx`

- [ ] **Step 1: Create the banner component**

This component shows at the top of a form when a parent is drafting solo. It explains the async context and offers an escape to sync.

```tsx
'use client'

import { InformationCircleIcon } from '@heroicons/react/24/outline'

interface AsyncDraftBannerProps {
  coParentName: string
  state: 'drafting' | 'reviewing' | 'contested'
  editCount?: number
  onStartSession?: () => void
}

export default function AsyncDraftBanner({ coParentName, state, editCount, onStartSession }: AsyncDraftBannerProps) {
  const config = {
    drafting: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      iconColor: 'text-amber-500',
      title: "You're drafting this on your own",
      subtitle: `${coParentName} will review your answers when you submit.`,
    },
    reviewing: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      iconColor: 'text-blue-500',
      title: `${coParentName} submitted this draft`,
      subtitle: 'Review each answer. You can accept as-is, or edit any field to suggest changes.',
    },
    contested: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      iconColor: 'text-amber-500',
      title: `${coParentName} suggested changes to ${editCount ?? 0} field${editCount !== 1 ? 's' : ''}`,
      subtitle: 'Review the changes. Accept to agree, or edit further.',
    },
  }

  const { bg, border, iconColor, title, subtitle } = config[state]

  return (
    <div className={`${bg} ${border} border rounded-lg p-4 flex items-start gap-3`}>
      <InformationCircleIcon className={`w-5 h-5 ${iconColor} mt-0.5 flex-shrink-0`} />
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-600 mt-0.5">{subtitle}</p>
        {onStartSession && (
          <button
            onClick={onStartSession}
            className="text-sm text-primary hover:text-primary-dark font-medium mt-2 underline"
          >
            Start a live session to work on this together
          </button>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/AsyncDraftBanner.tsx
git commit -m "feat: add AsyncDraftBanner component for async context messaging"
```

---

### Task 6: Create InlineDiffField component

**Files:**
- Create: `app/components/InlineDiffField.tsx`

- [ ] **Step 1: Create the inline diff component**

This component renders a form field that shows the current value and, if changed, highlights the edit with the previous value below.

```tsx
'use client'

interface InlineDiffFieldProps {
  label: string
  currentValue: string
  previousValue?: string
  editedBy?: string
  isEditable?: boolean
  onChange?: (value: string) => void
  dimmed?: boolean
}

export default function InlineDiffField({
  label,
  currentValue,
  previousValue,
  editedBy,
  isEditable = false,
  onChange,
  dimmed = false,
}: InlineDiffFieldProps) {
  const hasChange = previousValue !== undefined && previousValue !== currentValue

  return (
    <div className={`mb-4 ${dimmed ? 'opacity-50' : ''}`}>
      <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>

      {hasChange ? (
        <div className="border-2 border-amber-300 bg-amber-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-amber-700 uppercase">
              {editedBy ? `${editedBy} changed this` : 'Edited'}
            </span>
          </div>
          {isEditable ? (
            <textarea
              className="w-full text-sm text-gray-900 bg-white border border-gray-200 rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary"
              value={currentValue}
              onChange={(e) => onChange?.(e.target.value)}
              rows={2}
            />
          ) : (
            <p className="text-sm text-gray-900">{currentValue}</p>
          )}
          <p className="text-xs text-gray-500 mt-2 italic">Was: {previousValue}</p>
        </div>
      ) : (
        <div className="border border-gray-200 bg-white rounded-lg p-3">
          {isEditable ? (
            <textarea
              className="w-full text-sm text-gray-900 bg-white border-0 p-0 focus:ring-0 resize-none"
              value={currentValue}
              onChange={(e) => onChange?.(e.target.value)}
              rows={2}
            />
          ) : (
            <p className="text-sm text-gray-900">{currentValue || <span className="italic text-gray-400">Not yet filled in</span>}</p>
          )}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/InlineDiffField.tsx
git commit -m "feat: add InlineDiffField component for async review diffs"
```

---

### Task 7: Create AsyncSectionView component

**Files:**
- Create: `app/components/AsyncSectionView.tsx`

- [ ] **Step 1: Create the main async section view**

This is the primary component that renders the form in async mode — handling drafting, reviewing, and contested states. It composes `AsyncDraftBanner` and `InlineDiffField`.

```tsx
'use client'

import { useState } from 'react'
import { Section, EditEntry } from '@/app/types/section'
import AsyncDraftBanner from './AsyncDraftBanner'
import InlineDiffField from './InlineDiffField'

interface AsyncSectionViewProps {
  section: Section
  coParentName: string
  onSave?: (data: Record<string, string>) => void
  onSubmitForReview?: (data: Record<string, string>) => void
  onAccept?: () => void
  onSubmitChanges?: (data: Record<string, string>, edits: EditEntry[]) => void
  onStartSession?: () => void
  onClose?: () => void
}

export default function AsyncSectionView({
  section,
  coParentName,
  onSave,
  onSubmitForReview,
  onAccept,
  onSubmitChanges,
  onStartSession,
  onClose,
}: AsyncSectionViewProps) {
  const draftData = (section.draftData ?? {}) as Record<string, string>
  const [formData, setFormData] = useState<Record<string, string>>(draftData)
  const [editedFields, setEditedFields] = useState<Set<string>>(new Set())

  const editHistoryMap = new Map(
    (section.editHistory ?? []).map((e) => [e.fieldId, e])
  )

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
    setEditedFields((prev) => new Set(prev).add(fieldId))
  }

  // Determine the async mode — this view should only be opened when it's the user's turn
  const bannerState = (() => {
    if (section.state === 'in-review') return 'reviewing' as const
    if (section.state === 'contested') return 'contested' as const
    return 'drafting' as const
  })()

  const isReviewing = section.state === 'in-review'
  const isContested = section.state === 'contested'
  const isDrafting = section.state === 'draft' || section.state === 'not-started'

  const formFields = Object.keys(formData)

  // If formFields is empty (e.g., not-started section with no draftData),
  // the caller should provide draftData with empty string values as a field schema.
  // Example: { springBreak: '', winterBreak: '', summerBreak: '' }

  const handleAccept = () => {
    onAccept?.()
  }

  const handleSubmitChanges = () => {
    const edits: EditEntry[] = Array.from(editedFields).map((fieldId) => ({
      fieldId,
      previousValue: draftData[fieldId],
      newValue: formData[fieldId],
      editedBy: 'you' as const,
      editedAt: new Date(),
    }))
    onSubmitChanges?.(formData, edits)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
          <p className="text-sm text-gray-500 mt-1">{section.description}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm">
            Close
          </button>
        )}
      </div>

      {/* Async context banner */}
      <div className="mb-6">
        <AsyncDraftBanner
          coParentName={coParentName}
          state={bannerState}
          editCount={section.editHistory?.length}
          onStartSession={onStartSession}
        />
      </div>

      {/* Form fields */}
      <div className="space-y-1">
        {formFields.map((fieldId) => {
          const editEntry = editHistoryMap.get(fieldId)
          const isChanged = editEntry !== undefined

          return (
            <InlineDiffField
              key={fieldId}
              label={fieldId.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
              currentValue={formData[fieldId]}
              previousValue={isChanged ? editEntry.previousValue : undefined}
              editedBy={isChanged ? coParentName : undefined}
              isEditable={isDrafting || isReviewing || isContested}
              onChange={(value) => handleFieldChange(fieldId, value)}
              dimmed={isContested && !isChanged}
            />
          )
        })}
      </div>

      {/* Action bar */}
      <div className="flex gap-3 justify-end pt-6 mt-6 border-t border-gray-200">
        {isDrafting && (
          <>
            <button
              onClick={() => onSave?.(formData)}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Save & Continue Later
            </button>
            <button
              onClick={() => onSubmitForReview?.(formData)}
              className="px-5 py-2 text-sm font-semibold text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors"
            >
              Submit for Review
            </button>
          </>
        )}

        {isReviewing && (
          <>
            <button
              onClick={handleAccept}
              className="px-5 py-2 text-sm font-semibold text-white bg-success rounded-lg hover:bg-green-700 transition-colors"
            >
              Accept All
            </button>
            {editedFields.size > 0 && (
              <button
                onClick={handleSubmitChanges}
                className="px-5 py-2 text-sm font-semibold text-amber-700 bg-amber-100 border border-amber-300 rounded-lg hover:bg-amber-200 transition-colors"
              >
                Submit Changes
              </button>
            )}
          </>
        )}

        {isContested && !editedFields.size && (
          <>
            <button
              onClick={handleAccept}
              className="px-5 py-2 text-sm font-semibold text-white bg-success rounded-lg hover:bg-green-700 transition-colors"
            >
              Accept Changes
            </button>
          </>
        )}

        {/* Once the user edits fields in contested mode, show submit button */}
        {isContested && editedFields.size > 0 && (
          <>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Accept Changes Instead
            </button>
            <button
              onClick={handleSubmitChanges}
              className="px-5 py-2 text-sm font-semibold text-amber-700 bg-amber-100 border border-amber-300 rounded-lg hover:bg-amber-200 transition-colors"
            >
              Submit My Edits
            </button>
          </>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/AsyncSectionView.tsx
git commit -m "feat: add AsyncSectionView component for draft/review/contested workflow"
```

---

## Chunk 3: Signing Refactor & Integration

### Task 8: Refactor SectionSigningApproval for single-parent signing

**Files:**
- Modify: `app/components/SectionSigningApproval.tsx`

- [ ] **Step 1: Update props to support single-parent mode**

Replace the props interface (lines ~6-14) with:

```typescript
interface SectionSigningApprovalProps {
  sectionTitle: string
  generatedText: string
  onEditAndRegenerate: () => void
  onApprove: (initials: string) => void
  onSkip: () => void
  parentName?: string
  coParentName?: string
  coParentSigned?: boolean
}
```

- [ ] **Step 2: Update the component to single-parent initials**

Replace the approval section (the two-input initials area, lines ~57-111) with a single initials input:

```tsx
{/* Approval section */}
<div className="mt-6">
  <p className="text-sm text-gray-600 mb-4">
    By entering your initials below, you confirm that you have reviewed and approve of this language.
  </p>

  <div className="flex items-center gap-6">
    {/* Your initials */}
    <div className="flex flex-col items-center">
      <label className="text-xs text-gray-500 mb-1">{parentName || 'Your'} Initials</label>
      <input
        type="text"
        value={initials}
        onChange={(e) => setInitials(e.target.value.toUpperCase().slice(0, 4))}
        className="w-20 h-12 text-center text-lg font-serif border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary"
        placeholder="___"
        style={{ fontFamily: 'Georgia, serif' }}
      />
    </div>

    {/* Co-parent status */}
    <div className="flex flex-col items-center">
      <label className="text-xs text-gray-500 mb-1">{coParentName || 'Co-parent'}</label>
      <div className={`w-20 h-12 flex items-center justify-center text-sm rounded-lg border-2 ${
        coParentSigned
          ? 'border-success bg-green-50 text-success font-medium'
          : 'border-gray-200 bg-gray-50 text-gray-400'
      }`}>
        {coParentSigned ? 'Signed' : 'Pending'}
      </div>
    </div>
  </div>

  <button
    onClick={() => onApprove(initials)}
    disabled={!initials.trim()}
    className="mt-4 w-full py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
  >
    Initialed & Approved
  </button>
</div>
```

- [ ] **Step 3: Update component state**

Replace the two state variables with one:

```typescript
const [initials, setInitials] = useState('')
```

- [ ] **Step 4: Commit**

```bash
git add app/components/SectionSigningApproval.tsx
git commit -m "refactor: update SectionSigningApproval to single-parent signing mode"
```

---

### Task 9: Update QuickSignModal for agreed state

**Files:**
- Modify: `app/components/QuickSignModal.tsx`

- [ ] **Step 1: Update header text**

The modal header (line ~73) says "Sign Completed Sections". Change to "Sign Agreed Sections".

- [ ] **Step 2: Search for `'completed'` string references**

Search the file for any references to the string `'completed'` — this includes status checks, display text, and comments. Replace with `'agreed'` where appropriate. Note: The QuickSignModal currently doesn't filter by state internally (it uses whatever sections are passed via props), so the filtering happens at the call site.

- [ ] **Step 3: Verify co-parent signature display**

The existing signature status display (lines ~153-165) already shows a "Signed"/"Pending" status indicator for the co-parent based on `signatureStatus.them`. Verify this matches the async signing model — no changes should be needed here since it already supports independent signing display.

- [ ] **Step 4: Commit**

```bash
git add app/components/QuickSignModal.tsx
git commit -m "refactor: update QuickSignModal text for agreed state"
```

---

### Task 10: Wire up AsyncSectionView and QuickSignModal to the dashboard

**Files:**
- Modify: `app/page.tsx`

Note: `asyncViewSection`, `setAsyncViewSection`, `showSignModal`, and `setShowSignModal` state variables were already added in Task 2, Step 3. The `handleSectionClick` handler was also already updated in Task 2 to route async states to `setAsyncViewSection(section)` and agreed state to `setShowSignModal(true)`.

- [ ] **Step 1: Add imports**

Add at the top of the file:

```typescript
import AsyncSectionView from '@/app/components/AsyncSectionView'
```

(QuickSignModal should already be imported — verify.)

- [ ] **Step 2: Add AsyncSectionView overlay to the JSX**

Add before the closing tags of the main layout:

```tsx
{asyncViewSection && (
  <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
    <div className="py-8 px-4">
      <AsyncSectionView
        section={asyncViewSection}
        coParentName="Michael"
        onSave={(data) => {
          console.log('Saved draft:', data)
          setAsyncViewSection(null)
        }}
        onSubmitForReview={(data) => {
          console.log('Submitted for review:', data)
          setAsyncViewSection(null)
        }}
        onAccept={() => {
          console.log('Accepted')
          setAsyncViewSection(null)
        }}
        onSubmitChanges={(data, edits) => {
          console.log('Submitted changes:', data, edits)
          setAsyncViewSection(null)
        }}
        onStartSession={() => {
          setAsyncViewSection(null)
        }}
        onClose={() => setAsyncViewSection(null)}
      />
    </div>
  </div>
)}
```

- [ ] **Step 3: Add QuickSignModal rendering**

Add the sign modal, filtering to only agreed sections where the user hasn't signed:

```tsx
{showSignModal && (
  <QuickSignModal
    sections={sections.filter(s => s.state === 'agreed' && !s.signatureStatus?.you)}
    coParentName="Michael"
    onClose={() => setShowSignModal(false)}
    onSign={(sectionIds, signature) => {
      console.log('Signed sections:', sectionIds, 'with signature:', signature)
      setShowSignModal(false)
    }}
  />
)}
```

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: wire AsyncSectionView and QuickSignModal to dashboard"
```

---

### Task 11: Verify the full flow works end-to-end

**Files:**
- No new files

- [ ] **Step 1: Run the dev server**

```bash
npm run dev
```

Verify no TypeScript or build errors.

- [ ] **Step 2: TypeScript compilation check**

```bash
npx tsc --noEmit
```

Fix any type errors before proceeding.

- [ ] **Step 3: Manual verification checklist**

Open the dashboard and verify:

**Dashboard indicators:**
1. Category-grouped sections display with correct status badges
2. "School Breaks" section shows blue accent with "Michael submitted a draft for your review" + Review button
3. "Healthcare Decisions" shows amber accent with "Michael suggested changes · 1 field"
4. Agreed sections show "Ready to sign"
5. Signed sections show "Signed"
6. Session prompt remains prominent at the top
7. Preview mode (pre-course) still works — sections display in dimmed, non-interactive mode

**Async section view:**
8. Clicking "Review" on School Breaks opens AsyncSectionView with reviewing banner
9. Clicking Healthcare Decisions opens AsyncSectionView with contested banner showing diffs
10. Contested view dims unchanged fields and highlights changed fields with "Was:" text
11. "Accept All" button appears in review mode
12. "Accept Changes" button appears in contested mode (when no edits made)
13. Editing a field in contested mode shows "Submit My Edits" button
14. "Start a live session" escape hatch link appears in all banners
15. Close button returns to dashboard

**Signing flow:**
16. Clicking an agreed section opens QuickSignModal
17. QuickSignModal shows only agreed sections where user hasn't signed
18. SectionSigningApproval shows single initials input + co-parent status indicator
19. QuickSignModal header says "Sign Agreed Sections"

- [ ] **Step 3: Fix any issues found**

Address any TypeScript errors, styling issues, or broken interactions.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete async section completion MVP"
```
