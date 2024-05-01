import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionArticleRoutingModule } from './gestion-article-routing.module';
import { ArticleAddComponent } from './composants/article-add/article-add.component';
import { ArticleListComponent } from './composants/article-list/article-list.component';
import { SharedModule } from '../shared/shared.module';
import { BlockUIModule } from 'ng-block-ui';
import { ZoneStockAddComponent } from './composants/zone-stock-add/zone-stock-add.component';
import { ZoneStockListComponent } from './composants/zone-stock-list/zone-stock-list.component';
import { UniteMesureAddComponent } from './composants/unite-mesure-add/unite-mesure-add.component';
import { UniteMesureListComponent } from './composants/unite-mesure-list/unite-mesure-list.component';
import { TypeArticleListComponent } from './composants/type-article-list/type-article-list.component';
import { TypeArticleAddComponent } from './composants/type-article-add/type-article-add.component';


@NgModule({
  declarations: [
    ArticleAddComponent,
    ArticleListComponent,
    ZoneStockAddComponent,
    ZoneStockListComponent,
    UniteMesureAddComponent,
    UniteMesureListComponent,
    TypeArticleListComponent,
    TypeArticleAddComponent
  ],
  imports: [GestionArticleRoutingModule, SharedModule, BlockUIModule.forRoot()],
})
export class GestionArticleModule {}
