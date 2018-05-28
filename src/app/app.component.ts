import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MenuComponent } from './menu.component';
import { Page } from 'ionic-angular/navigation/nav-util';
import { LoginPage } from '../pages/authentication/login/login';
import { AuthenticationProvider } from '../providers/authentication/authentication';

@Component({
  template: '<ion-nav #baseNav></ion-nav>'
})
export class MyApp {

  @ViewChild('baseNav') nav: Nav;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private authenticationProvider: AuthenticationProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  ngOnInit() {
    const componentStack : Array<Page> = [MenuComponent];

    if (!this.authenticationProvider.isloggedIn) {
      componentStack.push(LoginPage);
    }
    
    this.nav.insertPages(0, componentStack, { animate: false })
  }

}

