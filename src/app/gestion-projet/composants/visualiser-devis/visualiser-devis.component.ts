import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-visualiser-devis',
  templateUrl: './visualiser-devis.component.html',
  styleUrls: ['./visualiser-devis.component.css'],
})
export class VisualiserDevisComponent implements OnInit {
  projetId!: number;
  devis: any | null = null;

  constructor(
    private route: ActivatedRoute,
    private projetService: ProjectService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.projetId = +id;
      this.loadDevis();
    } else {
      console.error("ID du projet non trouvé dans l'URL");
    }
  }

  loadDevis(): void {
    this.projetService.getDevisByProjetId(this.projetId).subscribe({
      next: (data) => {
        console.log('Données reçues:', data);
        this.devis = data && data.length > 0 ? data[0] : null;
        console.log('Devis assigné:', this.devis);
        console.log('Statut:', this.devis?.statut);
      },
      error: (error) => {
        console.error('Erreur lors du chargement du devis:', error);
      },
    });
  }

  validerDevis(id: number): void {
    this.projetService.validerDevis(id).subscribe({
      next: (response) => {
        console.log('Devis validé avec succès:', response);
        if (this.devis) {
          this.devis.statut = 'VALIDE';
        }
      },
      error: (error) => {
        console.error('Erreur lors de la validation du devis:', error);
      },
    });
  }

  annulerDevis(id: number): void {
    this.projetService.annulerDevis(id).subscribe({
      next: (response) => {
        console.log('Devis annulé avec succès:', response);
        if (this.devis) {
          this.devis.statut = 'ANNULE';
        }
      },
      error: (error) => {
        console.error("Erreur lors de l'annulation du devis:", error);
      },
    });
  }

  telechargerDevis(): void {
    this.projetService.downloadDevisPdf(this.projetId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `devis_${this.projetId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Erreur lors du téléchargement du devis:', error);
      },
    });
  }

  calculateTotal(): number {
    if (!this.devis?.lignesDevis) return 0;
    return this.devis.lignesDevis.reduce(
      (sum: number, ligne: any) =>
        sum + ligne.quantite * ligne.article.prixAchatUnitaire,
      0
    );
  }

  getStatusClass(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE':
        return 'status-en-attente';
      case 'VALIDE':
        return 'status-valide';
      case 'ANNULE':
        return 'status-annule';
      default:
        return '';
    }
  }
}
