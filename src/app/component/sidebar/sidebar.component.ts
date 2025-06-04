import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'] 
})
export class SidebarComponent {
  constructor(public router: Router, private authService: AuthService) {}

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}