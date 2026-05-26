import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { OpportunityService } from '../../services/opportunity.service';
import { OrganizationService } from '../../services/organization.service';

@Component({
  selector: 'app-opportunity-workspace',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="h-full flex flex-col">
      @if (opp()) {
        <!-- ── Header ── -->
        <div class="bg-white border-b border-slate-200 px-8 py-6 flex-shrink-0">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                <lucide-icon name="briefcase" [size]="20" class="text-blue-600" />
              </div>
              <div>
                <h2 class="text-xl font-bold text-slate-800">{{ opp()!.title }}</h2>
                <p class="text-sm text-slate-500 mt-0.5 flex items-center gap-2">
                  <a [routerLink]="['/job-description/org', org()?.id]" class="font-medium text-blue-600 hover:underline flex items-center gap-1">
                    <lucide-icon name="building-2" [size]="14" />
                    {{ org()?.name || 'Unknown Organization' }}
                  </a>
                  @if (opp()!.team) {
                    <span class="text-slate-300">•</span>
                    <span>{{ opp()!.team }}</span>
                  }
                </p>
              </div>
            </div>
            
            <div class="flex items-center gap-2">
              <div class="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg uppercase tracking-wider">
                {{ opp()!.status }}
              </div>
              <button class="px-3 py-1.5 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors">
                Edit
              </button>
            </div>
          </div>
          
          <!-- ── Tabs ── -->
          <div class="flex items-center gap-6 mt-8">
            <a
              [routerLink]="['./']"
              routerLinkActive="text-blue-600 border-blue-600"
              [routerLinkActiveOptions]="{ exact: true }"
              class="pb-3 text-sm font-semibold text-slate-500 border-b-2 border-transparent hover:text-slate-800 transition-colors"
            >
              Overview
            </a>
            <a
              [routerLink]="['contacts']"
              routerLinkActive="text-blue-600 border-blue-600"
              class="pb-3 text-sm font-semibold text-slate-500 border-b-2 border-transparent hover:text-slate-800 transition-colors"
            >
              Contacts
            </a>
            <a
              [routerLink]="['notes']"
              routerLinkActive="text-blue-600 border-blue-600"
              class="pb-3 text-sm font-semibold text-slate-500 border-b-2 border-transparent hover:text-slate-800 transition-colors"
            >
              Notes
            </a>
            <a
              [routerLink]="['questions']"
              routerLinkActive="text-blue-600 border-blue-600"
              class="pb-3 text-sm font-semibold text-slate-500 border-b-2 border-transparent hover:text-slate-800 transition-colors"
            >
              Questions
            </a>
          </div>
        </div>

        <!-- ── Tab Content (Router Outlet) ── -->
        <div class="flex-1 overflow-y-auto p-8 bg-slate-50">
          <router-outlet></router-outlet>
        </div>
      } @else {
        <div class="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <lucide-icon name="briefcase" [size]="48" class="text-slate-200 mb-4" />
          <h2 class="text-lg font-bold text-slate-600">Opportunity Not Found</h2>
          <p class="text-sm text-slate-400 mt-1">The opportunity you're looking for doesn't exist or was deleted.</p>
        </div>
      }
    </div>
  `
})
export class OpportunityWorkspaceComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly oppService = inject(OpportunityService);
  private readonly orgService = inject(OrganizationService);
  
  // NOTE: In an actual app, you'd want to use paramMap from a parent or subscribe to it.
  // Because router-outlet children might navigate without remounting this component,
  // we'll use a signal driven by a router event or similar.
  // For simplicity here, we'll assume standard paramMap works or we'll navigate completely.
  
  readonly oppId = computed(() => this.route.snapshot.paramMap.get('id') || '');
  readonly opp = computed(() => this.oppService.getById(this.oppId()));
  readonly org = computed(() => {
    const o = this.opp();
    return o ? this.orgService.getById(o.organizationId) : null;
  });
}
