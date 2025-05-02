import { Component } from '@angular/core';
import { ProjectService } from '../../services/project.service';

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

  constructor(private projetService: ProjectService) {}

  ngOnInit(): void {
    this.getDevis();
  }

  getDevis(): void {
    this.projetService.obtenirTousLesDevis().subscribe({
      next: (data) => (this.devisList = data),
      error: (err) =>
        console.error('Erreur lors de la récupération des devis', err),
    });
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

