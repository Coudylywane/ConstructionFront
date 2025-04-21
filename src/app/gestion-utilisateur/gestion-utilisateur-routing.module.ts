import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUtilisateurComponent } from './add-utilisateur/add-utilisateur.component';
import { ListeUtilisateurComponent } from './liste-utilisateur/liste-utilisateur.component';

const routes: Routes = [
  { path: 'add-user', component: AddUtilisateurComponent },
  { path: 'liste-user', component: ListeUtilisateurComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionUtilisateurRoutingModule { }
