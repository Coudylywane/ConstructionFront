import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ArticleModel } from 'src/app/shared/models/article.model';
import { ArticleService } from '../../services/article.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { MyEncryptionService } from 'src/app/shared/services/my-encryption.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css'],
})
export class ArticleListComponent implements OnInit {
  articles = [] as ArticleModel[];
  newarticle: ArticleModel = new ArticleModel();
  searchForm: any;
  subscriptions = [] as Subscription[];
  page = 0;
  pageSize = 5;
  totalPage = 0;
  disablePrevious = true;
  disableNext = false;
  closeResult = '';
  article: any;
  @BlockUI()
  blockUI!: NgBlockUI;
  show: boolean = false;

  constructor(
    private articleService: ArticleService,
    private router: Router,
    private auth: AuthService,
    private encryptService: MyEncryptionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getArticles(this.page, this.pageSize);
  }

  getArticles(page = 0, size = 2) {
    this.subscriptions.push(
      this.articleService.getAllArticles(page, size).subscribe(
        (data:any) => {
          this.page = data.currentPage;
          this.totalPage = data.totalPages;
          this.articles = data.article;
        },
        (error: any) => {
          this.blockUI.stop();
          //this.router.navigate(['/gestion-article/listArticle']);
        },
        () => {
          this.blockUI.stop();
        }
      )
    );
  }

  precedent() {
    if ((this.page - 1) >= 0) {
      this.page--;
      this.getArticles(this.page, this.pageSize);
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
      this.getArticles(this.page, this.pageSize);
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
    this.getArticles(this.page, this.pageSize);
  }

}
