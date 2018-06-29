import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChequeInquiryPage } from './cheque-inquiry';

@NgModule({
  declarations: [
    ChequeInquiryPage,
  ],
  imports: [
    IonicPageModule.forChild(ChequeInquiryPage),
  ],
})
export class ChequeInquiryPageModule {}
