# Async Section Completion Design

Parents can complete parenting plan sections independently (async) or together in live sessions (sync). Sync is the preferred and promoted path; async is a fallback that lets parents continue making progress when they can't be together.

## State Model

Each section flows through these states:

```
not-started → learning → draft → in-review → contested → agreed → signed
                                      ↑            |
                                      └────────────┘  (contest loop)
```

**Sync shortcut:** When parents work together in a live session, they skip `draft → in-review → contested` and go straight from `learning` to `agreed`.

### State Definitions

| State | Description | Who acts next |
|-------|-------------|---------------|
| `not-started` | Neither parent has begun this section | Either |
| `learning` | One or both parents working through lesson content | Each independently |
| `draft` | A parent is filling out the form solo (auto-saves) | Drafter |
| `in-review` | Draft submitted, waiting for co-parent to review | Reviewer |
| `contested` | Reviewer made edits, sent back to drafter | Drafter |
| `agreed` | Both parents accept the form answers | Either (sign) |
| `signed` | Both parents have applied signatures | Complete |

### Key Transitions

- **Draft submitted** → `in-review`: Drafter submits form, co-parent notified via dashboard
- **Reviewer accepts all** → `agreed`: No changes needed
- **Reviewer edits fields** → `contested`: Changes sent back to drafter with inline diffs
- **Drafter accepts changes** → `agreed`: Drafter approves the edits
- **Drafter re-edits** → `in-review`: Another round. `draftedBy` does not change (tracks original author), but `currentTurn` swaps to the co-parent for review
- **Race condition**: The race is resolved at draft-start time, not submission. When a parent opens a section form outside a session, the section moves to `draft` and records `draftedBy`. If the co-parent tries to open the same section, they see a message: "Michael is working on this section. You'll be able to review it when they submit." The first parent to open the form claims it.

### Learning Tracking

Learning infrastructure does not exist in the codebase yet. Lessons currently exist at the module level (e.g., `/app/course/module-3/lesson-3/`) with no per-section mapping or per-parent completion tracking. The `learning` state and `learningProgress` field depend on building this infrastructure as a prerequisite.

**Prerequisite work (separate from this spec):**
- Define mapping from lessons to sections
- Add completion tracking per parent to `LessonVideoContent`
- Add `learningProgress` to the section data model

**Until learning tracking is built:** The `learning` state is skipped. Sections go directly from `not-started` to `draft` (async) or `not-started` to `agreed` (sync). The signing gate on learning completion is also deferred. This spec can be fully implemented without the learning infrastructure — it gets layered in later.

**Target behavior (once learning is built):**
- Learning progress is tracked independently per parent (e.g., "3/5 videos completed")
- A parent can start drafting a section once *they've* completed its lessons — no need to wait for co-parent
- Signing requires both parents to have completed the learning (enforced at `agreed → signed`)

## Dashboard UX

### Sync-First Principle

The dashboard keeps its current structure:
- **Session prompt stays prominent** at the top ("Ready to work together?") — sync is always the primary CTA
- **Category grouping preserved** — Timesharing, Decision-Making, etc. remain the organizing structure
- Async status appears as **subtle inline indicators** on sections that have async activity

### Async Section Indicators

Sections with async activity get a left-border accent and a one-line status message:

- **Needs your review** (blue accent): "Michael submitted a draft for your review" + Review button
- **Waiting on co-parent** (no accent, dimmed): "Your draft sent · Waiting on Michael · Sent 2d ago"
- **Changes to review** (amber accent): "Michael suggested changes · 2 fields" + Review button
- **Ready to sign** (green): "Both agreed" + Sign button
- **Not started** (dimmed): "Not started" or "Complete lessons first" if locked

Sections without async activity look exactly as they do today.

## Async Workflow

### 1. Drafting

The parent fills out the same form used in sync sessions. The only differences:
- A subtle banner: "You're drafting this on your own. Michael will review your answers when you submit."
- The banner includes an escape hatch: "You can also start a live session to work on this together."
- Action buttons: "Save & Continue Later" and "Submit for Review"
- Drafts auto-save so parents can step away mid-section

### 2. Reviewing

The co-parent sees the submitted answers in the same form layout:
- A banner: "Sarah submitted this draft. Review each answer. You can accept as-is, or edit any field to suggest changes."
- Fields the reviewer hasn't touched display normally
- Fields the reviewer edits get highlighted with an "Edited" badge, showing the new value with a strikethrough of the original
- Action buttons: "Accept All" (→ agreed) or "Submit Changes" (→ contested)

### 3. Contested (Edits Sent Back)

The original drafter sees what changed:
- A banner: "Michael suggested changes to N fields. Review the changes. Accept to agree, or edit further."
- Unchanged fields are dimmed to focus attention on edits
- Changed fields show the new value with "Was: [original]" below
- Action buttons: "Accept Changes" (→ agreed) or "Edit Further" (→ in-review, cycle continues)

### Inline Diffs

Changes appear directly on form fields — no separate diff view. Each changed field shows:
- The current (edited) value prominently
- The previous value below in muted text with "Was:" prefix
- A highlight border to draw attention

## Entry Points

No mode toggle or "Work Alone" button. The system infers async vs sync:

1. **From a section row**: Tapping a not-started section (after completing lessons) opens the form. If you're not in a live session, you're in draft mode automatically.
2. **From within a session**: If a parent leaves a live session, any in-progress sections become drafts that can be submitted for review.
3. **Mental model**: If you fill out a form and your co-parent isn't there, they'll need to review it before you can both sign.

### Sync session started on a section with async activity

If a section is in `draft`, `in-review`, or `contested` state and both parents start a live session on that section, the sync session uses the existing draft data as the starting point. Both parents edit the form together as in normal sync mode. On completion, the section skips to `agreed`, and the async states are cleared. The draft data is preserved as the base — nothing is lost.

## Signing

Signing is decoupled from the draft/review cycle:

- **When**: Only after a section reaches `agreed` state AND both parents have completed learning
- **How**: Each parent signs independently using the existing `QuickSignModal` flow (type full name, apply initials per section). The existing `SectionSigningApproval` component currently collects both parents' initials side-by-side — this needs to be refactored to single-parent mode for async signing, where each parent signs independently and sees the co-parent's signature status.
- **Batch signing**: Parents can sign multiple agreed sections at once. The dashboard shows a "Sign agreed sections" prompt when multiple sections are in `agreed` state. The `QuickSignModal` filters to sections where the current user has not yet signed.
- **Independent**: Each parent signs on their own time. The existing `signatureStatus: { you: boolean, them: boolean }` field (already in the codebase) tracks per-parent progress. Section moves to `signed` when both have signed.
- **Shortcut**: "Agree & Sign" button available when a reviewer accepts changes and both have completed learning. This transitions the section to `agreed` and immediately applies the current parent's signature. The section remains in `agreed` (not `signed`) until the co-parent also signs.
- **No per-step signing**: Parents don't sign during the draft/review cycle. They work through edits until they agree, then sign.

## Data Model Changes

### Section Type Extensions

```typescript
interface Section {
  // ... existing fields ...
  state: SectionState           // extended with new states
  completedData?: any           // EXISTING — holds finalized form data (agreed/signed sections)
  draftData?: any               // NEW — holds in-progress form data during draft/review/contested states. On agreement, draftData is moved to completedData and cleared.
  draftedBy?: 'you' | 'them'   // who created the initial draft
  currentTurn?: 'you' | 'them' // whose turn to act (review/accept)
  editHistory?: EditEntry[]     // track changes for inline diffs (only most recent round needed for UI; older entries can be pruned)
  learningProgress?: {          // deferred until learning infrastructure is built
    you: { completed: number; total: number }
    them: { completed: number; total: number }
  }
}

interface EditEntry {
  fieldId: string
  previousValue: any
  newValue: any
  editedBy: 'you' | 'them'
  editedAt: Date
}
```

### SectionState Extension

```typescript
type SectionState =
  | 'not-started'
  | 'learning'    // deferred — skipped until learning infrastructure exists
  | 'draft'
  | 'in-review'
  | 'contested'
  | 'agreed'      // replaces 'completed'
  | 'signed'
```

### Migration from existing states

The existing `SectionState` is `'not-started' | 'completed' | 'signed'`. Migration:
- `'completed'` is renamed to `'agreed'` — same semantics, clearer name in async context
- All existing code that checks for `'completed'` must be updated to check for `'agreed'`
- Affected components: `ParentingPlanProgress`, `SectionStatusBadge`, `getCategoryCompletion()`, `handleSectionClick` in `page.tsx`, and mock data throughout

### Form validation

- **Save & Continue Later**: Allowed with incomplete fields (partial draft is saved)
- **Submit for Review**: All required fields must be filled. Validation runs the same rules as the sync form submission.

## Notifications

Deferred to a future pass. For now, parents check the dashboard to see what needs attention. The async indicators on section rows serve as the primary awareness mechanism.
