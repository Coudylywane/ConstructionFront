import { Component, Inject, LOCALE_ID, Optional } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MyEncryptionService } from 'src/app/shared/services/my-encryption.service';
import {
  DATE_PIPE_DEFAULT_TIMEZONE,
  DatePipe,
  formatDate,
} from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastService } from 'src/app/shared/services/toast.service';
import { TypeArticleModel } from 'src/app/shared/models/type-article.model';
import { TypeArticleService } from '../../services/type-article.service';

@Component({
  selector: 'app-type-article-add',
  templateUrl: './type-article-add.component.html',
  styleUrls: ['./type-article-add.component.css'],
})
export class TypeArticleAddComponent {
  @BlockUI()
  blockUI!: NgBlockUI;

  subscriptions = [] as Subscription[];

  type: TypeArticleModel = new TypeArticleModel();
  isEditing: boolean = false;

  typeFrom!: FormGroup;
  error = '';

  constructor(
    private router: Router,
    private typeArticleService: TypeArticleService,
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
    const designation = this.typeFrom.controls['designation'];
    return designation.touched && designation.hasError('required');
  }

  validDescription() {
    const description = this.typeFrom.controls['description'];
    return description.touched && description.hasError('required');
  }

  ////////////////Ajout Zone///////////////////////

  addType() {
    if (this.typeFrom.valid) {
      this.blockUI.start('Veuillez patienter....');
      this.type.designation = this.typeFrom.value.designation;
      this.type.description = this.typeFrom.value.description;

      this.subscriptions.push(
        this.typeArticleService.addType(this.type).subscribe(
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

  getTypeById(typeId: any) {
    this.typeArticleService
      .getTypeById(typeId)
      .subscribe((typeDetails: any) => {
        this.typeFrom.patchValue({
          designation: typeDetails.designation,
          description: typeDetails.description,
        });
      });
  }

  private initForms(type: TypeArticleModel) {
    if (type) {
      this.typeFrom = this.fb.group({
        designation: new FormControl(type.designation, [Validators.required]),
        description: new FormControl(type.description, [Validators.required]),
      });
    } else {
      this.typeFrom = this.fb.group({
        designation: new FormControl(null, [Validators.required]),
        description: new FormControl(null, [Validators.required]),
      });
    }
  }

  ngOnInit() {
    this.initForms(new TypeArticleModel());
    this.typeFrom = this.fb.group({
      designation: ['', Validators.required],
      description: ['', Validators.required],
    });

    const typeId = this.route.snapshot.params['typeId']; // Récupérez l'ID de la zone depuis les paramètres de route
    if (typeId) {
      const typeIdDecript = Number(this.encryptService.decryptText(typeId));
      // Si un ID de zone est présent dans les paramètres de route, cela signifie que le formulaire est utilisé pour la modification
      this.isEditing = true;
      this.subscriptions.push(
        this.typeArticleService.getTypeById(typeIdDecript).subscribe(
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

    // const routeParam = this.route.snapshot.paramMap.get('patientId');
    // if (routeParam) {
    //   const patientIdFromRoute = Number(
    //     this.encryptService.decryptText(routeParam)
    //   );
    //   this.subscriptions.push(
    //     this.patientService.getPatientById(patientIdFromRoute).subscribe(
    //       (patient) => {
    //         this.patient = patient;
    //       },
    //       (error) =>
    //         this.toastService.showErrorToast(
    //           'Erreur',
    //           "Ce patient n'existe pas"
    //         ),
    //       () => {
    //         this.initForms(this.patient);
    //       }
    //     )
    //   );
    // }
  }

  onSubmit() {
    this.router.navigate(['/gestion-article/listZoneStock']);
  }

  clear() {
    this.typeFrom.reset();
  }
}

function invalidPipeArgumentError(DatePipe: any, message: string) {
  throw new Error('Function not implemented.');
}
