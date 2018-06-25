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
//import { MenuComponent } from './menu.component';
import { LoginPage } from '../pages/login/login';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { IonicStepperModule } from 'ionic-stepper';

import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';

import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { IonSimpleWizard } from '../pages/ion-simple-wizard/ion-simple-wizard.component';
import { IonSimpleWizardStep } from '../pages/ion-simple-wizard/ion-simple-wizard.step.component';
import { Keyboard } from '@ionic-native/keyboard';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { VirementConfirmationPage } from '../pages/virement-confirmation/virement-confirmation';
import { SepaTransfersPage } from '../pages/sepa-transfers/sepa-transfers';
import { DataProvider } from '../providers/data/data';
import { StandingOrdersPage } from '../pages/standing-orders/standing-orders';
import { UtilityPage } from '../pages/utility/utility';
import { UtilityConfirmationPage } from '../pages/utility-confirmation/utility-confirmation';


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
    VirementConfirmationPage,
    SepaTransfersPage,
    IonSimpleWizard,
    IonSimpleWizardStep,
    StandingOrdersPage,
    UtilityPage,
    UtilityConfirmationPage
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
    VirementConfirmationPage,
    SepaTransfersPage,
    StandingOrdersPage,
    UtilityPage,
    UtilityConfirmationPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    File,
    FileOpener,
    AuthenticationProvider,
    FingerprintAIO,
    Keyboard,
    ScreenOrientation,
    DataProvider
  ]
})
export class AppModule {}
