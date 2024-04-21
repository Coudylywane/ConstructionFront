import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { UniteMesureModel } from 'src/app/shared/models/unite-mesure.model';
import { MyEncryptionService } from 'src/app/shared/services/my-encryption.service';
import { UniteMesureService } from '../../services/unite-mesure.service';

@Component({
  selector: 'app-unite-mesure-list',
  templateUrl: './unite-mesure-list.component.html',
  styleUrls: ['./unite-mesure-list.component.css'],
})
export class UniteMesureListComponent {
  uniteMesures = [] as UniteMesureModel[];
  newUniteMesure: UniteMesureModel = new UniteMesureModel();
  searchForm: any;
  subscriptions = [] as Subscription[];
  page = 0;
  pageSize = 5;
  totalPage = 0;
  disablePrevious = true;
  disableNext = false;
  closeResult = '';
  archiveZone = new UniteMesureModel();
  article: any;
  zoneFrom!: FormGroup;
  @BlockUI()
  blockUI!: NgBlockUI;
  show: boolean = false;

  constructor(
    private uniteMesureService: UniteMesureService,
    private router: Router,
    private auth: AuthService,
    private encryptService: MyEncryptionService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getUniteMesures(this.page, this.pageSize);
    // this.loadZones();
  }

  change(id?: Number) {
    this.router.navigate([
      '/gestion-article/uniteMesure-edit/',
      this.encryptService.encryptText(Number(id) + ''),
    ]);
  }

  deleteUniteMesure(uniteId?: Number): void {
    // alert('test');
    this.subscriptions.push(
      this.uniteMesureService
        .delete(Number(uniteId))
        .subscribe(() => this.ngOnInit())
    );
  }

  getUniteMesures(page = 0, size = 2) {
    this.subscriptions.push(
      this.uniteMesureService.getAllUniteMesures(page, size).subscribe(
        (data: any) => {
          this.page = data.currentPage;
          this.totalPage = data.totalPages;
          this.uniteMesures = data.uniteMesure;
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
      this.getUniteMesures(this.page, this.pageSize);
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
      this.getUniteMesures(this.page, this.pageSize);
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
    this.getUniteMesures(this.page, this.pageSize);
  }
}
