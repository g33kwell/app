import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AccountDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-account-details',
  templateUrl: 'account-details.html',
})
export class AccountDetailsPage {
  @Input() selectedAccount = {};
  date = new Date();
  data = [{
    'category' : 'test1',
    'account' : '085-7210867-0',
    'desc' : 'desc1',
    'current' : 'current1',
    'available' : 'available1',
    'availableToday' : 'availableToday1',
    'reserved' : 'reserved1',
    'uncleared' : 'uncleared1',
    'overdraft' : 'overdraft1',
    'maturity' : 'maturity1'
  },{
    'category' : 'test2',
    'account' : '085-7210822-1',
    'desc' : 'desc2',
    'current' : 'current2',
    'available' : 'available2',
    'availableToday' : 'availableToday2',
    'reserved' : 'reserved2',
    'uncleared' : 'uncleared2',
    'overdraft' : 'overdraft2',
    'maturity' : 'maturity2'
  }]

  accounts = [];

  category = [{
    'category' : 'test1'
  }, {
    'category' : 'test2'
  }];

  selected = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountDetailsPage');
  }

  onChange(element){
    this.selected = false;
    this.selectedAccount = null;
    this.accounts.length = 0;
    for(let key of this.data){
      if(key.category == element)
        this.accounts.push(key);
    }
  }

  showPrint() {
    if(this.selectedAccount)
      this.selected = true;
  }

  genPdf(){
    
  }

}
