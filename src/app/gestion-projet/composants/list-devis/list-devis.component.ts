import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/authentication/services/auth.service';

@Component({
  selector: 'app-list-devis',
  templateUrl: './list-devis.component.html',
  styleUrls: ['./list-devis.component.css'],
})
export class ListDevisComponent {
  devisList: any;
  page = 0;
  pageSize = 5;
  totalPage = 0;
  disablePrevious = true;
  disableNext = false;
  errorMessage: string |null =null;


  constructor(
    private projectService: ProjectService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getDevis();
  }

  getDevis(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.errorMessage = 'Veuillez vous connecter pour voir vos devis.';
      this.devisList = [];
      this.router.navigate(['/login']);
      return;
    }

    if (this.authService.isClient()) {
      // Utilisateur CLIENT : charger les devis liés à son clientId
      this.projectService.getDevisByClientId(userId).subscribe({
        next: (data) => {
          this.devisList = data;
          this.errorMessage = null;
          console.log('Devis chargés pour client ID ' + userId + ':', data);
        },
        error: (err) => {
          console.error(
            'Erreur lors de la récupération des devis du client',
            err
          );
          this.errorMessage = 'Erreur lors du chargement des devis.';
          this.devisList = [];
        },
      });
    } else {
      // Utilisateur non-CLIENT (ex. ADMIN) : charger tous les devis
      this.projectService.obtenirTousLesDevis().subscribe({
        next: (data) => {
          this.devisList = data;
          this.errorMessage = null;
          console.log(
            'Tous les devis chargés pour utilisateur ID ' + userId + ':',
            data
          );
        },
        error: (err) => {
          console.error(
            'Erreur lors de la récupération de tous les devis',
            err
          );
          this.errorMessage = 'Erreur lors du chargement des devis.';
          this.devisList = [];
        },
      });
    }
  }

  getStatusClass(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE':
        return 'status-en-attente';
      case 'VALIDE':
      case 'VALIDER':
        return 'status-valide';
      case 'ANNULE':
        return 'status-annule';
      default:
        return '';
    }
  }

  precedent() {
    if ((this.page - 1) >= 0) {
      this.page--;
      //this.getDevis(this.page, this.pageSize);
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
      //this.getDevis(this.page, this.pageSize);
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
    //this.getDevis(this.page, this.pageSize);
  }

}

