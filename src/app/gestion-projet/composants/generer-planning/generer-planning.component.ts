import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Tache } from 'src/app/shared/models/Tache.model';

@Component({
  selector: 'app-generer-planning',
  templateUrl: './generer-planning.component.html',
  styleUrls: ['./generer-planning.component.css'],
})
export class GenererPlanningComponent {
  devisId!: number;
  taches: Tache[] = [];
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    // this.devisId = +this.route.snapshot.paramMap.get('id');
    this.chargerTaches(); // Charger les tâches du devis
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

  onTacheSelectionChange(tache: Tache): void {
    if (!tache.selected) {
      tache.dateDebut = '';
      tache.dateFin = '';
    }
  }

  genererPlanning(): void {
    const selectedTaches = this.taches.filter((tache) => tache.selected);
    if (selectedTaches.length === 0) {
      alert('Veuillez sélectionner au moins une tâche.');
      return;
    }

    // Vérifier que les dates sont renseignées pour toutes les tâches sélectionnées
    for (const tache of selectedTaches) {
      if (!tache.dateDebut || !tache.dateFin) {
        alert(
          'Veuillez renseigner les dates pour toutes les tâches sélectionnées.'
        );
        return;
      }
    }

    // Envoyer les données au backend pour générer le planning
    console.log('Tâches sélectionnées:', selectedTaches);
    alert('Planning généré avec succès !');
  }
}
