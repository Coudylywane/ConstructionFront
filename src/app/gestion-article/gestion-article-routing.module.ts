import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth.guard';
import { ArticleAddComponent } from './composants/article-add/article-add.component';
import { ArticleListComponent } from './composants/article-list/article-list.component';
import { ZoneStockListComponent } from './composants/zone-stock-list/zone-stock-list.component';
import { ZoneStockAddComponent } from './composants/zone-stock-add/zone-stock-add.component';
import { UniteMesureListComponent } from './composants/unite-mesure-list/unite-mesure-list.component';
import { UniteMesureAddComponent } from './composants/unite-mesure-add/unite-mesure-add.component';
import { TypeArticleListComponent } from './composants/type-article-list/type-article-list.component';
import { TypeArticleAddComponent } from './composants/type-article-add/type-article-add.component';

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
      {
        path: 'listZoneStock',
        component: ZoneStockListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'addZoneStock',
        component: ZoneStockAddComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'zone-edit/:zoneId',
        component: ZoneStockAddComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'listUniteMesure',
        component: UniteMesureListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'addUniteMesure',
        component: UniteMesureAddComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'uniteMesure-edit/:uniteId',
        component: UniteMesureAddComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'listTypeArticle',
        component: TypeArticleListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'addTypeArticle',
        component: TypeArticleAddComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'typeArticle-edit/:uniteId',
        component: TypeArticleAddComponent,
        canActivate: [AuthGuard],
      },
    ]),
  ],
  exports: [RouterModule],
})
export class GestionArticleRoutingModule {}
