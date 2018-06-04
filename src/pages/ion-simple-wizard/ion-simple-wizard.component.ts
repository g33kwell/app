import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Events, LoadingController, AlertController } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { WizardAnimations } from './ion-simple-wizard-animations';

@Component({
  selector: 'ion-simple-wizard',
  templateUrl: 'ion-simple-wizard.component.html',
  animations: WizardAnimations.btnRotate
})
export class IonSimpleWizard {
  @Input() finishIcon = 'send';//Default
  @Input() showSteps: boolean=true;//Default
  @Input() step = 1;//Default
  @Output() finish = new EventEmitter();
  @Output() stepChange = new EventEmitter();
  public steps = 0;//Innitial
  public hideWizard = false;//Default
  @Input() stepCondition = true;//Default
  @Input() backBtnDisabled = false;
  @Input() form;

  //////////////////////////////////
  smsOtp = "123456";
  login = "144IICD1D"
  //////////////////////////////////

  constructor(public evts: Events, private keyboard: Keyboard, private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) {
  }

  ngOnInit() {
    /**
     * Hide the wizard buttons when the keyboard is open
     */
    this.keyboard.onKeyboardShow().subscribe(() => {
      this.hideWizard = true;
    });
    this.keyboard.onKeyboardHide().subscribe(() => {
      this.hideWizard = false;
    })
  }
  /**
   * @return {number} New Steps
   */
  public addStep() {
    const newSteps = this.steps + 1;
    this.steps = newSteps;
    return newSteps;
  }
  /**
   * @return {boolean} true if is the final step
   */
  isOnFinalStep() {
    return this.step === this.steps;
  }
  /**
   * @return {boolean} the current step condition
   */
  getCondition() {
    return this.stepCondition;
  }
  /**
   * @return {boolean} true if the the step is the first 
   */
  isOnFirstStep() {
    return this.step === 1;
  }
  /**
   * @method back button event and emit Event Called 'step:back'
   */
  back() {
    this.stepChange.emit(this.step - 1);
    this.evts.publish('step:back');

  }
  /**
   * @method next button event and emit  Event Called 'step:next'
   */
  next() {
    let loading = this.loadingCtrl.create({
      content: "Please wait..."
    });

    loading.present();

    setTimeout(() => {
      if(this.step == 1){
        if(this.login == this.form.login){
          this.stepChange.emit(this.step + 1);
          this.evts.publish('step:next');
        }else{
          this.form.login = ""
          this.presentAlert("Login not found!")
        }
      }else if (this.step == 2) {
        if(this.smsOtp == this.form.smsOtp){
          this.stepChange.emit(this.step + 1);
          this.evts.publish('step:next');
        }else{
          this.form.smsOtp = ""
          this.presentAlert("Sms incorrect!")
        }
      }
      loading.dismiss();
    }, 1000);
    
  }

  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: msg,
      buttons: ['Dismiss']
    });
    alert.present();
  }

}
