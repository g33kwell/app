import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountTransactionHistoryPage } from './account-transaction-history';

@NgModule({
  declarations: [
    AccountTransactionHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountTransactionHistoryPage),
  ],
})
export class AccountTransactionHistoryPageModule {}
