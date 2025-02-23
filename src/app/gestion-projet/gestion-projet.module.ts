import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionProjetRoutingModule } from './gestion-projet-routing.module';
import { AddProjetComponent } from './composants/add-projet/add-projet.component';
import { ListProjetComponent } from './composants/list-projet/list-projet.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DetailProjetComponent } from './composants/detail-projet/detail-projet.component';
import { PanelModule } from 'primeng/panel';
import { ToastrModule } from 'ngx-toastr';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast'; // Importer ToastModule
import { TabViewModule } from 'primeng/tabview';
import { DividerModule } from 'primeng/divider';



@NgModule({
  declarations: [
    AddProjetComponent,
    ListProjetComponent,
    DetailProjetComponent,
  ],
  imports: [
    CommonModule,
    GestionProjetRoutingModule,
    FormsModule,
    ConfirmDialogModule,
    MessagesModule,
    MessageModule,
    ReactiveFormsModule,
    PanelModule,
    ToastrModule,
    InputTextModule,
    InputTextModule,
    ToastModule,
    TabViewModule, // Pour p-tabView et p-tabPanel
    DividerModule, // Pour p-divider
  ],
  providers: [
    MessageService,
    ConfirmationService, // Provide services here instead of in the component
  ],
})
export class GestionProjetModule {}
