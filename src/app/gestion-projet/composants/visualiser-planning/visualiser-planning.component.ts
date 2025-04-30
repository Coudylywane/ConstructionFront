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

@Component({
  selector: 'app-visualiser-planning',
  templateUrl: './visualiser-planning.component.html',
  styleUrls: ['./visualiser-planning.component.css'],
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

  constructor(
    private route: ActivatedRoute,
    private projetService: ProjectService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.devisId = +id;
      this.loadTaches();
      this.loadArticles();
    } else {
      console.error("ID du projet non trouvé dans l'URL");
    }
  }

  loadTaches(): void {
    const statuses = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'DONE'];
    statuses.forEach((status) => {
      this.projetService.getTaches(this.devisId!, status).subscribe({
        next: (taches) => {
          console.log(`Tâches pour ${status}:`, taches);
          if (status === 'BACKLOG') this.backlog = taches;
          if (status === 'TODO') this.todo = taches;
          if (status === 'IN_PROGRESS') this.inProgress = taches;
          if (status === 'DONE') this.done = taches;
        },
        error: (error) => {
          console.error(
            `Erreur lors du chargement des tâches (${status}):`,
            error
          );
        },
      });
    });
  }

  loadArticles(): void {
    this.projetService.getArticlesByDevisId(this.devisId!).subscribe({
      next: (articles) => {
        this.articles = articles;
        console.log('Articles:', articles);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des articles:', error);
      },
    });
  }

  openEditModal(tache: Tache): void {
    if (tache.status !== 'IN_PROGRESS') {
      alert('Seules les tâches en cours peuvent être modifiées.');
      return;
    }
    this.selectedTache = tache;
    this.pourcentageExecution = tache.pourcentageExecution;
    this.selectedArticles = tache.articles ? [...tache.articles] : [];
    this.showModal = true;
  }

  getArticleQuantity(articleId: number): number {
    const article = this.selectedArticles.find(
      (a) => a.articleId === articleId
    );
    return article ? article.quantiteUtilisee : 0;
  }

  updateArticleQuantity(articleId: number, event: any): void {
    const quantite = +event.target.value;
    const index = this.selectedArticles.findIndex(
      (a) => a.articleId === articleId
    );
    if (index >= 0) {
      this.selectedArticles[index].quantiteUtilisee = quantite;
    } else {
      this.selectedArticles.push({ articleId, quantiteUtilisee: quantite });
    }
  }

  saveTache(): void {
    if (!this.selectedTache) return;
    const updatedTache: Tache = {
      ...this.selectedTache,
      pourcentageExecution: this.pourcentageExecution,
      articles: this.selectedArticles.filter((a) => a.quantiteUtilisee > 0),
    };
    this.projetService
      .updateTache(this.selectedTache.id, updatedTache)
      .subscribe({
        next: () => {
          console.log('Tâche mise à jour avec succès');
          this.showModal = false;
          this.selectedTache = null;
          this.loadTaches();
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour de la tâche:', error);
          alert('Erreur lors de la mise à jour de la tâche.');
        },
      });
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedTache = null;
  }

  drop(event: CdkDragDrop<Tache[]>) {
    console.log('Événement drop:', event);
    if (event.previousContainer === event.container) {
      console.log('Réorganisation dans la même liste:', event.container.id);
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      console.log('Déplacement vers une autre liste:', event.container.id);
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const movedTache = event.container.data[event.currentIndex];
      const newStatus = this.getStatusFromContainerId(event.container.id);
      movedTache.status = newStatus;

      console.log(
        `Mise à jour de la tâche ${movedTache.nom} vers ${newStatus}`
      );
      this.projetService.updateTache(movedTache.id, movedTache).subscribe({
        next: () => {
          console.log(
            `Tâche ${movedTache.nom} mise à jour avec succès vers ${newStatus}`
          );
        },
        error: (error) => {
          console.error(
            `Erreur lors de la mise à jour de la tâche ${movedTache.nom}:`,
            error
          );
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
      },
      error: (error) => {
        console.error('Erreur lors du téléchargement du PDF :', error);
        alert('Une erreur est survenue lors du téléchargement du PDF.');
      },
    });
  }
}
