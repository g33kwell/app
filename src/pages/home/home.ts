import { Component } from "@angular/core";
import { NavController, LoadingController, FabContainer } from "ionic-angular";

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

  selected: any = {
    'account' : '',
    'desc' : '',
    'balance' : '',
    'hidden' : true
  };

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController) {
  }

  ngAfterViewInit() {
    /*let loading = this.loadingCtrl.create({
      content: `<p><ion-spinner name="bubbles"></ion-spinner></p><p>Loading...</p>`,
      duration: 3000
    });

    loading.present();*/
      
  }

  send(element, fab?: FabContainer){
    if(element.hidden){
      this.selected.hidden = true;
      element.hidden = false;
      this.selected = element;
    }
    else{
      element.hidden = true;
      this.selected = element;
      if (fab !== undefined) {
        fab.close();
      }
    }
  }
}
