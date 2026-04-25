import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

interface QuestionCard {
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'Draft' | 'Ready' | 'Needs review';
  prompt: string;
}

@Component({
  selector: 'app-question-bank',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './question-bank.component.html',
  styleUrl: './question-bank.component.scss'
})
export class QuestionBankComponent {
  readonly filters = ['All', 'Frontend', 'Backend', 'System Design', 'Behavioral'];

  readonly questions: QuestionCard[] = [
    {
      title: 'Explain Angular signals',
      category: 'Frontend',
      difficulty: 'Medium',
      status: 'Ready',
      prompt: 'Describe how signals help manage reactive state and when they are preferable to observable-heavy component state.'
    },
    {
      title: 'Design an interview prep tracker',
      category: 'System Design',
      difficulty: 'Hard',
      status: 'Needs review',
      prompt: 'Walk through entities, data flows, caching, and progress metrics for a scalable preparation dashboard.'
    },
    {
      title: 'SQL joins and filtering',
      category: 'Backend',
      difficulty: 'Easy',
      status: 'Draft',
      prompt: 'Compare inner, left, and full joins using a real hiring or learner progress example.'
    }
  ];
}
