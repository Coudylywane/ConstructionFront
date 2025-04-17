import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { LayoutModule } from './layout/layout.module';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BlockUIModule } from 'ng-block-ui';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InputTextModule } from 'primeng/inputtext';
import { GestionProjetModule } from './gestion-projet/gestion-projet.module';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr'; // Import fr-FR locale data
registerLocaleData(localeFr, 'fr-FR');
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    LayoutModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    BlockUIModule.forRoot(),
    InputTextModule,
    InputTextModule,
    GestionProjetModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-FR' }, // Set fr-FR as the default locale
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
