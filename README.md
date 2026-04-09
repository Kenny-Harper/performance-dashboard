# ⚡ IPU Performance Dashboard

A real-time hardware performance monitoring dashboard built with React, TypeScript and Vite. Inspired by the kind of profiling tools used in AI hardware companies like Graphcore.

## Live Demo
https://kenny-harper-ipu-dashboard.netlify.app

## Features
- Live updating metrics every second — CPU usage, memory and throughput
- Three real-time line charts with timestamp X axis
- IPU Core Status grid showing active, idle and overloaded cores
- Time range filter — view last 10s, 30s or 60s of data
- Pause and resume live data updates
- Colour coded status indicators based on performance thresholds
- Simulated realistic data with gradual fluctuation

## Tech Stack
- React
- TypeScript
- Vite
- Recharts (data visualisation)
- CSS (custom dark theme)

## TypeScript Concepts Used
- Interfaces — defining the shape of all metric data
- Union types — e.g. status can only be 'active' | 'idle' | 'overloaded'
- Type annotations on function parameters and return types
- import type — type-only imports for performance
- ReturnType utility type

## React Concepts Used
- useReducer for centralised state management
- useEffect with setInterval for live data updates
- useMemo for filtered metric calculations
- Props with TypeScript typed interfaces
- Conditional rendering based on metric thresholds

## Architecture
The app is split into focused components:
- App.tsx — root component, holds all state and the live data interval
- MetricCard.tsx — displays a single metric summary card
- Charts.tsx — three live line charts using Recharts
- CoreGrid.tsx — IPU core status display
- dataGenerator.ts — simulates realistic hardware metrics
- types.ts — all TypeScript interfaces and types in one place
