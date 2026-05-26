import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { OpportunityService } from '../../services/opportunity.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-opportunity-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col h-full bg-slate-50/50">
      <div class="p-4 border-b border-slate-200">
        <div class="flex items-center gap-2 mb-3">
          <div class="relative flex-1">
            <lucide-icon name="search" [size]="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search opportunities..."
              [(ngModel)]="searchQuery"
              class="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                     transition-all"
            />
          </div>
          <button class="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm" title="Add Opportunity">
            <lucide-icon name="plus" [size]="16" />
          </button>
        </div>
      </div>
      
      <div class="flex-1 overflow-y-auto p-2 space-y-1">
        @for (opp of oppService.opportunities(); track opp.id) {
          <a
            [routerLink]="['/job-description', opp.id]"
            routerLinkActive="bg-blue-50 border-blue-200"
            class="block p-3 bg-white border border-slate-100 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                <lucide-icon name="briefcase" [size]="16" class="text-blue-500" />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-sm font-semibold text-slate-800 truncate">{{ opp.title }}</h3>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase tracking-wider">
                    {{ opp.status }}
                  </span>
                </div>
              </div>
            </div>
          </a>
        } @empty {
          <div class="p-8 text-center text-slate-400 text-sm">
            No opportunities yet. Add one to get started.
          </div>
        }
      </div>
    </div>
  `
})
export class OpportunityListComponent {
  readonly oppService = inject(OpportunityService);
  searchQuery = signal('');
}
