import { Component, Inject, LOCALE_ID, Optional } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ZoneStockModel } from 'src/app/shared/models/zone-stock.model';
import { ZoneStockService } from '../../services/zone-stock.service';
import { MyEncryptionService } from 'src/app/shared/services/my-encryption.service';
import { DATE_PIPE_DEFAULT_TIMEZONE, DatePipe, formatDate } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-zone-stock-add',
  templateUrl: './zone-stock-add.component.html',
  styleUrls: ['./zone-stock-add.component.css'],
})
export class ZoneStockAddComponent {
  @BlockUI()
  blockUI!: NgBlockUI;

  subscriptions = [] as Subscription[];

  zone: ZoneStockModel = new ZoneStockModel();
  isEditing: boolean = false;

  zoneFrom!: FormGroup;
  error = '';

  constructor(
    private router: Router,
    private zoneStockService: ZoneStockService,
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
    const designation = this.zoneFrom.controls['designation'];
    return designation.touched && designation.hasError('required');
  }

  validDescription() {
    const description = this.zoneFrom.controls['description'];
    return description.touched && description.hasError('required');
  }

  ////////////////Ajout Zone///////////////////////

  addZone() {
    if (this.zoneFrom.valid) {
      this.blockUI.start('Veuillez patienter....');
      this.zone.designation = this.zoneFrom.value.designation;
      this.zone.description = this.zoneFrom.value.description;

      this.subscriptions.push(
        this.zoneStockService.addZone(this.zone).subscribe(
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


  getZoneById(zoneId: any) {
    this.zoneStockService.getZoneById(zoneId).subscribe((zoneDetails: any) => {
      this.zoneFrom.patchValue({
        designation: zoneDetails.designation,
        description: zoneDetails.description,
      });
    });
  }



  private initForms(zone: ZoneStockModel) {
    if (zone) {
      this.zoneFrom = this.fb.group({
        designation: new FormControl(zone.designation, [Validators.required]),
        description: new FormControl(zone.description, [Validators.required]),
      });
    } else {
      this.zoneFrom = this.fb.group({
        designation: new FormControl(null, [Validators.required]),
        description: new FormControl(null, [Validators.required]),
      });
    }
  }

  ngOnInit() {
    this.initForms(new ZoneStockModel());
    this.zoneFrom = this.fb.group({
      designation: ['', Validators.required],
      description: ['', Validators.required],
    });

    const zoneId = this.route.snapshot.params['zoneId']; // Récupérez l'ID de la zone depuis les paramètres de route
    if (zoneId) {
      const zoneIdDecript = Number(this.encryptService.decryptText(zoneId));
      // Si un ID de zone est présent dans les paramètres de route, cela signifie que le formulaire est utilisé pour la modification
      this.isEditing = true;
      this.subscriptions.push(
        this.zoneStockService.getZoneById(zoneIdDecript).subscribe((data: any)=>{
          this.zone = data;
          console.log(this.zone);
          
        },(error: any) =>
        {
          
        },
          () => {
            this.initForms(this.zone)
          }
      ))
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
    this.zoneFrom.reset();
  }
}


function invalidPipeArgumentError(DatePipe: any, message: string) {
  throw new Error('Function not implemented.');
}


