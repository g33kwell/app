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
import { SepaTransfersPage } from '../pages/sepa-transfers/sepa-transfers';
import { StandingOrdersPage } from '../pages/standing-orders/standing-orders';
import { UtilityPage } from '../pages/utility/utility';
import { SetupFingerPrintPage } from '../pages/setup-finger-print/setup-finger-print';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { OrderChequeBookPage } from '../pages/order-cheque-book/order-cheque-book';
import { ChequeInquiryPage } from '../pages/cheque-inquiry/cheque-inquiry';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {

  fingerAvailable = false;

  appPages = [
    {
      'group': 'Accounts',
      'elements': [
        { title: 'My accounts', name: 'HomePage', component: HomePage, icon: 'paper' },
        { title: 'Account details', name: 'AccountDetailsPage', component: AccountDetailsPage, icon: 'document' },
        { title: 'Account transaction history', name: 'AccountTransactionHistoryPage', component: AccountTransactionHistoryPage, icon: 'archive' }
      ]
    },
    {
      'group': 'Transfers',
      'elements': [
        { title: 'COOP transfers', name: 'CoopTransfersPage', component: CoopTransfersPage, icon: 'cash' },
        { title: 'SEPA transfers', name: 'SepaTransfersPage', component: SepaTransfersPage, icon: 'logo-euro' },
        { title: 'Standing orders', name: 'StandingOrdersPage', component: StandingOrdersPage, icon: 'briefcase' }
      ]
    },
    {
      'group': 'Services',
      'elements': [
        { title: 'Utility Payments', name: 'UtilityPage', component: UtilityPage, icon: 'cash' },
        { title: 'Order Cheque Book', name: 'OrderChequeBookPage', component: OrderChequeBookPage, icon: 'book' },
        { title: 'Cheque Inquiry', name: 'ChequeInquiryPage', component: ChequeInquiryPage, icon: 'archive' },
      ]
    },
    {
      'group': 'Security',
      'elements': [
        { title: 'Setup Fingerprint', name: 'SetupFingerPrintPage', component: SetupFingerPrintPage, icon: 'finger-print' }
      ]
    }
  ];


  @ViewChild(Nav) nav: Nav
  rootPage: any = OrderChequeBookPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, faio: FingerprintAIO) {
    platform.ready().then(() => {

      faio.isAvailable().then(() => this.fingerAvailable = true)
                            .catch( () => this.fingerAvailable = false)


      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // let status bar overlay webview
      statusBar.overlaysWebView(false);

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


