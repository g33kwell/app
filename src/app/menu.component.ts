import { Component, ViewChild } from '@angular/core';
import { Nav } from 'ionic-angular';

import { HomePage } from '../pages/home/home';
import { AccountDetailsPage } from '../pages/account-details/account-details';
import { AccountTransactionHistoryPage } from '../pages/account-transaction-history/account-transaction-history';
import { CoopTransfersPage } from '../pages/coop-transfers/coop-transfers';

@Component({
  templateUrl: 'menu.html'
})
export class MenuComponent {

  appPages = [
    {
      'group': 'Accounts',
      'elements': [
        { title: 'My accounts', name: 'HomePage', component: HomePage, icon: 'calendar' },
        { title: 'Account details', name: 'AccountDetailsPage', component: AccountDetailsPage, icon: 'contacts' },
        { title: 'Account transaction history', name: 'AccountTransactionHistoryPage', component: AccountTransactionHistoryPage, icon: 'cash' }
      ]
    },
    {
      'group': 'Transfers',
      'elements': [
        { title: 'COOP transfers', name: 'CoopTransfersPage', component: CoopTransfersPage, icon: 'calendar' },
        { title: 'SEPA transfers', name: 'SepaTransfersPage', component: null, icon: 'contacts' },
        { title: 'Standing orders', name: 'StandingOrdersPage', component: null, icon: 'cash' }
      ]
    }
  ];


  @ViewChild(Nav) nav: Nav
  rootPage: any = HomePage;

  constructor() {}

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

