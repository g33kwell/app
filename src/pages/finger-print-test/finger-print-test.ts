import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';

/**
 * Generated class for the FingerPrintTestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-finger-print-test',
  templateUrl: 'finger-print-test.html',
})
export class FingerPrintTestPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private androidFingerprintAuth: AndroidFingerprintAuth) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FingerPrintTestPage');
    this.checkFinger();
  }

  checkFinger(){
    this.androidFingerprintAuth.isAvailable()
  .then((result)=> {
    if(result.isAvailable){
      // it is available

      this.androidFingerprintAuth.encrypt({ clientId: 'myAppName', username: 'myUsername', password: 'myPassword' })
        .then(result => {
           if (result.withFingerprint) {
               console.log('Successfully encrypted credentials.');
               console.log('Encrypted credentials: ' + result.token);
           } else if (result.withBackup) {
             console.log('Successfully authenticated with backup password!');
           } else console.log('Didn\'t authenticate!');
        })
        .catch(error => {
           if (error === this.androidFingerprintAuth.ERRORS.FINGERPRINT_CANCELLED) {
             console.log('Fingerprint authentication cancelled');
           } else console.error(error)
        });

    } else {
      // fingerprint auth isn't available
    }
  })
  .catch(error => console.error(error));
  }

}
