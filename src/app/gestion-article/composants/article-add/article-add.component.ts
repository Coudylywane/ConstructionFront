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
    console.log('Valeurs du formulaire:', this.articleForm.value);

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
    
      // Vérifier que c'est un tableau et récupérer le premier élément
      typeArticle: Array.isArray(this.articleForm.value.typeArticle) && this.articleForm.value.typeArticle.length > 0 
        ? { id: this.articleForm.value.typeArticle[0].id } 
        : null,
    
      uniteMesure: this.articleForm.value.uniteMesure ? { id: this.articleForm.value.uniteMesure.id } : null,
      zoneStock: this.articleForm.value.zoneStock ? { id: this.articleForm.value.zoneStock.id } : null,
    };
    
    // Vérification des champs obligatoires
    if (!articleData.zoneStock || !articleData.zoneStock.id) {
      console.error("Erreur : Zone de stockage obligatoire !");
      this.toastService.showError("La zone de stockage est obligatoire !");
      return;
    }
    if (!articleData.uniteMesure || !articleData.uniteMesure.id) {
      console.error("Erreur : Unité de mesure obligatoire !");
      this.toastService.showError("L'unité de mesure est obligatoire !");
      return;
    }
    if (!articleData.typeArticle || !articleData.typeArticle.id) {
      console.error("Erreur : Type d'article obligatoire !");
      this.toastService.showError("Le type d'article est obligatoire !");
      return;
    }
    

    console.log("Données envoyées :", articleData);  // Vérification finale

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
                typeArticleId: new FormControl(type.typeArticle ,[Validators.required]),
                prixReel: new FormControl(type.prixReel,[Validators.required]),
                zoneStockId: new FormControl(type.zoneStock ,[ Validators.required]),  
                uniteMesureId : new FormControl(type.uniteMesure, [ Validators.required]),
                //typeArticle : new FormControl(type. [ Validators.required] 
                zoneStock: [null, Validators.required],  
                uniteMesure: [null, Validators.required],
                typeArticle: [null, Validators.required]
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
            zoneStockId : new FormControl(null),
            uniteMesureId : new FormControl(null),
            //typeArticle: new FormControl(null),
            zoneStock: [null, Validators.required],  
            uniteMesure: [null, Validators.required],
            typeArticle: [null, Validators.required]
            
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
        //console.log("Données récupérées:", response);
        if (response && Array.isArray(response.typeArticle)) {
          this.typeArticles = response.typeArticle;          
          //console.log("typeArticles :", this.typeArticles); 

        } else {
          console.log("Aucune donnée pour Unitée");
          this.typeArticles = [];

        }
      },
      (error) => {
        console.error("Erreur lors de la récupération des Untées", error);
      }
    );  
   

     this.zoneStockService.getAllZones().subscribe(
      (response) => {
        //console.log("Données récupérées:", response);
        if (response && Array.isArray(response.zone)) {
          this.zoneStocks = response.zone;          
         //console.log("zoneStocks :", this.zoneStocks); // Vérifie que zoneStocks contient bien un tableau d'objets

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
    const articleId = this.route.snapshot.params['articleId']; // Récupérer l'ID chiffré de l'URL
    console.log("🔹 ID chiffré récupéré de l'URL:", articleId);

    if (articleId) {
    const decryptedId = this.encryptService.decryptText(articleId);
    console.log("🔹 ID déchiffré:", decryptedId);

    const typeIdDecript = Number(decryptedId);
    if (!isNaN(typeIdDecript)) {
    this.isEditing = true;
    this.subscriptions.push(
      this.articleService.getArticleById(typeIdDecript).subscribe(
        (data: any) => {
          this.Article = data;
          console.log("Article récupéré:", this.Article);
        },
        (error: any) => {
          console.error(" Erreur lors de la récupération de l'article :", error);
        },
        () => {
          this.initForms(this.Article);
        }
      )
    );
  } else {
    console.error("Erreur : ID déchiffré invalide !");
  }
}

    
  }

  onSubmit(){
    this.router.navigate(['/gestion-article/listArticle']);
  }
  
  clear(){
   
    this.articleForm.reset();
  }


//////////////////////:::::::Validation des champs::::::::::

  validDesignation() {
    const designation = this.articleForm.controls['designation'];
    return designation.touched && designation.hasError('required');
  }

  validDescription() {
    const description = this.articleForm.controls['description'];
    return description.touched && description.hasError('required');
  }
  validCode() {
    const description = this.articleForm.controls['description'];
    return description.touched && description.hasError('required');
  }
  validPoids() {
    const poids = this.articleForm.controls['poids'];
    return poids.touched && poids.hasError('required');
  }
  validPrixAchatUnitaire() {
    const prixAchatUnitaire = this.articleForm.controls['prixAchatUnitaire'];
    return prixAchatUnitaire.touched && prixAchatUnitaire.hasError('required');
  }
  validPrixReel() {
    const prixReel = this.articleForm.controls['prixReel'];
    return prixReel.touched && prixReel.hasError('required');
  }
  validPrixReviens() {
    const prixReviensUnitaire = this.articleForm.controls['prixReviensUnitaire'];
    return prixReviensUnitaire.touched && prixReviensUnitaire.hasError('required');
  }
  validPrixDevis() {
    const prixDevis = this.articleForm.controls['prixDevis'];
    return prixDevis.touched && prixDevis.hasError('required');
  }
  validPrixVente() {
    const prixVenteUnitaire = this.articleForm.controls['prixVenteUnitaire'];
    return prixVenteUnitaire.touched && prixVenteUnitaire.hasError('required');
  }
  validQuantite() {
    const quantity = this.articleForm.controls['quantity'];
    return quantity.touched && quantity.hasError('required');
  }
   
}
