import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  err = '';
  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService
    ) {
      this.form = this.formBuilder.group({
        login: [null, Validators.compose([Validators.required])],
        password: [null, Validators.compose([Validators.required])]
      }); }

  ngOnInit(): void {
  }

  login() {
    const val = this.form?.value;
    if (val.login && val.password) {

      this.auth.login(val).then(
        (x) => {
          if (x) {
            this.err = 'Login ou mot de passe incorrect';
            // this.progressbar = false;
          } else {
            this.err = '';
          }
        });
    } else {
      this.err = 'Tous les champs sont obligatoires';
    }
  }

}
