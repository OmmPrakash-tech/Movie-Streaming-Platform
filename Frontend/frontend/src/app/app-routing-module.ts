import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Landing } from './landing/landing';
import { Signup } from './signup/signup';
import { Login } from './login/login';
import { VerifyEmailComponent } from './verify-email/verify-email';
import { Home } from './user/home/home';

import { authGuard } from './shared/guards/auth-guard';
import { adminGuard } from './shared/guards/admin-guard';
import { ForgotPassword } from './forgot-password/forgot-password';
import { ResetPassword } from './reset-password/reset-password';


const routes: Routes = [

  { path: '', component: Landing },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  {path:'forgot-password', component: ForgotPassword},
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'reset-password', component: ResetPassword },

  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin-module').then(m => m.AdminModule),
    canActivate: [adminGuard]
  },

  {
    path: 'home',
    component: Home,
    canActivate: [authGuard]
  },

  // ❗ ALWAYS KEEP LAST
  { path: '**', redirectTo: '', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}