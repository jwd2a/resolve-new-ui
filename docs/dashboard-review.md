# Dashboard Review: Current vs. Plan

## Executive Summary

The current dashboard has solid foundations but **misses key aspects** of the plan's state-based model. The attention hierarchy is inverted—progress visualization dominates (40% of screen) when it should be ambient (5%), while actionable items are less prominent than they should be.

**Overall Alignment: 6/10**

---

## Detailed Analysis

### ✅ What's Working Well

1. **Clear Primary Action**
   - The "Up Next" card with "Start Now" button is visually distinct
   - Shows estimated time to complete
   - Prominent placement in the left column
   - **Matches plan**: Primary Zone concept

2. **Co-parent Awareness**
   - Shows co-parent's progress
   - Online indicator with green dot
   - "Start Live Session" button when online
   - **Matches plan**: Live session integration

3. **Task Categorization**
   - Separates "Up Next", "What You're Working On", and "Waiting for [Name]"
   - Uses color coding (amber for waiting items)
   - **Partially matches plan**: Has some state separation

4. **Clean Visual Design**
   - Follows existing brand guidelines
   - Good use of white space and rounded corners
   - Consistent with color palette
   - **Matches plan**: Visual design direction

---

## ❌ Critical Gaps

### 1. **Missing 6-State Model** (Priority: CRITICAL)

**Problem**: Current implementation only has 3 task types (action, progress, waiting) instead of the plan's 6 states.

**Plan's States:**
| State | Current Mapping | Missing? |
|-------|----------------|----------|
| Ready to Start | ✅ "Up Next" | Partial |
| Your Turn | ❌ None | **YES** |
| Waiting on Them | ✅ "Waiting for" | No |
| Needs Resolution | ❌ None | **YES** |
| Ready to Sign | ❌ None | **YES** |
| Complete | ✅ Recent Completions | Indirect |

**Impact**: Users can't distinguish between:
- Starting fresh vs. responding to co-parent's input ("Your Turn")
- Simple waiting vs. active conflict that needs discussion ("Needs Resolution")
- Completed sections that need signatures vs. fully done

**Fix Required**: Implement full state model in data structure and UI.

---

### 2. **Inverted Attention Hierarchy** (Priority: HIGH)

**Problem**: ProgressHero takes ~40% of visual attention, but plan allocates only 5% to progress.

**Current Hierarchy:**
- Header: 5%
- Timeline: 5%
- **ProgressHero: 40%** ← Problem
- What's Next: 25%
- Waiting Tasks: 10%
- Recent Completions: 10%
- Right Sidebar: 5%

**Plan's Hierarchy:**
- **Your Move: 60%** (Currently ~25%)
- **Work Together: 25%** (Currently 0%)
- **Waiting: 10%** (Currently ~10% ✓)
- **Progress: 5%** (Currently ~50%)

**Impact**: Users focus on passive information (progress) instead of actionable items.

**Fix Required**:
- Collapse ProgressHero into ambient header/sidebar
- Expand "Your Move" to be dominant
- Add "Work Together" section

---

### 3. **Missing "Work Together" Zone** (Priority: CRITICAL)

**Problem**: No section for collaborative actions that need both parents.

**Plan Requires:**
- "Needs Resolution" items (conflicts to discuss)
- "Ready to Sign" items (quick wins)
- Contextual suggestion to start live session when co-parent online

**Current Reality:**
- Live session button exists but isn't contextually linked to work items
- No way to surface disagreements
- No batch signing flow

**Impact**: Parents don't know WHEN to work together vs. separately.

**Fix Required**: New component for collaborative work items.

---

### 4. **No "Your Turn" Indicator** (Priority: MEDIUM)

**Problem**: Can't distinguish "go first" vs. "respond to co-parent"

**Plan's Intent:**
> "Subtle indicator when you're 'responding' vs 'going first'"

**Current Reality:**
- All actionable tasks look the same
- No indication that Michael answered yesterday and it's your turn

**Impact**: Misses opportunity to create social momentum ("Michael's waiting for you!")

**Fix Required**: Add visual indicator and timestamp for "Your Turn" items.

---

### 5. **Missing Key Interactions** (Priority: MEDIUM)

**From Plan:**
- ❌ Nudge functionality (remind inactive co-parent)
- ❌ Quick Sign batch flow
- ❌ Resolution chat/diff view
- ❌ Prioritized "Continue" button logic

**Current Reality:**
- Single "Start Now" button
- No communication tools
- No signing workflow

---

### 6. **Extraneous Content** (Priority: LOW)

**Not in Plan:**
- Recent Completions card (10% of space)
- Course Access info card
- Support card

**Analysis**: These add value but dilute focus. Plan is laser-focused on forward momentum.

**Recommendation**: Move to secondary pages or collapse into header.

---

## Component-by-Component Review

### ProgressHero Component

**Status**: ❌ Needs Major Rework

**Current:**
- Large gradient hero (ProgressHero.tsx)
- Circular progress ring (visually heavy)
- Shows both parents' progress bars
- Estimated completion date
- Live session button

**Should Be:**
- Collapsed ambient indicator
- Maybe in header or thin sidebar
- Progress ring removed or much smaller
- Focus on co-parent status, not celebration

**Recommendation**: Create new `AmbientProgress` component to replace this.

---

### WhatsNext Component

**Status**: ✅ Good Foundation, Needs Enhancement

**Current:**
- ✅ "Up Next" with prominent CTA
- ✅ "What You're Working On" list
- ✅ "Waiting for" list
- ❌ No state differentiation
- ❌ No "Your Turn" indicator
- ❌ No estimated completion times on in-progress items

**Should Be:**
- Renamed to `YourMove`
- Add "Your Turn" visual treatment
- Show timestamps ("Michael answered 2 hours ago")
- Display count: "3 sections ready to start"

**Recommendation**: Enhance, not replace.

---

### AmbientTimeline Component

**Status**: ✅ Aligned with Plan

**Current:**
- Thin bar showing overall progress
- Start date → target date
- Days remaining
- Non-intrusive

**Analysis**: This matches the plan's "ambient" progress concept.

**Recommendation**: Keep as-is. This is correct.

---

### ParentingPlanProgress Component

**Status**: ⚠️ Needs Evaluation

**Current:**
- Shows 5 stages (Onboarding, Co-Parent Connection, Course, Plan, Finalize)
- Module-level progress with substeps
- Lives in right sidebar

**Analysis**: Provides orientation but duplicates timeline/progress info.

**Recommendation**:
- Simplify or collapse by default
- Consider moving to a separate "Progress" page
- Keep if it helps users orient, but make it smaller

---

### RecentCompletions Component

**Status**: ❌ Not in Plan

**Current:**
- Shows last 4 completed items
- Takes significant space

**Analysis**: Celebrates progress but isn't actionable. Plan focuses only on "what's next."

**Recommendation**:
- Remove from dashboard
- Move to user profile or dedicated progress page
- Or show as collapsed "View recent activity →" link

---

## Data Model Gaps

### Current Task Type
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  type: 'action' | 'waiting' | 'progress'; // ← Only 3 states
  waitingOn?: string;
  actionUrl?: string;
  estimatedTime?: string;
}
```

### Needed Task State Model
```typescript
interface Section {
  id: string;
  moduleId: string;
  title: string;
  description: string;

  // State tracking
  state: 'ready-to-start' | 'your-turn' | 'waiting-on-them' |
         'needs-resolution' | 'ready-to-sign' | 'complete';

  // Co-parent context
  yourAnswer?: Answer;
  theirAnswer?: Answer;
  yourSignature?: Signature;
  theirSignature?: Signature;

  // Activity
  lastActivity?: {
    by: 'you' | 'them';
    action: string;
    timestamp: Date;
  };

  // Metadata
  estimatedTime?: string;
  priority?: number;
  actionUrl?: string;
}
```

---

## Recommended Restructuring

### New Component Hierarchy

```
Dashboard
├── Header (5%)
│   ├── Logo & Nav
│   └── AmbientProgressIndicator ← New, replaces ProgressHero
│
├── Main Content (95%)
│   ├── Left Column (65%)
│   │   ├── YourMove (40%) ← Enhanced WhatsNext
│   │   │   ├── Primary Action Card (Ready to Start or Your Turn)
│   │   │   ├── + More Ready to Start (collapsed)
│   │   │   └── + More Your Turn (collapsed)
│   │   │
│   │   └── WorkTogether (25%) ← NEW
│   │       ├── Needs Resolution (urgent)
│   │       └── Ready to Sign (quick wins)
│   │
│   └── Right Sidebar (30%)
│       ├── WaitingOnThem (10%)
│       │   ├── Section count
│       │   ├── Last activity
│       │   └── Nudge option (if >3 days)
│       │
│       └── OverviewProgress (5%)
│           ├── Module completion
│           └── Timeline to target
```

---

## Wireframe: Proposed Layout

```
┌──────────────────────────────────────────────────────────────┐
│  [R] Resolve    HOME   COURSE   PLAN         ███░░░ 65%  [👤]│
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────┐  ┌──────────────────────┐  │
│  │  YOUR MOVE                  │  │  WORK TOGETHER       │  │
│  │                             │  │                      │  │
│  │  ┌───────────────────────┐  │  │  ⚠️ 1 Needs Discussion│  │
│  │  │ ⭐ YOUR TURN          │  │  │  Extra-curricular    │  │
│  │  │                       │  │  │  Activities          │  │
│  │  │ Holiday Schedule      │  │  │  [Review Together →] │  │
│  │  │ Michael answered      │  │  │                      │  │
│  │  │ yesterday             │  │  │  ✓ 2 Ready to Sign   │  │
│  │  │                       │  │  │  [Quick Sign →]      │  │
│  │  │ [Continue →] 15 min   │  │  └──────────────────────┘  │
│  │  └───────────────────────┘  │                            │
│  │                             │  ┌──────────────────────┐  │
│  │  + 2 more sections ready    │  │  WAITING ON MICHAEL  │  │
│  │  + 1 more your turn         │  │                      │  │
│  └─────────────────────────────┘  │  4 sections          │  │
│                                   │  Active 2 hours ago  │  │
│                                   │                      │  │
│                                   │  ● Michael is online │  │
│                                   │  [Start Live Session]│  │
│                                   └──────────────────────┘  │
│                                                              │
│                                   ┌──────────────────────┐  │
│                                   │  PROGRESS            │  │
│                                   │  Module 1  ████████  │  │
│                                   │  Module 2  ████░░░░  │  │
│                                   │  Module 3  ██░░░░░░  │  │
│                                   │                      │  │
│                                   │  Target: Jan 9       │  │
│                                   │  44 days left        │  │
│                                   └──────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## Implementation Priority

### Phase 1: Critical (Do First) ⚡
1. **Implement 6-state model** in data structure
2. **Create WorkTogether component** for Needs Resolution / Ready to Sign
3. **Collapse ProgressHero** into ambient indicator
4. **Add "Your Turn" treatment** to WhatsNext
5. **Rebalance layout** to 65/35 split

### Phase 2: High Priority 🔥
1. **Nudge functionality** for inactive co-parents
2. **Quick Sign flow** for Ready to Sign items
3. **Prioritized Continue button logic** (as specified in plan)
4. **Activity timestamps** on all tasks
5. **Remove/relocate** Recent Completions

### Phase 3: Medium Priority 📋
1. **Resolution interface** (diff view, chat)
2. **Batch operations** (sign multiple at once)
3. **Contextual live session** (auto-focus on Needs Resolution)
4. **Estimated completion** on all tasks
5. **Collapsed progress tracker** (module view)

### Phase 4: Polish ✨
1. **Micro-interactions** (progress animations, completion celebrations)
2. **Empty states** for each section
3. **Loading states** during async actions
4. **Mobile responsive** optimizations
5. **Accessibility** improvements

---

## Specific Code Changes Needed

### 1. Update Task Type Definition

**File**: Create `app/types/section.ts`

```typescript
export type SectionState =
  | 'ready-to-start'
  | 'your-turn'
  | 'waiting-on-them'
  | 'needs-resolution'
  | 'ready-to-sign'
  | 'complete';

export interface Section {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  state: SectionState;
  estimatedTime?: string;
  actionUrl?: string;

  lastActivity?: {
    by: 'you' | 'them';
    action: string;
    timestamp: Date;
  };

  // For state-specific data
  stateData?: {
    yourAnswer?: any;
    theirAnswer?: any;
    conflict?: {
      field: string;
      yourValue: any;
      theirValue: any;
    }[];
    signatureStatus?: {
      you: boolean;
      them: boolean;
    };
  };
}
```

### 2. Rename and Enhance WhatsNext

**File**: Rename `app/components/WhatsNext.tsx` → `app/components/YourMove.tsx`

Add props:
```typescript
interface YourMoveProps {
  readyToStart: Section[];
  yourTurn: Section[];
  prioritySection: Section; // The one "Continue" button targets
}
```

### 3. Create WorkTogether Component

**File**: Create `app/components/WorkTogether.tsx`

```typescript
interface WorkTogetherProps {
  needsResolution: Section[];
  readyToSign: Section[];
  coParentOnline: boolean;
  onStartLiveSession: () => void;
}
```

### 4. Create AmbientProgressIndicator

**File**: Create `app/components/AmbientProgressIndicator.tsx`

Should be thin, non-intrusive, possibly in header or as collapsed sidebar item.

### 5. Update Page Layout

**File**: `app/page.tsx`

Restructure grid from `lg:grid-cols-5` to proper 65/35 split:
```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2"> {/* 66% */}
    <YourMove />
    <WorkTogether />
  </div>
  <div className="lg:col-span-1"> {/* 33% */}
    <WaitingOnThem />
    <OverviewProgress />
  </div>
</div>
```

---

## Testing Considerations

### Key User Scenarios to Test

1. **First-time user** (everything "Ready to Start")
2. **Active async** (mix of Your Turn and Waiting)
3. **Needs resolution** (conflict to discuss)
4. **Ready to complete** (multiple Ready to Sign)
5. **Waiting on co-parent** (all blocked, co-parent inactive)
6. **Co-parent online** (opportunity for live session)

### Success Metrics from Plan

Track these to validate redesign:
- ⏱️ Time to next action (click Continue)
- ✅ Section completion rate
- 🤝 Resolution success without attorney
- 🔄 Return rate until completion
- 🎉 Overall completion rate

---

## Conclusion

The current dashboard is **well-designed but misaligned with the plan's core philosophy**. The plan prioritizes actionability and clarity ("What should I do right now?"), while the current design emphasizes progress celebration.

**Key Shifts Needed:**
1. De-emphasize progress visualization
2. Emphasize state-based actionable items
3. Add collaborative work section
4. Implement full 6-state model
5. Contextual live session integration

**Estimated Effort:**
- Phase 1 (Critical): 2-3 days
- Phase 2 (High): 2-3 days
- Phase 3 (Medium): 3-4 days
- Phase 4 (Polish): 2-3 days

**Total: ~10-13 days of development**

The foundations are solid. With focused restructuring around the state model and attention hierarchy, this dashboard can fully realize the plan's vision.
