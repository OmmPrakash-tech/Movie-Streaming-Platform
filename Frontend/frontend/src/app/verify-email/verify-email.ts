import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

    const token = this.route.snapshot.queryParamMap.get('token');

    console.log('TOKEN =', token); // ⭐ check console

    if (!token) {
      this.loading = false;
      this.success = false;
      this.message = 'Invalid verification link.';
      return;
    }

    this.authService.verifyEmail(token).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.success = true;
        this.message = res.message;
      },
      error: (err) => {
        this.loading = false;
        this.success = false;
        this.message = err.error?.error || 'Verification failed.';
      }
    });
  }
}