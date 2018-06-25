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
      iban: "CY17007010100000000020062734"
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
      iban: "CY17007010100000000072108221"
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
      iban: "CY17007010100000000072108720"
    }
  ];

  private transactions: Array<ITransaction> = [
    {
      debited: "085-7210872-0",
      credited: "010-2006273-4",
      amount: "32.65",
      firstExec: "2018-06-10",
      endDate: "2019-06-10",
      periodicity: "Yearly",
      desc: "Αντίθετα με αυτό",
      standing: true,
      type: "Coop",
  }, 
  {
    debited: "085-7210822-1",
    credited: "085-7210872-0",
    amount: "50.00",
    firstExec: "2018-06-10",
    endDate: "",
    periodicity: "",
    desc: "στην ενότητα",
    standing: false,
    type: "Coop",
  },
  {
    debited: "010-2006273-4",
    credited: "CY17 0070 1010 0000 0000 7210 8720",
    amount: "137.50",
    firstExec: "2018-06-10",
    endDate: "",
    periodicity: "",
    desc: "ένα κομμάτι",
    standing: false,
    type: "Sepa",
  },
  {
    debited: "010-2006273-4",
    credited: "023-2006273-4",
    amount: "1200.00",
    firstExec: "2018-06-22",
    endDate: "2024-06-22",
    periodicity: "Monthly",
    desc: "στο διαδίκτυο",
    standing: true,
    type: "Coop",
  }
];

private organisations: any = [
  {
    name: "ΔΗΜΟΣ ΑΓΛΑΝΤΖ/AGLANTZIA MUNICI",
    account: "012-0052760-0"
  },
  {
    name: "ΑΛΙΚΟ ΑΣΦΑΛΙΣΤΙΚΗ/ALICO INSURA",
    account: "012-0052778-5"
  },
  {
    name: "CABLENET",
    account: "012-0096760-4"
  },
  {
    name: "ATHK/CYTA",
    account: "012-0141760-0"
  }
]

private references: any = ['S1234567APTE01','EDNS1234567A','VCS1234567A','SES1234567A']

  constructor() {
    console.log("Hello DataProvider Provider");
  }

  getReferences() {
    return this.references
  }

  getOrganisations() {
    return this.organisations;
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

  getStandingOrders(account) {
    return this.transactions.filter(
      x => x.debited == account && x.standing == true
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

      debit.current = (Number(debit.current) - Number(transaction.amount)).toString();
      debit.available = (Number(debit.available) - Number(transaction.amount)).toString();

      if(credit){
        credit.current = (Number(credit.current) + Number(transaction.amount)).toString();
        credit.available = (Number(credit.available) + Number(transaction.amount)).toString();
      }
    }
    else {
      let debit = this.accounts.filter(
        x => x.account == transaction.debited
      )[0];

      debit.current = (Number(debit.current) - Number(transaction.amount)).toString();
      debit.available = (Number(debit.available) - Number(transaction.amount)).toString();

    }
  }
}
