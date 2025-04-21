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
import { GenererDevisComponent } from './composants/generer-devis/generer-devis.component';
import { ListDevisComponent } from './composants/list-devis/list-devis.component';
import { AddTacheComponent } from './composants/add-tache/add-tache.component';
import { ListTacheComponent } from './composants/list-tache/list-tache.component';
import { GenererPlanningComponent } from './composants/generer-planning/generer-planning.component';
import { VisualiserDevisComponent } from './composants/visualiser-devis/visualiser-devis.component';
import { CfaCurrencyPipe } from './cfa-currency.pipe';
import { VisualiserPlanningComponent } from './composants/visualiser-planning/visualiser-planning.component';

@NgModule({
  declarations: [
    AddProjetComponent,
    ListProjetComponent,
    DetailProjetComponent,
    GenererDevisComponent,
    ListDevisComponent,
    AddTacheComponent,
    ListTacheComponent,
    GenererPlanningComponent,
    VisualiserDevisComponent,
    CfaCurrencyPipe,
    VisualiserPlanningComponent,
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
