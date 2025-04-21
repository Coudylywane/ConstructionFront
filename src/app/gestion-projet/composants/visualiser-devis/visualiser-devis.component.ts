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
  devis: any; // Replace with your Devis model/interface

  constructor(
    private route: ActivatedRoute,
    private projetService: ProjectService // Inject your service to fetch devis data
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.projetId = +id;
    } else {
      console.error("ID du projet non trouvé dans l'URL");
      // Rediriger l'utilisateur ou gérer l'erreur
    }
    this.loadDevis();
  }

  loadDevis(): void {
    this.projetService.getDevisByProjetId(this.projetId).subscribe(
      (data) => {
        console.log(data);
        this.devis = data && data.length > 0 ? data[0] : null;
        console.log('Devis assigned:', this.devis);
        console.log('Statut:', this.devis?.statut);
      },
      (error) => {
        console.error('Error loading devis:', error);
      }
    );
  }

  // validerDevis(): void {
  //   this.projetService.validerDevis(this.projetId).subscribe(
  //     () => {
  //       alert('Devis validé avec succès');
  //       // Optionally redirect or update UI
  //     },
  //     (error) => {
  //       console.error('Error validating devis:', error);
  //     }
  //   );
  // }

  // annulerDevis(): void {
  //   this.projetService.annulerDevis(this.projetId).subscribe(
  //     () => {
  //       alert('Devis annulé avec succès');
  //       // Optionally redirect or update UI
  //     },
  //     (error) => {
  //       console.error('Error canceling devis:', error);
  //     }
  //   );
  // }

  visualiserDevis() {
    this.projetService.downloadDevisPdf(this.projetId).subscribe(
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

  telechargerDevis() {
    this.projetService.downloadDevisPdf(this.projetId).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `devis_${this.projetId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
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
}
