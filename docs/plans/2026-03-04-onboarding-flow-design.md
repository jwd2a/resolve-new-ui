# Onboarding Flow Design

## Overview

A 5-step onboarding flow that collects user profile information needed to create a parenting plan. Each step is a separate route under `/onboarding/` with a shared layout containing a progress stepper.

## Routing & Layout

```
/onboarding/layout.tsx     — shared layout with stepper + branding
/onboarding/your-info      — Step 1
/onboarding/co-parent      — Step 2
/onboarding/children       — Step 3
/onboarding/jurisdiction   — Step 4
/onboarding/target-date    — Step 5
```

### Shared Layout

- Resolve logo/branding at top
- Horizontal stepper with 5 labeled steps showing active/complete/upcoming states
- Centered content card (max-w-2xl) with white background, rounded-xl
- Purple gradient background matching existing app aesthetic
- Back/Continue buttons in each step's footer

## Step Details

### Step 1: Your Info

Fields:
- Legal Name: first name, last name (two columns)
- Address: street address, city/state/zip row
- Phone number

Info callout: "It is common to have the same legal address as your co-parent at this stage. You can always adjust your plan as things progress."

### Step 2: Co-Parent

Fields:
- Co-Parent Legal Name: first name, last name (two columns)
- Co-Parent Legal Address: street, city/state/zip row
- Co-Parent Phone Number
- Co-Parent Email

Invite section:
- Info callout explaining co-parent needs to register
- "Send Invite Email Now" button
- Skip option: "You can also invite them later from the home screen"

### Step 3: Children

- Section header: "Add information about each child who will be included in the parenting plan."
- Per child card: Full Name, Date of Birth (date picker), Gender (select dropdown)
- "+ Add Another Child" button to add more children
- Trash icon to remove added children
- At least one child required

### Step 4: Jurisdiction

- "What state will you be filing your divorce or separation?"
- State dropdown selector
- Required field

### Step 5: Target Date (NEW)

- Heading: "When would you like to have your parenting plan complete?"
- Subtext: "Setting a target helps you stay on track. You can always adjust this later."
- Three preset selectable cards:
  - 30 days (with calculated date)
  - 60 days (with calculated date)
  - 90 days (with calculated date)
- "Or pick a specific date" link that reveals a date input
- Summary line showing selected date: "Your target: [Month Day, Year]"
- CTA: "Complete Onboarding"

## State Management

- React context provider at the layout level holds all onboarding data
- Each step reads/writes to the shared context
- On "Complete Onboarding", consolidated data is ready for API submission (currently mock)
- Navigation via Next.js `router.push()`
- Stepper reflects completion based on visited/filled steps
- Users can click completed steps in the stepper to go back and edit
- On completion, redirect to dashboard at `/`

## Validation

- Inline validation on blur for required fields and format (e.g., valid email)
- Continue button disabled until required fields are filled
- Required: Legal name (first + last), at least one child, jurisdiction state, target date
- Optional: Co-parent info (can invite later)

## Visual Design

- Purple gradient background, white card, rounded-xl corners, Geist font
- Stepper: circular icons + connecting lines
  - Completed: filled purple circle with checkmark
  - Active: outlined purple circle with step icon
  - Upcoming: gray outlined circle
- Form inputs: `border border-gray-300 rounded-lg` with `focus:ring-primary`
- Primary button: `bg-primary` purple for Continue
- Secondary button: outline style for Back
- Info callouts: light blue/purple background with info icon
- Target date preset cards: selectable with border highlight on selection
