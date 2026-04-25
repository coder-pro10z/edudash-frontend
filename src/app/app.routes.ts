import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) 
  },
  { 
    path: 'interactive-lessons', 
    loadComponent: () => import('./features/interview-canvas/interview-canvas.component').then(m => m.InterviewCanvasComponent) 
  },
  {
    path: 'skill-tree',
    loadComponent: () => import('./features/skill-tree/skill-tree.component').then(m => m.SkillTreeComponent)
  }
];
