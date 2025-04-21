import { Component, OnInit } from '@angular/core';
import { CommandeModel } from 'src/app/shared/models/commande.model';
import { CommandeService } from '../../services/commande.service';

@Component({
  selector: 'app-commande-list',
  templateUrl: './commande-list.component.html',
  styleUrls: ['./commande-list.component.scss']
})
export class CommandeListComponent implements OnInit {

  commandes: CommandeModel[] = [];

  constructor(private commandeService: CommandeService) {}

  ngOnInit() {
    //this.commandeService.getAllCommandes().subscribe(data => {
      //this.commandes = data;
    //});
  }
}
