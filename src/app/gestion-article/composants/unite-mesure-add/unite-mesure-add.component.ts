import { Component, Inject, LOCALE_ID, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { UniteMesureModel } from 'src/app/shared/models/unite-mesure.model';
import { UniteMesureService } from '../../services/unite-mesure.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { MyEncryptionService } from 'src/app/shared/services/my-encryption.service';
import { DATE_PIPE_DEFAULT_TIMEZONE, DatePipe, formatDate } from '@angular/common';

@Component({
  selector: 'app-unite-mesure-add',
  templateUrl: './unite-mesure-add.component.html',
  styleUrls: ['./unite-mesure-add.component.css'],
})
export class UniteMesureAddComponent {
  @BlockUI()
  blockUI!: NgBlockUI;

  subscriptions = [] as Subscription[];

  unite: UniteMesureModel = new UniteMesureModel();
  isEditing: boolean = false;

  uniteFrom!: FormGroup;
  error = '';

  constructor(
    private router: Router,
    private uniteMesureService: UniteMesureService,
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

  validNom() {
    const nom = this.uniteFrom.controls['nom'];
    return nom.touched && nom.hasError('required');
  }

  validAbreviation() {
    const abreviation = this.uniteFrom.controls['abreviation'];
    return abreviation.touched && abreviation.hasError('required');
  }

  ////////////////Ajout Zone///////////////////////

  addUnite() {
    if (this.uniteFrom.valid) {
      this.blockUI.start('Veuillez patienter....');
      this.unite.nom = this.uniteFrom.value.nom;
      this.unite.abreviation = this.uniteFrom.value.abreviation;

      this.subscriptions.push(
        this.uniteMesureService.addUnite(this.unite).subscribe(
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

  getZoneById(uniteId: any) {
    this.uniteMesureService
      .getUniteById(uniteId)
      .subscribe((uniteDetails: any) => {
        this.uniteFrom.patchValue({
          nom: uniteDetails.nom,
          abreviation: uniteDetails.abreviation,
        });
      });
  }

  private initForms(unite: UniteMesureModel) {
    if (unite) {
      this.uniteFrom = this.fb.group({
        nom: new FormControl(unite.nom, [Validators.required]),
        abreviation: new FormControl(unite.abreviation, [Validators.required]),
      });
    } else {
      this.uniteFrom = this.fb.group({
        nom: new FormControl(null, [Validators.required]),
        abreviation: new FormControl(null, [Validators.required]),
      });
    }
  }

  ngOnInit() {
    this.initForms(new UniteMesureModel());
    this.uniteFrom = this.fb.group({
      nom: ['', Validators.required],
      abreviation: ['', Validators.required],
    });

    const uniteId = this.route.snapshot.params['uniteId']; // Récupérez l'ID de la zone depuis les paramètres de route
    if (uniteId) {
      const uniteIdDecript = Number(this.encryptService.decryptText(uniteId));
      // Si un ID de zone est présent dans les paramètres de route, cela signifie que le formulaire est utilisé pour la modification
      this.isEditing = true;
      this.subscriptions.push(
        this.uniteMesureService.getUniteById(uniteIdDecript).subscribe(
          (data: any) => {
            this.unite = data;
            console.log(this.unite);
          },
          (error: any) => {},
          () => {
            this.initForms(this.unite);
          }
        )
      );
    }

  }

  onSubmit() {
    this.router.navigate(['/gestion-article/listUniteMesure']);
  }

  clear() {
    this.uniteFrom.reset();
  }
}

function invalidPipeArgumentError(DatePipe: any, message: string) {
  throw new Error('Function not implemented.');
}

