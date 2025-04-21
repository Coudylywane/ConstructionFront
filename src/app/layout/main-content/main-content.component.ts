import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { RoleModel } from 'src/app/shared/models/role.model';
// Initialization for ES Users


@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {

  constructor(private auth: AuthService) { }
  roles : RoleModel[] = [];


hasRole(roleName: string): boolean {
  return this.roles.some(role => role.libelle?.toUpperCase() === roleName.toUpperCase());
}

hasAnyRole(...roleNames: string[]): boolean {
  return this.roles.some(role =>
    role.libelle !== undefined && roleNames.includes(role.libelle)
  );
}


  ngOnInit(): void {
    this.roles = this.auth.getCurrentUserRoles();
    console.log('Rôles utilisateur :', this.roles);
  }

  logout() {
    this.auth.logout();
  }

}
