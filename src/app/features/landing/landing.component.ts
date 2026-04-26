import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements AfterViewInit {
  heatmapGrid = Array.from({ length: 14 }, () => 
    Array.from({ length: 5 }, () => Math.random() > 0.7 ? 'bg-[#1A73E8]' : (Math.random() > 0.4 ? 'bg-[#C7D2FE]' : 'bg-[#E2E8F0]'))
  );

  ngAfterViewInit() {
    // Initialize the Scroll Animations (Intersection Observer)
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          const heroDash = entry.target.querySelector('#heroDash');
          if (heroDash) {
            setTimeout(() => heroDash.classList.add('expanded'), 300);
          }
        }
      });
    }, observerOptions);

    // Grab all sections with the trigger class and observe them
    document.querySelectorAll('.reveal-fade-in, .reveal-slide-up, .reveal-slide-in').forEach(section => {
      observer.observe(section);
    });
  }
}