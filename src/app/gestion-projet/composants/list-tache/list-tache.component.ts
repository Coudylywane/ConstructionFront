import { Component } from '@angular/core';
import { Tache } from 'src/app/shared/models/Tache.model';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-list-tache',
  templateUrl: './list-tache.component.html',
  styleUrls: ['./list-tache.component.css'],
})
export class ListTacheComponent {
  taches: Tache[] = [];
  errorMessage: string = '';

  constructor(private projectService : ProjectService) {}

  ngOnInit(): void {
    this.chargerTaches();
  }

  chargerTaches() {
    this.projectService.listerTaches().subscribe({
      next: (data) => {
        this.taches = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des tâches', error);
        this.errorMessage = 'Erreur lors du chargement des tâches';
      },
    });
  }
}
