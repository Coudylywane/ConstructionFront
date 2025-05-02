import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { ActivatedRoute } from '@angular/router';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {
  Article,
  Tache,
  TacheArticle,
} from 'src/app/shared/models/Tache.model';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/authentication/services/auth.service';

@Component({
  selector: 'app-visualiser-planning',
  templateUrl: './visualiser-planning.component.html',
  styleUrls: ['./visualiser-planning.component.css'],
  providers: [MessageService],
})
export class VisualiserPlanningComponent implements OnInit {
  devisId: number | null = null;
  backlog: Tache[] = [];
  todo: Tache[] = [];
  inProgress: Tache[] = [];
  done: Tache[] = [];
  selectedTache: Tache | null = null;
  pourcentageExecution: number = 0;
  articles: Article[] = [];
  selectedArticles: TacheArticle[] = [];
  showModal: boolean = false;
  isClient: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private projetService: ProjectService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.isClient = this.authService.isClient();
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.devisId = +id;
      this.loadTaches();
      this.loadArticles();
    } else {
      console.error("ID du devis non trouvé dans l'URL");
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: "ID du devis non trouvé dans l'URL",
      });
    }
  }

  loadTaches(): void {
    const statuses = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'DONE'];
    statuses.forEach((status) => {
      this.projetService.getTaches(this.devisId!, status).subscribe({
        next: (taches) => {
          if (status === 'BACKLOG') this.backlog = taches;
          if (status === 'TODO') this.todo = taches;
          if (status === 'IN_PROGRESS') this.inProgress = taches;
          if (status === 'DONE') this.done = taches;
          console.log(`Tâches ${status} chargées:`, taches);
        },
        error: (error) => {
          console.error(
            `Erreur lors du chargement des tâches (${status}):`,
            error
          );
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: `Erreur lors du chargement des tâches (${status})`,
          });
        },
      });
    });
  }

  loadArticles(): void {
    this.projetService.getArticlesByDevisId(this.devisId!).subscribe({
      next: (articles) => {
        this.articles = articles;
        console.log('Articles chargés:', articles);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des articles:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur lors du chargement des articles',
        });
      },
    });
  }

  openEditModal(tache: Tache): void {
    console.log('Ouverture du modal pour tâche:', tache);
    this.selectedTache = tache;
    this.pourcentageExecution = tache.pourcentageExecution || 0;
    this.selectedArticles = tache.articles
      ? tache.articles.map((ta) => ({
          articleId: ta.articleId,
          quantiteUtilisee: ta.quantiteUtilisee,
        }))
      : [];
    console.log('Articles sélectionnés initialement:', this.selectedArticles);
    this.showModal = true;
  }

  isArticleSelected(articleId: number): boolean {
    return this.selectedArticles.some((a) => a.articleId === articleId);
  }

  toggleArticleSelection(articleId: number): void {
    if (this.isClient) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Action non autorisée',
        detail: 'Les clients ne peuvent pas modifier les articles',
      });
      return;
    }
    console.log(`Toggle sélection pour article ${articleId}`);
    const index = this.selectedArticles.findIndex(
      (a) => a.articleId === articleId
    );
    if (index >= 0) {
      console.log(`Suppression de l'article ${articleId}`);
      this.selectedArticles.splice(index, 1);
    } else {
      console.log(`Ajout de l'article ${articleId}`);
      this.selectedArticles.push({ articleId, quantiteUtilisee: 0 });
    }
    console.log('selectedArticles après toggle:', this.selectedArticles);
  }

  getArticleQuantity(articleId: number): number {
    const article = this.selectedArticles.find(
      (a) => a.articleId === articleId
    );
    return article ? article.quantiteUtilisee : 0;
  }

  updateArticleQuantity(articleId: number, event: any): void {
    if (this.isClient) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Action non autorisée',
        detail: 'Les clients ne peuvent pas modifier les quantités',
      });
      return;
    }
    const quantite = +event.target.value;
    console.log(`Mise à jour quantité pour article ${articleId}:`, quantite);
    if (quantite < 0) {
      console.warn(`Quantité négative non autorisée pour article ${articleId}`);
      this.messageService.add({
        severity: 'warn',
        summary: 'Avertissement',
        detail: 'La quantité ne peut pas être négative',
      });
      return;
    }
    const maxQuantity =
      this.articles.find((a) => a.id === articleId)?.quantity || 0;
    if (quantite > maxQuantity) {
      console.warn(`Quantité dépasse le stock pour article ${articleId}`);
      this.messageService.add({
        severity: 'warn',
        summary: 'Avertissement',
        detail: `La quantité ne peut pas dépasser ${maxQuantity}`,
      });
      event.target.value = maxQuantity;
      return;
    }
    const index = this.selectedArticles.findIndex(
      (a) => a.articleId === articleId
    );
    if (index >= 0) {
      this.selectedArticles[index].quantiteUtilisee = quantite;
    } else {
      this.selectedArticles.push({ articleId, quantiteUtilisee: quantite });
    }
    console.log('selectedArticles après mise à jour:', this.selectedArticles);
  }

  restrictPercentage(event: any): void {
    if (this.isClient) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Action non autorisée',
        detail:
          "Les clients ne peuvent pas modifier le pourcentage d'exécution",
      });
      return;
    }
    const value = +event.target.value;
    if (value < 0 || value > 100) {
      event.target.value = this.pourcentageExecution;
      this.messageService.add({
        severity: 'warn',
        summary: 'Avertissement',
        detail: 'Le pourcentage doit être entre 0 et 100',
      });
    } else {
      this.pourcentageExecution = value;
    }
  }

  saveTache(): void {
    if (this.isClient) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Action non autorisée',
        detail: 'Les clients ne peuvent pas modifier les tâches',
      });
      return;
    }
    if (!this.selectedTache) {
      console.error('Aucune tâche sélectionnée pour la sauvegarde');
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Aucune tâche sélectionnée',
      });
      return;
    }
    const articlesToSave = this.selectedArticles.filter((a) =>
      this.isArticleSelected(a.articleId)
    );
    console.log('Articles à sauvegarder:', articlesToSave);
    const updatedTache: Tache = {
      ...this.selectedTache,
      pourcentageExecution: this.pourcentageExecution,
      articles: articlesToSave,
    };
    console.log('Tâche à envoyer au backend:', updatedTache);
    this.projetService
      .updateTache(this.selectedTache.id, updatedTache)
      .subscribe({
        next: (response) => {
          console.log('Tâche mise à jour avec succès:', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Tâche mise à jour avec succès',
          });
          this.showModal = false;
          this.selectedTache = null;
          this.selectedArticles = [];
          this.loadTaches();
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour de la tâche:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la mise à jour de la tâche',
          });
        },
      });
  }

  closeModal(): void {
    console.log('Fermeture du modal');
    this.showModal = false;
    this.selectedTache = null;
    this.selectedArticles = [];
  }

  drop(event: CdkDragDrop<Tache[]>): void {
    if (this.isClient) {
      console.log('Déplacement désactivé pour le rôle CLIENT');
      this.messageService.add({
        severity: 'warn',
        summary: 'Action non autorisée',
        detail: "Vous n'avez pas la permission de déplacer les tâches",
      });
      return;
    }
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const movedTache = event.container.data[event.currentIndex];
      const newStatus = this.getStatusFromContainerId(event.container.id);
      movedTache.status = newStatus;
      this.projetService.updateTache(movedTache.id, movedTache).subscribe({
        next: () => {
          console.log(`Tâche ${movedTache.nom} mise à jour vers ${newStatus}`);
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `Tâche déplacée vers ${newStatus}`,
          });
        },
        error: (error) => {
          console.error(
            `Erreur lors de la mise à jour de la tâche ${movedTache.nom}:`,
            error
          );
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors du déplacement de la tâche',
          });
          transferArrayItem(
            event.container.data,
            event.previousContainer.data,
            event.currentIndex,
            event.previousIndex
          );
        },
      });
    }
  }

  private getStatusFromContainerId(containerId: string): string {
    switch (containerId) {
      case 'backlogList':
        return 'BACKLOG';
      case 'todoList':
        return 'TODO';
      case 'inProgressList':
        return 'IN_PROGRESS';
      case 'doneList':
        return 'DONE';
      default:
        return 'BACKLOG';
    }
  }

  downloadPdf(): void {
    this.projetService.downloadPlanningPdf(this.devisId!).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `planning_devis_${this.devisId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Planning téléchargé avec succès',
        });
      },
      error: (error) => {
        console.error('Erreur lors du téléchargement du PDF :', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur lors du téléchargement du PDF',
        });
      },
    });
  }

  getExecutionClass(pourcentage: number): string {
    if (pourcentage <= 33) return 'execution-low';
    if (pourcentage <= 66) return 'execution-medium';
    if (pourcentage <= 99) return 'execution-high';
    return 'execution-complete';
  }
}
