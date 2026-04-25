import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Briefcase, FileText } from 'lucide-angular';
import { PremiumCheckboxComponent } from '../../../../shared/components/premium-checkbox/premium-checkbox.component';

@Component({
  selector: 'app-jd-resume-checklist',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, PremiumCheckboxComponent],
  templateUrl: './jd-resume-checklist.component.html',
  styleUrl: './jd-resume-checklist.component.scss'
})
export class JdResumeChecklistComponent {
  // Temporary placeholders
  jdItems = [
    { id: 'j1', text: 'Architect and maintain robust backend systems using .NET Core and C#.', checked: false },
    { id: 'j2', text: 'Demonstrable experience in designing, developing, debugging, and implementing .Net applications within AWS environments.', checked: false }
  ];

  resumeItems = [
    { id: 'r1', text: 'Improved enterprise module response performance by 30% using ASP.NET Core Web API and C#.', checked: false },
    { id: 'r2', text: 'Architected scalable Microservices using Dependency Injection, SOLID principles, and messaging queues.', checked: false }
  ];

  toggleJd(index: number) {
    this.jdItems[index].checked = !this.jdItems[index].checked;
  }

  toggleResume(index: number) {
    this.resumeItems[index].checked = !this.resumeItems[index].checked;
  }
}
