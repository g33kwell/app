import { Component } from "@angular/core";
import { NavController } from "ionic-angular";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {

  data = [
    [{
      'account' : '0-857210867-0 EUR',
      'desc' : 'Description',
      'balance' : '9276864387',
      'hidden' : true
    },{
      'account' : '0-857210867-0 EUR',
      'desc' : 'Description',
      'balance' : '9276864387',
      'hidden' : true
    }],
    [{
      'account' : '0-857210867-0 EUR',
      'desc' : 'Description',
      'balance' : '9276864387',
      'hidden' : true
    },{
      'account' : '0-857210867-0 EUR',
      'desc' : 'Description',
      'balance' : '9276864387',
      'hidden' : true
    },{
      'account' : '0-857210867-0 EUR',
      'desc' : 'Description',
      'balance' : '9276864387',
      'hidden' : true
    }]
  ];

  selected = false;

  constructor(public navCtrl: NavController) {
    console.log(this.data)
  }

  send(element){
    if(element.hidden){
      element.hidden = false;
      this.selected = true;
    }
    else{
      element.hidden = true;
      this.selected = false;
    }
  }
}
