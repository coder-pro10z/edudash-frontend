import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { OrganizationListComponent } from './components/organization-list/organization-list.component';
import { OpportunityListComponent } from './components/opportunity-list/opportunity-list.component';

@Component({
  selector: 'app-job-description',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LucideAngularModule, OrganizationListComponent, OpportunityListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex h-full bg-slate-50 overflow-hidden">
      
      <!-- ── Left Panel: List (Orgs or Opps) ── -->
      <div class="w-80 flex-shrink-0 border-r border-slate-200 bg-white flex flex-col h-full">
        <!-- Header / Toggle -->
        <div class="px-4 py-4 border-b border-slate-200">
          <h1 class="text-lg font-bold text-slate-800 flex items-center gap-2 mb-3">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
              <lucide-icon name="briefcase" [size]="16" class="text-white" />
            </div>
            Job Hunt
          </h1>
          
          <div class="flex p-1 bg-slate-100 rounded-lg">
            <button
              (click)="activeList.set('orgs')"
              class="flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5"
              [class.bg-white]="activeList() === 'orgs'"
              [class.shadow-sm]="activeList() === 'orgs'"
              [class.text-slate-800]="activeList() === 'orgs'"
              [class.text-slate-500]="activeList() !== 'orgs'"
            >
              <lucide-icon name="building-2" [size]="14" />
              Organizations
            </button>
            <button
              (click)="activeList.set('opps')"
              class="flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5"
              [class.bg-white]="activeList() === 'opps'"
              [class.shadow-sm]="activeList() === 'opps'"
              [class.text-slate-800]="activeList() === 'opps'"
              [class.text-slate-500]="activeList() !== 'opps'"
            >
              <lucide-icon name="briefcase" [size]="14" />
              Opportunities
            </button>
          </div>
        </div>

        <!-- List Content -->
        <div class="flex-1 overflow-hidden">
          @if (activeList() === 'orgs') {
            <app-organization-list />
          } @else {
            <app-opportunity-list />
          }
        </div>
      </div>

      <!-- ── Right Panel: Workspace (Router Outlet) ── -->
      <div class="flex-1 h-full overflow-hidden relative bg-slate-50">
        <router-outlet></router-outlet>
      </div>
      
    </div>
  `
})
export class JobDescriptionComponent {
  activeList = signal<'orgs' | 'opps'>('orgs');
}
