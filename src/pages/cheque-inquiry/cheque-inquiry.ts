import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { DataProvider } from '../../providers/data/data';

/**
 * Generated class for the ChequeInquiryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cheque-inquiry',
  templateUrl: 'cheque-inquiry.html',
})
export class ChequeInquiryPage {

  selectedAccount;
  accounts;

  constructor(public navCtrl: NavController, public navParams: NavParams, public app:App, public dataProvider: DataProvider) {
    this.accounts = this.dataProvider.getAccounts();
    this.selectedAccount = this.accounts[0];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChequeInquiryPage');
  }

  logout(){
    this.app.getRootNav().setRoot(LoginPage)
  }

}
