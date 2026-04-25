# EduDash Navigation

## Current Navigation State

EduDash uses an Angular standalone router with a sticky app navbar and lazy-loaded feature screens. The public landing page remains available at `/`, but it is not part of the daily workflow navigation.

## Proposed Final Navbar

```text
Dashboard | Interview Canvas | Skill Tree | Question Bank | Learning Lab | Quiz
```

The EduDash logo links to `/dashboard` for an app-first experience.

## Route Table

| Label | Route | Component | Purpose |
|---|---|---|---|
| Dashboard | `/dashboard` | `DashboardComponent` | Progress overview |
| Interview Canvas | `/interview-canvas` | `InterviewCanvasComponent` | JD/resume alignment, pitch, Q&A, keywords |
| Skill Tree | `/skill-tree` | `SkillTreeComponent` | Skill roadmap |
| Question Bank | `/question-bank` | `QuestionBankComponent` | Manage interview questions |
| Learning Lab | `/learning-lab` | `LearningLabComponent` | Interactive lessons and widgets |
| Quiz | `/quiz` | `QuizComponent` | Topic-based practice quizzes |
| Landing | `/` | `LandingComponent` | Public/product intro, not main navbar |

## Screen Purpose

| Screen | Primary Job |
|---|---|
| Question Bank | Browse, search, filter, import, add, and review interview questions. |
| Learning Lab | Practice concepts with quiz widgets, graphs, SQL visuals, and table exercises. |
| Quiz | Run focused topic assessments with answer choices, progress, and score review. |

## Landing Page Recommendation

Landing should stay as the public home page at `/`, but it should not appear in the app navbar. The navbar should focus on active preparation workflows, while the logo can return users to `/dashboard`.

## Migration Notes

The older `/interactive-lessons` path redirects to `/learning-lab` for backward compatibility. The corrected interview preparation workspace route is `/interview-canvas`.

## Acceptance Checklist

- `/` opens the landing page.
- Landing is not visible as a top-level navbar item.
- `/dashboard`, `/interview-canvas`, `/skill-tree`, `/question-bank`, `/learning-lab`, and `/quiz` appear in the navbar.
- `/question-bank`, `/learning-lab`, and `/quiz` lazy-load successfully.
- `/interactive-lessons` redirects to `/learning-lab`.
- `npm run build` completes successfully.
