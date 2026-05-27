import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AdminApiService,
  BulkImportResultDto,
  CategoryManageDto,
} from '../../../core/services/admin-api.service';

@Component({
  selector: 'app-admin-import',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<div class="space-y-6">

  <!-- ── Page Header ────────────────────────────────────────────────────── -->
  <div>
    <h1 class="text-xl font-bold text-slate-800 tracking-tight">Import Questions</h1>
    <p class="text-sm text-slate-500 mt-1">
      Bulk-upload questions from a <code class="text-violet-600 font-mono text-xs">.xlsx</code>,
      <code class="text-violet-600 font-mono text-xs">.csv</code>, or
      <code class="text-violet-600 font-mono text-xs">.json</code> file.
      Use <strong>Dry Run</strong> to validate without saving.
    </p>
  </div>

  <!-- ── Card ───────────────────────────────────────────────────────────── -->
  <div class="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 max-w-2xl space-y-6">

    <!-- Default Category -->
    <div>
      <label for="import-category" class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
        Default Category
      </label>
      @if (categoriesLoading()) {
        <div class="h-9 bg-slate-100 animate-pulse rounded-lg"></div>
      } @else {
        <select
          id="import-category"
          [(ngModel)]="importCategoryId"
          class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm
                 text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/40
                 focus:border-violet-400 transition-all"
        >
          <option [ngValue]="0" disabled>Select a category…</option>
          @for (cat of flatCategories(); track cat.id) {
            <option [ngValue]="cat.id">{{ cat.name }}</option>
          }
        </select>
        <p class="text-[11px] text-slate-400 mt-1">
          Used when a row in the file doesn't specify its own category.
        </p>
      }
    </div>

    <!-- Dry Run Toggle -->
    <label class="flex items-center gap-3 cursor-pointer select-none">
      <div class="relative">
        <input
          id="import-dry-run"
          type="checkbox"
          [(ngModel)]="importDryRun"
          class="sr-only peer"
        >
        <div class="w-10 h-6 rounded-full bg-slate-200 peer-checked:bg-violet-600
                    transition-colors duration-200"></div>
        <div class="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow
                    peer-checked:translate-x-4 transition-transform duration-200"></div>
      </div>
      <div>
        <p class="text-sm font-medium text-slate-700">Dry Run</p>
        <p class="text-xs text-slate-400">Validate the file without saving any data</p>
      </div>
    </label>

    <!-- Drop Zone -->
    <div>
      <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
        File
      </label>
      <div
        id="import-drop-zone"
        class="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200"
        [class]="dropZoneClass()"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave()"
        (drop)="onDrop($event)"
        (click)="fileInput.click()"
        role="button"
        aria-label="Upload file"
      >
        <input
          #fileInput
          id="import-file-input"
          type="file"
          accept=".xlsx,.json,.csv"
          class="hidden"
          (change)="onFileChange($event)"
        >

        @if (selectedFile()) {
          <!-- File selected state -->
          <div class="flex flex-col items-center gap-2">
            <div class="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
              <svg class="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-sm font-semibold text-slate-800">{{ selectedFile()!.name }}</p>
            <p class="text-xs text-slate-400">{{ fileSize() }} · Click or drag to replace</p>
          </div>
        } @else if (dragging()) {
          <!-- Drag-over state -->
          <div class="flex flex-col items-center gap-2">
            <svg class="w-10 h-10 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p class="text-sm font-semibold text-violet-600">Drop it here!</p>
          </div>
        } @else {
          <!-- Idle state -->
          <div class="flex flex-col items-center gap-2">
            <svg class="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p class="text-sm text-slate-600">
              <span class="font-semibold text-violet-600">Click to upload</span> or drag &amp; drop
            </p>
            <p class="text-xs text-slate-400">.xlsx &nbsp;·&nbsp; .csv &nbsp;·&nbsp; .json</p>
          </div>
        }
      </div>
    </div>

    <!-- Progress bar (visible while uploading) -->
    @if (uploading()) {
      <div class="space-y-1.5">
        <div class="flex items-center justify-between text-xs text-slate-500">
          <span>Processing file…</span>
          <svg class="w-3.5 h-3.5 animate-spin text-violet-500" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        </div>
        <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full animate-pulse"
               style="width: 70%"></div>
        </div>
      </div>
    }

    <!-- Import Result -->
    @if (result()) {
      <div
        id="import-result"
        class="rounded-xl border text-sm space-y-3 overflow-hidden"
        [class]="result()!.failed > 0
          ? 'border-red-200 bg-red-50'
          : result()!.isDryRun
            ? 'border-blue-200 bg-blue-50'
            : 'border-green-200 bg-green-50'"
      >
        <!-- Summary row -->
        <div class="flex flex-wrap items-center gap-4 px-4 py-3 border-b"
             [class]="result()!.failed > 0
               ? 'border-red-200'
               : result()!.isDryRun
                 ? 'border-blue-200'
                 : 'border-green-200'">

          @if (result()!.isDryRun) {
            <span class="inline-flex items-center gap-1.5 text-blue-700 font-semibold text-xs
                         bg-blue-100 px-2.5 py-1 rounded-full">
              🔍 DRY RUN
            </span>
          }

          <span class="text-green-700 font-medium">
            ✓ {{ result()!.imported }} imported
          </span>
          @if (result()!.skipped) {
            <span class="text-amber-600 font-medium">
              ⚠ {{ result()!.skipped }} skipped
            </span>
          }
          @if (result()!.failed) {
            <span class="text-red-700 font-medium">
              ✗ {{ result()!.failed }} failed
            </span>
          }
        </div>

        <!-- Warnings -->
        @if (result()!.warnings.length) {
          <div class="px-4 pb-2 space-y-1">
            <p class="text-xs font-semibold text-amber-700 uppercase tracking-wider">Warnings</p>
            @for (w of result()!.warnings; track $index) {
              <p class="text-xs text-amber-700">⚠ {{ w }}</p>
            }
          </div>
        }

        <!-- Errors -->
        @if (result()!.errors.length) {
          <div class="px-4 pb-4 space-y-1">
            <p class="text-xs font-semibold text-red-700 uppercase tracking-wider">Errors</p>
            @for (e of result()!.errors; track $index) {
              <p class="text-xs text-red-700">✗ {{ e }}</p>
            }
          </div>
        }
      </div>
    }

    <!-- Error banner (network / server error) -->
    @if (errorMsg()) {
      <div class="flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
        <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
        <p>{{ errorMsg() }}</p>
      </div>
    }

    <!-- Submit Button -->
    <button
      id="import-submit-btn"
      (click)="runImport()"
      [disabled]="!selectedFile() || uploading() || !importCategoryId"
      class="w-full flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl
             text-sm font-semibold text-white
             bg-gradient-to-r from-violet-600 to-pink-600
             hover:from-violet-700 hover:to-pink-700
             disabled:opacity-40 disabled:cursor-not-allowed
             shadow-sm hover:shadow-violet-200
             transition-all duration-200"
    >
      @if (uploading()) {
        <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        Processing…
      } @else {
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        {{ importDryRun ? 'Validate File (Dry Run)' : 'Import Questions' }}
      }
    </button>

    <!-- Help text -->
    @if (!importCategoryId && !uploading()) {
      <p class="text-center text-xs text-amber-600">
        ⚠ Please select a default category before importing.
      </p>
    }
  </div>

  <!-- ── Format Guide ────────────────────────────────────────────────────── -->
  <div class="max-w-2xl">
    <h2 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Supported File Formats</h2>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">

      <!-- XLSX -->
      <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-lg">📊</span>
          <span class="text-sm font-semibold text-slate-700">.xlsx</span>
        </div>
        <p class="text-xs text-slate-500">Excel spreadsheet. Columns: <code class="text-violet-600">Title</code>, <code class="text-violet-600">QuestionText</code>, <code class="text-violet-600">Difficulty</code>, <code class="text-violet-600">CategorySlug</code>, <code class="text-violet-600">AnswerMarkdown</code></p>
      </div>

      <!-- CSV -->
      <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-lg">📄</span>
          <span class="text-sm font-semibold text-slate-700">.csv</span>
        </div>
        <p class="text-xs text-slate-500">Comma-separated. Same column headers as XLSX. Quoted fields and embedded newlines are supported.</p>
      </div>

      <!-- JSON -->
      <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-lg">🗂</span>
          <span class="text-sm font-semibold text-slate-700">.json</span>
        </div>
        <p class="text-xs text-slate-500">Array under <code class="text-violet-600">"questions"</code> key. Each object: <code class="text-violet-600">questionText</code>, <code class="text-violet-600">difficulty</code>, <code class="text-violet-600">categorySlug</code>, etc.</p>
      </div>

    </div>
  </div>

</div>
  `,
})
export class AdminImportComponent implements OnInit {
  private readonly api = inject(AdminApiService);

  // ── Category state ──────────────────────────────────────────────────────
  readonly categories = signal<CategoryManageDto[]>([]);
  readonly categoriesLoading = signal(true);

  readonly flatCategories = computed(() => {
    const flatten = (cats: CategoryManageDto[], depth = 0): { id: number; name: string }[] =>
      cats.flatMap(c => [
        { id: c.id, name: '\u00a0'.repeat(depth * 2) + c.name },
        ...flatten(c.subCategories ?? [], depth + 1),
      ]);
    return flatten(this.categories());
  });

  // ── Import form state ───────────────────────────────────────────────────
  importCategoryId = 0;
  importDryRun = false;

  readonly selectedFile = signal<File | null>(null);
  readonly dragging = signal(false);
  readonly uploading = signal(false);
  readonly result = signal<BulkImportResultDto | null>(null);
  readonly errorMsg = signal('');

  readonly fileSize = computed(() => {
    const f = this.selectedFile();
    if (!f) return '';
    const kb = f.size / 1024;
    return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(2)} MB`;
  });

  readonly dropZoneClass = computed(() => {
    if (this.dragging()) return 'border-violet-400 bg-violet-50';
    if (this.selectedFile()) return 'border-green-400 bg-green-50/40';
    return 'border-slate-200 hover:border-violet-300 hover:bg-violet-50/30 bg-slate-50/50';
  });

  // ── Lifecycle ───────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.api.getCategoryTree().subscribe({
      next: cats => { this.categories.set(cats); this.categoriesLoading.set(false); },
      error: () => this.categoriesLoading.set(false),
    });
  }

  // ── Drag & Drop ─────────────────────────────────────────────────────────
  onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.dragging.set(true);
  }

  onDragLeave(): void {
    this.dragging.set(false);
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.dragging.set(false);
    const file = e.dataTransfer?.files[0];
    if (file) this.setFile(file);
  }

  onFileChange(e: Event): void {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) this.setFile(file);
  }

  private setFile(file: File): void {
    this.selectedFile.set(file);
    this.result.set(null);
    this.errorMsg.set('');
  }

  // ── Import ──────────────────────────────────────────────────────────────
  runImport(): void {
    const file = this.selectedFile();
    if (!file || this.uploading()) return;

    this.uploading.set(true);
    this.result.set(null);
    this.errorMsg.set('');

    const categoryId = this.importCategoryId || 1;

    this.api.importFile(file, categoryId, this.importDryRun).subscribe({
      next: r => {
        this.result.set(r);
        this.uploading.set(false);
      },
      error: err => {
        const msg =
          err?.error?.error ??
          err?.error?.title ??
          err?.message ??
          'Upload failed. Please check the file and try again.';
        this.errorMsg.set(msg);
        this.uploading.set(false);
      },
    });
  }
}
