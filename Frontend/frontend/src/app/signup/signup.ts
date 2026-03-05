import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../shared/services/auth-service';
import { ErrorHandlerService } from '../shared/services/error-handler-service';
import { NotificationService } from '../shared/services/notification-service';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class Signup implements OnInit {

  hidePassword = true;
  hideConfirmPassword = true;
  signupForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private notification: NotificationService,
    private errorHandlerService: ErrorHandlerService
  ) {

    this.signupForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: [
        '',
        [
          Validators.required,
          this.authService.passwordMatchValidator('password')
        ]
      ]
    });
  }

  ngOnInit(): void {

    if (this.authService.isLoggedIn()) {
      this.authService.redirectBasedOnRole();
    }

    // update confirm password validation when password changes
    this.signupForm.get('password')?.valueChanges.subscribe(() => {
      this.signupForm.get('confirmPassword')?.updateValueAndValidity();
    });

    const email = this.route.snapshot.queryParams['email'];

    if (email) {
      this.signupForm.patchValue({ email });
    }
  }

  submit() {

    if (this.signupForm.invalid || this.loading) return;

    this.loading = true;

    const { email, password, fullName } = this.signupForm.value;

    const data = {
      email: email?.trim().toLowerCase(),
      password,
      fullName
    };

    this.authService.signup(data).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.notification.success(response?.message);
        this.router.navigate(['/login']);
      },

      error: (err) => {
        this.loading = false;
        this.errorHandlerService.handle(
          err,
          'Registration failed. Please try again.'
        );
      }
    });
  }
}