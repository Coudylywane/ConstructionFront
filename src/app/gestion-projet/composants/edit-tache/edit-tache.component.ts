import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

interface Tache {
  id: number;
  nom: string;
  description: string;
  dureeEstimee: number;
  dateDebut: string;
  dateFin: string;
  status: string;
  pourcentageExecution: number;
  articles: TacheArticle[];
}

interface TacheArticle {
  articleId: number;
  quantiteUtilisee: number;
}

interface Article {
  id: number;
  nom: string;
}

@Component({
  selector: 'app-edit-tache-modal',
  templateUrl: './edit-tache.component.html',
})
export class EditTacheComponent {
  @Input() tache: Tache | null = null;
  @Input() articles: Article[] = [];
  pourcentageExecution: number = 0;
  selectedArticles: TacheArticle[] = [];

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    if (this.tache) {
      this.pourcentageExecution = this.tache.pourcentageExecution;
      this.selectedArticles = this.tache.articles
        ? [...this.tache.articles]
        : [];
    }
  }

  getArticleQuantity(articleId: number): number {
    const article = this.selectedArticles.find(
      (a) => a.articleId === articleId
    );
    return article ? article.quantiteUtilisee : 0;
  }

  updateArticleQuantity(articleId: number, event: any): void {
    const quantite = +event.target.value;
    const index = this.selectedArticles.findIndex(
      (a) => a.articleId === articleId
    );
    if (index >= 0) {
      this.selectedArticles[index].quantiteUtilisee = quantite;
    } else {
      this.selectedArticles.push({ articleId, quantiteUtilisee: quantite });
    }
  }

  save(): void {
    this.activeModal.close({
      pourcentageExecution: this.pourcentageExecution,
      articles: this.selectedArticles.filter((a) => a.quantiteUtilisee > 0),
    });
  }
}
