import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth-service';
import { NotificationService } from '../shared/services/notification-service';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css'],
})
export class ResetPassword implements OnInit {
  resetPasswordForm: FormGroup;
  loading = false;
  tokenValid = false;
  token = '';
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private notification: NotificationService,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmpassword: [
        '',
        [Validators.required, this.authService.passwordMatchValidator('password')],
      ],
    });
  }

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token && token.trim() !== '') {
      this.token = token;
      this.tokenValid = true;
    } else {
      this.tokenValid = false;
    }
  }

  submit() {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const newPassword = this.resetPasswordForm.get('password')?.value;

    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.notification.success(
          response.message || 'Password reset successfully!'
        );
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.loading = false;

        const errorMsg =
          err.error?.error || 'Failed to reset password. Please try again.';

        if (
          errorMsg.toLowerCase().includes('expired') ||
          errorMsg.toLowerCase().includes('invalid')
        ) {
          this.tokenValid = false;
        } else {
          this.notification.error(errorMsg);
        }
      },
    });
  }
}