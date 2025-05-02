import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { UtilisateurService } from 'src/app/admin/services/utilisateur.service';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { UtilisateurModel } from 'src/app/shared/models/utilisateur.model';

@Component({
  selector: 'app-liste-utilisateur',
  templateUrl: './liste-utilisateur.component.html',
  styleUrls: ['./liste-utilisateur.component.scss']
})
export class ListeUtilisateurComponent implements OnInit, OnDestroy {

  closeResult = '';
  userId: number | undefined;
  page = 0;
  pageSize = 5;
  totalPage = 0;
  disablePrevious = true;
  disableNext = false;
  searchForm: any;
  deleteForm: any;
  selectedUserArchive!: UtilisateurModel;
  subscriptions = [] as Subscription[];
  public patientForm: any;
  modalRef: any;
  show: boolean = false;
  utilisateurs = [] as UtilisateurModel[];
  @BlockUI()
  blockUI!: NgBlockUI;

  connectedUser = new UtilisateurModel();
  constructor(
    private auth: AuthService,
    private modalService: NgbModal,
    private utilisateurService: UtilisateurService
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    this.getConnectedUser();
    this.initSearchForm();
    this.getUsers(this.page, this.pageSize);
  }

  onDeleteUser(content: any, user: UtilisateurModel) {
    this.initDeleteForm();
    this.selectedUserArchive = user;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  async getConnectedUser() {
    await this.auth.identity().toPromise().then(
      (result: any) => {
        this.connectedUser = result;
      }
    ).catch((error: any) => {console.log('cannot get connected user')})
  }

  initSearchForm() {
    this.searchForm = new FormGroup({
      'filterType': new FormControl(null, Validators.required),
      'searchTerm': new FormControl(null, [Validators.required])
    });
  }

  initDeleteForm() {
    this.deleteForm = new FormGroup({
      'motif': new FormControl(null, Validators.required)
    });
  }

  archiveUser(modal: any) {
    console.log(this.deleteForm.value.motif);
    console.log(this.selectedUserArchive);
    modal.close();
  }

  onSearch() {}
  deleteUser() {
    if (this.userId) {
      this.utilisateurService.deleteUser(this.userId).subscribe(
        (response: any) => {
          console.log('User deleted', response);
        },
        (error: any) => {
          console.error('Error deleting user', error);
        }
      );
    } else {
      console.error('User ID is required');
    }
  }
  confirmDelete(utilisateur: UtilisateurModel): void {
    if (!utilisateur || !utilisateur.id) {
      console.error('Utilisateur invalide');
      return;
    }

    this.utilisateurService.deleteUser(utilisateur.id).subscribe({
      next: () => {
        this.getUsers(this.page, this.pageSize); 
        console.log('Utilisateur supprimé avec succès');
      },
      error: (error) => {
        console.error('Erreur lors de la suppression', error);
      }
    });
  }

  getUsers(page: number = 0, size: number = 5) {

    this.subscriptions.push(
      this.utilisateurService.getAllUsers( page, size).subscribe(
        (data: any) => {
          console.log(data);
          this.utilisateurs = data.user;
          this.page = data.currentPage;
          this.totalPage = data.totalPages;
        }, (error) => {console.log(error);}
      )
    );
  }

  precedent() {
    if ((this.page - 1) >= 0) {
      this.page--;
      this.getUsers(this.page, this.pageSize);
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
      this.getUsers(this.page, this.pageSize);
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
    this.getUsers(this.page, this.pageSize);
  }







}
