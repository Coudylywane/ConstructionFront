import { Component } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { ActivatedRoute } from '@angular/router';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-visualiser-planning',
  templateUrl: './visualiser-planning.component.html',
  styleUrls: ['./visualiser-planning.component.css'],
})
export class VisualiserPlanningComponent {
  taches: any[] = [];
  devisId: number | null = null;
  backlog: any[] = [];
  todo: any[] = [];
  inProgress: any[] = [];
  done: any[] = [];
  donne: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private projetService: ProjectService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.devisId = +id;
    } else {
      console.error("ID du projet non trouvé dans l'URL");
      // Rediriger l'utilisateur ou gérer l'erreur
    }
    this.loadTache();
    this.loadTaches();
  }

  getTaches(): void {
    this.projetService.getPlanningByDevisId(this.devisId!).subscribe(
      (data) => {
        console.log(data);
        this.taches = data && data.length > 0 ? data[0] : null;
      },
      (error) => {
        console.error('Error loading devis:', error);
      }
    );
  }

  loadTache(): void {
    this.projetService.getPlanningByDevisId(this.devisId!).subscribe({
      next: (donnes) => {
        this.donne = donnes;
      console.log('taches:', this.donne);
      
      },
    });
  }
  loadTaches(): void {
    // Charger les tâches pour chaque statut
    this.projetService
      .getTachesByStatus(this.devisId!, 'BACKLOG')
      .subscribe((taches) => {
        this.backlog = taches;
      });
    this.projetService
      .getTachesByStatus(this.devisId!, 'TODO')
      .subscribe((taches) => {
        this.todo = taches;
      });
    this.projetService
      .getTachesByStatus(this.devisId!, 'IN_PROGRESS')
      .subscribe((taches) => {
        this.inProgress = taches;
      });
    this.projetService
      .getTachesByStatus(this.devisId!, 'DONE')
      .subscribe((taches) => {
        this.done = taches;
      });
  }

  // Gérer le drag-and-drop
  drop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      // Réorganiser dans la même liste
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // Déplacer d'une liste à une autre
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Mettre à jour le statut de la tâche déplacée
      const movedTache = event.container.data[event.currentIndex];
      const newStatus = this.getStatusFromContainerId(event.container.id);
      movedTache.status = newStatus;

      // Appeler l'API pour mettre à jour le statut
      this.projetService
        .updateTache(movedTache.id, movedTache)
        .subscribe(() => {
          console.log(`Tâche ${movedTache.nom} déplacée vers ${newStatus}`);
        });
    }
  }

  // Mapper l'ID du conteneur au statut
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
        // Créer un lien de téléchargement
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `planning_devis_${this.devisId}.pdf`; // Nom du fichier
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url); // Nettoyer l'URL
      },
      error: (error) => {
        console.error('Erreur lors du téléchargement du PDF :', error);
        alert('Une erreur est survenue lors du téléchargement du PDF.');
      },
    });
  }
}
