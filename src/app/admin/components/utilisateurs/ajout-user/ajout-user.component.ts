import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ajout-user',
  templateUrl: './ajout-user.component.html',
  styleUrls: ['./ajout-user.component.scss']
})
export class AjoutUserComponent implements OnInit {

  userForm!: FormGroup;
  constructor() {
   
  }

  ngOnInit(): void {
  }

 

  // validNom() {
  //   const nom = this.habitant.controls['nom'];
  //   return nom.touched && nom.hasError('required');
  // }
  // validPrenom() {
  //   const nom = this.habitant.controls['prenom'];
  //   return nom.touched && nom.hasError('required');
  // }

  // validTelephone() {
  //   const telephone = this.habitant.controls['telephone'];
  //   return telephone.touched && telephone.errors?telephone.errors['pattern'] : false;
  // }
}
