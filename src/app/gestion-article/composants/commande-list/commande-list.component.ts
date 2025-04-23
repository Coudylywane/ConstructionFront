import { Component, OnInit } from '@angular/core';
import { CommandeModel } from 'src/app/shared/models/commande.model';
import { CommandeService } from '../../services/commande.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { MyEncryptionService } from 'src/app/shared/services/my-encryption.service';

@Component({
  selector: 'app-commande-list',
  templateUrl: './commande-list.component.html',
  styleUrls: ['./commande-list.component.scss']
})
export class CommandeListComponent implements OnInit {

  commandes: CommandeModel[] = [];
    searchForm: any;
    subscriptions = [] as Subscription[];
    page = 0;
    pageSize = 5;
    totalPage = 0;
    disablePrevious = true;
    disableNext = false;
    closeResult = '';
    article: any;
    @BlockUI()
    blockUI!: NgBlockUI;
    show: boolean = false;
    selectedArticles: any[] = [];
    selectedCommande: any = null;


  constructor(private commandeService: CommandeService,
      private router: Router,
        private auth: AuthService,
        private encryptService: MyEncryptionService,
        private route: ActivatedRoute

  ) {}

  setSelectedCommande(commande: any): void {
    this.selectedCommande = commande;
  }
  

  ngOnInit(): void {
    this.getCommande(this.page, this.pageSize);
  }

  getCommande(page = 0, size = 2) {
    this.subscriptions.push(
      this.commandeService.getAllCommande(page, size).subscribe(
        (data:any) => {
          console.log('Commandes récupérés:', data);

          this.page = data.currentPage;
          this.totalPage = data.totalPages;
          this.commandes = data.commande;
        },
        (error: any) => {
          this.blockUI.stop();
          //this.router.navigate(['/gestion-article/listCommande']);
        },
        () => {
          this.blockUI.stop();
        }
      )
    );
  }
/******* MODIFICATION COMMANDE ******/

change(id?: number) {
  if (id !== undefined && id !== null) {
    const encryptedId = this.encryptService.encryptText(id.toString());

    console.log("ID original:", id);
    console.log("ID encrypté (avant passage URL):", encryptedId);

    this.router.navigate(['/gestion-article/commande-edit', encryptedId]);
  } else {
    console.error("Erreur : ID invalide pour la modification !");
  }
}



/***** PAGINATION  ********/
precedent() {
  if ((this.page - 1) >= 0) {
    this.page--;
    this.getCommande(this.page, this.pageSize);
    this.disableNext = false;
  } else {
    this.disablePrevious = true;
  }

  if (this.page == 0) {
    this.disablePrevious = true;
  }
}

suivant() {
  if ((this.page + 1) < this.totalPage) {
    this.page++;
    this.getCommande(this.page, this.pageSize);
    this.disablePrevious = false;
  } else {
    this.disableNext = true;
  }

  if (this.page + 1 >= this.totalPage) {
    this.disableNext = true;
    this.disablePrevious = false;
  }
}
onSelectedPageSize(event: any) {
  this.page = 0;
  this.pageSize = Number(event.target.value);
  this.getCommande(this.page, this.pageSize);
}

/***** GENERER BON DE COMMANDE ******/
generateBonDeCommande() {
  //if (this.selectedCommande) {
    // Vous pouvez ici envoyer une requête au backend pour générer le bon de commande
    console.log('Générer le bon de commande pour la commande:', this.selectedCommande);
    
    // Exemple d'appel au service pour générer un bon de commande
    //this.commandeService.generateBonDeCommande(this.selectedCommande.id)
      //.subscribe(response => {
        //}, error => {
        //console.error('Erreur lors de la génération du bon de commande:', error);
     // });
  }

}
