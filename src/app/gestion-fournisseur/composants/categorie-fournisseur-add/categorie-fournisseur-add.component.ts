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
import { CategorieFournisseurModel } from 'src/app/shared/models/categorie-fournisseur.model';
import { CategorieFourisseurService } from '../../services/categorie-fourisseur.service';



@Component({
  selector: 'app-categorie-fournisseur-add',
  templateUrl: './categorie-fournisseur-add.component.html',
  styleUrls: ['./categorie-fournisseur-add.component.css'],
})
export class CategorieFournisseurAddComponent {
  @BlockUI()
  blockUI!: NgBlockUI;

  subscriptions = [] as Subscription[];

  type: CategorieFournisseurModel = new CategorieFournisseurModel();
  isEditing: boolean = false;

  categorieFourniFrom!: FormGroup;
  error = '';

  constructor(
    private router: Router,
    private categorieFournisseurService: CategorieFourisseurService,
    private toastService: ToastService,
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

  validDesignation() {
    const designation = this.categorieFourniFrom.controls['designation'];
    return designation.touched && designation.hasError('required');
  }

  validDescription() {
    const description = this.categorieFourniFrom.controls['description'];
    return description.touched && description.hasError('required');
  }

  ////////////////Ajout TypeFournisseur///////////////////////

  addCategorieFournisseur() {
    if (this.categorieFourniFrom.valid) {
      this.blockUI.start('Veuillez patienter....');
      this.type.designation = this.categorieFourniFrom.value.designation;
      this.type.description = this.categorieFourniFrom.value.description;

      this.subscriptions.push(
        this.categorieFournisseurService
          .addCategorieFournisseur(this.type)
          .subscribe(
            (data) => {},
            (error) => {
              this.blockUI.stop();
              this.toastService.showErrorToast();
            },
            () => {
              // this.blockUI.stop();
              this.onSubmit();
              this.toastService.showSuccessToast();
              this.clear();
            }
          )
      );
    }
  }

  getCategorieFournisseurById(typeId: any) {
    this.categorieFournisseurService
      .getCategorieFournisseurById(typeId)
      .subscribe((typeDetails: any) => {
        this.categorieFourniFrom.patchValue({
          designation: typeDetails.designation,
          description: typeDetails.description,
        });
      });
  }

  private initForms(type: CategorieFournisseurModel) {
    if (type) {
      this.categorieFourniFrom = this.fb.group({
        designation: new FormControl(type.designation, [Validators.required]),
        description: new FormControl(type.description, [Validators.required]),
      });
    } else {
      this.categorieFourniFrom = this.fb.group({
        designation: new FormControl(null, [Validators.required]),
        description: new FormControl(null, [Validators.required]),
      });
    }
  }

  ngOnInit() {
    this.initForms(new CategorieFournisseurModel());
    this.categorieFourniFrom = this.fb.group({
      designation: ['', Validators.required],
      description: ['', Validators.required],
    });

    const categorieFournisseurId =
      this.route.snapshot.params['categorieFournisseurId']; // Récupérez l'ID de la zone depuis les paramètres de route
    if (categorieFournisseurId) {
      const typeIdDecript = Number(
        this.encryptService.decryptText(categorieFournisseurId)
      );
      // Si un ID de type fournisseur est présent dans les paramètres de route, cela signifie que le formulaire est utilisé pour la modification
      this.isEditing = true;
      this.subscriptions.push(
        this.categorieFournisseurService
          .getCategorieFournisseurById(typeIdDecript)
          .subscribe(
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
    this.router.navigate(['/gestion-fournisseur/listCategorieFournisseur']);
  }

  clear() {
    this.categorieFourniFrom.reset();
  }
}

function invalidPipeArgumentError(DatePipe: any, message: string) {
  throw new Error('Function not implemented.');
}
