import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/authentication/services/auth.service';
// Initialization for ES Users


@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }

  logout() {
    this.auth.logout();
  }

}
