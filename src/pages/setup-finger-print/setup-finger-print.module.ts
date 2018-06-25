import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SetupFingerPrintPage } from './setup-finger-print';

@NgModule({
  declarations: [
    SetupFingerPrintPage,
  ],
  imports: [
    IonicPageModule.forChild(SetupFingerPrintPage),
  ],
})
export class SetupFingerPrintPageModule {}
