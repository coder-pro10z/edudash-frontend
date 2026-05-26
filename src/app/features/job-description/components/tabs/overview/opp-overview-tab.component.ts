import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OpportunityService } from '../../../services/opportunity.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-opp-overview-tab',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 max-w-4xl">
      <!-- ── Job Description Section ── -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 class="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <lucide-icon name="file-text" [size]="16" class="text-slate-400" />
            Job Description
          </h3>
          @if (opp()?.jdLink) {
            <a [href]="opp()!.jdLink" target="_blank" class="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1">
              Original Posting <lucide-icon name="external-link" [size]="12" />
            </a>
          }
        </div>
        
        <div class="p-6">
          @if (opp()?.jdText) {
            <div class="prose prose-sm max-w-none text-slate-600 font-sans">
              <!-- Hardcoded for now, would use markdown rendering -->
              <pre class="whitespace-pre-wrap font-sans">{{ opp()!.jdText }}</pre>
            </div>
          } @else {
            <div class="py-8 text-center">
              <lucide-icon name="file-text" [size]="32" class="text-slate-200 mx-auto mb-3" />
              <p class="text-sm text-slate-500">No job description text added.</p>
              <button class="mt-2 text-sm text-blue-600 font-medium hover:underline">Add Description</button>
            </div>
          }
        </div>
      </div>
      
      <!-- ── Attachments Grid Placeholder ── -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 class="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <lucide-icon name="paperclip" [size]="16" class="text-slate-400" />
          Attachments & Screenshots
        </h3>
        <div class="grid grid-cols-3 gap-4">
          <div class="border-2 border-dashed border-slate-200 rounded-xl h-32 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-blue-300 hover:text-blue-500 cursor-pointer transition-colors">
            <lucide-icon name="plus" [size]="20" class="mb-1" />
            <span class="text-xs font-medium">Add file</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class OppOverviewTabComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly oppService = inject(OpportunityService);
  
  // Get oppId from parent route param
  readonly oppId = computed(() => this.route.parent?.snapshot.paramMap.get('id') || '');
  readonly opp = computed(() => this.oppService.getById(this.oppId()));
}
