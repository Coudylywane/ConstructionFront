import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainContentComponent } from './layout/main-content/main-content.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: MainContentComponent,
    children: [
      // {
      //   path: '',
      //   redirectTo: 'gestion-article/listArticle',
      //   pathMatch: 'full',
      // },
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
    path: 'login',
    loadChildren: () =>
      import('./authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
