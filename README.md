# Resolve UI

A Next.js application for the Resolve co-parenting course and parenting plan platform.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Dashboard States

The dashboard supports multiple states controlled via query parameters. This allows testing and previewing different user journeys.

### Pre-Course Requirements

Before users can begin the course, they must complete three requirements:
1. **Invite Co-Parent** - Send an invitation to their co-parent
2. **Sign Waivers/Agreements** - Review and sign legal documents
3. **Complete Payment** - Pay for course enrollment

When requirements are incomplete, a banner displays at the top of the dashboard prompting users to complete the next step. Users can still browse the dashboard, preview the course, and explore the platform while completing these requirements.

#### Query Parameters

| Parameter | Values | Description |
|-----------|--------|-------------|
| `precourse` | `true` | Shows the pre-course requirements banner |
| `invited` | `true` / `false` | Co-parent invitation status |
| `waivers` | `true` / `false` | Waivers signed status |
| `paid` | `true` / `false` | Payment complete status |

#### Example URLs

```bash
# No requirements complete - shows banner with first step
http://localhost:3000/?precourse=true

# Co-parent invited - banner shows next step (waivers)
http://localhost:3000/?precourse=true&invited=true

# Co-parent invited + waivers signed - banner shows payment step
http://localhost:3000/?precourse=true&invited=true&waivers=true

# All requirements complete - no banner shown
http://localhost:3000/?precourse=true&invited=true&waivers=true&paid=true
```

### Onboarding State

Shows the onboarding checklist for new users.

| Parameter | Values | Description |
|-----------|--------|-------------|
| `onboarding` | `true` | Shows onboarding checklist only |
| `onboarding` | `preview` | Shows onboarding with course preview |

#### Example URLs

```bash
# Onboarding checklist
http://localhost:3000/?onboarding=true

# Onboarding with course preview
http://localhost:3000/?onboarding=preview
```

### Normal Dashboard

The default view (no query params) shows the main dashboard with:
- Session prompt for co-parent collaboration
- Parenting plan progress tracker
- Support resources

```bash
http://localhost:3000/
```

## Project Structure

```
app/
├── components/
│   ├── PreCourseRequirementsBanner.tsx  # Pre-course requirements banner
│   ├── OnboardingChecklist.tsx          # Onboarding tasks
│   ├── ParentingPlanProgress.tsx        # Main progress tracker
│   ├── SessionPrompt.tsx                # Co-parent session prompt
│   └── ...
├── types/
│   └── section.ts                       # Type definitions
└── page.tsx                             # Main dashboard page
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
