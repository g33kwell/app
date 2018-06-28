import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { LoginPage } from '../login/login';

/**
 * Generated class for the StandingOrdersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-standing-orders',
  templateUrl: 'standing-orders.html',
})
export class StandingOrdersPage {

  myInput = "";

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

  onCancel(e) {
    this.filterItemsOfAccount("")
  }

  onInput(e) {
    console.log(this.myInput)
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataProvider: DataProvider,
    public app:App) {
    this.accounts = dataProvider.getAccounts();
    this.selectedAccount = this.accounts[0];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StandingOrdersPage');
  }

  filterItemsOfAccount(e) {
    //if(e == null || e == "") return this.dataProvider.getTransactions(this.selectedAccount.account);
    if(this.myInput == null || this.myInput == "") return this.dataProvider.getStandingOrders(this.selectedAccount.account);
    return this.dataProvider.getStandingOrders(this.selectedAccount.account)
    .filter(x => x.desc.includes(this.myInput) || x.firstExec.includes(this.myInput) || x.amount.includes(this.myInput))
  }

  logout(){
    this.app.getRootNav().setRoot(LoginPage)
  }

}
