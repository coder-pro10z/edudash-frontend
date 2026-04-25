import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronDown, ChevronUp, CheckCircle, Lightbulb, Play, Volume2 } from 'lucide-angular';
import { PremiumCheckboxComponent } from '../../../../shared/components/premium-checkbox/premium-checkbox.component';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';

interface QAItem {
  id: string;
  q: string;
  motive: string;
  hint: string;
  a: string;
  showHint: boolean;
  showAnswer: boolean;
  checked: boolean;
}

@Component({
  selector: 'app-qa-accordion',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, PremiumCheckboxComponent, BadgeComponent],
  templateUrl: './qa-accordion.component.html',
  styleUrl: './qa-accordion.component.scss'
})
export class QaAccordionComponent {
  qaList: QAItem[] = [
    {
      id: 'q1',
      q: 'Explain the different dependency injection lifetimes in .NET Core and when you would use each.',
      motive: 'Tests fundamental ASP.NET Core architectural knowledge and memory management.',
      hint: 'Define lifecycles: Transient (every time), Scoped (per request), Singleton (app lifetime).',
      a: 'For global caching, utilize AddSingleton. For per-request database context, AddScoped is mandatory. Never inject a Scoped service into a Singleton.',
      showHint: false,
      showAnswer: false,
      checked: false
    }
  ];

  toggleHint(item: QAItem) {
    item.showHint = !item.showHint;
  }

  toggleAnswer(item: QAItem) {
    item.showAnswer = !item.showAnswer;
  }
}
