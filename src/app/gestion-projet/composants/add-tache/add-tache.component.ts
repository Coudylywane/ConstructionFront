import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Projet } from 'src/app/shared/models/projet';
import { Tache } from 'src/app/shared/models/Tache.model';

@Component({
  selector: 'app-add-tache',
  templateUrl: './add-tache.component.html',
  styleUrls: ['./add-tache.component.scss'],
})
export class AddTacheComponent {
  tacheForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.tacheForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      dureeEstimee: ['', Validators.required],
    });
  }

  confirmCreateProject() {
    const tache = this.tacheForm.value;
    console.log('formulaire', tache);

    const body: Tache = {
      nom: tache.nom,
      description: tache.description,
      dureeEstimee: tache.dureeEstimee,
      statut: 'ENATENTE',
    };

    // Préparation du corps de la requête
    this.projectService.ajouterTache(body).subscribe({
      next: (value) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès ,' + "L'offre a été créé",
        });
        this.router.navigate(['/gestion-projet/listTache']);
        // this.refreshOfferList.emit({ newoffer: true });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur de création',
          detail: "Une erreur est survenue lors de la création de l'offre",
        });
      },
    });
  }
}
