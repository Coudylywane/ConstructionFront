import { NgModule } from '@angular/core';
import { AjoutUserComponent } from './components/utilisateurs/ajout-user/ajout-user.component';
import { ListUserComponent } from './components/utilisateurs/list-user/list-user.component';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { BlockUIModule } from 'ng-block-ui';



@NgModule({
  declarations: [
    AjoutUserComponent,
    ListUserComponent,
   
  ],
  imports: [
    SharedModule,
    AdminRoutingModule,
    BlockUIModule.forRoot()
  ]
})
export class AdminModule { }
