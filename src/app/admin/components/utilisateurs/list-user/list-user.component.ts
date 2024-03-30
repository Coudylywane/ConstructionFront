import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { UtilisateurService } from 'src/app/admin/services/utilisateur.service';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { fade, fadeSlide } from 'src/app/shared/animations/animations';
import { UtilisateurModel } from 'src/app/shared/models/utilisateur.model';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss'],
  animations: [fade, fadeSlide]
})
export class ListUserComponent implements OnInit, OnDestroy {

  closeResult = '';
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

  getUsers(page: number = 0, size: number = 5) {

    this.subscriptions.push(
      this.utilisateurService.getAllUsers( page, size).subscribe(
        (data: any) => {
          console.log(data);
          this.utilisateurs = data.users;
          this.page = data.currentPage;
          this.totalPage = data.totalPages;
        }, (error) => {console.log(error);}
      )
    );
  }

}
