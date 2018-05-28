import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events } from 'ionic-angular';

import { IonicStepperComponent } from "ionic-stepper";
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
/**
 * Generated class for the AuthenticationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  @ViewChild('stepper') stepper: IonicStepperComponent;
  mode: string = 'horizontal';
  selectedIndex = 0;
  finger = false;

  form: IArcotV6Form = <IArcotV6Form>{}

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
    private faio: FingerprintAIO, public events: Events) {

      this.events.publish('listening to Fingerprint');

  }

  ngOnInit() { 
    this.faio.isAvailable() ? this.finger = true : this.finger = false;
    this.checkFinger()
    this.events.subscribe('listening to Fingerprint', () => {
      this.checkFinger()
    })
  }

  selectChange(e) {
  }

  setSubscriberId() {
    this.presentLoading()
  }

  setSMS() {
    this.presentLoading()
  }

  setPassword() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss().then(res => this.navCtrl.pop());
    }, 500);

  }

  presentLoading() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 500);
  }

  parseInt(element) {
    if (Number(element))
      return true;
    return false;
  }

  checkFinger() {
    this.faio.show({
      clientId: 'Fingerprint-Demo',
      clientSecret: 'password', //Only necessary for Android
      disableBackup:true,  //Only for Android(optional)
      localizedFallbackTitle: 'Use Pin', //Only for iOS
      localizedReason: 'Please authenticate' //Only for iOS
  })
  .then((result: any) => console.log(result))
  .catch((error: any) => console.log(error));
  }


}
