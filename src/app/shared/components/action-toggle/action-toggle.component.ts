import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-action-toggle',
  standalone: true,
  template: `
    <button
      type="button"
      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ease-out"
      [class]="active ? activeClasses : inactiveClasses"
      [title]="label"
      (click)="toggled.emit()">

      <!-- Solved icon -->
      @if (icon === 'solved') {
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          @if (active) {
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          } @else {
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4" />
          }
        </svg>
      }

      <!-- Revision/Bookmark icon -->
      @if (icon === 'bookmark') {
        <svg class="w-3.5 h-3.5" [attr.fill]="active ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      }

      <span>{{ label }}</span>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionToggleComponent {
  @Input({ required: true }) label = '';
  @Input() active = false;
  @Input() icon: 'solved' | 'bookmark' = 'solved';
  @Output() toggled = new EventEmitter<void>();

  get activeClasses(): string {
    if (this.icon === 'solved') {
      return 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200 scale-[1.02]';
    }
    return 'bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200 scale-[1.02]';
  }

  get inactiveClasses(): string {
    return 'bg-slate-50 text-[#5F6368] border border-[#E0E0E0] hover:text-[#202124] hover:bg-slate-100';
  }
}
