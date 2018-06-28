import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  App,
  LoadingController
} from "ionic-angular";
import { VirementConfirmationPage } from "../virement-confirmation/virement-confirmation";
import { HomePage } from "../home/home";
import { DataProvider } from "../../providers/data/data";
import { LoginPage } from "../login/login";

/**
 * Generated class for the CoopTransfersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-coop-transfers",
  templateUrl: "coop-transfers.html"
})
export class CoopTransfersPage {
  isStanding = false;
  transferType = "Transfer to a connected account";
  selectedAccount;
  accounts;
  accountToCredit;
  accountToCreditInput;
  transaction: ITransaction = <ITransaction>{};
  today = new Date().toISOString();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public app: App,
    public dataProvider: DataProvider,
    public loadingCtrl: LoadingController
  ) {
    this.accounts = this.dataProvider.getAccounts();
    this.selectedAccount = this.accounts[0];
    this.accountToCredit = this.accounts[1];
  }

  logout(){
    this.app.getRootNav().setRoot(LoginPage)
  }

  standing() {
    if (this.isStanding) this.isStanding = false;
    else this.isStanding = true;
  }

  filterAccountsToCredit() {
    return this.accounts.filter(x => x.account != this.selectedAccount.account)
  }

  confirmVirement() {
    if(this.transferType == "Transfer to a connected account") this.transaction.credited = this.accountToCredit.account;
    else this.transaction.credited = this.accountToCreditInput;
    this.transaction.debited = this.selectedAccount.account;

    this.transaction.type = "Coop";

    let loading = this.loadingCtrl.create({
      content: "Please wait..."
    });

    loading.present();
    setTimeout(() => {
      loading.dismiss().then(res =>
        this.navCtrl.push(VirementConfirmationPage, {
          transaction: this.transaction
        })
      );
    }, 500);
  }

  cancel() {
    this.app.getRootNav().setRoot(HomePage);
  }

  selectAccountToCredit() {
    if(this.transaction.type == "Transfer to a connected account")
    this.accountToCredit = this.filterAccountsToCredit()[0]
    
  }
}
