import { Component, Inject, LOCALE_ID, Optional } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { ToastService } from 'src/app/shared/services/toast.service';
import { MyEncryptionService } from 'src/app/shared/services/my-encryption.service';
import {
  DATE_PIPE_DEFAULT_TIMEZONE,
  DatePipe,
  formatDate,
} from '@angular/common';
import { FournisseurModel } from 'src/app/shared/models/fournisseur.model';
import { FournisseurService } from '../../services/fournisseur.service';
import { TypeFournisseurService } from '../../services/type-fournisseur.service';
import { TypeFournisseurModel } from 'src/app/shared/models/type-fournisseur.model';
import { CategorieFournisseurModel } from '../../../shared/models/categorie-fournisseur.model';
import { CategorieFourisseurService } from '../../services/categorie-fourisseur.service';

@Component({
  selector: 'app-fournisseur-add',
  templateUrl: './fournisseur-add.component.html',
  styleUrls: ['./fournisseur-add.component.css'],
})
export class FournisseurAddComponent {
  @BlockUI()
  blockUI!: NgBlockUI;

  subscriptions = [] as Subscription[];

  type: FournisseurModel = new FournisseurModel();
  isEditing: boolean = false;
  typeFour: TypeFournisseurModel | undefined;
  fourniFrom!: FormGroup;
  error = '';
  typesFournisseurs = [] as TypeFournisseurModel[];
  categorieFournisseurs = [] as CategorieFournisseurModel[];

  constructor(
    private router: Router,
    private fournisseurService: FournisseurService,
    private toastService: ToastService,
    private typeFournisseurService: TypeFournisseurService,
    private categorieFourisseurService:CategorieFourisseurService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private encryptService: MyEncryptionService,
    @Inject(LOCALE_ID) private locale: string,
    @Inject(DATE_PIPE_DEFAULT_TIMEZONE)
    @Optional()
    private defaultTimezone?: string | null
  ) {}

  ///////////Date pipe///////////////
  transform(
    value: Date | string | number,
    format?: string,
    timezone?: string,
    locale?: string
  ): string | null;
  transform(
    value: null | undefined,
    format?: string,
    timezone?: string,
    locale?: string
  ): null;
  transform(
    value: Date | string | number | null | undefined,
    format?: string,
    timezone?: string,
    locale?: string
  ): string | null;
  transform(
    value: Date | string | number | null | undefined,
    format = 'mediumDate',
    timezone?: string,
    locale?: string
  ): string | null {
    if (value == null || value === '' || value !== value) return null;

    try {
      return formatDate(
        value,
        format,
        locale || this.locale,
        timezone ?? this.defaultTimezone ?? undefined
      );
    } catch (error) {
      throw invalidPipeArgumentError(DatePipe, (error as Error).message);
    }
  }
  ///Validation des champs////////////////::::::

  validNom() {
    const nom = this.fourniFrom.controls['nom'];
    return nom.touched && nom.hasError('required');
  }

  validAdresse() {
    const adresse = this.fourniFrom.controls['adresse'];
    return adresse.touched && adresse.hasError('required');
  }

  validEmail() {
    const email = this.fourniFrom.controls['email'];
    return email.touched && email.hasError('required');
  }

  validTelephone() {
    const telephone = this.fourniFrom.controls['telephone'];
    return telephone.touched && telephone.errors
      ? telephone.errors['pattern']
      : false;
  }

  validSolde() {
    const solde = this.fourniFrom.controls['solde'];
    return solde.touched && solde.value < 0; // Vérifie si le solde est négatif
  }

  validType() {
    const type = this.fourniFrom.controls['type'];
    return type.touched && type.hasError('required');
  }

  validTotalVersement() {
    const totalVersement = this.fourniFrom.controls['totalVersement'];
    return totalVersement.touched && totalVersement.value < 0; // Vérifie si le solde est négatif
  }

  ////////////////Ajout TypeFournisseur///////////////////////

  // addFournisseur() {
  //   if (this.fourniFrom.valid) {
  //     this.blockUI.start('Veuillez patienter....');
  //     this.type.nom = this.fourniFrom.value.nom;
  //     this.type.adresse = this.fourniFrom.value.adresse;
  //     this.type.telephone = this.fourniFrom.value.telephone;
  //     this.type.email = this.fourniFrom.value.email;
  //     this.type.solde = this.fourniFrom.value.solde;
  //     this.type.totalVersement = this.fourniFrom.value.totalVersement;
  //     //this.type.categorie = this.fourniFrom.value.categorie;
  //     // this.type.typeFournisseur: {
  //     //   id: this.fourniFrom.value.typeFournisseurId; // Assurez-vous que l'ID est correct
  //     // }
  //     const typeFournisseur: TypeFournisseurModel = new TypeFournisseurModel();
  //     typeFournisseur.id = this.fourniFrom.value.typeFournisseurId;
  //     this.type.typeFournisseurId = typeFournisseur;
  //     //  this.type.categorie = this.fourniFrom.value.categorieId;

  //     console.log(this.type);

  //     this.subscriptions.push(
  //       this.fournisseurService.addFournisseur(this.type).subscribe(
  //         (data) => {},
  //         (error) => {
  //           this.blockUI.stop();
  //           this.toastService.showErrorToast();
  //         },
  //         () => {
  //           // this.blockUI.stop();
  //           this.onSubmit();
  //           this.toastService.showSuccessToast();
  //           this.clear();
  //         }
  //       )
  //     );
  //   }
  // }
  addFournisseur() {
    if (this.fourniFrom.valid) {
      this.blockUI.start('Veuillez patienter....');
      console.log('Valeurs du formulaire:', this.fourniFrom.value);

      const fournisseur: FournisseurModel = new FournisseurModel();
      fournisseur.nom = this.fourniFrom.value.nom;
      fournisseur.adresse = this.fourniFrom.value.adresse;
      fournisseur.telephone = this.fourniFrom.value.telephone;
      fournisseur.email = this.fourniFrom.value.email;
      fournisseur.solde = this.fourniFrom.value.solde;
      fournisseur.totalVersement = this.fourniFrom.value.totalVersement;

      // console.log(this.fourniFrom.value.typeFournisseurId);
      // Ajoutez ceci avant d'assigner l'ID
      const typeFournisseur: TypeFournisseurModel = new TypeFournisseurModel();
      typeFournisseur.id = this.fourniFrom.value.typeFournisseurId; // Assurez-vous que l'ID est correct et non undefined
      fournisseur.typeFournisseur = typeFournisseur;

      console.log(this.fourniFrom.value.categorieFournisseurId);

      const categorieFournisseur: CategorieFournisseurModel = new CategorieFournisseurModel();
      categorieFournisseur.id = this.fourniFrom.value.categorieFournisseurId;
      fournisseur.categorieFournisseur = categorieFournisseur;

      this.subscriptions.push(
        this.fournisseurService.addFournisseur(fournisseur).subscribe(
          (data) => {
            // Logique en cas de succès
          },
          (error) => {
            this.blockUI.stop();
            this.toastService.showErrorToast();
          },
          () => {
            this.onSubmit();
            this.toastService.showSuccessToast();
            this.clear();
          }
        )
      );
    }
  }

  getFournisseurById(typeId: any) {
    this.fournisseurService
      .getFournisseurById(typeId)
      .subscribe((typeDetails: any) => {
        this.fourniFrom.patchValue({
          nom: typeDetails.nom,
          adresse: typeDetails.adresse,
          email: typeDetails.email,
          telephone: typeDetails.telephone,
          solde: typeDetails.solde,
          totalVersement: typeDetails.totalVersement,
          typeFournisseurId: typeDetails.typeFournisseurId,
          categorieFournisseurId: typeDetails.categorieFournisseurId,
        });
      });
  }

  private initForms(type: FournisseurModel) {
    if (type) {
      this.fourniFrom = this.fb.group({
        nom: new FormControl(type.nom, [Validators.required]),
        adresse: new FormControl(type.adresse, [Validators.required]),
        email: new FormControl(type.email, [Validators.required]),
        telephone: new FormControl(type.telephone, [Validators.required]),
        solde: new FormControl(type.solde, [Validators.required]),
        totalVersement: new FormControl(type.totalVersement, [
          Validators.required,
        ]),
        typeFournisseurId: new FormControl(type.typeFournisseur, [
          Validators.required,
        ]),
        categorieFournisseurId: new FormControl(type.categorieFournisseur, [
          Validators.required,
        ]),
      });
    } else {
      this.fourniFrom = this.fb.group({
        nom: new FormControl(null, [Validators.required]),
        adresse: new FormControl(null, [Validators.required]),
        email: new FormControl(null, [Validators.required]),
        telephone: new FormControl(null, [Validators.required]),
        solde: new FormControl(null, [Validators.required]),
        totalVersement: new FormControl(null, [Validators.required]),
        categorieFournisseur: new FormControl(null, [Validators.required]),
      });
    }
  }

  ngOnInit() {
    // Dans ngOnInit, appelez la méthode du service pour récupérer les types de fournisseurs
    this.typeFournisseurService
      .getTypeFournisseurs()
      .subscribe((typeFournisseur) => {
        console.log(typeFournisseur);
        // Stockez les types de fournisseurs récupérés dans la variable de classe
        this.typesFournisseurs = typeFournisseur;
      });
    this.categorieFourisseurService
      .getCategorieFournisseurs()
      .subscribe((categorie) => {
          console.log(categorie);
        this.categorieFournisseurs = categorie;
      })
      
    // this.typeFournisseurService
    //   .getTypeFournisseurs()
    //   .subscribe((typeFournisseur) => {
    //     console.log(typeFournisseur); // Log the data to check its content
    //     this.typesFournisseurs = typeFournisseur;
    //   });

    this.initForms(new FournisseurModel());
    this.fourniFrom = this.fb.group({
      nom: ['', Validators.required],
      adresse: ['', Validators.required],
      email: ['', Validators.required],
      telephone: ['', Validators.required],
      solde: ['', Validators.required],
      totalVersement: ['', Validators.required],
      typeFournisseurId: ['', Validators.required],
      categorieFournisseurId: ['', Validators.required],
    });

    const fournisseurId = this.route.snapshot.params['fournisseurId']; // Récupérez l'ID de la zone depuis les paramètres de route
    if (fournisseurId) {
      const typeIdDecript = Number(
        this.encryptService.decryptText(fournisseurId)
      );
      // Si un ID de type fournisseur est présent dans les paramètres de route, cela signifie que le formulaire est utilisé pour la modification
      this.isEditing = true;
      this.subscriptions.push(
        this.fournisseurService.getFournisseurById(typeIdDecript).subscribe(
          (data: any) => {
            this.type = data;
            console.log(this.type);
          },
          (error: any) => {},
          () => {
            this.initForms(this.type);
          }
        )
      );
    }
  }

  onSubmit() {
    this.router.navigate(['/gestion-fournisseur/listFournisseur']);
  }

  clear() {
    this.fourniFrom.reset();
  }
}

function invalidPipeArgumentError(DatePipe: any, message: string) {
  throw new Error('Function not implemented.');
}
