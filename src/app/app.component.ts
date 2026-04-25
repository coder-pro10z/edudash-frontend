import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'edudash-frontend';
  
  // Basic search state for shell
  isSearchOpen = false;
  isLandingRoute = true;

  constructor(private router: Router) {
    this.isLandingRoute = this.router.url === '/';

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => {
        this.isLandingRoute = event.urlAfterRedirects === '/';
        if (this.isLandingRoute) {
          this.isSearchOpen = false;
        }
      });
  }

  toggleFloatingSearch() {
    this.isSearchOpen = !this.isSearchOpen;
  }

  clearSearch() {
    this.isSearchOpen = false;
  }
}
