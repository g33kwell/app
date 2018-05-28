import { Component, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  Platform
} from "ionic-angular";

import { IonicStepperComponent } from "ionic-stepper";
import { FingerprintAIO } from "@ionic-native/fingerprint-aio";
/**
 * Generated class for the AuthenticationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  @ViewChild("stepper") stepper: IonicStepperComponent;
  mode: string = "horizontal";
  selectedIndex = 0;
  finger = false;
  isFirstStep = true;

  form: IArcotV6Form = <IArcotV6Form>{};

  element;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private faio: FingerprintAIO,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.setupFingerPrint();
  }

  async setupFingerPrint() {
    try {
      await this.platform.ready();
      (await this.faio.isAvailable())
        ? (this.finger = true)
        : (this.finger = false);
    } catch (e) {
      console.log(e);
    }
  }

  onKeyDown(e){
    if(e.key === "Enter"){
      if(e.target.name === "login"){
        let element = document.getElementById('btnstep1');
        element.click()
      } else if(e.target.name === "smsOtp"){
        let element = document.getElementById('btnstep2');
        element.click()
      } else if(e.target.name === "password"){
        let element = document.getElementById('btnstep3');
        element.click()
      }
    }
  }

  setSubscriberId() {
    let loading = this.loadingCtrl.create({
      content: "Please wait..."
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 500);
  }

  setSMS() {
    let loading = this.loadingCtrl.create({
      content: "Please wait..."
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 500);
  }

  setPassword() {
    let loading = this.loadingCtrl.create({
      content: "Please wait..."
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss().then(res => this.navCtrl.pop());
    }, 500);
  }

  parseInt(element) {
    if (Number(element)) return true;
    return false;
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
        let loading = this.loadingCtrl.create({
          content: "Please wait..."
        });

        loading.present();

        setTimeout(() => {
          loading.dismiss().then(res => this.navCtrl.pop());
        }, 500);
      })
      .catch((error: any) => console.log(error));
  }
}
