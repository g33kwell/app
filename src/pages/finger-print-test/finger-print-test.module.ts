import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FingerPrintTestPage } from './finger-print-test';

@NgModule({
  declarations: [
    FingerPrintTestPage,
  ],
  imports: [
    IonicPageModule.forChild(FingerPrintTestPage),
  ],
})
export class FingerPrintTestPageModule {}
