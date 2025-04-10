import { Component, Inject, LOCALE_ID, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { finalize, Subscription } from 'rxjs';
import { ArticleModel } from 'src/app/shared/models/article.model';
import { ArticleService } from '../../services/article.service';
import { MyEncryptionService } from 'src/app/shared/services/my-encryption.service';
import { TypeArticleModel } from 'src/app/shared/models/type-article.model';
import { UniteMesureModel } from 'src/app/shared/models/unite-mesure.model';
import { ZoneStockModel } from 'src/app/shared/models/zone-stock.model';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UniteMesureService } from '../../services/unite-mesure.service';
import { TypeArticleService } from '../../services/type-article.service';
import { ZoneStockService } from '../../services/zone-stock.service';


@Component({
  selector: 'app-article-add',
  templateUrl: './article-add.component.html',
  styleUrls: ['./article-add.component.scss']
})
export class ArticleAddComponent {

  articleForm!: FormGroup;
  Article : ArticleModel = new ArticleModel();
  subscriptions = [] as Subscription[];
  error = '';
  zoneStocks = [] as ZoneStockModel[];
  uniteMesures = [] as UniteMesureModel[];
  typeArticles = [] as TypeArticleModel[];
  isEditing: boolean = false;
 
  constructor(
    private router :Router,
    private encryptService: MyEncryptionService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private articleService : ArticleService,
    private fb: FormBuilder,
    private uniteMesureService: UniteMesureService,
    private typeArticleService: TypeArticleService,
    private zoneStockService: ZoneStockService,

  ){}
//////////////// //////       AJOUT ARTICLE...............
addArticle() {
  if (this.articleForm.valid) {
   // console.log('Valeurs du formulaire:', this.articleForm.value);

    const articleData: any = {
      designation: this.articleForm.value.designation,
      description: this.articleForm.value.description,
      code: this.articleForm.value.code,
      poids: this.articleForm.value.poids,
      prixDevis: this.articleForm.value.prixDevis,
      prixAchatUnitaire: this.articleForm.value.prixAchatUnitaire,
      prixReviensUnitaire: this.articleForm.value.prixReviensUnitaire,
      prixVenteUnitaire: this.articleForm.value.prixVenteUnitaire,
      quantity: this.articleForm.value.quantity,
      prixReel: this.articleForm.value.prixReel,
      zoneStock: this.articleForm.value.zoneStock ,
      uniteMesure: this.articleForm.value.uniteMesure  ,
      typeArticle: this.articleForm.value.typeArticle ,
    };

    //console.log('Données envoyées au backend :', articleData);
      const uniteMesure: UniteMesureModel = new UniteMesureModel();
      uniteMesure.id = this.articleForm.value.uniteMesureId; // Assurez-vous que l'ID est correct et non undefined
      articleData.uniteMesure = uniteMesure;
     
      console.log(this.articleForm.value.uniteMesureId);

      const zoneStock: ZoneStockModel = new ZoneStockModel();
      zoneStock.id = this.articleForm.value.zoneStockId; 
      articleData.zoneStock = zoneStock;

      const typeArticle: TypeArticleModel = new TypeArticleModel();
      typeArticle.id = this.articleForm.value.typeArticleId; 
      articleData.typeArticle = typeArticle;

    this.articleService.addArticle(articleData).subscribe({
      next: response => {
        console.log('Article ajouté avec succès', response);
        this.router.navigate(['/gestion-article/listArticle']);
      },
      error: error => {
        console.error("Erreur lors de l'ajout de l'article", error);
        this.toastService.showError("Échec de l'ajout de l'article !");
      }
    
    });
  }
}



    private initForms(type: ArticleModel) {
        if (type) {
            this.articleForm = this.fb.group({
                code: new FormControl(type.code, [Validators.required]),
                designation: new FormControl(type.designation, [Validators.required]),
                description: new FormControl(type.description, [Validators.required]),
                poids: new FormControl(type.poids, [Validators.required]),
                prixAchatUnitaire: new FormControl(type.prixAchatUnitaire, [Validators.required]),
                prixDevis: new FormControl(type.prixDevis, [Validators.required]),
                prixReviensUnitaire: new FormControl(type.prixReviensUnitaire, [Validators.required]),
                prixVenteUnitaire: new FormControl(type.prixVenteUnitaire, [Validators.required]),
                quantity: new FormControl(type.quantity, [Validators.required]),
                typeArticleId: ['', Validators.required],
                prixReel: [null, Validators.required],
                zoneStock:  ['', Validators.required],  
                uniteMesure : ['', Validators.required],
                typeArticle : ['', Validators.required] 
          });
        } else {
          this.articleForm = this.fb.group({
            code: new FormControl(null, [Validators.required]),
            designation: new FormControl(null, [Validators.required]),
            description: new FormControl(null, [Validators.required]),
            poids: new FormControl(null, [Validators.required]),
            prixAchatUnitaire: new FormControl(null, [Validators.required]),
            prixDevis: new FormControl(null, [Validators.required]),
            prixReviensUnitaire: new FormControl(null, [Validators.required]),
            prixVenteUnitaire: new FormControl(null, [Validators.required]),
            quantity: new FormControl(null, [Validators.required]),
            prixReel: [null, Validators.required],
            typeArticleId: new FormControl(null, [Validators.required]),
            zoneStock : new FormControl(null),
            uniteMesure : new FormControl(null),
            typeArticle: new FormControl(null),
            
          });
        }
      }

      getArticleById(typeId: any) {
        this.articleService
          .getArticleById(typeId)
          .subscribe((typeDetails: any) => {
            this.articleForm.patchValue({
              
              code: typeDetails.code,
              designation: typeDetails.designation,
              description: typeDetails.description,
              poids: typeDetails.poids,
              prixAchatUnitaire: typeDetails.prixAchatUnitaire,
              prixReviensUnitaire: typeDetails.prixReviensUnitaire,
              prixVenteUnitaire: typeDetails.prixVenteUnitaire,
              quantity: typeDetails.quantity,
              prixReel: typeDetails.prixReel,
              typeArticleId: typeDetails.typeArticleId,
              uniteMesureId: typeDetails.uniteMesureId,
              zoneStockId: typeDetails.zoneStockId
            });
          });
      }
    
  ngOnInit() {

    //console.log(this.addArticle);
    this.uniteMesureService.getAllUniteMesures().subscribe(
      (response) => {
        if (response && Array.isArray(response.uniteMesure)) {
          this.uniteMesures = response.uniteMesure;          

        } else {
          this.uniteMesures = [];

        }
      },
      (error) => {
        console.error("Erreur lors de la récupération des Untées", error);
      }
    );  

    this.typeArticleService.getAllTypeArticles().subscribe(
      (response) => {
        console.log("Données récupérées:", response);
        if (response && Array.isArray(response.typeArticle)) {
          this.typeArticles = response.typeArticle;          
          console.log("typeArticles :", this.typeArticles); 

        } else {
          console.log("Aucune donnée pour Unitée");
          this.typeArticles = [];

        }
      },
      (error) => {
        console.error("Erreur lors de la récupération des Untées", error);
      }
    );  
   
    this.typeArticleService
    .getAllTypeArticles()
    .subscribe((typeArticle) => {
      //console.log(typeArticle);
      this.typeArticles= typeArticle || [];
      //console.log("Données après affectation :", this.typeArticles);
    });


     this.zoneStockService.getAllZones().subscribe(
      (response) => {
        //console.log("Données récupérées:", response);
        if (response && Array.isArray(response.zone)) {
          this.zoneStocks = response.zone;          
         // console.log("zoneStocks :", this.zoneStocks); // Vérifie que zoneStocks contient bien un tableau d'objets

        } else {
          console.log("Aucune donnée pour zones");
          this.zoneStocks = [];

        }
      },
      (error) => {
        console.error("Erreur lors de la récupération des zones", error);
      }
    );  

    this.initForms(new ArticleModel());
    this.articleForm = this.fb.group({
      designation: ['', Validators.required],
      description: ['', Validators.required],
      code: ['', Validators.required],
      poids: [null, Validators.required],
      prixDevis: [null, Validators.required],
      prixAchatUnitaire: [null, Validators.required],
      prixReviensUnitaire: [null, Validators.required],
      quantity: [null, Validators.required],
      prixVenteUnitaire: [null, Validators.required],
      prixReel: [null ],
      zoneStock:['', Validators.required],
      uniteMesure:['', Validators.required],
      typeArticle:['', Validators.required],
      zoneStockId: [null], 
      uniteMesureId: [null],  
      typeArticleId: [null]
    });
    const articleId = this.route.snapshot.params['articleId']; // Récupérez l'ID de la zone depuis les paramètres de route
    if (articleId) {
      const typeIdDecript = Number(
        this.encryptService.decryptText(articleId)
      );
      // Si un ID de type fournisseur est présent dans les paramètres de route, cela signifie que le formulaire est utilisé pour la modification
      this.isEditing = true;
      this.subscriptions.push(
        this.articleService.getArticleById(typeIdDecript).subscribe(
          (data: any) => {
            this.Article = data;
          },
          (error: any) => {},
          () => {
            this.initForms(this.Article);
          }
        )
      );
    }
    
  }

  onSubmit(){
    this.router.navigate(['/gestion-article/listArticle']);
  }
  
  clear(){
   
    this.articleForm.reset();
  }
   
}
