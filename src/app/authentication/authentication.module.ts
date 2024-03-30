import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from './services/auth.service';



@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    AuthenticationRoutingModule,
    SharedModule
  ],
  providers: [AuthService]
})
export class AuthenticationModule { }
