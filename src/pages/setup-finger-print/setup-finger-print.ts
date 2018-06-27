import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { AuthenticationProvider } from '../../providers/authentication/authentication';

/**
 * Generated class for the SetupFingerPrintPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-setup-finger-print',
  templateUrl: 'setup-finger-print.html',
})
export class SetupFingerPrintPage {

  enabled;

  constructor(public navCtrl: NavController, public navParams: NavParams, public faio: FingerprintAIO,
    public alertCtrl: AlertController, public authProvider: AuthenticationProvider) {
      this.enabled = this.authProvider.checkFinger()
  }

  enable() {
    if(!this.enabled){
      this.enabled = this.authProvider.disabedFinger();
    }
    else{
      this.checkFinger()
    }
  }

  checkFinger() {
    this.faio
      .show({
        clientId: "CCB",
        clientSecret: "password", //Only necessary for Android
        disableBackup: false, //Only for Android(optional)
        localizedFallbackTitle: "Use Pin", //Only for iOS
        localizedReason: "Please authenticate" //Only for iOS
      })
      .then((result: any) => {
        this.presentPrompt()
      })
      .catch((error: any) => {
        this.enabled = this.authProvider.disabedFinger()
      });
  }

  presentAlert(title, msg) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ["Ok"]
    });
    alert.present();
  }

  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Password',
      inputs: [
        {
          name: 'password',
          placeholder: 'Password',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Password',
          handler: data => {
            if (data.password == "azerty.123") {
              this.enabled = this.authProvider.enableFinger()
              this.presentAlert("Success","FingerPrint authentication is enabled")
            } else {
              this.enabled = this.authProvider.disabedFinger()
              this.presentAlert("Error","Wrong password")
              return false;
            }
          }
        }
      ]
    });

    alert.present();
  }

}
