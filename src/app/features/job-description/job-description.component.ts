import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

export interface JobDescription {
  id: string;
  title: string;
  content: string;
  link: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'edudash_job_descriptions';

@Component({
  selector: 'app-job-description',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-full bg-slate-50">

      <!-- ── Page Header ── -->
      <div class="bg-gradient-to-br from-blue-600 via-blue-700 to-violet-700 px-6 py-8">
        <div class="max-w-5xl mx-auto">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <lucide-icon name="file-text" [size]="18" class="text-white" />
            </div>
            <h1 class="text-xl font-bold text-white tracking-tight">Job Descriptions</h1>
          </div>
          <p class="text-blue-200 text-sm max-w-lg leading-relaxed">
            Paste or link job descriptions to align your prep — saved locally for quick reference.
          </p>

          <!-- Stats row -->
          <div class="flex items-center gap-4 mt-5">
            <div class="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5">
              <lucide-icon name="layers" [size]="13" class="text-blue-200" />
              <span class="text-xs font-medium text-white">{{ savedJDs().length }} saved</span>
            </div>
            @if (savedJDs().length > 0) {
              <div class="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5">
                <lucide-icon name="clock" [size]="13" class="text-blue-200" />
                <span class="text-xs font-medium text-white">Last added {{ lastAdded() }}</span>
              </div>
            }
          </div>
        </div>
      </div>

      <div class="max-w-5xl mx-auto px-6 py-6 space-y-6">

        <!-- ── Add / Edit Form Card ── -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          <!-- Card header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <lucide-icon name="plus-circle" [size]="16" class="text-blue-600" />
              <h2 class="text-sm font-semibold text-slate-800">
                {{ editingId() ? 'Edit Job Description' : 'Add New Job Description' }}
              </h2>
            </div>
            @if (editingId()) {
              <button
                (click)="cancelEdit()"
                class="text-xs font-medium text-slate-500 hover:text-slate-800
                       px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors duration-150"
              >
                Cancel edit
              </button>
            }
          </div>

          <div class="p-6 space-y-4">

            <!-- Title -->
            <div>
              <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Job Title / Company
              </label>
              <input
                id="jd-title-input"
                [(ngModel)]="formTitle"
                placeholder="e.g. Senior Frontend Engineer — Google"
                class="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200
                       bg-slate-50 text-slate-800 placeholder-slate-400
                       focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                       transition-colors duration-150"
              />
            </div>

            <!-- Input mode tabs -->
            <div>
              <div class="flex gap-1 mb-3 bg-slate-100 rounded-lg p-1 w-fit">
                <button
                  id="tab-paste"
                  (click)="activeTab.set('paste')"
                  class="px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150"
                  [class.bg-white]="activeTab() === 'paste'"
                  [class.text-slate-800]="activeTab() === 'paste'"
                  [class.shadow-sm]="activeTab() === 'paste'"
                  [class.text-slate-500]="activeTab() !== 'paste'"
                >
                  <span class="flex items-center gap-1.5">
                    <lucide-icon name="clipboard-paste" [size]="12" />
                    Paste Content
                  </span>
                </button>
                <button
                  id="tab-link"
                  (click)="activeTab.set('link')"
                  class="px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150"
                  [class.bg-white]="activeTab() === 'link'"
                  [class.text-slate-800]="activeTab() === 'link'"
                  [class.shadow-sm]="activeTab() === 'link'"
                  [class.text-slate-500]="activeTab() !== 'link'"
                >
                  <span class="flex items-center gap-1.5">
                    <lucide-icon name="link" [size]="12" />
                    Add Link
                  </span>
                </button>
              </div>

              @if (activeTab() === 'paste') {
                <textarea
                  id="jd-content-textarea"
                  [(ngModel)]="formContent"
                  rows="10"
                  placeholder="Paste the full job description here. Markdown formatting is supported.

Example:
## About the Role
We're looking for a Senior Frontend Engineer...

## Requirements
- 5+ years experience
- Strong TypeScript skills
..."
                  class="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200
                         bg-slate-50 text-slate-800 placeholder-slate-400 font-mono leading-relaxed
                         focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                         transition-colors duration-150 resize-y"
                ></textarea>
                <p class="text-[11px] text-slate-400 mt-1">Markdown supported. Paste raw JD text.</p>
              }

              @if (activeTab() === 'link') {
                <input
                  id="jd-link-input"
                  [(ngModel)]="formLink"
                  placeholder="https://jobs.lever.co/company/job-id"
                  type="url"
                  class="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200
                         bg-slate-50 text-slate-800 placeholder-slate-400
                         focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                         transition-colors duration-150"
                />
                <p class="text-[11px] text-slate-400 mt-2 mb-2">Optionally also paste the content above.</p>
                <!-- Also show content textarea in link mode -->
                <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Content (optional)
                </label>
                <textarea
                  id="jd-link-content-textarea"
                  [(ngModel)]="formContent"
                  rows="6"
                  placeholder="Optionally paste the full JD text for offline reference..."
                  class="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200
                         bg-slate-50 text-slate-800 placeholder-slate-400 font-mono leading-relaxed
                         focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                         transition-colors duration-150 resize-y"
                ></textarea>
              }
            </div>

            <!-- Validation error -->
            @if (formError()) {
              <div class="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                <lucide-icon name="alert-circle" [size]="14" class="text-red-500 flex-shrink-0" />
                <p class="text-xs text-red-700">{{ formError() }}</p>
              </div>
            }

            <!-- Submit -->
            <div class="flex items-center justify-end gap-3 pt-2">
              <button
                id="jd-save-btn"
                (click)="saveJD()"
                class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600
                       text-white text-sm font-semibold rounded-xl shadow-sm
                       hover:-translate-y-0.5 hover:shadow-md
                       active:scale-95 transition-all duration-300 ease-out"
              >
                <lucide-icon name="save" [size]="14" />
                {{ editingId() ? 'Update' : 'Save JD' }}
              </button>
            </div>
          </div>
        </div>

        <!-- ── Saved JDs List ── -->
        @if (savedJDs().length > 0) {
          <div>
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <lucide-icon name="layers" [size]="15" class="text-slate-400" />
                Saved Descriptions
              </h2>
              <span class="text-xs text-slate-400">{{ savedJDs().length }} total</span>
            </div>

            <div class="space-y-3">
              @for (jd of savedJDs(); track jd.id) {
                <div
                  class="bg-white rounded-xl border border-slate-200 shadow-sm
                         hover:shadow-md hover:-translate-y-0.5 transition-all duration-300
                         cursor-pointer overflow-hidden"
                  (click)="viewJD(jd)"
                >
                  <div class="p-4 flex items-start gap-3">
                    <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-50 to-violet-50
                                border border-blue-100 flex items-center justify-center flex-shrink-0">
                      <lucide-icon name="briefcase" [size]="15" class="text-blue-600" />
                    </div>

                    <div class="flex-1 min-w-0">
                      <div class="flex items-start justify-between gap-2">
                        <h3 class="text-sm font-semibold text-slate-800 truncate">
                          {{ jd.title || 'Untitled JD' }}
                        </h3>
                        <div class="flex items-center gap-1 flex-shrink-0" (click)="$event.stopPropagation()">
                          @if (jd.link) {
                            <a
                              [href]="jd.link"
                              target="_blank"
                              rel="noopener"
                              class="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50
                                     transition-colors duration-150"
                              title="Open link"
                            >
                              <lucide-icon name="external-link" [size]="13" />
                            </a>
                          }
                          <button
                            (click)="editJD(jd)"
                            class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100
                                   transition-colors duration-150"
                            title="Edit"
                          >
                            <lucide-icon name="pencil" [size]="13" />
                          </button>
                          <button
                            (click)="deleteJD(jd.id)"
                            class="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50
                                   transition-colors duration-150"
                            title="Delete"
                          >
                            <lucide-icon name="trash-2" [size]="13" />
                          </button>
                        </div>
                      </div>

                      @if (jd.link) {
                        <div class="flex items-center gap-1 mt-0.5">
                          <lucide-icon name="link" [size]="11" class="text-slate-400 flex-shrink-0" />
                          <span class="text-[11px] text-blue-600 truncate">{{ jd.link }}</span>
                        </div>
                      }

                      @if (jd.content) {
                        <p class="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                          {{ jd.content.slice(0, 180) }}{{ jd.content.length > 180 ? '…' : '' }}
                        </p>
                      }

                      <div class="flex items-center gap-3 mt-2">
                        <span class="text-[11px] text-slate-400 flex items-center gap-1">
                          <lucide-icon name="calendar" [size]="11" />
                          Added {{ formatDate(jd.createdAt) }}
                        </span>
                        @if (jd.content) {
                          <span class="text-[11px] text-slate-400 flex items-center gap-1">
                            <lucide-icon name="type" [size]="11" />
                            {{ wordCount(jd.content) }} words
                          </span>
                        }
                      </div>
                    </div>
                  </div>

                  <!-- Expand hint -->
                  <div class="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-1">
                    <lucide-icon name="eye" [size]="11" class="text-slate-400" />
                    <span class="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Click to view full content</span>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        @if (savedJDs().length === 0) {
          <!-- Empty saved state -->
          <div class="bg-white rounded-2xl border border-dashed border-slate-300 py-12 text-center">
            <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <lucide-icon name="inbox" [size]="22" class="text-slate-400" />
            </div>
            <h3 class="text-sm font-semibold text-slate-600 mb-1">No saved job descriptions yet</h3>
            <p class="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              Add your first JD above — paste the text or drop a link to get started.
            </p>
          </div>
        }
      </div>

      <!-- ── JD Viewer Modal ── -->
      @if (viewingJD()) {
        <div
          class="fixed inset-0 z-50 flex items-start justify-center pt-12 px-4 pb-8
                 bg-black/40 backdrop-blur-sm"
          (click)="closeViewer()"
        >
          <div
            class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col
                   transform transition-all duration-300 border border-white/50"
            (click)="$event.stopPropagation()"
          >
            <!-- Modal header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600
                            flex items-center justify-center shadow-sm">
                  <lucide-icon name="briefcase" [size]="14" class="text-white" />
                </div>
                <div>
                  <h2 class="text-sm font-bold text-slate-800">{{ viewingJD()!.title || 'Untitled JD' }}</h2>
                  <p class="text-[11px] text-slate-400">Added {{ formatDate(viewingJD()!.createdAt) }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                @if (viewingJD()!.link) {
                  <a
                    [href]="viewingJD()!.link"
                    target="_blank"
                    rel="noopener"
                    class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
                           text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg
                           transition-colors duration-150"
                  >
                    <lucide-icon name="external-link" [size]="12" />
                    Open Link
                  </a>
                }
                <button
                  id="jd-viewer-close"
                  (click)="closeViewer()"
                  class="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100
                         transition-colors duration-150"
                  title="Close"
                >
                  <lucide-icon name="x" [size]="16" />
                </button>
              </div>
            </div>

            <!-- Modal body -->
            <div class="flex-1 overflow-y-auto px-6 py-5">
              @if (viewingJD()!.link && !viewingJD()!.content) {
                <div class="flex flex-col items-center justify-center py-8 text-center">
                  <lucide-icon name="link" [size]="32" class="text-blue-400 mb-3" />
                  <p class="text-sm text-slate-600 mb-3">This JD is link-only — no text was pasted.</p>
                  <a
                    [href]="viewingJD()!.link"
                    target="_blank"
                    rel="noopener"
                    class="text-blue-600 text-sm font-medium underline underline-offset-2 break-all"
                  >
                    {{ viewingJD()!.link }}
                  </a>
                </div>
              }
              @if (viewingJD()!.content) {
                <pre class="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed font-sans">{{ viewingJD()!.content }}</pre>
              }
            </div>
          </div>
        </div>
      }

    </div>
  `,
  styles: [`
    :host { display: block; }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `],
})
export class JobDescriptionComponent {

  // ── Form state ──────────────────────────────────────────────────────────
  readonly activeTab = signal<'paste' | 'link'>('paste');
  formTitle = '';
  formContent = '';
  formLink = '';
  readonly formError = signal<string | null>(null);
  readonly editingId = signal<string | null>(null);

  // ── Saved JDs ────────────────────────────────────────────────────────────
  readonly savedJDs = signal<JobDescription[]>(this.loadFromStorage());

  // ── Viewer ───────────────────────────────────────────────────────────────
  readonly viewingJD = signal<JobDescription | null>(null);

  // ── Computed ─────────────────────────────────────────────────────────────
  readonly lastAdded = computed(() => {
    const jds = this.savedJDs();
    if (!jds.length) return '';
    const last = jds[jds.length - 1];
    return this.formatDate(last.createdAt);
  });

  // ── Actions ──────────────────────────────────────────────────────────────
  saveJD(): void {
    this.formError.set(null);
    const title = this.formTitle.trim();
    const content = this.formContent.trim();
    const link = this.formLink.trim();

    if (!title) {
      this.formError.set('Please enter a job title or company name.');
      return;
    }
    if (!content && !link) {
      this.formError.set('Please paste the JD content or provide a link.');
      return;
    }

    const now = new Date().toISOString();
    const editId = this.editingId();

    if (editId) {
      this.savedJDs.update(list =>
        list.map(jd => jd.id === editId
          ? { ...jd, title, content, link, updatedAt: now }
          : jd
        )
      );
      this.editingId.set(null);
    } else {
      const newJD: JobDescription = {
        id: `jd_${Date.now()}`,
        title,
        content,
        link,
        createdAt: now,
        updatedAt: now,
      };
      this.savedJDs.update(list => [...list, newJD]);
    }

    this.persistToStorage();
    this.resetForm();
  }

  editJD(jd: JobDescription): void {
    this.editingId.set(jd.id);
    this.formTitle = jd.title;
    this.formContent = jd.content;
    this.formLink = jd.link;
    this.activeTab.set(jd.link && !jd.content ? 'link' : 'paste');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.resetForm();
  }

  deleteJD(id: string): void {
    this.savedJDs.update(list => list.filter(jd => jd.id !== id));
    this.persistToStorage();
    if (this.editingId() === id) {
      this.editingId.set(null);
      this.resetForm();
    }
  }

  viewJD(jd: JobDescription): void {
    this.viewingJD.set(jd);
  }

  closeViewer(): void {
    this.viewingJD.set(null);
  }

  // ── Helpers ──────────────────────────────────────────────────────────────
  formatDate(iso: string): string {
    try {
      return new Date(iso).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
      });
    } catch {
      return iso;
    }
  }

  wordCount(text: string): number {
    return text.trim().split(/\s+/).filter(Boolean).length;
  }

  private resetForm(): void {
    this.formTitle = '';
    this.formContent = '';
    this.formLink = '';
    this.formError.set(null);
  }

  private loadFromStorage(): JobDescription[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as JobDescription[]) : [];
    } catch {
      return [];
    }
  }

  private persistToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.savedJDs()));
    } catch {
      // Storage quota exceeded — silently fail
    }
  }
}
