import { NgModule, provideAppInitializer, provideBrowserGlobalErrorListeners, inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Landing } from './landing/landing';
import { Signup } from './signup/signup';
import { Login } from './login/login';
import { VerifyEmailComponent } from './verify-email/verify-email';

import { SharedModule } from './shared/shared-module';
import { Home } from './user/home/home';
import { authInterceptor } from './shared/interceptors/auth-interceptor';
import { ForgotPassword } from './forgot-password/forgot-password';
import { AuthService } from './shared/services/auth-service'

@NgModule({
  declarations: [
    App,
    Landing,
    Signup,
    Login,
    VerifyEmailComponent,
    Home,
    ForgotPassword
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    provideAppInitializer(() => {
      const auth = inject(AuthService);
      return auth.initializeAuth();
    }),
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
  bootstrap: [App],
})
export class AppModule {}