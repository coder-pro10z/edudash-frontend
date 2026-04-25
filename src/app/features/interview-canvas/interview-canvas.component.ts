import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Trash2, ArrowLeftRight, Brain, MessageSquare, Upload, Plus, Key } from 'lucide-angular';
import { BadgeComponent } from '../../shared/components/badge/badge.component';

import { JdResumeChecklistComponent } from './components/jd-resume-checklist/jd-resume-checklist.component';
import { PitchStrategyComponent } from './components/pitch-strategy/pitch-strategy.component';
import { QaAccordionComponent } from './components/qa-accordion/qa-accordion.component';
import { KeywordCardComponent } from './components/keyword-card/keyword-card.component';
import { CanvasStore } from '../../core/state/canvas.store';

@Component({
  selector: 'app-interview-canvas',
  standalone: true,
  imports: [
    CommonModule, 
    LucideAngularModule, 
    BadgeComponent,
    JdResumeChecklistComponent,
    PitchStrategyComponent,
    QaAccordionComponent,
    KeywordCardComponent
  ],
  templateUrl: './interview-canvas.component.html',
  styleUrl: './interview-canvas.component.scss'
})
export class InterviewCanvasComponent {
  private canvasStore = inject(CanvasStore);

  readonly title = computed(() => this.canvasStore.title());
  readonly pitchCompletedCount = computed(() => {
    const pitch = this.canvasStore.pitchStrategy();
    return [pitch.introChecked, pitch.aboutChecked, pitch.customChecked].filter(Boolean).length;
  });
  readonly pitchProgressWidth = computed(() => `${(this.pitchCompletedCount() / 3) * 100}%`);
  readonly qaCompletedCount = computed(() => this.canvasStore.qaItems().filter((item) => item.checked).length);
  readonly qaTotalCount = computed(() => this.canvasStore.qaItems().length);
  readonly qaProgressWidth = computed(() => {
    const total = this.qaTotalCount();
    return `${total === 0 ? 0 : (this.qaCompletedCount() / total) * 100}%`;
  });

  constructor() {
    effect(() => {
      document.title = `${this.title()} - Prep Canvas`;
    });
  }

  onTitleChange(event: Event) {
    const el = event.target as HTMLElement;
    this.canvasStore.updateTitle(el.innerText.trim() || 'Role Title / Company Name');
  }

  resetData() {
    if (confirm("Reset to default mock data? All your edits will be lost.")) {
      this.canvasStore.reset();
    }
  }

  openImportModal() {
    // Agent Gamma will implement modal logic
  }

  addQA() {
    this.canvasStore.addQa();
  }

  addKeyword() {
    // Agent Gamma logic
  }
}
