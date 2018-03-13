import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


/**
 * Generated class for the AccountDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-account-details',
  templateUrl: 'account-details.html',
})
export class AccountDetailsPage {

  letterObj = {
    to: '',
    from: '',
    text: ''
  }
 
  pdfObj = null;

  @Input() selectedAccount = {};
  date = new Date();
  data = [{
    'category' : 'test1',
    'account' : '085-7210867-0',
    'desc' : 'desc1',
    'current' : 'current1',
    'available' : 'available1',
    'availableToday' : 'availableToday1',
    'reserved' : 'reserved1',
    'uncleared' : 'uncleared1',
    'overdraft' : 'overdraft1',
    'maturity' : 'maturity1'
  },{
    'category' : 'test2',
    'account' : '085-7210822-1',
    'desc' : 'desc2',
    'current' : 'current2',
    'available' : 'available2',
    'availableToday' : 'availableToday2',
    'reserved' : 'reserved2',
    'uncleared' : 'uncleared2',
    'overdraft' : 'overdraft2',
    'maturity' : 'maturity2'
  }]

  accounts = [];

  category = [{
    'category' : 'test1'
  }, {
    'category' : 'test2'
  }];

  selected = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private file: File, private fileOpener: FileOpener, private plt: Platform) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountDetailsPage');
  }

  onChange(element){
    this.selected = false;
    this.selectedAccount = null;
    this.accounts.length = 0;
    for(let key of this.data){
      if(key.category == element)
        this.accounts.push(key);
    }
  }

  showPrint() {
    if(this.selectedAccount)
      this.selected = true;
  }

  genPdf(){
    var docDefinition = {
      content: [
        { text: 'REMINDER', style: 'header' },
        { text: new Date().toTimeString(), alignment: 'right' },
 
        { text: 'From', style: 'subheader' },
        { text: this.letterObj.from },
 
        { text: 'To', style: 'subheader' },
        this.letterObj.to,
 
        { text: this.letterObj.text, style: 'story', margin: [0, 20, 0, 20] },
 
        {
          ul: [
            'Bacon',
            'Rips',
            'BBQ',
          ]
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 0]
        },
        story: {
          italic: true,
          alignment: 'center',
          width: '50%',
        }
      }
    }
    this.pdfObj = pdfMake.createPdf(docDefinition);
    this.downloadPdf();
  }

  downloadPdf() {
    if (this.plt.is('cordova')) {
      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });
 
        // Save the PDF to the data Directory of our App
        this.file.writeFile(this.file.dataDirectory, 'file.pdf', blob, { replace: true }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          this.fileOpener.open(this.file.dataDirectory + 'file.pdf', 'application/pdf');
        })
      });
    } else {
      // On a browser simply use download!
      this.pdfObj.download();
    }
  }

}
