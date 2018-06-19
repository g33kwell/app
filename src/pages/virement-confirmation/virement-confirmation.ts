import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, LoadingController, AlertController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { HomePage } from '../home/home';

/**
 * Generated class for the VirementConfirmationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-virement-confirmation',
  templateUrl: 'virement-confirmation.html',
})
export class VirementConfirmationPage {

  transaction = {
    'debitedAccount': '085-7210872-0',
    'creditedAccount': '085-7210822-1',
    'date': new Date().toLocaleDateString(),
    'desc': 'Description',
    'amount': '199',
    'sens': 'debit',
    'type': 'coop',
    'standing' : true,
    'periodicity' : 'm',
    'endingDate' : '29/03/2020'
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public app: App, public dataProvider: DataProvider,
     public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
  }

  cancel() {
    this.navCtrl.pop()
  }

  confirmVirement() {
    let loading = this.loadingCtrl.create({
      content: "Please wait..."
    });

    loading.present();
    setTimeout(() => {
      loading.dismiss().then(res => {
        this.dataProvider.addTransaction(this.transaction)
        this.presentAlert()
      }
    );
    }, 500);
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: "Success",
      subTitle: "Your transaction was successfully processed",
      buttons: [
        {
          text: "Ok",
          handler: () => this.app.getRootNav().setRoot(HomePage)
        }
      ],
      enableBackdropDismiss: false
    });
    alert.present()
  }

}
