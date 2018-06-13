import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
//import { MenuComponent } from './menu.component';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { AccountDetailsPage } from '../pages/account-details/account-details';
import { AccountTransactionHistoryPage } from '../pages/account-transaction-history/account-transaction-history';
import { CoopTransfersPage } from '../pages/coop-transfers/coop-transfers';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {

  appPages = [
    {
      'group': 'Accounts',
      'elements': [
        { title: 'My accounts', name: 'HomePage', component: HomePage, icon: 'calendar' },
        { title: 'Account details', name: 'AccountDetailsPage', component: AccountDetailsPage, icon: 'contacts' },
        { title: 'Account transaction history', name: 'AccountTransactionHistoryPage', component: AccountTransactionHistoryPage, icon: 'archive' }
      ]
    },
    {
      'group': 'Transfers',
      'elements': [
        { title: 'COOP transfers', name: 'CoopTransfersPage', component: CoopTransfersPage, icon: 'cash' },
        { title: 'SEPA transfers', name: 'SepaTransfersPage', component: null, icon: 'cash' },
        { title: 'Standing orders', name: 'StandingOrdersPage', component: null, icon: 'cash' }
      ]
    },
    {
      'group': 'Services',
      'elements': [
        { title: 'Utility Payments', name: 'CoopTransfersPage', component: CoopTransfersPage, icon: 'calendar' },
        { title: 'Cheque Inquiry', name: 'SepaTransfersPage', component: null, icon: 'contacts' },
        { title: 'Order Chequebook', name: 'StandingOrdersPage', component: null, icon: 'cash' },
        { title: 'Setup Fingerprint', name: 'StandingOrdersPage', component: null, icon: 'finger-print' }
      ]
    }
  ];


  @ViewChild(Nav) nav: Nav
  rootPage: any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // let status bar overlay webview
      statusBar.overlaysWebView(true);

      // set status bar to white
      statusBar.backgroundColorByHexString('#008983');
      //statusBar.styleDefault();
      splashScreen.hide();
    });

  }

  openPage(p) {
    this.nav.setRoot(p.component);
  }

  isActive(p) {
    if (this.nav.getActive() && this.nav.getActive().name === p.name) {
      return 'primary';
    }
    return;
  }
}

  

  /*ngOnInit() {
    const componentStack : Array<Page> = [MenuComponent];

    /*if (!this.authenticationProvider.isloggedIn) {
      componentStack.push(LoginPage);
    }
    
    this.nav.insertPages(0, componentStack, { animate: false })
  }*/


