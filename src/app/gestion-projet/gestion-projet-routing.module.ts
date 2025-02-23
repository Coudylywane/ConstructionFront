import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth.guard';
import { AddProjetComponent } from './composants/add-projet/add-projet.component';
import { ListProjetComponent } from './composants/list-projet/list-projet.component';
import { DetailProjetComponent } from './composants/detail-projet/detail-projet.component';

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
    ]),
  ],
  exports: [RouterModule],
})
export class GestionProjetRoutingModule {}
