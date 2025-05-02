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
  styleUrls: ['./type-article-add.component.scss'],
})
export class TypeArticleAddComponent {
 
  subscriptions: Subscription[] = [];

  type: TypeArticleModel = new TypeArticleModel();
  isEditing = false;

  typeFrom!: FormGroup;
  error = '';
  blockUI: any;

  constructor(
    private router: Router,
    private typeArticleService: TypeArticleService,
    private toastService: ToastService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private encryptService: MyEncryptionService,
    @Inject(LOCALE_ID) private locale: string,
    @Inject(DATE_PIPE_DEFAULT_TIMEZONE) @Optional() private defaultTimezone?: string | null
  ) {}

  ngOnInit() {
    this.initForms(new TypeArticleModel());
  
    this.route.queryParams.subscribe(params => {
      const typeId = params['id'];
      if (typeId) {
        const typeIdDecript = Number(this.encryptService.decryptText(typeId));
        console.log("typeId décrypté:", typeIdDecript);
        this.isEditing = true;
        this.subscriptions.push(
          this.typeArticleService.getTypeById(typeIdDecript).subscribe(
            (data: any) => {
              this.type = data;
            },
            (error: any) => {
              console.error("Erreur lors de la récupération du type :", error);
            },
            () => {
              this.initForms(this.type);
            }
          )
        );
      }
    });
  }
  

  transform(value: Date | string | number | null | undefined, format = 'mediumDate', timezone?: string, locale?: string): string | null {
    if (value == null || value === '' || value !== value) return null;

    try {
      return formatDate(
        value,
        format,
        locale || this.locale,
        timezone ?? this.defaultTimezone ?? undefined
      );
    } catch (error) {
      console.error('Erreur lors du formatage de la date:', error);
      return null;
    }
  }

  validDesignation() {
    const designation = this.typeFrom.controls['designation'];
    return designation.touched && designation.hasError('required');
  }

  validDescription() {
    const description = this.typeFrom.controls['description'];
    return description.touched && description.hasError('required');
  }

  addOrUpdateType() {
    if (this.typeFrom.valid) {
      this.type.designation = this.typeFrom.value.designation;
      this.type.description = this.typeFrom.value.description;

      const request$ = this.isEditing
        ? this.typeArticleService.updateType(this.type.id!, this.type)
        : this.typeArticleService.addType(this.type);

      this.subscriptions.push(
        request$.subscribe(
          () => {},
          (error) => {
            this.toastService.showErrorToast('Erreur', 'Échec de l’opération');
          },
          () => {
            this.toastService.showSuccessToast('Succès', this.isEditing ? 'Type modifié' : 'Type ajouté');
            this.onSubmit();
            this.clear();
          }
        )
      );
    }
  }

  private initForms(type: TypeArticleModel) {
    this.typeFrom = this.fb.group({
      designation: new FormControl(type.designation || '', [Validators.required]),
      description: new FormControl(type.description || '', [Validators.required]),
    });
  }

  onSubmit() {
    this.router.navigate(['/gestion-article/listTypeArticle']);
  }

  clear() {
    this.typeFrom.reset();
  }
}



function invalidPipeArgumentError(DatePipe: any, message: string) {
  throw new Error('Function not implemented.');
}
