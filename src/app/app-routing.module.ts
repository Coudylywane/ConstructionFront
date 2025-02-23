import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainContentComponent } from './layout/main-content/main-content.component';

const routes: Routes = [
  //{
  // path: '',
  //redirectTo: 'login',
  //pathMatch: 'full',
  //},
  // {
  //   path: '**',
  //   component: NotFoundComponent,
  // },
  {
    path: '',
    component: MainContentComponent,
    children: [
      {
        path: 'gestion-article',
        loadChildren: () =>
          import('./gestion-article/gestion-article.module').then(
            (m) => m.GestionArticleModule
          ),
      },
    ],
  },
  {
    path: '',
    component: MainContentComponent,
    children: [
      {
        path: 'gestion-fournisseur',
        loadChildren: () =>
          import('./gestion-fournisseur/gestion-fournisseur.module').then(
            (m) => m.GestionFournisseurModule
          ),
      },
    ],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: '',
    component: MainContentComponent,
    children: [
      {
        path: 'gestion-projet',
        loadChildren: () =>
          import('./gestion-projet/gestion-projet.module').then(
            (m) => m.GestionProjetModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
