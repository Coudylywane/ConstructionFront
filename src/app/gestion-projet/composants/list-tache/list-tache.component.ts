import { Component } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { Tache } from 'src/app/shared/models/Tache.model';

@Component({
  selector: 'app-list-tache',
  templateUrl: './list-tache.component.html',
  styleUrls: ['./list-tache.component.css'],
})
export class ListTacheComponent {
  taches: Tache[] = [];
  errorMessage: string = '';
  page = 0;
  pageSize = 5;
  totalPage = 0;
  disablePrevious = true;
  disableNext = false;
  constructor(private projectService: ProjectService) {}

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


  precedent() {
    if ((this.page - 1) >= 0) {
      this.page--;
      //this.getDevis(this.page, this.pageSize);
      this.disableNext = false;
    } else {
      this.disablePrevious = true;
    }

    if (this.page == 0) {
      this.disablePrevious = true;
    }
  }

  suivant() {
    if ((this.page + 1) < this.totalPage) {
      this.page++;
      //this.getDevis(this.page, this.pageSize);
      this.disablePrevious = false;
    } else {
      this.disableNext = true;
    }

    if (this.page + 1 >= this.totalPage) {
      this.disableNext = true;
      this.disablePrevious = false;
    }
  }

  onSelectedPageSize(event: any) {
    this.page = 0;
    this.pageSize = Number(event.target.value);
    //this.getDevis(this.page, this.pageSize);
  }
}
