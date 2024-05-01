import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { TypeFournisseurModel } from 'src/app/shared/models/type-fournisseur.model';
import { TypeFournisseurService } from '../../services/type-fournisseur.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { MyEncryptionService } from 'src/app/shared/services/my-encryption.service';

@Component({
  selector: 'app-type-fournisseur-list',
  templateUrl: './type-fournisseur-list.component.html',
  styleUrls: ['./type-fournisseur-list.component.css'],
})
export class TypeFournisseurListComponent {
  typeFournisseurs = [] as TypeFournisseurModel[];
  newTypeFournisseur: TypeFournisseurModel = new TypeFournisseurModel();
  searchForm: any;
  subscriptions = [] as Subscription[];
  page = 0;
  pageSize = 5;
  totalPage = 0;
  disablePrevious = true;
  disableNext = false;
  closeResult = '';
  typeFourniFrom!: FormGroup;
  @BlockUI()
  blockUI!: NgBlockUI;
  show: boolean = false;

  constructor(
    private typeFournisseurService: TypeFournisseurService,
    private router: Router,
    private auth: AuthService,
    private encryptService: MyEncryptionService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getTypeFournisseurs(this.page, this.pageSize);
    // this.loadZones();
  }

  change(id?: Number) {
    this.router.navigate([
      '/gestion-fournisseur/typeFournisseur-edit/',
      this.encryptService.encryptText(Number(id) + ''),
    ]);
  }

  deleteTypeFournisseur(typeId?: Number): void {
    // alert('test');
    this.subscriptions.push(
      this.typeFournisseurService
        .delete(Number(typeId))
        .subscribe(() => this.ngOnInit())
    );
  }

  getTypeFournisseurs(page = 0, size = 2) {
    this.subscriptions.push(
      this.typeFournisseurService.getAllTypeFournisseurs(page, size).subscribe(
        (data: any) => {
          this.page = data.currentPage;
          this.totalPage = data.totalPages;
          this.typeFournisseurs = data.typeFournisseur;
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
      this.getTypeFournisseurs(this.page, this.pageSize);
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
      this.getTypeFournisseurs(this.page, this.pageSize);
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
    this.getTypeFournisseurs(this.page, this.pageSize);
  }
}
