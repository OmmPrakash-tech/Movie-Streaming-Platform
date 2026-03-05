import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { AuthService } from '../shared/services/auth-service';
import { NotificationService } from '../shared/services/notification-service';
import { ErrorHandlerService } from '../shared/services/error-handler-service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {

  hide = true;
  loginForm!: FormGroup;
  loading = false;
  showResendLink = false;
  userEmail = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notification: NotificationService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.authService.redirectBasedOnRole();
    }
  }

  submit(): void {

    if (this.loginForm.invalid) {
      this.notification.error('Please fill all required fields correctly');
      return;
    }

    this.loading = true;
    this.showResendLink = false;

    const { email, password } = this.loginForm.value;

    const authData = {
      email: email.trim().toLowerCase(),
      password
    };

    this.authService.login(authData)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: () => {
          this.authService.redirectBasedOnRole();
        },

        error: (err) => {

          const errorMsg =
            err?.error?.error ||
            'Login failed. Please check your credentials.';

          // If email not verified
          if (
            err.status === 403 &&
            errorMsg.toLowerCase().includes('verify')
          ) {
            this.showResendLink = true;
            this.userEmail = authData.email;
          } else {
            this.showResendLink = false;
          }

          this.notification.error(errorMsg);
          console.error('Login error:', err);
        }
      });
  }

  resendVerification(): void {

    if (!this.userEmail) {
      this.notification.error('Please enter your email address');
      return;
    }

    this.loading = true;

    this.authService.resendVerificationEmail(this.userEmail)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (response: any) => {
          this.notification.success(
            response?.message ||
            'Verification email sent! Please check your inbox.'
          );
        },

        error: (err) => {
          this.errorHandlerService.handle(
            err,
            'Failed to send verification email. Please try again'
          );
        }
      });
  }

  forget(): void {
    this.router.navigate(['/forget-password']);
  }
}