import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { FournisseurModel } from 'src/app/shared/models/fournisseur.model';
import { MyEncryptionService } from 'src/app/shared/services/my-encryption.service';
import { FournisseurService } from '../../services/fournisseur.service';


@Component({
  selector: 'app-fournisseur-list',
  templateUrl: './fournisseur-list.component.html',
  styleUrls: ['./fournisseur-list.component.css'],
})
export class FournisseurListComponent {
  fournisseurs = [] as FournisseurModel[];
  newFournisseur: FournisseurModel = new FournisseurModel();
  searchForm: any;
  subscriptions = [] as Subscription[];
  page = 0;
  pageSize = 5;
  totalPage = 0;
  disablePrevious = true;
  disableNext = false;
  closeResult = '';
  FourniFrom!: FormGroup;
  @BlockUI()
  blockUI!: NgBlockUI;
  show: boolean = false;

  constructor(
    private fournisseurService: FournisseurService,
    private router: Router,
    private auth: AuthService,
    private encryptService: MyEncryptionService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getFournisseurs(this.page, this.pageSize);
    // this.loadZones();
  }

  change(id?: Number) {
    this.router.navigate([
      '/gestion-fournisseur/Fournisseur-edit/',
      this.encryptService.encryptText(Number(id) + ''),
    ]);
  }

  deleteFournisseur(typeId?: Number): void {
    // alert('test');
    this.subscriptions.push(
      this.fournisseurService
        .delete(Number(typeId))
        .subscribe(() => this.ngOnInit())
    );
  }

  getFournisseurs(page = 0, size = 2) {
    this.subscriptions.push(
      this.fournisseurService.getAllFournisseurs(page, size).subscribe(
        (data: any) => {
          this.page = data.currentPage;
          this.totalPage = data.totalPages;
          this.fournisseurs = data.fournisseur;
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
      this.getFournisseurs(this.page, this.pageSize);
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
      this.getFournisseurs(this.page, this.pageSize);
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
    this.getFournisseurs(this.page, this.pageSize);
  }
}
