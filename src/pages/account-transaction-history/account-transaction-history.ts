import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AccountTransactionHistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-account-transaction-history',
  templateUrl: 'account-transaction-history.html',
})
export class AccountTransactionHistoryPage {

  isSearch = false;
  header = "Account history transaction";
  date = new Date();

  @Input() selectedAccount;
  @Input() selectedCategory;
  @Input() selectedRecord;
  @Input() selectedOperator;
  @Input() fromDate;
  @Input() toDate;

  items = [];

  accounts = [
    {
      'category': 'test1',
      'account': '085-7210867-0',
      'desc': 'desc1',
      'current': 'current1',
      'available': 'available1',
      'availableToday': 'availableToday1',
      'reserved': 'reserved1',
      'uncleared': 'uncleared1',
      'overdraft': 'overdraft1',
      'maturity': 'maturity1',
      'transactions': [{
        'hidden': true,
        'date': this.date.toLocaleDateString(),
        'desc': 'desc',
        'amount': '100',
        'type': 'credit'
      },
      {
        'hidden': true,
        'date': this.date.toLocaleDateString(),
        'desc': 'desc',
        'amount': '100',
        'type': 'debit'
      }]
    }, {
      'category': 'test2',
      'account': '085-7210822-1',
      'desc': 'desc2',
      'current': 'current2',
      'available': 'available2',
      'availableToday': 'availableToday2',
      'reserved': 'reserved2',
      'uncleared': 'uncleared2',
      'overdraft': 'overdraft2',
      'maturity': 'maturity2',
      'transactions': [{
        'hidden': true,
        'date': this.date.toLocaleDateString(),
        'desc': 'desc',
        'amount': '200',
        'type': 'credit'
      },
      {
        'hidden': true,
        'date': this.date.toLocaleDateString(),
        'desc': 'desc',
        'amount': '200',
        'type': 'debit'
      }]
    }]

  categories = [
    {
      'category': 'test1'
    }, {
      'category': 'test2'
    }];

  records = [
    {
      'record': 'both'
    }, {
      'record': 'debit'
    },
    {
      'record': 'credit'
    }];

  operators = [
    {
      operator: '='
    },
    {
      operator: '<='
    },
    {
      operator: '>='
    },
    {
      operator: '<'
    },
    {
      operator: '>'
    }]


  selected = {
    'hidden': true,
    'date': '',
    'desc': '',
    'amount': '',
    'type': ''
  }


  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.selectedOperator = this.operators[0].operator;
    this.selectedRecord = this.records[0].record;
  }

  showSearch() {
    this.isSearch = true;
    this.header = "Search";
  }

  hideSearch() {
    this.isSearch = false;
    this.header = "Account history transaction";
  }

  /*onChange() {
    this.selectedAccount = null;
    this.accounts.length = 0;
    for (let key of this.data) {
      if (key.category == this.selectedCategory)
        this.accounts.push(key);
    }
  }*/

  send(element) {
    if (element.hidden) {
      this.selected.hidden = true;
      element.hidden = false;
      this.selected = element;
    }
    else {
      element.hidden = true;
      this.selected = element;
    }
  }

  search(){
    this.hideSearch()
  }

}
