import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { CategorieFournisseurModel } from 'src/app/shared/models/categorie-fournisseur.model';
import { CategorieFourisseurService } from '../../services/categorie-fourisseur.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { MyEncryptionService } from 'src/app/shared/services/my-encryption.service';

@Component({
  selector: 'app-categorie-fournisseur-list',
  templateUrl: './categorie-fournisseur-list.component.html',
  styleUrls: ['./categorie-fournisseur-list.component.css'],
})
export class CategorieFournisseurListComponent {
  categorieFournisseurs = [] as CategorieFournisseurModel[];
  newTypeFournisseur: CategorieFournisseurModel =
    new CategorieFournisseurModel();
  searchForm: any;
  subscriptions = [] as Subscription[];
  page = 0;
  pageSize = 5;
  totalPage = 0;
  disablePrevious = true;
  disableNext = false;
  closeResult = '';
  categorieFourniFrom!: FormGroup;
  @BlockUI()
  blockUI!: NgBlockUI;
  show: boolean = false;

  constructor(
    private categorieFournisseurService: CategorieFourisseurService,
    private router: Router,
    private auth: AuthService,
    private encryptService: MyEncryptionService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getCategorieFournisseurs(this.page, this.pageSize);
    // this.loadZones();
  }

  change(id?: Number) {
    this.router.navigate([
      '/gestion-fournisseur/categorieFournisseur-edit/',
      this.encryptService.encryptText(Number(id) + ''),
    ]);
  }

  deleteTypeFournisseur(typeId?: Number): void {
    // alert('test');
    this.subscriptions.push(
      this.categorieFournisseurService
        .delete(Number(typeId))
        .subscribe(() => this.ngOnInit())
    );
  }

  getCategorieFournisseurs(page = 0, size = 2) {
    this.subscriptions.push(
      this.categorieFournisseurService
        .getAllCategorieFournisseurs(page, size)
        .subscribe(
          (data: any) => {
            this.page = data.currentPage;
            this.totalPage = data.totalPages;
            this.categorieFournisseurs = data.categorieFournisseur;
          },
          (error: any) => {
            this.blockUI.stop();
          },
          () => {
            this.blockUI.stop();
          }
        )
    );
  }

  precedent() {
    if (this.page - 1 >= 0) {
      this.page--;
      this.getCategorieFournisseurs(this.page, this.pageSize);
      this.disableNext = false;
    } else {
      this.disablePrevious = true;
    }

    if (this.page == 0) {
      this.disablePrevious = true;
    }
  }

  suivant() {
    if (this.page + 1 < this.totalPage) {
      this.page++;
      this.getCategorieFournisseurs(this.page, this.pageSize);
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
    this.getCategorieFournisseurs(this.page, this.pageSize);
  }
}

