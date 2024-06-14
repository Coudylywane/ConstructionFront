import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionFournisseurRoutingModule } from './gestion-fournisseur-routing.module';
import { CategorieFournisseurAddComponent } from './composants/categorie-fournisseur-add/categorie-fournisseur-add.component';
import { CategorieFournisseurListComponent } from './composants/categorie-fournisseur-list/categorie-fournisseur-list.component';
import { TypeFournisseurAddComponent } from './composants/type-fournisseur-add/type-fournisseur-add.component';
import { TypeFournisseurListComponent } from './composants/type-fournisseur-list/type-fournisseur-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { BlockUIModule } from 'ng-block-ui';
import { FournisseurAddComponent } from './composants/fournisseur-add/fournisseur-add.component';
import { FournisseurListComponent } from './composants/fournisseur-list/fournisseur-list.component';


@NgModule({
  declarations: [
    CategorieFournisseurAddComponent,
    CategorieFournisseurListComponent,
    TypeFournisseurAddComponent,
    TypeFournisseurListComponent,
    FournisseurAddComponent,
    FournisseurListComponent,
    
  ],

  imports: [GestionFournisseurRoutingModule, CommonModule ,SharedModule, BlockUIModule.forRoot()],

})
export class GestionFournisseurModule { }
