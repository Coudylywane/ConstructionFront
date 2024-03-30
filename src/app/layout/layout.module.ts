import { NgModule } from '@angular/core';
import { MainContentComponent } from './main-content/main-content.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    MainContentComponent
  ],
  exports: [MainContentComponent],
  imports: [
    SharedModule
  ],
  //schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LayoutModule { }
