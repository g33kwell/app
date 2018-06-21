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

  standing() {
    if (this.isStanding) this.isStanding = false;
    else this.isStanding = true;
  }

  confirmVirement() {
    this.transaction.debited = this.selectedAccount.account;
    this.transaction.credited = this.accountToCredit.account;
    this.transaction.type = "Coop";

    if (this.transaction.standing) {
      let t = this.transaction.fistExec;
      this.transaction.date = t;
      console.log(this.transaction);
    }
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
}
