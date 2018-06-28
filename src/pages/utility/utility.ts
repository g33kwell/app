import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, LoadingController, AlertController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { HomePage } from '../home/home';
import { UtilityConfirmationPage } from '../utility-confirmation/utility-confirmation';
import { LoginPage } from '../login/login';

/**
 * Generated class for the UtilityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-utility',
  templateUrl: 'utility.html',
})
export class UtilityPage {

  accounts;
  transaction: ITransaction = <ITransaction>{};
  references = [];
  organisations;

  selectedAccount: any = {
    account: "",
    desc: "",
    balance: "",
    type: "",
    hidden: true,
    circle: "",
    background: ""
  };

  selectedOrganisation;
  selectedReference;

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataProvider: DataProvider,
    public app:App, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    this.accounts = dataProvider.getAccounts();
    this.selectedAccount = this.accounts[0];

    this.organisations = dataProvider.getOrganisations();
    this.selectedOrganisation = this.organisations[0];

    this.references = this.dataProvider.getReferences()
  }

  logout(){
    this.app.getRootNav().setRoot(LoginPage)
  }

  confirmVirement() {

    this.transaction.debited = this.selectedAccount.account;
    this.transaction.firstExec = new Date().toISOString().substring(0, 10)

    let loading = this.loadingCtrl.create({
      content: "Please wait..."
    });

    loading.present();
    setTimeout(() => {
      loading.dismiss().then(res =>
        {
          if( this.references.indexOf(this.selectedReference) < 0)
            this.presentAlert()
          else {
            this.navCtrl.push(UtilityConfirmationPage, {
              transaction: this.transaction, 
              organisation: this.selectedOrganisation
            })
          }
        }
      );
    }, 500);
  }


  cancel() {
    this.app.getRootNav().setRoot(HomePage);
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: "Error",
      subTitle: "Wrong reference or wrong amount",
      buttons: ["Ok"]
    });
    alert.present();
  }

}
