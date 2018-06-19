import { Injectable } from '@angular/core';

/*
  Generated class for the AuthenticationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {
  
    private accounts =
    [{
      'account': '085-7210867-0',
      'desc': 'desc1',
      'current': 'current1',
      'available': 'available1',
      'availableToday': 'availableToday1',
      'reserved': 'reserved1',
      'uncleared': 'uncleared1',
      'overdraft': 'overdraft1',
      'maturity': 'maturity1'
    }, {
      'account': '085-7210822-1',
      'desc': 'desc2',
      'current': 'current2',
      'available': 'available2',
      'availableToday': 'availableToday2',
      'reserved': 'reserved2',
      'uncleared': 'uncleared2',
      'overdraft': 'overdraft2',
      'maturity': 'maturity2'
    },
    {
      'account': '085-7210872-0',
      'desc': 'desc3',
      'current': 'current3',
      'available': 'available3',
      'availableToday': 'availableToday3',
      'reserved': 'reserved3',
      'uncleared': 'uncleared3',
      'overdraft': 'overdraft3',
      'maturity': 'maturity3'
    }];

    private transactions = [];

  constructor() {
    console.log('Hello DataProvider Provider');
  }

  getAccounts() {
      return this.accounts;
  }

  addTransaction(transaction) {
    this.transactions.push(transaction);
  }

  getTransactions(account) {
    return this.transactions.filter(x => x.debitedAccount == account || x.creditedAccount == account);
  }

}
