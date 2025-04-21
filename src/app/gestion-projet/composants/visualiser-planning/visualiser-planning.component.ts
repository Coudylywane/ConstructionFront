import { Component } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-visualiser-planning',
  templateUrl: './visualiser-planning.component.html',
  styleUrls: ['./visualiser-planning.component.css'],
})
export class VisualiserPlanningComponent {
  taches: any[] = [];
  devisId: number | null = null;

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
    this.getTaches();
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
}
