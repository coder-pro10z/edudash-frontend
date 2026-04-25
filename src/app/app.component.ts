import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, Search, Bell, X } from 'lucide-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'edudash-frontend';
  
  // Basic search state for shell
  isSearchOpen = false;

  toggleFloatingSearch() {
    this.isSearchOpen = !this.isSearchOpen;
  }

  clearSearch() {
    this.isSearchOpen = false;
  }
}
