import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PremiumCheckboxComponent } from '../../../../shared/components/premium-checkbox/premium-checkbox.component';

@Component({
  selector: 'app-pitch-strategy',
  standalone: true,
  imports: [CommonModule, PremiumCheckboxComponent],
  templateUrl: './pitch-strategy.component.html',
  styleUrl: './pitch-strategy.component.scss'
})
export class PitchStrategyComponent {
  introChecked = false;
  aboutChecked = false;
  customChecked = false;

  introText = 'The following analysis presents an exhaustive interview preparation framework...';
  aboutText = 'Praveen Kashyap is a Full Stack Software Engineer with enterprise experience...';
  customTitle = 'Strategic Gap Analysis';
  customText = 'Identified three critical alignment vectors to bridge during the interview...';

  saveText(field: string, event: Event) {
    const el = event.target as HTMLElement;
    // @ts-ignore
    this[field] = el.innerText;
  }
}
