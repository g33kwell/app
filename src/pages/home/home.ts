import { Component } from "@angular/core";
import { NavController, LoadingController, FabContainer, MenuController, App, Platform } from "ionic-angular";
import { LoginPage } from "../login/login";
import { ScreenOrientation } from "@ionic-native/screen-orientation";

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

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, private menuController: MenuController,
     private app: App, private platform: Platform, private screenOrientation:ScreenOrientation) {
    this.platform.ready().then(() => {
      if (this.platform.is("cordova"))
        this.screenOrientation.unlock()
    });
  }

  ngAfterViewInit() {
    /*let loading = this.loadingCtrl.create({
      content: `<p><ion-spinner name="bubbles"></ion-spinner></p><p>Loading...</p>`,
      duration: 3000
    });

    loading.present();*/
      
  }

  logout(){
    this.app.getRootNav().setRoot(LoginPage)
  }

  ionViewWillEnter() {
    this.menuController.enable(true, 'myMenu');
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
