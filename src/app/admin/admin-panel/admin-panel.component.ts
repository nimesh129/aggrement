import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; // Add this import
import { RightPanelComponent } from '../../shared/right-panel/right-panel.component';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    RightPanelComponent, 
    RouterLink
  ],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent {
  showRightPanel: boolean = true;
  isAdminHome: boolean = true;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      const navEndEvent = event as NavigationEnd;
      this.updateRightPanelVisibility(navEndEvent.url);
      // Check if we're on the admin home route
      this.isAdminHome = navEndEvent.url === '/admin' || navEndEvent.url === '/admin/';
    });
  }

  private updateRightPanelVisibility(url: string) {
    if (url.includes('manage-questions') || url.includes('survey-management')) {
      this.showRightPanel = true;
    } else {
      this.showRightPanel = true;
    }
  }

  toggleRightPanel() {
    this.showRightPanel = !this.showRightPanel;
  }
}