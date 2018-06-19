import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SepaTransfersPage } from './sepa-transfers';

@NgModule({
  declarations: [
    SepaTransfersPage,
  ],
  imports: [
    IonicPageModule.forChild(SepaTransfersPage),
  ],
})
export class SepaTransfersPageModule {}
