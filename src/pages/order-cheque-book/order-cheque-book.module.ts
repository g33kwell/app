import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderChequeBookPage } from './order-cheque-book';

@NgModule({
  declarations: [
    OrderChequeBookPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderChequeBookPage),
  ],
})
export class OrderChequeBookPageModule {}
