import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionUtilisateurRoutingModule } from './gestion-utilisateur-routing.module';
import { AddUtilisateurComponent } from './add-utilisateur/add-utilisateur.component';
import { ListeUtilisateurComponent } from './liste-utilisateur/liste-utilisateur.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfilComponent } from './profil/profil.component';


@NgModule({
  declarations: [
    AddUtilisateurComponent,
    ListeUtilisateurComponent,
    ProfilComponent
  ],
  imports: [
    CommonModule,
    GestionUtilisateurRoutingModule,
    ReactiveFormsModule
  ]
})
export class GestionUtilisateurModule { }
