import { Component, Inject, LOCALE_ID, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { TypeFournisseurService } from '../../services/type-fournisseur.service';
import { TypeFournisseurModel } from 'src/app/shared/models/type-fournisseur.model';
import { ToastService } from 'src/app/shared/services/toast.service';
import { MyEncryptionService } from 'src/app/shared/services/my-encryption.service';
import { DATE_PIPE_DEFAULT_TIMEZONE, DatePipe, formatDate } from '@angular/common';


@Component({
  selector: 'app-type-fournisseur-add',
  templateUrl: './type-fournisseur-add.component.html',
  styleUrls: ['./type-fournisseur-add.component.css'],
})
export class TypeFournisseurAddComponent {
  @BlockUI()
  blockUI!: NgBlockUI;

  subscriptions = [] as Subscription[];

  type: TypeFournisseurModel = new TypeFournisseurModel();
  isEditing: boolean = false;

  typeFourniFrom!: FormGroup;
  error = '';

  constructor(
    private router: Router,
    private typeFournisseurService: TypeFournisseurService,
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
    const designation = this.typeFourniFrom.controls['designation'];
    return designation.touched && designation.hasError('required');
  }

  validDescription() {
    const description = this.typeFourniFrom.controls['description'];
    return description.touched && description.hasError('required');
  }

  ////////////////Ajout TypeFournisseur///////////////////////

  addTypeFournisseur() {
    if (this.typeFourniFrom.valid) {
      this.blockUI.start('Veuillez patienter....');
      this.type.designation = this.typeFourniFrom.value.designation;
      this.type.description = this.typeFourniFrom.value.description;

      this.subscriptions.push(
        this.typeFournisseurService.addTypeFournisseur(this.type).subscribe(
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

  getTypeFournisseurById(typeId: any) {
    this.typeFournisseurService
      .getTypeFournisseurById(typeId)
      .subscribe((typeDetails: any) => {
        this.typeFourniFrom.patchValue({
          designation: typeDetails.designation,
          description: typeDetails.description,
        });
      });
  }

  private initForms(type: TypeFournisseurModel) {
    if (type) {
      this.typeFourniFrom = this.fb.group({
        designation: new FormControl(type.designation, [Validators.required]),
        description: new FormControl(type.description, [Validators.required]),
      });
    } else {
      this.typeFourniFrom = this.fb.group({
        designation: new FormControl(null, [Validators.required]),
        description: new FormControl(null, [Validators.required]),
      });
    }
  }

  ngOnInit() {
    this.initForms(new TypeFournisseurModel());
    this.typeFourniFrom = this.fb.group({
      designation: ['', Validators.required],
      description: ['', Validators.required],
    });

    const typeFournisseurId = this.route.snapshot.params['typeFournisseurId']; // Récupérez l'ID de la zone depuis les paramètres de route
    if (typeFournisseurId) {
      const typeIdDecript = Number(
        this.encryptService.decryptText(typeFournisseurId)
      );
      // Si un ID de type fournisseur est présent dans les paramètres de route, cela signifie que le formulaire est utilisé pour la modification
      this.isEditing = true;
      this.subscriptions.push(
        this.typeFournisseurService
          .getTypeFournisseurById(typeIdDecript)
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
    this.router.navigate(['/gestion-fournisseur/listTypeFournisseur']);
  }

  clear() {
    this.typeFourniFrom.reset();
  }
}

function invalidPipeArgumentError(DatePipe: any, message: string) {
  throw new Error('Function not implemented.');
}
