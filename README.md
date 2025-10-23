# ACE Fraud Detection

A React application for fraud detection analysis and experimentation.

## Project Structure

```
ace-fraud-detection/
├── src/
│   ├── app/                        # Application pages
│   │   ├── page.tsx                # Home page
│   │   ├── layout.tsx              # Root layout with navigation
│   │   └── (routes)/               # Route pages
│   │       ├── live-test/page.tsx  # Live testing page
│   │       ├── experiments/page.tsx # Experiments page
│   │       └── playbook/page.tsx   # Playbook page
│   ├── components/
│   │   ├── ui/                     # Reusable UI components
│   │   └── features/               # Feature-specific components
│   │       ├── AgentAnalysisCard.tsx
│   │       ├── AgentScoreBar.tsx
│   │       ├── ComparisonChart.tsx
│   │       ├── BulletCard.tsx
│   │       └── ExperimentRunner.tsx
│   ├── lib/
│   │   └── api.ts                  # API client
│   └── types/
│       └── index.ts                # TypeScript types
├── package.json
├── vite.config.ts
├── tsconfig.json
└── index.html
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing

## TODO

- Implement page content and functionality
- Add styling (consider using Tailwind CSS or similar)
- Implement API integration
- Add state management (Context API or Redux)
- Add charting library for visualizations
- Add form validation
- Implement error handling
- Add loading states
- Add tests

