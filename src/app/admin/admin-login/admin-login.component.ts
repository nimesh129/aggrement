import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-login.component.html', // Updated to use external HTML file
  styleUrls: ['./admin-login.component.css'] 
})
export class AdminLoginComponent {
  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private authService: AuthService
  ) {}

  onSubmit() {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;
      
      if (email && password) {
        this.authService.login({ email, password }).subscribe((response) => {
          if (response.success) {
            this.router.navigate(['/admin']);
          } else {
            alert('Invalid username or password');
          }
        });
      }
    }
  }
}