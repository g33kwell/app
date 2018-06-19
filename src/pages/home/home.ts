import { Component } from "@angular/core";
import { NavController, LoadingController, FabContainer, MenuController, App, Platform } from "ionic-angular";
import { LoginPage } from "../login/login";
import { ScreenOrientation } from "@ionic-native/screen-orientation";
import { DataProvider } from "../../providers/data/data";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {

  accounts;

  selectedAccount: any = {
    'account' : '',
    'desc' : '',
    'balance' : '',
    'type' : '',
    'hidden' : true,
    'circle' : "",
    'background' : ""
  };

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, private menuController: MenuController,
     private app: App, private platform: Platform, private screenOrientation:ScreenOrientation, private dataProvider: DataProvider) {
    this.platform.ready().then(() => {
      if (this.platform.is("cordova"))
        this.screenOrientation.unlock()
    });
    this.accounts = this.dataProvider.getAccounts();
    this.accounts.forEach(element => {
      element['circle'] = 'add-circle',
      element['hidden'] = true;
      element['background'] = 'white';
      element['type'] = 'self';
    });
    this.accounts[0]['type'] = 'join'
  }

  logout(){
    this.app.getRootNav().setRoot(LoginPage)
  }

  ionViewWillEnter() {
    this.menuController.enable(true, 'myMenu');
  }

  send(element, fab?: FabContainer){
    if(element.hidden){
      element.circle = "remove-circle"
      this.selectedAccount.hidden = true;
      this.selectedAccount.background = "white"
      this.selectedAccount.circle = "add-circle"
      element.hidden = false;
      element.background = "greenyellow";
      this.selectedAccount = element;
    }
    else{
      element.circle = "add-circle"
      element.hidden = true;
      element.background = "white";
      this.selectedAccount = element;
    }
  }

  filterItemsOfType(type) {
    return this.accounts.filter(x => x['type'] == type);
  }
}
