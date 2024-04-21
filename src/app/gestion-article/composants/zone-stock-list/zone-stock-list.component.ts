import { Component } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { ZoneStockModel } from 'src/app/shared/models/zone-stock.model';
import { ZoneStockService } from '../../services/zone-stock.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { MyEncryptionService } from 'src/app/shared/services/my-encryption.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-zone-stock-list',
  templateUrl: './zone-stock-list.component.html',
  styleUrls: ['./zone-stock-list.component.css'],
})
export class ZoneStockListComponent {
  zones = [] as ZoneStockModel[];
  newzone: ZoneStockModel = new ZoneStockModel();
  searchForm: any;
  subscriptions = [] as Subscription[];
  page = 0;
  pageSize = 5;
  totalPage = 0;
  disablePrevious = true;
  disableNext = false;
  closeResult = '';
  archiveZone = new ZoneStockModel();
  article: any;
  zoneFrom!: FormGroup;
  @BlockUI()
  blockUI!: NgBlockUI;
  show: boolean = false;

  constructor(
    private zoneStockService: ZoneStockService,
    private router: Router,
    private auth: AuthService,
    private encryptService: MyEncryptionService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getZones(this.page, this.pageSize);
    // this.loadZones();
  }

  change(id?: Number) {
    this.router.navigate([
      '/gestion-article/zone-edit/',
      this.encryptService.encryptText(Number(id) + ''),
    ]);
  }

  deleteZone(zoneId?: Number): void {
   // alert('test');
    this.subscriptions.push(
      this.zoneStockService
        .deleteZone(Number(zoneId))
        .subscribe(() => this.ngOnInit())
    );
  }



  // this.zoneStockService.deleteZone(Number(zoneId)).subscribe(() => this.ngOnInit())

  // loadZones() {
  //   this.zoneStockService.getAllZones().subscribe(
  //     (data: ZoneStockModel[]) => {
  //       this.zones = data;
  //     },
  //     (error) => {
  //       // Gérez les erreurs de chargement des zones
  //     }
  //   );
  // }

  getZones(page = 0, size = 2) {
    this.subscriptions.push(
      this.zoneStockService.getAllZones(page, size).subscribe(
        (data: any) => {
          this.page = data.currentPage;
          this.totalPage = data.totalPages;
          this.zones = data.zone;
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
      this.getZones(this.page, this.pageSize);
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
      this.getZones(this.page, this.pageSize);
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
    this.getZones(this.page, this.pageSize);
  }
}
