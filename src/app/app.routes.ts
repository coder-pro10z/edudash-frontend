import { Routes } from '@angular/router';

export const routes: Routes = [

  // ─────────────────────────────────────────────────────────
  //  AUTH routes — rendered WITHOUT any layout wrapper
  // ─────────────────────────────────────────────────────────
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'landing',
    loadComponent: () =>
      import('./features/landing/landing.component').then(m => m.LandingComponent),
  },

  // ─────────────────────────────────────────────────────────
  //  STUDENT APP — wrapped in AppLayoutComponent
  // ─────────────────────────────────────────────────────────
  {
    path: '',
    loadComponent: () =>
      import('./layouts/app-layout/app-layout.component').then(m => m.AppLayoutComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'learning-lab',
        loadComponent: () =>
          import('./features/learning-lab/learning-lab.component').then(m => m.LearningLabComponent),
      },
      {
        path: 'interview-canvas',
        loadComponent: () =>
          import('./features/interview-canvas/interview-canvas.component').then(m => m.InterviewCanvasComponent),
      },
      {
        path: 'skill-tree',
        loadComponent: () =>
          import('./features/skill-tree/skill-tree.component').then(m => m.SkillTreeComponent),
      },
      {
        path: 'question-bank',
        loadComponent: () =>
          import('./features/question-bank/question-bank.component').then(m => m.QuestionBankComponent),
      },
      {
        path: 'quiz',
        loadComponent: () =>
          import('./features/quiz/quiz.component').then(m => m.QuizComponent),
      },
      // Legacy alias
      {
        path: 'interactive-lessons',
        redirectTo: 'learning-lab',
        pathMatch: 'full',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  //  ADMIN PANEL — wrapped in AdminLayoutComponent
  // ─────────────────────────────────────────────────────────
  {
    path: 'admin',
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/admin-dashboard/admin-dashboard.component').then(
            m => m.AdminDashboardComponent
          ),
      },
      {
        path: 'import',
        // Stub: swap with real component when ready
        loadComponent: () =>
          import('./features/admin/admin-dashboard/admin-dashboard.component').then(
            m => m.AdminDashboardComponent
          ),
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  //  CATCH-ALL — redirect any unknown path to /dashboard
  // ─────────────────────────────────────────────────────────
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];
