import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController, LoadingController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { HomePage } from '../home/home';

/**
 * Generated class for the OrderChequeBookPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-cheque-book',
  templateUrl: 'order-cheque-book.html',
})
export class OrderChequeBookPage {

  selectedAccount;
  accounts;
  requests = [];

  leaf5 = true;
  leaf10 = false;

  quant1 = true;
  quant2 = false;

  date = new Date();

  request: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataProvider: DataProvider,
    public app:App, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    this.accounts = this.dataProvider.getAccounts();
    this.selectedAccount = this.accounts[0];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderChequeBookPage');
  }

  onChangeLeaves5() {
    if(this.leaf5) this.leaf10 = false;
  }

  onChangeLeaves10() {
    if(this.leaf10) this.leaf5 = false;
  }

  onChangeQuant1() {
    if(this.quant1) this.quant2 = false;
  }

  onChangeQuant2() {
    if(this.quant2) this.quant1 = false;
  }

  cancel() {
    this.app.getRootNav().setRoot(HomePage);
  }

  confirmCheque() {
    this.presentConfirm()
  }

  presentConfirm() {
    let quant;
    let leaf;

    if(this.quant1) quant = 1;
    else quant = 2;

    if(this.leaf5) leaf = 5;
    else leaf = 10;

    let alert = this.alertCtrl.create({
      title: 'Confirm order',
      message: 'Do you want to order '+quant+' cheque book(s) of '+leaf+' leaves for the account '+this.selectedAccount.account+'?',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Order',
          handler: () => {
            let loading = this.loadingCtrl.create({
              content: "Please wait..."
            });
    
            loading.present();
    
            setTimeout(() => {
              loading
                .dismiss()
                .then(val => {
                  this.request.account = this.selectedAccount.account
                  this.request.date = this.date.toLocaleDateString()
                  this.request.status = "pending"
                  this.request.quant = quant
                  this.request.leaf = leaf
                  this.presentAlert('Success','Your request is being processed')
                  this.requests.push(this.request)
                });
            }, 1000);
          }
        }
      ]
    });

    alert.present()

  }

  presentAlert(title, msg) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ["Ok"]
    });
    alert.present();
  }

}
