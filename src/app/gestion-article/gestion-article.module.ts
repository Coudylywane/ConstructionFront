import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionArticleRoutingModule } from './gestion-article-routing.module';
import { ArticleAddComponent } from './composants/article-add/article-add.component';
import { ArticleListComponent } from './composants/article-list/article-list.component';
import { SharedModule } from '../shared/shared.module';
import { BlockUIModule } from 'ng-block-ui';


@NgModule({
  declarations: [
    ArticleAddComponent,
    ArticleListComponent
  ],
  imports: [GestionArticleRoutingModule, SharedModule, BlockUIModule.forRoot()],
})
export class GestionArticleModule {}
