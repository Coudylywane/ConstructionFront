import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/authentication/services/auth.service';

@Component({
  selector: 'app-list-devis',
  templateUrl: './list-devis.component.html',
  styleUrls: ['./list-devis.component.css'],
})
export class ListDevisComponent implements OnInit {
  devisList: any[] = [];
  errorMessage: string | null = null;

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

    if (!this.authService.isClient()) {
      this.errorMessage = 'Accès réservé aux clients.';
      this.devisList = [];
      return;
    }

    this.projectService.getDevisByClientId(userId).subscribe({
      next: (data) => {
        this.devisList = data;
        this.errorMessage = null;
        console.log('Devis chargés pour client ID ' + userId + ':', data);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des devis', err);
        this.errorMessage = 'Erreur lors du chargement des devis.';
        this.devisList = [];
      },
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
