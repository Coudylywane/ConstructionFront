import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth.guard';
import { AddProjetComponent } from './composants/add-projet/add-projet.component';
import { ListProjetComponent } from './composants/list-projet/list-projet.component';
import { DetailProjetComponent } from './composants/detail-projet/detail-projet.component';
import { GenererDevisComponent } from './composants/generer-devis/generer-devis.component';
import { ListDevisComponent } from './composants/list-devis/list-devis.component';
import { ListTacheComponent } from './composants/list-tache/list-tache.component';
import { AddTacheComponent } from './composants/add-tache/add-tache.component';
import { GenererPlanningComponent } from './composants/generer-planning/generer-planning.component';
import { VisualiserDevisComponent } from './composants/visualiser-devis/visualiser-devis.component';
import { VisualiserPlanningComponent } from './composants/visualiser-planning/visualiser-planning.component';

const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'addProjet',
        component: AddProjetComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'listProjet',
        component: ListProjetComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'detailProjet/:id',
        component: DetailProjetComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'genererDevis/:id',
        component: GenererDevisComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'listDevis',
        component: ListDevisComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'listTache',
        component: ListTacheComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'addTache',
        component: AddTacheComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'genererPlanning/:id',
        component: GenererPlanningComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'visualiserDevis/:id',
        component: VisualiserDevisComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'visualiserPlanning/:id',
        component: VisualiserPlanningComponent,
        canActivate: [AuthGuard],
      },
    ]),
  ],
  exports: [RouterModule],
})
export class GestionProjetRoutingModule {}
