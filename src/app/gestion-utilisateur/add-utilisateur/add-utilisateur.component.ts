import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilisateurService } from 'src/app/admin/services/utilisateur.service';
import { RoleModel } from 'src/app/shared/models/role.model';
import { ToastService } from 'src/app/shared/services/toast.service';
import { RoleService } from '../role.service';
import { MyEncryptionService } from 'src/app/shared/services/my-encryption.service';
import { UtilisateurModel } from 'src/app/shared/models/utilisateur.model';

@Component({
  selector: 'app-add-utilisateur',
  templateUrl: './add-utilisateur.component.html',
  styleUrls: ['./add-utilisateur.component.css']
})
export class AddUtilisateurComponent implements OnInit {
  utilisateurForm!: FormGroup;
roles: RoleModel[] = [];
isEditing: boolean = false;
utilisateur: UtilisateurModel = new UtilisateurModel();

constructor(
  private fb: FormBuilder,
  private roleService: RoleService,
  private utilisateurService: UtilisateurService,
  private route: ActivatedRoute,
  private router: Router,
  private toastService: ToastService,
  private encryptService: MyEncryptionService,
) {}

ngOnInit() {
  this.initForm();
  this.loadRoles();

/*   const userId = this.route.snapshot.params['userId'];
  if (userId) {
    const decryptedId = this.encryptService.decryptText(userId);
    const id = Number(decryptedId);
    if (!isNaN(id)) {
      this.isEditing = true;
      this.utilisateurService.getUtilisateurById(id).subscribe((user:any) => {
        this.utilisateurForm.patchValue(user);
        this.utilisateurForm.patchValue({
          roles: user.roles.map((role: any) => role.id) // Assure que les rôles sont bien bindés
        });
      });
    }
  } */
}

initForm() {
  this.utilisateurForm = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    login: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    telephoneString: ['', [
      Validators.required,
      Validators.pattern('^(\\+\\d{1,3}|00\\d{1,3})?[0-9]{6,12}$')
    ]],
    role: ['', Validators.required] // tableau d'ID des rôles
  });
}

loadRoles() {
  this.roleService.getAllRoles().subscribe((response: any) => {
    console.log(response);
      this.roles = response;
  });
}
addUtilisateur() {

  const formData = this.utilisateurForm.value;
  console.log(formData);
  this.utilisateur.nom= formData.nom,
  this.utilisateur.prenom= formData.prenom,
  this.utilisateur.login= formData.login,
  this.utilisateur.password = formData.password,
  this.utilisateur.telephoneString = formData.telephoneString,
  this.utilisateur.role = new RoleModel();
  console.log(formData.role);
  console.log(this.utilisateur.role);
  this.utilisateur.role.id = formData.role;
  this.utilisateurService.addUtilisateur(this.utilisateur).subscribe({
    next: (res : any) => {
      console.log(res);
      this.toastService.showSuccess("Utilisateur ajouté avec succès !");
      this.router.navigate(['/gestion-utilisateur/listUtilisateur']);
    },
    error: (err : any) => {
      console.error(err);
      this.toastService.showError("Erreur lors de l'ajout de l'utilisateur !");
    }
  });
}

validNom() {
  return this.utilisateurForm.get('nom')?.invalid && this.utilisateurForm.get('nom')?.touched;
}

validPrenom() {
  return this.utilisateurForm.get('prenom')?.invalid && this.utilisateurForm.get('prenom')?.touched;
}

validEmail() {
  return this.utilisateurForm.get('login')?.invalid && this.utilisateurForm.get('login')?.touched;
}

validPassword() {
  return this.utilisateurForm.get('password')?.invalid && this.utilisateurForm.get('password')?.touched;
}

validRole() {
  return this.utilisateurForm.get('role')?.invalid && this.utilisateurForm.get('role')?.touched;
}
validTelephone(): boolean {
  const tel = this.utilisateurForm.get('telephoneString');
  return !!tel && tel.invalid && (tel.dirty || tel.touched);
}



}
