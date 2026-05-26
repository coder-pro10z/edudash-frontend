import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OpportunityService } from '../../../services/opportunity.service';
import { ResumeService } from '../../../services/resume.service';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-opp-overview-tab',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 max-w-4xl">
      
      <!-- ── Pinned Resume Section ── -->
      <div class="bg-indigo-50 rounded-2xl border border-indigo-100 p-6 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-600">
            <lucide-icon name="file-text" [size]="24" />
          </div>
          <div>
            <h3 class="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-1">Pinned Resume</h3>
            @if (pinnedResume()) {
              <div class="flex items-center gap-2">
                <span class="text-sm font-semibold text-slate-800">{{ pinnedResume()!.label }}</span>
                @if (pinnedResume()!.externalLink) {
                  <a [href]="pinnedResume()!.externalLink" target="_blank" class="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1">
                    Open <lucide-icon name="external-link" [size]="10" />
                  </a>
                }
              </div>
            } @else {
              <span class="text-sm text-slate-500">No resume pinned for this opportunity.</span>
            }
          </div>
        </div>
        
        <div class="relative">
          <button (click)="isSelectingResume.set(!isSelectingResume())" class="px-4 py-2 bg-white border border-indigo-200 text-indigo-700 text-sm font-semibold rounded-lg hover:bg-indigo-50 transition-colors shadow-sm">
            {{ pinnedResume() ? 'Change Resume' : 'Pin Resume' }}
          </button>
          
          <!-- Resume Selector Dropdown -->
          @if (isSelectingResume()) {
            <div class="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
              <div class="p-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <span class="text-xs font-bold text-slate-600 uppercase tracking-wider">Select from Vault</span>
                <button (click)="isSelectingResume.set(false)" class="text-slate-400 hover:text-slate-700"><lucide-icon name="x" [size]="14"/></button>
              </div>
              <div class="max-h-64 overflow-y-auto p-2 space-y-1">
                @for (resume of resumeService.resumes(); track resume.id) {
                  <button 
                    (click)="pinResume(resume.id)"
                    class="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-between"
                    [class.bg-indigo-50]="opp()?.pinnedResumeId === resume.id"
                  >
                    <div>
                      <div class="text-sm font-semibold text-slate-800">{{ resume.label }}</div>
                      @if (resume.notes) { <div class="text-[10px] text-slate-500 truncate mt-0.5">{{ resume.notes }}</div> }
                    </div>
                    @if (opp()?.pinnedResumeId === resume.id) {
                      <lucide-icon name="check" [size]="14" class="text-indigo-600 flex-shrink-0" />
                    }
                  </button>
                } @empty {
                  <div class="p-4 text-center text-sm text-slate-500">
                    No resumes in Vault.<br>
                    <a routerLink="/job-description/vault" class="text-indigo-600 font-medium hover:underline mt-1 inline-block">Go to Vault to add one</a>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>

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
  readonly resumeService = inject(ResumeService);
  
  // Get oppId from parent route param
  readonly oppId = computed(() => this.route.parent?.snapshot.paramMap.get('id') || '');
  readonly opp = computed(() => this.oppService.getById(this.oppId()));
  
  readonly pinnedResume = computed(() => {
    const o = this.opp();
    if (!o?.pinnedResumeId) return null;
    return this.resumeService.getById(o.pinnedResumeId);
  });

  readonly isSelectingResume = signal(false);

  pinResume(resumeId: string) {
    if (this.oppId()) {
      this.oppService.update(this.oppId(), { pinnedResumeId: resumeId });
      this.isSelectingResume.set(false);
    }
  }
}
