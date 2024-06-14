import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TypeArticleAddComponent } from '../gestion-article/composants/type-article-add/type-article-add.component';
import { AuthGuard } from '../shared/services/auth.guard';
import { TypeFournisseurAddComponent } from './composants/type-fournisseur-add/type-fournisseur-add.component';
import { TypeFournisseurListComponent } from './composants/type-fournisseur-list/type-fournisseur-list.component';
import { CategorieFournisseurAddComponent } from './composants/categorie-fournisseur-add/categorie-fournisseur-add.component';
import { CategorieFournisseurListComponent } from './composants/categorie-fournisseur-list/categorie-fournisseur-list.component';
import { FournisseurAddComponent } from './composants/fournisseur-add/fournisseur-add.component';
import { FournisseurListComponent } from './composants/fournisseur-list/fournisseur-list.component';

const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'addTypeFournisseur',
        component: TypeFournisseurAddComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'listTypeFournisseur',
        component: TypeFournisseurListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'typeFournisseur-edit/:typeFournisseurId',
        component: TypeFournisseurAddComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'addCategorieFournisseur',
        component: CategorieFournisseurAddComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'listCategorieFournisseur',
        component: CategorieFournisseurListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'categorieFournisseur-edit/:categorieFournisseurId',
        component: CategorieFournisseurAddComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'addFournisseur',
        component: FournisseurAddComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'listFournisseur',
        component: FournisseurListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'fournisseur-edit/:fournisseurId',
        component: FournisseurAddComponent,
        canActivate: [AuthGuard],
      },
    ]),
  ],
  exports: [RouterModule],
})
export class GestionFournisseurRoutingModule {}
