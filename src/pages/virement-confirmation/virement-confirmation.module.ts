import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VirementConfirmationPage } from './virement-confirmation';

@NgModule({
  declarations: [
    VirementConfirmationPage,
  ],
  imports: [
    IonicPageModule.forChild(VirementConfirmationPage),
  ],
})
export class VirementConfirmationPageModule {}
