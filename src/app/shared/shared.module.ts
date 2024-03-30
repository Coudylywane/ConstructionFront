import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { HasAnyAuthorityDirective } from './directives/has-any-authority.directive';
import { AuthInterceptor } from './services/auth.interceptor';
import { AuthExpiredInterceptor } from './services/auth-expired.interceptor';
import { NumbersOnlyDirective } from './directives/number-only.directive';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BlockUIModule } from 'ng-block-ui';



@NgModule({
  declarations: [
    HasAnyAuthorityDirective,
    NumbersOnlyDirective,
    ConfirmDialogComponent,
  ],
  imports: [CommonModule],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    NgbModule,
    ConfirmDialogComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthExpiredInterceptor,
      multi: true,
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
