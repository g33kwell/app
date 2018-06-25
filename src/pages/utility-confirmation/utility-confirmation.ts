import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, LoadingController, AlertController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { HomePage } from '../home/home';

/**
 * Generated class for the UtilityConfirmationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-utility-confirmation',
  templateUrl: 'utility-confirmation.html',
})
export class UtilityConfirmationPage {

  transaction = <ITransaction>{};
  organisation;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public app: App,
    public dataProvider: DataProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController) {
      this.transaction = navParams.get("transaction");
      this.organisation = navParams.get("organisation");
  }

  cancel() {
    this.navCtrl.pop();
  }

  confirmVirement() {

    this.transaction.desc = this.organisation.name
    let loading = this.loadingCtrl.create({
      content: "Please wait..."
    });

    loading.present();
    setTimeout(() => {
      loading.dismiss().then(res => {
        this.dataProvider.addTransaction(this.transaction);
        this.presentAlert();
      });
    }, 500);
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: "Success",
      subTitle: "Your payement was successfully processed",
      buttons: [
        {
          text: "Ok",
          handler: () => this.app.getRootNav().setRoot(HomePage)
        }
      ],
      enableBackdropDismiss: false
    });
    alert.present();
  }

}
