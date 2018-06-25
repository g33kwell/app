import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DataProvider } from '../../providers/data/data';
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



  pdfObj = null;

  date = new Date();

  selectedAccount;

  accounts;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private file: File, private fileOpener: FileOpener, private plt: Platform, private dataProvider: DataProvider) {
      this.accounts = this.dataProvider.getAccounts()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountDetailsPage');
    this.selectedAccount = this.accounts[0]
  }

  genPdf() {
    var docDefinition = {
      content: [
        {
          image: 'data:image/png;base64,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',
          alignment: 'center'
        },

        {
          text: 'Printed on ' + this.date.toLocaleDateString(), alignment: 'center', margin: [0, 15, 0, 0], color: '#00B2AA'
        },

        {
          layout: 'noBorders',
          margin: [0, 15, 0, 0],
          table: {
            widths: ['50%', '*'],
            body: [
              [{ text: 'Greek/Details IBAN/BIC', style: 'header', colSpan: 2, alignment: 'center' }, {}],
              [{ text: 'Something greek', style: 'subheader', colSpan: 2, alignment: 'center' }, {}],
              [{ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 500, y2: 0, lineWidth: 0.1 }], margin: [0, 0, 0, 15] }, {}],
              [{ margin: [0, 0, 0, 70], text: 'Greek/Customer', style: 'cell' }, { fontSize: 18, text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor' }],
              [{ margin: [0, 0, 0, 30], text: 'Greek/Account', style: 'cell' }, { fontSize: 18, text: '085-7210867-0 EUR' }],
              [{ margin: [0, 0, 0, 30], text: 'Greek Greek/Account Type', style: 'cell' }, { fontSize: 18, text: 'Description' }],
              [{ text: 'IBAN', style: 'ibic' }, { text: 'BIC', style: 'ibic' }],
              [{ text: 'CY69 0070 8510 0000 0000 7210 8670', style: 'iban' }, { text: 'CCBKCY2N', style: 'iban' }],
            ]
          }
        },

        {
          text: 'C.C.S = COOP Credit Society', style: 'story', margin: [350, 100, 0, 0]
        },
        {
          text: 'C.S.B = Credit Savings Bank', style: 'story', margin: [350, 5, 0, 0]
        },
        { canvas: [{ type: 'line', x1: 10, y1: 10, x2: 500, y2: 10, lineWidth: 0.1 }] },
        {
          text: '(Το παρόν μπορεί να χρησιμοποιηθεί για σκοπούς πληρωμής  στον λογαριασμό σας.)', style: 'footer', margin: [0, 10, 0, 0]
        },
        {
          text: '(This document may be used for payment purposes to your account.)', style: 'footer', margin: [0, 10, 0, 0]
        }
      ],

      styles: {
        header: {
          fontSize: 20,
          bold: true,
          color: '#00B2AA',
          alignment: 'center'
        },
        subheader: {
          margin: [0, 15, 0, 15],
          fontSize: 16,
          bold: true,
          color: '#00B2AA',
          alignment: 'center'
        },
        cell: {
          fontSize: 14,
          bold: true,
          color: '#00B2AA',
        },
        iban: {
          margin: [0, 15, 0, 0],
          alignment: 'center',
          fontSize: 14,
          bold: true,
          color: '#00B2AA',
        },
        ibic: {
          margin: [0, 15, 0, 0],
          decoration: 'underline',
          fontSize: 14,
          bold: true,
          color: '#00B2AA',
          alignment: 'center'
        },
        story: {
          italic: true,
          color: '#00B2AA',
        },
        footer: {
          italic: true,
          color: '#00B2AA',
          alignment: 'center'
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
