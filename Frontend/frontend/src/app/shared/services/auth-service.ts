import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/auth`;

  private currentUserSubject = new BehaviorSubject<any | null>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  passwordMatchValidator(passwordControlName: string): ValidatorFn {
    return (confirmControl: AbstractControl): ValidationErrors | null => {
      if (!confirmControl.parent) return null;

      const password =
        confirmControl.parent.get(passwordControlName)?.value;

      const confirm = confirmControl.value;

      return password === confirm ? null : { passwordMismatch: true };
    };
  }

  signup(signupData: {
    email: string;
    password: string;
    fullName: string;
  }) {
    return this.http.post(`${this.apiUrl}/signup`, signupData);
  }

  verifyEmail(token: string) {
    return this.http.get(`${this.apiUrl}/verify-email`, {
      params: { token }
    });
  }

  login(loginData: any) {
    return this.http.post(`${this.apiUrl}/login`, loginData).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

 handleAuthSuccess(authData: any) {
  if (authData?.token) {
    localStorage.setItem('token', authData.token);
  }

  // store only the user object
  this.setCurrentUser(authData.user);
}

  setCurrentUser(user: any | null) {
    this.currentUserSubject.next(user);
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  }

  redirectBasedOnRole() {
    const targetUrl = this.isAdmin() ? '/admin' : '/home';
    this.router.navigate([targetUrl]);
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'ADMIN';
  }

  resendVerificationEmail(email: string) {
    return this.http.post(`${this.apiUrl}/resend-verification`, { email });
  }

  forgotPassword(email:string){
    return this.http.post(this.apiUrl+'/forgot-password',{email})
  }

  resetPassword(token:string,newPassword:string){
    return this.http.post(this.apiUrl+ '/reset-password',{token,newPassword})
  }

initializeAuth(): Promise<void> {
  return new Promise((resolve) => {

    const token = localStorage.getItem('token');

    if (!token) {
      resolve();
      return;
    }

    this.fetchCurrentUser().subscribe({
      next: (user) => {
        this.handleAuthSuccess(user);
        resolve();
      },
      error: () => {
        localStorage.removeItem('token');
        resolve();
      }
    });

  });
}

private fetchCurrentUser() {
  return this.http.get(this.apiUrl + '/current-user');
}

logout() {
  localStorage.removeItem('token');
  this.currentUserSubject.next(null);
  this.router.navigate(['/']);
}

}