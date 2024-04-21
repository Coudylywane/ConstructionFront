import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { TypeArticleModel } from 'src/app/shared/models/type-article.model';
import { TypeArticleService } from '../../services/type-article.service';
import { MyEncryptionService } from 'src/app/shared/services/my-encryption.service';

@Component({
  selector: 'app-type-article-list',
  templateUrl: './type-article-list.component.html',
  styleUrls: ['./type-article-list.component.css']
})
export class TypeArticleListComponent {
  typeArticles = [] as TypeArticleModel[];
  newTypeArticle: TypeArticleModel = new TypeArticleModel();
  searchForm: any;
  subscriptions = [] as Subscription[];
  page = 0;
  pageSize = 5;
  totalPage = 0;
  disablePrevious = true;
  disableNext = false;
  closeResult = '';
  zoneFrom!: FormGroup;
  @BlockUI()
  blockUI!: NgBlockUI;
  show: boolean = false;

  constructor(
    private typeArticleService: TypeArticleService,
    private router: Router,
    private auth: AuthService,
    private encryptService: MyEncryptionService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getTypeArticles(this.page, this.pageSize);
    // this.loadZones();
  }

  change(id?: Number) {
    this.router.navigate([
      '/gestion-article/typeArticle-edit/',
      this.encryptService.encryptText(Number(id) + ''),
    ]);
  }

  deleteTypeArticle(typeId?: Number): void {
    // alert('test');
    this.subscriptions.push(
      this.typeArticleService
        .delete(Number(typeId))
        .subscribe(() => this.ngOnInit())
    );
  }

  getTypeArticles(page = 0, size = 2) {
    this.subscriptions.push(
      this.typeArticleService.getAllTypeArticles(page, size).subscribe(
        (data: any) => {
          this.page = data.currentPage;
          this.totalPage = data.totalPages;
          this.typeArticles = data.typeArticle;
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
      this.getTypeArticles(this.page, this.pageSize);
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
      this.getTypeArticles(this.page, this.pageSize);
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
    this.getTypeArticles(this.page, this.pageSize);
  }
}

