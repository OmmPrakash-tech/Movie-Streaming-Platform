import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../shared/services/auth-service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.html',
  styleUrls: ['./verify-email.css'],
  standalone: false
})
export class VerifyEmailComponent implements OnInit {

  loading = true;
  success = false;
  message = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {

    this.route.queryParamMap.subscribe(params => {

      const token = params.get('token');

      if (!token) {
        this.loading = false;
        this.success = false;
        this.message = 'Invalid verification link.';
        return;
      }

      this.authService.verifyEmail(token)
        .pipe(
          finalize(() => this.loading = false)
        )
        .subscribe({
          next: (res: any) => {
            this.success = true;
            this.message = res?.message || 'Email verified successfully.';
          },
          error: (err) => {
            this.success = false;
            this.message =
              err.error?.error || 'Verification failed.';
          }
        });
    });
  }
}