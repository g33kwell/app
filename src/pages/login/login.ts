import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  Platform,
  AlertController,
  Events
} from "ionic-angular";

import { FingerprintAIO } from "@ionic-native/fingerprint-aio";
import { ScreenOrientation } from "@ionic-native/screen-orientation";
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
  finger = false;
  isFirstStep = true;
  form: IArcotV6Form = <IArcotV6Form>{};

  //////////////////////////////////
  disabled: boolean = false;
  step: any;
  stepCondition: any;
  stepDefaultCondition: any;
  currentStep: any;
  stepsArray: Array<Object> = [];
  //////////////////////////////////

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private faio: FingerprintAIO,
    private platform: Platform,
    public alertCtrl: AlertController,
    public evts: Events,
    private screenOrientation: ScreenOrientation
  ) {
    /**
         * Step Wizard Settings
         */
    this.currentStep = 1;//The value of the first step, always 1
    this.stepCondition = false;//For each step the condition is set to this value, Set to true if you don't need condition in every step
    this.stepDefaultCondition = this.stepCondition;//Save the default condition for each step
    //Let's create some dummy data for this case
    this.stepsArray =
      [
        {
          title: 'Login Input',
          name: 'login',
          label: 'Subsriber ID',
          icon : 'contact',
          step: 1
        },
        {
          title: 'Sms input',
          name: 'smsOtp',
          label: 'Sms Code',
          icon : 'mail',
          step: 2
        },
        {
          title: 'Password input',
          name: 'password',
          label: 'Password',
          icon : 'lock',
          step: 3
        }
      ];
    //You can subscribe to the Event 'step:changed' to handle the current step
    this.evts.subscribe('step:changed', step => {
      //Handle the current step if you need
      this.currentStep = step;
      //Set the step condition to the default value
      this.stepCondition = this.stepDefaultCondition;
      this.toggleCondition()
    });
    this.evts.subscribe('step:next', () => {
      //Do something if next
      if (this.currentStep == 2) this.setSubscriberId();
      else if (this.currentStep == 3) this.setSMS();
    });
    this.evts.subscribe('step:back', () => {
      //Do something if back
      console.log('Back pressed: ', this.currentStep);
    });
  }

  ngOnInit() {
    this.setupNative();
  }

  async setupNative() {
    try {
      await this.platform.ready().then( () => {
        if(this.platform.is('cordova'))
          this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT).then(() => console.log("locked"));
      });
      (await this.faio.isAvailable())
        ? (this.finger = true)
        : (this.finger = false);
    } catch (e) {
      console.log(e);
    }
  }

  /*onKeyDown(e) {
    if (e.key === "Enter") {
      if (e.target.name === "login") {
        let element = document.getElementById('btnstep1');
        element.click()
      } else if (e.target.name === "smsOtp") {
        let element = document.getElementById('btnstep2');
        element.click()
      } else if (e.target.name === "password") {
        let element = document.getElementById('btnstep3');
        element.click()
      }
    }
  }*/

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
    this.disabled = true;
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

  onFinish() {
    this.setPassword()
  }

  toggleCondition() {
    if(this.currentStep == 1) this.stepCondition = (this.form.login != "" && this.form.login != null)
    else if(this.currentStep == 2) this.stepCondition = (this.form.smsOtp != "" && this.form.smsOtp != null && this.form.smsOtp.length == 6 && Number(this.form.smsOtp))
    else if(this.currentStep == 3) this.stepCondition = (this.form.password != "" && this.form.password != null)
  }

}
