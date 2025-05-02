import { Component, Inject, LOCALE_ID, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { finalize, Subscription,forkJoin } from 'rxjs';
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
import { FournisseurService } from 'src/app/gestion-fournisseur/services/fournisseur.service';
import { FournisseurModel } from 'src/app/shared/models/fournisseur.model';



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
  fournisseurs = [] as FournisseurModel[];
  isEditing: boolean = false;
  currentStep: number = 1;
 
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
    private fournisseurService: FournisseurService,

  ){}
//////////////////////AJOUT ARTICLE...............
addArticle() {
  if (this.articleForm.valid) {
    console.log('Valeurs du formulaire:', this.articleForm.value);

    const articleData: any = {
      designation: this.articleForm.value.designation,
      description: this.articleForm.value.description,
      poids: this.articleForm.value.poids,
      prixDevis: this.articleForm.value.prixDevis,
      prixAchatUnitaire: this.articleForm.value.prixAchatUnitaire,
      prixReviensUnitaire: this.articleForm.value.prixReviensUnitaire,
      prixVenteUnitaire: this.articleForm.value.prixVenteUnitaire,
      quantity: this.articleForm.value.quantity,
      prixReel: this.articleForm.value.prixReel,
      quantiteSeuil: this.articleForm.value.quantiteSeuil,

      typeArticle: this.articleForm.value.typeArticle 
        ? { id: this.articleForm.value.typeArticle.id } 
        : null,    
    
      uniteMesure: this.articleForm.value.uniteMesure 
        ? { id: this.articleForm.value.uniteMesure.id } 
        : null,

      zoneStock: this.articleForm.value.zoneStock 
        ? { id: this.articleForm.value.zoneStock.id } 
        : null,

      fournisseur: this.articleForm.value.fournisseur 
        ? { id: this.articleForm.value.fournisseur.id } 
        : null,
    };

    // Vérification des champs obligatoires
    if (!articleData.zoneStock?.id) {
      this.toastService.showError("La zone de stockage est obligatoire !");
      return;
    }
    if (!articleData.uniteMesure?.id) {
      this.toastService.showError("L'unité de mesure est obligatoire !");
      return;
    }
    if (!articleData.typeArticle?.id) {
      this.toastService.showError("Le type d'article est obligatoire !");
      return;
    }
    if (!articleData.fournisseur?.id) {
      this.toastService.showError("Un fournisseur est obligatoire !");
      return;
    }

    console.log("Données envoyées :", articleData);

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

compareById(o1: any, o2: any): boolean {
  return o1 && o2 ? o1.id === o2.id : o1 === o2;
}

private initForms(type?: ArticleModel) {
  // Si 'type' est undefined, initialiser les valeurs avec un objet vide
  const defaultType: ArticleModel = type ?? new ArticleModel();

  this.articleForm = this.fb.group({
    code: new FormControl({ value: defaultType.code ?? null, disabled: this.isEditing }, [Validators.required]),
    designation: new FormControl(defaultType.designation ?? null, [Validators.required]),
    description: new FormControl(defaultType.description ?? null, [Validators.required]),
    poids: new FormControl(defaultType.poids ?? null, [Validators.required]),
    prixAchatUnitaire: new FormControl(defaultType.prixAchatUnitaire ?? null, [Validators.required]),
    prixDevis: new FormControl(defaultType.prixDevis ?? null, [Validators.required]),
    prixReviensUnitaire: new FormControl(defaultType.prixReviensUnitaire ?? null, [Validators.required]),
    prixVenteUnitaire: new FormControl(defaultType.prixVenteUnitaire ?? null, [Validators.required]),
    quantity: new FormControl(defaultType.quantity ?? null, [Validators.required]),
    prixReel: new FormControl(defaultType.prixReel ?? null, [Validators.required]),
    quantiteSeuil: new FormControl(defaultType.quantiteSeuil ?? null, [Validators.required]),

    // Relations (objets complets attendus)
    typeArticle: new FormControl(defaultType.typeArticle ?? null, [Validators.required]),
    uniteMesure: new FormControl(defaultType.uniteMesure ?? null, [Validators.required]),
    zoneStock: new FormControl(defaultType.zoneStock ?? null, [Validators.required]),
    fournisseur: new FormControl(defaultType.fournisseur ?? null),
  });
}



getArticleById(typeId: any) {
  this.articleService.getArticleById(typeId).subscribe((typeDetails: any) => {
    this.articleForm.patchValue({
      designation: typeDetails.designation,
      description: typeDetails.description,
      poids: typeDetails.poids,
      prixAchatUnitaire: typeDetails.prixAchatUnitaire,
      prixReviensUnitaire: typeDetails.prixReviensUnitaire,
      prixVenteUnitaire: typeDetails.prixVenteUnitaire,
      quantity: typeDetails.quantity,
      prixReel: typeDetails.prixReel,
      quantiteSeuil: typeDetails.quantiteSeuil,

      // Ces champs attendent des objets complets (avec id)
      typeArticle: typeDetails.typeArticle,
      uniteMesure: typeDetails.uniteMesure,
      zoneStock: typeDetails.zoneStock,
      fournisseur: typeDetails.fournisseur,
    });
  });
}

    
ngOnInit() {
  const articleId = this.route.snapshot.params['articleId'];
  console.log("🔹 ID chiffré récupéré de l'URL:", articleId);

  // Appels groupés pour charger toutes les listes nécessaires
  forkJoin({
    uniteMesures: this.uniteMesureService.getAllUniteMesures(),
    typeArticles: this.typeArticleService.getAllTypeArticles(),
    zoneStocks: this.zoneStockService.getAllZones(),
    fournisseurs: this.fournisseurService.getAllFournisseurs()
  }).subscribe({
    next: ({ uniteMesures, typeArticles, zoneStocks, fournisseurs }) => {
      this.uniteMesures = uniteMesures.uniteMesure || [];
      this.typeArticles = typeArticles.typeArticle || [];
      this.zoneStocks = zoneStocks.zone || [];
      this.fournisseurs = fournisseurs.fournisseur || [];

      if (articleId) {
        const decryptedId = this.encryptService.decryptText(articleId);
        const typeIdDecript = Number(decryptedId);
        if (!isNaN(typeIdDecript)) {
          this.isEditing = true;
          this.articleService.getArticleById(typeIdDecript).subscribe((data: any) => {
            this.Article = data;

            // Trouver les bonnes références dans les listes
            this.Article.zoneStock = this.zoneStocks.find(z => z.id === data.zoneStock?.id);
            this.Article.uniteMesure = this.uniteMesures.find(u => u.id === data.uniteMesure?.id);
            this.Article.typeArticle = this.typeArticles.find(t => t.id === data.typeArticle?.id);
            this.Article.fournisseur = this.fournisseurs.find(f => f.id === data.fournisseur?.id);

            this.initForms(this.Article);
          });
        } else {
          console.error("Erreur : ID déchiffré invalide !");
        }
      } else {
        this.initForms();
      }
    },
    error: err => {
      console.error("Erreur lors du chargement des données", err);
    }
  });
}



  onSubmit(){
    this.router.navigate(['/gestion-article/listArticle']);
  }
  
  clear(){
   
    this.articleForm.reset();
  }



//////////////////////:::::::Validation des champs::::::::::

validDesignation() {
  return this.articleForm?.controls['designation']?.touched && this.articleForm?.controls['designation']?.hasError('required');
}
validDescription() {
  return this.articleForm?.controls['description']?.touched && this.articleForm?.controls['description']?.hasError('required');
}

 
validCode() {
  const description = this.articleForm?.controls['description'];
  return description?.touched && description?.hasError('required');
}

validPoids() {
  const poids = this.articleForm?.controls['poids'];
  return poids?.touched && poids?.hasError('required');
}

validPrixAchatUnitaire() {
  const prixAchatUnitaire = this.articleForm?.controls['prixAchatUnitaire'];
  return prixAchatUnitaire?.touched && prixAchatUnitaire?.hasError('required');
}

validPrixReel() {
  const prixReel = this.articleForm?.controls['prixReel'];
  return prixReel?.touched && prixReel?.hasError('required');
}

validPrixReviens() {
  const prixReviensUnitaire = this.articleForm?.controls['prixReviensUnitaire'];
  return prixReviensUnitaire?.touched && prixReviensUnitaire?.hasError('required');
}

validPrixDevis() {
  const prixDevis = this.articleForm?.controls['prixDevis'];
  return prixDevis?.touched && prixDevis?.hasError('required');
}

validPrixVente() {
  const prixVenteUnitaire = this.articleForm?.controls['prixVenteUnitaire'];
  return prixVenteUnitaire?.touched && prixVenteUnitaire?.hasError('required');
}

validQuantite() {
  const quantity = this.articleForm?.controls['quantity'];
  return quantity?.touched && quantity?.hasError('required');
}

validQuantiteSeuil() {
  const quantiteSeuil = this.articleForm?.controls['quantiteSeuil'];
  return quantiteSeuil?.touched && quantiteSeuil?.hasError('required');
}

   
}
