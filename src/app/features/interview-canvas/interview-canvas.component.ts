import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Trash2, ArrowLeftRight, Brain, MessageSquare, Upload, Plus, Key } from 'lucide-angular';
import { BadgeComponent } from '../../shared/components/badge/badge.component';

import { JdResumeChecklistComponent } from './components/jd-resume-checklist/jd-resume-checklist.component';
import { PitchStrategyComponent } from './components/pitch-strategy/pitch-strategy.component';
import { QaAccordionComponent } from './components/qa-accordion/qa-accordion.component';
import { KeywordCardComponent } from './components/keyword-card/keyword-card.component';

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
  title = 'Role Title / Company Name';

  onTitleChange(event: Event) {
    const el = event.target as HTMLElement;
    this.title = el.innerText;
    document.title = `${this.title} - Prep Canvas`;
  }

  resetData() {
    if (confirm("Reset to default mock data? All your edits will be lost.")) {
      // Agent Gamma will implement actual reset logic via service
      console.log('Reset triggered');
    }
  }

  openImportModal() {
    // Agent Gamma will implement modal logic
  }

  addQA() {
    // Agent Gamma logic
  }

  addKeyword() {
    // Agent Gamma logic
  }
}
