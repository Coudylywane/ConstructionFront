import { Component } from '@angular/core';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-list-devis',
  templateUrl: './list-devis.component.html',
  styleUrls: ['./list-devis.component.css'],
})
export class ListDevisComponent {
  devisList: any;

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
}

