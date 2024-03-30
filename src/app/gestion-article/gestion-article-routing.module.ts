import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth.guard';
import { ArticleAddComponent } from './composants/article-add/article-add.component';
import { ArticleListComponent } from './composants/article-list/article-list.component';

const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'addArticle',
        component: ArticleAddComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'listArticle',
        component: ArticleListComponent,
        canActivate: [AuthGuard],
      },
      // {
      //   path: 'patient-edit/:patientId',
      //   component: ProduitAddComponent,
      //   canActivate: [AuthGuard],
      // },
    ]),
  ],
  exports: [RouterModule],
})
export class GestionArticleRoutingModule {}
