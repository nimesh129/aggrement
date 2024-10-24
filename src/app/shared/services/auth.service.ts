import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

interface LoginCredentials {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api'; // Replace with your actual API URL
  private isAuthenticated = false;

  constructor(private http: HttpClient) {}

  login(credentials: LoginCredentials): Observable<any> {
    // In a real application, you would send a request to your backend
    // For now, we'll simulate a successful login if the username is 'admin' and password is 'password'
    // if (credentials.username === 'admin' && credentials.password === 'password') {
    //   this.isAuthenticated = true;
    //   return of({ success: true, message: 'Login successful' }).pipe(
    //     tap(() => {
    //       localStorage.setItem('isLoggedIn', 'true');
    //     })
    //   );
    // } else {
    //   return of({ success: false, message: 'Invalid credentials' });
    // }

    // Uncomment the following when you have a backend ready
    return this.http.post(`${this.apiUrl}/admin/login`, credentials).pipe(
      tap((response: any) => {
        if (response.success) {
          this.isAuthenticated = true;
          localStorage.setItem('isLoggedIn', 'true');
        }
      })
    );
  }

  logout(): void {
    this.isAuthenticated = false;
    localStorage.removeItem('isLoggedIn');
    // this.router.navigate(['/login']);
    // You might want to send a logout request to your backend here
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated || localStorage.getItem('isLoggedIn') === 'true';
  }
}