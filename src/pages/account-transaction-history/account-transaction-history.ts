import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { DataProvider } from "../../providers/data/data";

/**
 * Generated class for the AccountTransactionHistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-account-transaction-history",
  templateUrl: "account-transaction-history.html"
})
export class AccountTransactionHistoryPage {
  myInput = "";

  onCancel(e) {
    this.filterItemsOfAccount("")
  }

  selectedAccount: any = {
    account: "",
    desc: "",
    balance: "",
    type: "",
    hidden: true,
    circle: "",
    background: ""
  };

  accounts;

  selected = {
    debited: "",
    credited: "",
    amount: "",
    firstExec: "",
    endDate: "",
    periodicity: "",
    desc: "",
    standing: "",
    type: "",
    hidden: true
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dataProvider: DataProvider
  ) {
    this.accounts = dataProvider.getAccounts();
    this.selectedAccount = this.accounts[0];
  }

  filterItemsOfAccount(e) {
    if(this.myInput == null || this.myInput == "") return this.dataProvider.getTransactions(this.selectedAccount.account);
    return this.dataProvider.getTransactions(this.selectedAccount.account)
    .filter(x => x.desc.includes(this.myInput) || x.firstExec.includes(this.myInput) || x.amount.includes(this.myInput))
  }
}
