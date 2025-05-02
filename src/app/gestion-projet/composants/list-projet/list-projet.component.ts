import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-list-projet',
  templateUrl: './list-projet.component.html',
  styleUrls: ['./list-projet.component.scss'],
  providers: [MessageService],
})
export class ListProjetComponent implements OnInit {
  projets: any[] = [];
  totalElements: number = 0;
  page: number = 1;
  perPage: number = 10;
  disablePrevious: boolean = true;
  disableNext: boolean = false;
  totalPage: number = 1;
  orderBy: string = 'name';
  direction: string = 'ASC';
  devisExistant: { [key: number]: number | null } = {};
  isClient: boolean = false;
  userId: number | null = null;

  constructor(
    private projetService: ProjectService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.isClient = this.authService.isClient();
    this.userId = this.authService.getUserId();
    this.getProjects();
  }

  getProjects(): void {
    if (this.isClient && this.userId) {
      // Charger les projets du client
      this.projetService
        .getProjetsByClientId(this.userId)
        .subscribe({
          next: (page) => {
            this.projets = page;
            // this.totalElements = page.totalElements;
            // this.totalPage = Math.ceil(this.totalElements / this.perPage);
            this.updatePaginationState();
            this.verifierDevisExistant();
           // console.log('Projets du client chargés:', page.content);
          },
          error: (error) => {
            console.error('Erreur lors de la récupération des projets:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors du chargement des projets',
            });
          },
        });
    } else {
      // Charger tous les projets
      this.projetService.getAllProjets(this.page - 1, this.perPage).subscribe({
        next: (page) => {
          this.projets = page.content;
          this.totalElements = page.totalElements;
          this.totalPage = Math.ceil(this.totalElements / this.perPage);
          this.updatePaginationState();
          this.verifierDevisExistant();
          console.log('Tous les projets chargés:', page.content);
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des projets:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors du chargement des projets',
          });
        },
      });
    }
  }

  editProjet(id: number): void {
    // À implémenter : naviguer vers la page d'édition
    console.log('Edit project with ID:', id);
  }

  deleteProjet(id: number): void {
    // À implémenter : supprimer le projet via API
    console.log('Delete project with ID:', id);
  }

  precedent(): void {
    if (this.page > 1) {
      this.page--;
      this.getProjects();
    }
  }

  suivant(): void {
    if (this.page < this.totalPage) {
      this.page++;
      this.getProjects();
    }
  }

  onSelectedPageSize(event: any): void {
    this.perPage = +event.target.value;
    this.page = 1; // Réinitialiser à la première page
    this.getProjects();
  }

  updatePaginationState(): void {
    this.disablePrevious = this.page === 1;
    this.disableNext = this.page === this.totalPage;
  }

  verifierDevisExistant(): void {
    this.projets.forEach((projet) => {
      this.projetService.verifierDevisExistant(projet.id).subscribe({
        next: (devis) => {
          this.devisExistant[projet.id] = devis[0]?.id || null;
        },
        error: (err) => {
          console.error(
            `Erreur lors de la vérification du devis pour le projet ID: ${projet.id}`,
            err
          );
          this.devisExistant[projet.id] = null;
        },
      });
    });
  }

  telechargerDevis(devisId: number): void {
    if (devisId) {
      this.projetService.downloadDevisPdf(devisId).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `devis_${devisId}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Devis téléchargé avec succès',
          });
        },
        error: (error) => {
          console.error('Erreur lors du téléchargement du devis:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors du téléchargement du devis',
          });
        },
      });
    }
  }

  visualiserDevis(devisId: number): void {
    if (devisId) {
      this.projetService.downloadDevisPdf(devisId).subscribe({
        next: (pdfBlob: Blob) => {
          const fileURL = URL.createObjectURL(pdfBlob);
          window.open(fileURL, '_blank');
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Devis visualisé avec succès',
          });
        },
        error: (error) => {
          console.error('Erreur lors de la visualisation du devis:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la visualisation du devis',
          });
        },
      });
    }
  }
}
