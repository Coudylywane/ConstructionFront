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


@NgModule({
  declarations: [AddProjetComponent, ListProjetComponent],
  imports: [
    CommonModule,
    GestionProjetRoutingModule,
    FormsModule,
    ConfirmDialogModule,
    MessagesModule,
    MessageModule,
    ReactiveFormsModule,
  ],
  providers: [
    MessageService,
    ConfirmationService, // Provide services here instead of in the component
  ],
})
export class GestionProjetModule {}
