import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from 'src/app/gestion-article/services/article.service';
import { ProjectService } from '../../services/project.service';
import { Subscription } from 'rxjs';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-generer-devis',
  templateUrl: './generer-devis.component.html',
  styleUrls: ['./generer-devis.component.css'],
})
export class GenererDevisComponent implements OnInit {
  projetId!: number;
  articles: any[] = [];
  articlesSelectionnes: any[] = [];
  subscriptions = [] as Subscription[];
  page = 0;
  pageSize = 5;
  totalPage = 0;
  @BlockUI()
  blockUI!: NgBlockUI;
  show: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService,
    private devisService: ProjectService
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID du projet depuis l'URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.projetId = +id;
    } else {
      console.error("ID du projet non trouvé dans l'URL");
      // Rediriger l'utilisateur ou gérer l'erreur
    }
    this.getArticles(this.page, this.pageSize);
  }

  // Ajouter un article au devis
  ajouterAuDevis(article: any) {
    if (article.quantite > 0) {
      // Vérifier si l'article est déjà dans la liste
      const existingArticle = this.articlesSelectionnes.find(
        (a) => a.id === article.id
      );

      if (existingArticle) {
        // Mettre à jour la quantité si l'article est déjà sélectionné
        existingArticle.quantite += article.quantite;
      } else {
        // Ajouter l'article à la liste des articles sélectionnés
        this.articlesSelectionnes.push({
          ...article,
          quantite: article.quantite,
        });
      }

      // Réinitialiser la quantité dans la liste des articles disponibles
      article.quantite = 0;
    }
  }

  // Valider le devis
  // validerDevis() {
  //   const devis = {
  //     articles: this.articlesSelectionnes,
  //     projetId: this.projetId,
  //   };

  //   // Appeler l'API pour créer le devis
  //   this.devisService.creerDevis(devis).subscribe(
  //     (response) => {
  //       console.log('Devis créé avec succès:', response);
  //       this.router.navigate(['/gestion-projet/listProjet']); // Rediriger vers la liste des projets
  //     },
  //     (error) => {
  //       console.error('Erreur lors de la création du devis:', error);
  //     }
  //   );
  // }

  validerDevis() {
    const devis = {
      lignesDevis: this.articlesSelectionnes.map((article) => ({
        article: {
          id: article.id, // Assurez-vous que l'ID de l'article est correct
          designation: article.designation,
        },
        quantite: article.quantite,
      })),
      projetId: this.projetId,
    };

    this.devisService.creerDevis(devis).subscribe(
      (response) => {
        console.log('Devis créé avec succès:', response);
        this.router.navigate(['/gestion-projet/listProjet']); // Rediriger vers la liste des projets
      },
      (error) => {
        console.error('Erreur lors de la création du devis:', error);
      }
    );
  }

  getArticles(page = 0, size = 2) {
    this.subscriptions.push(
      this.articleService.getAllArticles(page, size).subscribe(
        (data: any) => {
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
}
