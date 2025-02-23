import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Projet } from 'src/app/shared/models/projet';

@Component({
  selector: 'app-add-projet',
  templateUrl: './add-projet.component.html',
  styleUrls: ['./add-projet.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class AddProjetComponent {
  projetForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.projetForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDateProvisioning: ['', Validators.required],
      endDate: [''],
    });
  }

  createProject() {
    this.confirmationService.confirm({
      header: 'Création Projet',
      message: 'Voulez-vous confirmer la création du projet?',
      icon: 'pi pi-check-circle',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      acceptButtonStyleClass: 'btn-success',
      rejectButtonStyleClass: 'btn-danger',
      accept: () => {
        this.confirmCreateProject();
      },
    });
  }

  confirmCreateProject() {
    const projet = this.projetForm.value;
    console.log('formulaire', projet);

    const body: Projet = {
      name: projet.name,
      description: projet.description,
      endDateProvisioning: new Date(projet.endDateProvisioning),
      endDate: new Date(projet.endDate),
      startDate: new Date(projet.startDate),
    };

    // Préparation du corps de la requête
    this.projectService.createProject(body).subscribe({
      next: (value) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès ,' + "L'offre a été créé",
        });
        this.router.navigate(['/gestion-projet/listProjet']);
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
