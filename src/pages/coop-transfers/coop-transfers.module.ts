import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoopTransfersPage } from './coop-transfers';

@NgModule({
  declarations: [
    CoopTransfersPage,
  ],
  imports: [
    IonicPageModule.forChild(CoopTransfersPage),
  ],
})
export class CoopTransfersPageModule {}
