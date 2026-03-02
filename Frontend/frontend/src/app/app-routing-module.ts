import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Landing } from './landing/landing';
import { Signup } from './signup/signup';
import { Login } from './login/login';
import { VerifyEmailComponent } from './verify-email/verify-email';

const routes: Routes = [
  { path: '', component: Landing },
  {path: "login" , component: Login},
  {path: "signup",component:Signup},
  {path:"verify-email",component:VerifyEmailComponent},
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
