# EduDash Frontend — Migration Guide

> **From:** Vanilla HTML/CSS/JS monolith (`/components/*.html`)
> **To:** Angular 17+ Standalone Components with Tailwind CSS
> **Status:** 🟡 In Progress

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture Vision](#2-architecture-vision)
3. [Technology Stack](#3-technology-stack)
4. [Design System Reference](#4-design-system-reference)
5. [Source Inventory](#5-source-inventory--component-mapping)
6. [Target Directory Structure](#6-target-directory-structure)
7. [Migration Protocol](#7-migration-protocol)
8. [Agent Roles & Responsibilities](#8-agent-roles--responsibilities)
9. [Phased Execution Timeline](#9-phased-execution-timeline)
10. [Component API Contracts](#10-component-api-contracts)
11. [Quality Gates](#11-quality-gates)
12. [Getting Started](#12-getting-started)

---

## 1. Project Overview

**EduDash** is a premium interview preparation platform originally prototyped as a collection of standalone vanilla HTML files. Each file was a self-contained proof-of-concept (embedded styles, inline scripts, CDN dependencies) that demonstrated a specific UI concept:

- Activity Heatmaps (GitHub-style)
- Radar Charts (Stack Mastery)
- Interactive D3.js Graphs
- SQL Join Visualizers (Venn Diagrams)
- Forum-style Quiz Components
- Skill Tree navigation with SVG connectors

**The migration goal** is to decompose these monolithic HTML files into a production-grade Angular 17 Standalone Component architecture backed by a .NET 8 Clean Architecture API — without losing the "Premium Light" aesthetic that defines the platform.

### What We Are NOT Doing

| ❌ Out of Scope | Reason |
|---|---|
| Redesigning the UI | The design system is locked. We migrate pixel-for-pixel. |
| Rewriting business logic | Vanilla JS logic ports into Angular services (Agent Gamma). |
| Adding new features | Migration-only. Feature work comes after all views render. |

---

## 2. Architecture Vision

```
┌─────────────────────────────────────────────────────────────────────┐
│                         BEFORE (Monolith)                           │
│                                                                     │
│   interview-prep-dashboard.html   (1,081 lines)                     │
│   ├── <style type="tailwindcss"> ... 157 lines                      │
│   ├── <body> ... 670 lines of HTML                                  │
│   └── <script> ... 400+ lines of JS                                 │
│                                                                     │
│   + 9 more standalone .html files                                   │
└─────────────────────────────────────────────────────────────────────┘

                              ▼▼▼

┌─────────────────────────────────────────────────────────────────────┐
│                      AFTER (Angular 17)                             │
│                                                                     │
│   src/styles.scss ──────── Global Design System (Tailwind + Vars)   │
│                                                                     │
│   src/app/                                                          │
│   ├── core/models/  ─────── TypeScript interfaces (pure types)      │
│   ├── core/services/ ────── API + State services (Agent Gamma)      │
│   ├── shared/components/ ── Dumb, reusable UI atoms (Agent Beta)    │
│   └── features/ ─────────── Smart, routed views (Beta + Gamma)      │
│                                                                     │
│   Each component is:                                                │
│     • standalone: true (no NgModules)                               │
│     • Tailwind-only styling (empty .scss files)                     │
│     • @for/@if control flow (no *ngFor/*ngIf)                       │
│     • Lucide Angular icons (no inline SVGs)                         │
└─────────────────────────────────────────────────────────────────────┘
```

### Separation of Concerns

| Layer | Responsibility | Agent |
|---|---|---|
| **Shared Components** | Pure UI rendering via `@Input()`. Zero business logic. | Beta |
| **Feature Components** | Page layouts that compose shared components. Own their route. | Beta |
| **Core Services** | HTTP calls, state management, localStorage, Signal stores. | Gamma |
| **Core Models** | TypeScript interfaces. No runtime code. | Beta (creates), Gamma (consumes) |

---

## 3. Technology Stack

| Category | Technology | Version | Purpose |
|---|---|---|---|
| Framework | Angular | 17.3.x | Standalone Components, Control Flow, Signals |
| Styling | Tailwind CSS | 3.4.19 | Utility-first CSS via `@apply` in global layer |
| Icons | lucide-angular | 1.0.0 | Tree-shakeable SVG icons |
| Charts | chart.js | TBD | Radar chart, progress doughnut |
| Fonts | Inter | 400–700 | Primary UI typeface |
| Fonts | JetBrains Mono | 400–500 | Code blocks and terminal UI |
| Build | Angular CLI | 17.3.x | `ng serve`, `ng generate`, `ng build` |

### Tailwind Configuration

```javascript
// edudash-frontend/tailwind.config.js
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
```

> **Note:** We use Tailwind v3 (not v4). The `tailwind.config.js` file is mandatory for v3 and lives inside `edudash-frontend/`.

---

## 4. Design System Reference

The design system is defined in `src/styles.scss` (376 lines) and enforces the **"Premium Light"** aesthetic:

### Color Palette

| Token | CSS Variable | Hex | Usage |
|---|---|---|---|
| Primary | `--color-primary` | `#1A73E8` | CTAs, active links, focus rings |
| Primary Hover | `--color-primary-hover` | `#1557B0` | Button hover states |
| Success | `--color-success` | `#34A853` | Correct answers, completions |
| Success Dark | `--color-success-dark` | `#1b5d2b` | WCAG-compliant success text |
| Warning | `--color-warning` | `#FBBC05` | Caution indicators |
| Error | `--color-error` | `#EA4335` | Failures, destructive actions |
| Background | `--color-bg-default` | `#F8F9FA` | Page background (off-white) |
| Surface | `--color-surface` | `#FFFFFF` | Card & modal backgrounds |
| Border | `--color-border` | `#E0E0E0` | Universal dividers |
| Text Primary | `--color-text-primary` | `#202124` | Headings, body text |
| Text Secondary | `--color-text-secondary` | `#5F6368` | Subtitles, meta text |

### Elevation System

| Level | CSS Variable | Tailwind | Use Case |
|---|---|---|---|
| Level 1 | `--shadow-level-1` | `shadow-sm` | Cards at rest |
| Level 2 | `--shadow-level-2` | `shadow-md` | Cards on hover |
| Level 3 | `--shadow-level-3` | `shadow-lg` | Modals, popovers |

### Pre-Built Component Classes

These classes are defined globally in `@layer components` of `styles.scss` and should be used directly in templates:

| Class | Element |
|---|---|
| `.edudash-card` | White card with border, rounded corners, shadow-level-1 |
| `.btn .btn-primary` | Blue CTA button with shadow |
| `.btn .btn-secondary` | Ghost button with border |
| `.btn .btn-ghost` | Minimal text-only button |
| `.edudash-input` | Form input with focus ring |
| `.edudash-label` | Form label typography |
| `.badge .badge-primary` | Blue info badge |
| `.badge .badge-success` | Green success badge |
| `.badge .badge-warning` | Yellow warning badge |
| `.badge .badge-neutral` | Gray neutral badge |
| `.focus-ring` | Accessible keyboard focus indicator |

### Spacing Grid

All spacing uses Tailwind's 8px-based scale:

```
p-1  →  4px       gap-1  →  4px
p-2  →  8px       gap-2  →  8px
p-3  →  12px      gap-3  →  12px
p-4  →  16px      gap-4  →  16px
p-5  →  20px      gap-5  →  20px
p-6  →  24px      gap-6  →  24px
p-8  →  32px      gap-8  →  32px
```

---

## 5. Source Inventory & Component Mapping

### Vanilla HTML Files → Angular Components

| # | Source HTML File | Lines | Complexity | Target Angular Component | Placement |
|---|---|---|---|---|---|
| 1 | `components/dashboard/interview-prep-dashboard.html` | 1,081 | 🔴 High | **Dashboard** page (stat-cards, heatmap, radar, canvas) | `features/dashboard/` |
| 2 | `components/dashboard/v5.html` | ~400 | 🟡 Medium | Dashboard v5 (heatmap + radar combined) | `features/dashboard/` |
| 3 | `components/v5-heatmap-radar/dashboard_v2.html` | ~500 | 🟡 Medium | Heatmap + Radar composite | `features/dashboard/` |
| 4 | `components/heatmap/heatmap_index.html` | ~250 | 🟢 Low | `<app-activity-heatmap>` | `shared/components/` |
| 5 | `components/code-block/code-block.html` | ~350 | 🟡 Medium | `<app-code-block>` | `shared/components/` |
| 6 | `components/skill-tree/skill-tree.html.html` | ~350 | 🔴 High | `<app-skill-tree>` (SVG connectors) | `features/skill-tree/` |
| 7 | `components/interactive-forum-quiz/interactive_forum_quiz.html` | ~250 | 🟡 Medium | `<app-forum-quiz>` | `features/interactive-lessons/` |
| 8 | `components/interactive-graph/graph.html` | ~350 | 🔴 High | `<app-interactive-graph>` (D3.js) | `features/interactive-lessons/` |
| 9 | `components/interactive-venn-diag-joins/venn-diagram-interactive.html` | ~400 | 🔴 High | `<app-venn-diagram>` | `features/interactive-lessons/` |
| 10 | `components/Sql-code-table/sql-code-table.html` | ~200 | 🟡 Medium | `<app-sql-table>` | `features/interactive-lessons/` |

### What Gets Stripped During Migration

From each HTML file, the following are **removed** and replaced with Angular equivalents:

| Stripped | Replaced By |
|---|---|
| `<script src="https://cdn.tailwindcss.com">` | `tailwind.config.js` + build pipeline |
| `<script src="https://unpkg.com/lucide">` | `lucide-angular` package |
| `<script src="https://cdn.jsdelivr.net/npm/chart.js">` | `chart.js` npm package |
| `<style type="text/tailwindcss">` | `src/styles.scss` (already ported) |
| Inline `<script>` blocks | Angular component `.ts` files + services |
| `onclick="fn()"` handlers | Angular event bindings `(click)="fn()"` |
| `document.getElementById()` | `@ViewChild()` / template variables |
| `localStorage` direct access | `LocalStorageService` in `core/services/` |

---

## 6. Target Directory Structure

```
edudash-frontend/src/app/
│
├── app.component.ts                 # App shell: top nav + <router-outlet>
├── app.component.html               # Sticky navbar + content area
├── app.config.ts                    # provideRouter, provideHttpClient
├── app.routes.ts                    # Lazy-loaded feature routes
│
├── core/                            # 🏛 Singletons — never imported by shared/
│   ├── models/
│   │   ├── stat-card.model.ts       # IStatCard { title, value, icon, trend }
│   │   ├── heatmap.model.ts         # IHeatmapCell, HeatmapLayout, HeatmapShape
│   │   ├── skill-node.model.ts      # ISkillNode, NodeStatus enum
│   │   ├── quiz.model.ts            # IQuizQuestion, IQuizOption
│   │   └── dashboard.model.ts       # IDashboardStats, IRecommendation
│   └── services/
│       ├── api.service.ts           # HttpClient wrapper (Agent Gamma)
│       ├── local-storage.service.ts # Type-safe localStorage (Agent Gamma)
│       └── app-state.service.ts     # Global signal store (Agent Gamma)
│
├── shared/                          # 🧱 Dumb Components — zero injected services
│   └── components/
│       ├── stat-card/
│       │   ├── stat-card.component.ts
│       │   ├── stat-card.component.html
│       │   └── stat-card.component.scss    # EMPTY (Tailwind only)
│       ├── code-block/
│       │   ├── code-block.component.ts
│       │   ├── code-block.component.html
│       │   └── code-block.component.scss
│       ├── activity-heatmap/
│       │   ├── activity-heatmap.component.ts
│       │   ├── activity-heatmap.component.html
│       │   └── activity-heatmap.component.scss
│       ├── badge/
│       │   ├── badge.component.ts
│       │   └── badge.component.html
│       └── premium-checkbox/
│           ├── premium-checkbox.component.ts
│           └── premium-checkbox.component.html
│
└── features/                        # 📦 Smart Components — own routes, inject services
    ├── dashboard/
    │   ├── dashboard.component.ts
    │   ├── dashboard.component.html
    │   └── components/              # Dashboard-private sub-components
    │       ├── radar-chart/
    │       ├── streak-counter/
    │       └── continue-learning/
    ├── interview-canvas/
    │   ├── interview-canvas.component.ts
    │   ├── interview-canvas.component.html
    │   └── components/
    │       ├── jd-resume-checklist/
    │       ├── pitch-strategy/
    │       ├── qa-accordion/
    │       └── keyword-card/
    ├── skill-tree/
    │   ├── skill-tree.component.ts
    │   └── skill-tree.component.html
    └── interactive-lessons/
        ├── interactive-lessons.component.ts   # Layout wrapper
        ├── forum-quiz/
        ├── interactive-graph/
        ├── venn-diagram/
        └── sql-table/
```

---

## 7. Migration Protocol

Every HTML file follows this **4-step conversion protocol**:

### Step 1 — Deconstruct

1. Open the source `.html` file
2. Strip `<head>`, `<style>`, `<script>`, and CDN `<link>` tags
3. Extract only the semantic HTML between `<body>` tags
4. Create the Angular Standalone Component scaffold:

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-component-name',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './component-name.component.html',
})
export class ComponentNameComponent { }
```

### Step 2 — Data Binding

1. Identify all hardcoded values (numbers, strings, arrays)
2. Create TypeScript interfaces in `core/models/`
3. Replace static content with `@Input()` properties
4. Convert iteration patterns:

```diff
- @for (item of items; track item.title) {  ← vanilla Angular template
+ @for (item of items; track item.id) {     ← use stable ID
```

5. Use Angular 17 control flow (`@if`, `@for`, `@switch`) — NOT structural directives

### Step 3 — Tailwind Compliance

1. Map all `<style>` CSS to Tailwind utility classes
2. Use pre-built classes from `styles.scss` (`edudash-card`, `btn`, `badge`, etc.)
3. Enforce the 8px spacing grid
4. Keep `.component.scss` **empty** unless CSS cannot be expressed in Tailwind:
   - Exceptions: `clip-path`, `stroke-dasharray`, CSS Grid `template` with `var()`, `scrollbar-color`

### Step 4 — Icon Swap

Replace all Lucide icon patterns:

```html
<!-- BEFORE: Vanilla Lucide -->
<i data-lucide="check-circle" class="w-5 h-5"></i>

<!-- AFTER: Angular Lucide -->
<lucide-icon name="check-circle" [size]="20"></lucide-icon>
```

Register icons in the component:

```typescript
import { LucideAngularModule, CheckCircle, Flame, BookOpen } from 'lucide-angular';

@Component({
  imports: [LucideAngularModule.pick({ CheckCircle, Flame, BookOpen })],
})
```

---

## 8. Agent Roles & Responsibilities

### 🔵 Agent Beta — Angular UI Specialist

| Owns | Does NOT Touch |
|---|---|
| Template HTML extraction | HTTP services |
| `@Input()` / `input()` signal definitions | `inject(HttpClient)` |
| Tailwind class mapping | `ngAfterViewInit()` DOM logic |
| `<lucide-icon>` swaps | D3.js / Chart.js setup |
| TypeScript interface creation | `app.routes.ts` |
| Component file scaffolding | State management |

### 🟣 Agent Gamma — State & Logic Integrator

| Owns | Does NOT Touch |
|---|---|
| `core/services/` implementations | Template HTML structure |
| Observable / Signal piping | Tailwind CSS classes |
| `ngAfterViewInit()` for DOM libraries | Component `@Input()` signatures |
| Chart.js / D3.js initialization | Icon swap patterns |
| `localStorage` persistence | `.component.scss` files |
| Route guard logic | Design system tokens |

### 🟡 Agent Alpha — Backend Specialist

| Owns | Does NOT Touch |
|---|---|
| .NET DTOs matching `tech-stack.json` | Any Angular file |
| Application layer interfaces | Frontend services |
| Infrastructure layer services | Tailwind or UI |
| API Controllers | `package.json` |

---

## 9. Phased Execution Timeline

```
Phase 0 ──► Phase 1 ──► Phase 2 ──► Phase 3 ──► Phase 4
  App Shell    Shared      Dashboard    Skill Tree   Lessons
  (prereq)     (atoms)     (main view)  (SVG heavy)  (D3/Charts)
```

### Phase 0 — Foundation (Prerequisite)

| Task | Owner | Details |
|---|---|---|
| Clean `app.component.html` | Beta | Remove 337-line Angular default placeholder |
| Build app shell | Beta | Sticky top nav + `<router-outlet>` |
| Configure routing | Manual | Lazy-load feature routes |
| Add `provideHttpClient()` | Manual | Update `app.config.ts` |
| Install `chart.js` | Manual | `npm install chart.js` |

### Phase 1 — Shared Components

| Component | Source | Priority |
|---|---|---|
| `<app-stat-card>` | Extracted from dashboard stat grid | 🔴 P0 |
| `<app-code-block>` | `code-block.html` | 🟡 P1 |
| `<app-activity-heatmap>` | `heatmap_index.html` | 🔴 P0 |
| `<app-badge>` | Global pattern extraction | 🟢 P2 |
| `<app-premium-checkbox>` | Dashboard canvas pattern | 🟢 P2 |

### Phase 2 — Dashboard Feature

| Component | Source | Depends On |
|---|---|---|
| `DashboardComponent` (layout) | `interview-prep-dashboard.html` | stat-card, heatmap |
| `RadarChartComponent` (sub) | Radar section of dashboard | chart.js (Gamma) |
| `StreakCounterComponent` (sub) | Stat card variant | stat-card |
| `InterviewCanvasComponent` | Canvas view of dashboard | checkbox, badge |

### Phase 3 — Skill Tree Feature

| Component | Source | Depends On |
|---|---|---|
| `SkillTreeComponent` | `skill-tree.html.html` | SVG connector logic (Gamma) |

### Phase 4 — Interactive Lessons

| Component | Source | Depends On |
|---|---|---|
| `ForumQuizComponent` | `interactive_forum_quiz.html` | badge |
| `InteractiveGraphComponent` | `graph.html` | D3.js (Gamma) |
| `VennDiagramComponent` | `venn-diagram-interactive.html` | SVG logic (Gamma) |
| `SqlTableComponent` | `sql-code-table.html` | code-block |

---

## 10. Component API Contracts

### `<app-stat-card>`

```typescript
interface IStatCard {
  icon: string;          // Lucide icon name (e.g., 'check-circle')
  iconColor: string;     // Tailwind text color (e.g., 'text-[#34A853]')
  iconBg: string;        // Tailwind bg color (e.g., 'bg-[#34A85315]')
  value: string;         // Display value (e.g., '142', '87%')
  label: string;         // Metric name (e.g., 'Questions Solved')
  footer: string;        // Subtext (e.g., '12 questions to next milestone')
}
```

### `<app-activity-heatmap>`

```typescript
interface IHeatmapConfig {
  data: Record<string, number>;   // { '2026-04-20': 3, ... }
  layout: 'vertical' | 'horizontal';
  shape: 'square' | 'circle';
}

interface IHeatmapCell {
  date: Date;
  count: number;
  isFuture: boolean;
}
```

### `<app-code-block>`

```typescript
interface ICodeBlock {
  code: string;
  language: string;       // 'csharp', 'sql', 'typescript', etc.
  filename?: string;      // Optional file tab label
  showLineNumbers: boolean;
}
```

---

## 11. Quality Gates

Every migrated component must pass **all** of these checks before merge:

| # | Gate | Pass Criteria |
|---|---|---|
| 1 | **Standalone** | `standalone: true` in decorator |
| 2 | **No NgModule** | Zero `@NgModule()` declarations anywhere |
| 3 | **Control Flow** | Uses `@for` / `@if` / `@switch` — no `*ngFor` / `*ngIf` |
| 4 | **Track Clause** | Every `@for` has a `track` expression |
| 5 | **Tailwind Only** | `.component.scss` is empty (or contains only non-Tailwind-expressible CSS) |
| 6 | **No Hardcoded Data** | All display data flows through `@Input()` or `input()` signals |
| 7 | **Lucide Icons** | Zero `<i data-lucide>` or inline SVG icons remain |
| 8 | **8px Grid** | Spacing uses Tailwind's scale (`p-2`, `p-4`, `gap-6`) |
| 9 | **Design System** | Uses `edudash-card`, `btn`, `badge` from `styles.scss` |
| 10 | **Accessibility** | Interactive elements have `focus-ring` class |
| 11 | **Build Clean** | `ng build` produces zero errors and zero warnings |

---

## 12. Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Angular CLI 17.3+ (`npm install -g @angular/cli`)

### Setup

```powershell
# Navigate to the Angular project
cd edudash-frontend

# Install dependencies (Tailwind, Lucide, etc. already in package.json)
npm install

# Start the dev server
ng serve

# Open in browser
# http://localhost:4200
```

### Generating a New Component

```powershell
# Shared (dumb) component
ng generate component shared/components/stat-card --standalone --skip-tests

# Feature (smart) component
ng generate component features/dashboard --standalone --skip-tests

# Feature sub-component
ng generate component features/dashboard/components/radar-chart --standalone --skip-tests
```

### VS Code Extensions

The `.vscode/extensions.json` recommends:

- **Angular Language Service** (`angular.ng-template`) — template intellisense
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`) — class autocomplete + lint suppression

---

## Appendix: Key File References

| File | Purpose |
|---|---|
| `src/styles.scss` | Global design system (376 lines) — tokens, typography, component classes |
| `tailwind.config.js` | Tailwind v3 configuration — content paths, font families |
| `angular.json` | Angular CLI build configuration |
| `components/dashboard/tech-stack.json` | API data contract for the tech stack hexagon |
| `components/Readme.md` | Original design rationale for all vanilla prototypes |
| `Migration_Plan.md` | High-level full-stack migration roadmap (Backend + Frontend) |

---

*This document is the single source of truth for the EduDash frontend migration. All agents (Alpha, Beta, Gamma) must reference this before making changes.*
