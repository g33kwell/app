import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';

/**
 * Generated class for the AccountTransactionHistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-account-transaction-history',
  templateUrl: 'account-transaction-history.html',
})
export class AccountTransactionHistoryPage {

  isSearch = false;
  header = "Account history transaction";

  selectedAccount: any = {
    'account' : '',
    'desc' : '',
    'balance' : '',
    'type' : '',
    'hidden' : true,
    'circle' : "",
    'background' : ""
  };

  accounts;

  selected = {
    'debitedAccount': '',
    'creditedAccount': '',
    'date': new Date().toLocaleDateString(),
    'desc': '',
    'amount': '',
    'sens': '',
    'type': '',
    'hidden': true,
  }


  constructor(public navCtrl: NavController, public navParams: NavParams, private dataProvider: DataProvider) {
    this.accounts = dataProvider.getAccounts();
    this.selectedAccount = this.accounts[0]

  }


  filterItemsOfAccount() {
    return this.dataProvider.getTransactions(this.selectedAccount.account)
  }

}
