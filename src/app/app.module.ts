import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AccountDetailsPage } from '../pages/account-details/account-details';

import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { AccountTransactionHistoryPage } from '../pages/account-transaction-history/account-transaction-history';
import { CoopTransfersPage } from '../pages/coop-transfers/coop-transfers';

import { FingerPrintTestPage } from '../pages/finger-print-test/finger-print-test';
import { TestApiPage } from '../pages/test-api/test-api';
import { HttpClientModule } from '@angular/common/http';
import { MenuComponent } from './menu.component';
import { LoginPage } from '../pages/authentication/login/login';
import { SmsPage } from '../pages/authentication/sms/sms';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { IonicStepperModule } from 'ionic-stepper';

import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';

import { FingerprintAIO } from '@ionic-native/fingerprint-aio';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AccountDetailsPage,
    AccountTransactionHistoryPage,
    CoopTransfersPage,
    FingerPrintTestPage,
    TestApiPage,
    LoginPage,
    MenuComponent,
    SmsPage
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStepperModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AccountDetailsPage,
    AccountTransactionHistoryPage,
    CoopTransfersPage,
    FingerPrintTestPage,
    TestApiPage,
    LoginPage,
    MenuComponent,
    SmsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    File,
    FileOpener,
    AuthenticationProvider,
    FingerprintAIO
  ]
})
export class AppModule {}
