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
  styleUrls: ['./article-list.component.scss'],
})
export class ArticleListComponent implements OnInit {
  articles: ArticleModel[] = [];
  newarticle: ArticleModel = new ArticleModel();
  searchForm: any;
  subscriptions: Subscription[] = [];
  page = 0;
  pageSize = 4;
  totalPage = 0;
  disablePrevious = true;
  disableNext = false;
  closeResult = '';
  article: any;
  @BlockUI() blockUI!: NgBlockUI;
  show: boolean = false;
  selectedArticles: any[] = [];

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

  change(id?: number) {
    if (id !== undefined && id !== null) {
      const encryptedId = this.encryptService.encryptText(id.toString());

      console.log("ID original:", id);
      console.log("ID encrypté (avant passage URL):", encryptedId);

      this.router.navigate(['/gestion-article/article-edit', encryptedId]);
    } else {
      console.error("Erreur : ID invalide pour la modification !");
    }
  }

  getArticles(page: number = 0, size: number = 2) {
    this.blockUI.start('Chargement des articles...');
    this.subscriptions.push(
      this.articleService.getAllArticles(page, size).subscribe(
        (data: any) => {
          // Mise à jour de la pagination
          this.page = data.currentPage;
          this.totalPage = data.totalPages;
          this.articles = data.article;
        },
        (error: any) => {
          console.error('Erreur lors de la récupération des articles', error);
        },
        () => {
          this.blockUI.stop(); // Assure-toi que le blocage soit arrêté
        }
      )
    );
  }

  precedent() {
    if (this.page > 0) {
      this.page--;
      this.getArticles(this.page, this.pageSize);
      this.disableNext = false;
    } else {
      this.disablePrevious = true;
    }
  }

  suivant() {
    if (this.page + 1 < this.totalPage) {
      this.page++;
      this.getArticles(this.page, this.pageSize);
      this.disablePrevious = false;
    } else {
      this.disableNext = true;
    }
  }

  onSelectedPageSize(event: any) {
    const selectedPageSize = Number(event.target.value);
    if (!isNaN(selectedPageSize)) {
      this.pageSize = selectedPageSize;
      this.page = 0; // Réinitialise la page pour la nouvelle taille
      this.getArticles(this.page, this.pageSize);
    }
  }

  toggleSelection(article: any) {
    if (!article.id) return;

    const index = this.selectedArticles.findIndex(a => a.id === article.id);
    if (index > -1) {
      this.selectedArticles.splice(index, 1);
    } else {
      this.selectedArticles.push(article);
    }
  }

  isSelected(id?: number): boolean {
    if (!id) return false;
    return this.selectedArticles.some(a => a.id === id);
  }

  commanderSelection() {
    console.log('Articles à commander :', this.selectedArticles);
    // Exemple : redirection ou appel d’un service
    this.router.navigate(['/gestion-article/addCommande'], {
      state: { articles: this.selectedArticles }
    });
  }
}
