import { Injectable } from "@angular/core";

/*
  Generated class for the AuthenticationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {
  private accounts = [
    {
      account: "010-2006273-4",
      desc: "ΛΟΓΑΡΙΑΣΜΟΙ ΟΨΕΩΣ",
      current: "4121.33",
      available: "4121.33",
      availableToday: "4121.33",
      reserved: "0.00",
      uncleared: "0.00",
      overdraft: "0.00",
      maturity: "",
      bic: "CCBKCY2N",
      iban: "CY17 0070 1010 0000 0000 2006 2734"
    },
    {
      account: "085-7210822-1",
      desc: "ΛΟΓΑΡΙΑΣΜΟΙ ΟΨΕΩΣ",
      current: "32.01",
      available: "32.01",
      availableToday: "32.01",
      reserved: "0.00",
      uncleared: "0.00",
      overdraft: "0.00",
      maturity: "",
      bic: "CCBKCY2N",
      iban: "CY17 0070 1010 0000 0000 7210 8221"
    },
    {
      account: "085-7210872-0",
      desc: "ΛΟΓΑΡΙΑΣΜΟΙ ΟΨΕΩΣ",
      current: "18.01",
      available: "18.01",
      availableToday: "18.01",
      reserved: "0.00",
      uncleared: "0.00",
      overdraft: "0.00",
      maturity: "",
      bic: "CCBKCY2N",
      iban: "CY17 0070 1010 0000 0000 7210 8720"
    }
  ];

  private transactions: Array<ITransaction> = [];

  constructor() {
    console.log("Hello DataProvider Provider");
  }

  getAccounts() {
    return this.accounts;
  }

  addTransaction(transaction) {
    this.transactions.push(transaction);
    this.updateAccounts(transaction);
  }

  getTransactions(account) {
    return this.transactions.filter(
      x => x.debited == account || x.credited == account
    );
  }

  updateAccounts(transaction: ITransaction) {
    if (transaction.type == "Coop") {
      let debit = this.accounts.filter(
        x => x.account == transaction.debited
      )[0];
      let credit = this.accounts.filter(
        x => x.account == transaction.credited
      )[0];

      this.accounts.filter(x => x.account == transaction.debited)[0].current = (
        Number(debit.current) - Number(transaction.amount)
      ).toString();

      this.accounts.filter(
        x => x.account == transaction.credited
      )[0].current = credit.current = (
        Number(credit.current) + Number(transaction.amount)
      ).toString();
    }
  }
}
