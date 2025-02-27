import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { Projet } from 'src/app/shared/models/projet';
import { MyEncryptionService } from 'src/app/shared/services/my-encryption.service';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-list-projet',
  templateUrl: './list-projet.component.html',
  styleUrls: ['./list-projet.component.css'],
})
export class ListProjetComponent {
  projets: any[] = [];
  totalElements: number = 0;
  page: number = 1;
  perPage: number = 10;
  disablePrevious: boolean = true;
  disableNext: boolean = false;
  totalPage: number = 1;
  orderBy: string = 'name'; // Default field to order by
  direction: string = 'ASC'; // Default sorting direction
  args: any;

  constructor(private projetService: ProjectService) {}

  ngOnInit(): void {
    this.getProjects(this.args); // Fetch projects when the component initializes
  }

  getProjects(args: any): void {
    this.projetService.getAllProjets(this.page = 0, this.perPage = 50).subscribe({
      next: (page) => {
        this.projets = page.content;
        this.totalElements = page.totalElements;
        this.totalPage = Math.ceil(this.totalElements / this.perPage);
        this.updatePaginationState();
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des projets:', error);
      },
    });
  }

  editProjet(id: number): void {
    // Navigate to the edit page or open a modal
    console.log('Edit project with ID:', id);
  }

  deleteProjet(id: number): void {
    // Call the API to delete the project
    console.log('Delete project with ID:', id);
  }

  precedent(): void {
    if (this.page > 1) {
      this.page--;
      this.getProjects(this.args);
    }
  }

  suivant(): void {
    if (this.page < this.totalPage) {
      this.page++;
      this.getProjects(this.args);
    }
  }

  onSelectedPageSize(event: any): void {
    this.perPage = +event.target.value;
    this.getProjects(this.args);
  }

  updatePaginationState(): void {
    this.disablePrevious = this.page === 1;
    this.disableNext = this.page === this.totalPage;
  }
}