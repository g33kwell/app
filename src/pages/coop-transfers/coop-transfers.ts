import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CoopTransfersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-coop-transfers',
  templateUrl: 'coop-transfers.html',
})
export class CoopTransfersPage {

  isStanding = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  standing() {
    if (this.isStanding)
      this.isStanding = false;
    else
      this.isStanding = true;
  }

}
