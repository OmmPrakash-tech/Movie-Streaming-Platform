import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth-service';
import { NotificationService } from '../shared/services/notification-service';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPassword {
  forgotPassword!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notification: NotificationService,
    private router: Router
  ) {
    this.forgotPassword = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submit() {
    this.loading = true;

    const email = this.forgotPassword.value.email?.trim().toLowerCase();

    this.authService.forgotPassword(email).subscribe({
      next: (response: any) => {
  this.loading = false;
  this.notification.success(response.message);
  this.router.navigate(['/login']);
},
error: (err) => {
  this.loading = false;
  this.notification.error(err.error?.error || 'Failed to send reset email. Please try again.');
}
    }
      
    );
  }
}
