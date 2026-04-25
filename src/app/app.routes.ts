import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent) 
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) 
  },
  { 
    path: 'interview-canvas',
    loadComponent: () => import('./features/interview-canvas/interview-canvas.component').then(m => m.InterviewCanvasComponent) 
  },
  {
    path: 'skill-tree',
    loadComponent: () => import('./features/skill-tree/skill-tree.component').then(m => m.SkillTreeComponent)
  },
  {
    path: 'question-bank',
    loadComponent: () => import('./features/question-bank/question-bank.component').then(m => m.QuestionBankComponent)
  },
  {
    path: 'learning-lab',
    loadComponent: () => import('./features/learning-lab/learning-lab.component').then(m => m.LearningLabComponent)
  },
  {
    path: 'quiz',
    loadComponent: () => import('./features/quiz/quiz.component').then(m => m.QuizComponent)
  },
  {
    path: 'interactive-lessons',
    redirectTo: 'learning-lab',
    pathMatch: 'full'
  }
];
