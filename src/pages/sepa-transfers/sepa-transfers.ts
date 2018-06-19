import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, LoadingController } from 'ionic-angular';
import { VirementConfirmationPage } from '../virement-confirmation/virement-confirmation';
import { HomePage } from '../home/home';
import { DataProvider } from '../../providers/data/data';

/**
 * Generated class for the SepaTransfersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sepa-transfers',
  templateUrl: 'sepa-transfers.html',
})
export class SepaTransfersPage {

  selectedAccount;
  isStanding = false;
  accounts

  constructor(public navCtrl: NavController, public navParams: NavParams, public app:App, private dataProvider: DataProvider, public loadingCtrl: LoadingController) {
    this.accounts = this.dataProvider.getAccounts()
    this.selectedAccount = this.accounts[0]
  }

  standing() {
    if (this.isStanding)
      this.isStanding = false;
    else
      this.isStanding = true;
  }

  confirmVirement() {
    let loading = this.loadingCtrl.create({
      content: "Please wait..."
    });

    loading.present();
    setTimeout(() => {
      loading.dismiss().then(res => this.navCtrl.push(VirementConfirmationPage));
    }, 500);
  }

  cancel() {
    this.app.getRootNav().setRoot(HomePage)
  }

  

}
