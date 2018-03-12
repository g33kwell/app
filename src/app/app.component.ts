import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { AccountDetailsPage } from '../pages/account-details/account-details';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  appPages = [
    { title: 'My accounts', name: 'HomePage', component: HomePage, icon: 'calendar' },
    { title: 'Account details', name: 'AccountDetailsPage', component: AccountDetailsPage, icon: 'contacts' }
  ];

  @ViewChild(Nav) nav: Nav
  rootPage: any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  openPage(p) {
    this.nav.setRoot(p.component);
  }

  isActive(p) {
    if  (this.nav.getActive()  &&  this.nav.getActive().name  === p.name) {
      return  'primary';
    }
    return;
  }
}

