import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  passwordMatchValidator(passwordControlName: string): ValidatorFn {
    return (confirmControl: AbstractControl): ValidationErrors | null => {
      if (!confirmControl.parent) return null;

      const password = confirmControl.parent.get(passwordControlName)?.value;
      const confirm = confirmControl.value;

      return password === confirm ? null : { passwordMismatch: true };
    };
  }

  signup(signupData: { email: string; password: string; fullName: string }) {
    return this.http.post(`${this.apiUrl}/signup`, signupData);
  }

 verifyEmail(token: string) {
   return this.http.get(`${this.apiUrl}/verify-email`, {
      params: { token }
   });
}}