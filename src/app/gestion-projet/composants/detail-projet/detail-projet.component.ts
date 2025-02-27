import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Projet, Validation } from 'src/app/shared/models/projet';
import { ProjectService } from '../../services/project.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-detail-projet',
  templateUrl: './detail-projet.component.html',
  styleUrls: ['./detail-projet.component.css'],
})
export class DetailProjetComponent {
  projet: any; // Remplacez par votre modèle de données approprié
  devisExistant: boolean = false; // Initialisation de la propriété

  validation!: Validation;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private projetService: ProjectService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.projetService.getProjetById(+id).subscribe((projet) => {
        console.log(projet);

        this.projet = projet;
        this.devisExistant = projet.devis.length; // Définir `devisExistant` si le devis existe
      });
    }
  }

  validateProject(status: string): void {
    if (this.projet?.id) {
      console.log('ff', status);
      this.projetService.validateProject(this.projet.id, status).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Le projet a été validé avec succès.',
          });
          // Mettre à jour le statut du projet dans l'interface
          if (this.projet) {
            this.projet.status = status;
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail:
              "Une erreur s'est produite lors de la validation du projet.",
          });
        },
      });
    }
  }

  visualiserDevis(projetId: number) {
    this.projetService.downloadDevisPdf(projetId).subscribe(
      (pdfBlob: Blob) => {
        const fileURL = URL.createObjectURL(pdfBlob);
        window.open(fileURL, '_blank'); // Ouvre le PDF dans un nouvel onglet
      },
      (error) => {
        console.error('Erreur lors de la génération du devis : ', error);
      }
    );
  }

  validerDevis(id: number) {
    this.projetService.validerDevis(id).subscribe({
      next: (response) => {
        console.log('Devis validé avec succès :', response);
      },
      error: (error) => {
        console.error('Erreur lors de la validation du devis :', error);
      },
    });
  }

  annulerDevis(id: number) {
    this.projetService.annulerDevis(id).subscribe({
      next: (response) => {
        console.log('Devis validé avec succès :', response);
      },
      error: (error) => {
        console.error('Erreur lors de la validation du devis :', error);
      },
    });
  }
}
