import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AuthGuard } from "../shared/services/auth.guard";
import { AjoutUserComponent } from "./components/utilisateurs/ajout-user/ajout-user.component";
import { ListUserComponent } from "./components/utilisateurs/list-user/list-user.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'ajoutUser',
        component: AjoutUserComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'listUser',
        component: ListUserComponent,
        canActivate: [AuthGuard]
      },
    ])
  ],
  exports: [
    RouterModule
  ]
})

export class AdminRoutingModule {}
