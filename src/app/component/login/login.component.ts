import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service'; // ปรับเส้นทางให้ตรงกับที่เก็บไฟล์ auth.service.ts
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username = '';
  password = '';
  name = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService
      .login({ username: this.username, password: this.password })
      .subscribe({
        next: (response) => {
          this.authService.saveToken(response.token);
          localStorage.setItem('name', response.name); // เก็บ name ที่ได้จาก backend
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMessage = 'Login failed. Please check your credentials.';
          console.error('Login error:', error);
        },
      });
  }
}
