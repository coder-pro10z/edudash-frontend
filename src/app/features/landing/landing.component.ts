import { CommonModule } from '@angular/common';
import { Component, OnInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

interface LandingFeature {
  icon: string;
  title: string;
  text: string;
}

interface WorkflowStep {
  label: string;
  title: string;
  text: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit {
  @ViewChildren('reveal') revealElements!: QueryList<ElementRef>;

  ngOnInit() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1 });

    // Small delay to ensure ViewChildren are populated
    setTimeout(() => {
      this.revealElements.forEach(el => observer.observe(el.nativeElement));
    }, 100);
  }

  stats = { days: 90, workflows: 3, workspace: 1 };

  readonly features: LandingFeature[] = [
    {
      icon: 'layout-dashboard',
      title: 'Personal preparation dashboard',
      text: 'See your active streak, topic coverage, skill readiness, and next best learning action in one focused workspace.'
    },
    {
      icon: 'file-check-2',
      title: 'JD and resume alignment',
      text: 'Turn a job description into concrete resume checks, talking points, and preparation gaps before interview day.'
    },
    {
      icon: 'network',
      title: 'Skill tree planning',
      text: 'Map technologies, topics, and target roles into a visible path so preparation stays structured instead of scattered.'
    },
    {
      icon: 'message-square-text',
      title: 'High-probability Q&A',
      text: 'Build, import, and refine interview answers with progress tracking for the questions most likely to matter.'
    },
    {
      icon: 'brain-circuit',
      title: 'Interactive lessons',
      text: 'Practice concepts with visual widgets, diagrams, quizzes, and examples that help knowledge stick.'
    },
    {
      icon: 'activity',
      title: 'Progress history',
      text: 'Use activity heatmaps and skill metrics to keep momentum visible across daily and long-term preparation.'
    }
  ];

  readonly workflow: WorkflowStep[] = [
    {
      label: '01',
      title: 'Capture the target role',
      text: 'Start with the role, job description, and resume signals that define what the interview will test.'
    },
    {
      label: '02',
      title: 'Map the preparation path',
      text: 'Break the target into skill tree topics, high-probability questions, keywords, and pitch strategy.'
    },
    {
      label: '03',
      title: 'Practice with feedback loops',
      text: 'Move between lessons, quizzes, Q&A, and progress history until weak spots become visible and fixable.'
    }
  ];

  readonly quizTopics = ['SQL Joins', 'System Design', 'Angular Signals', 'API Design'];
}
