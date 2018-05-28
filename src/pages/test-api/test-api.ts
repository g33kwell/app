import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http'
declare var v3: any;
declare var ArcotClient: any;


/**
 * Generated class for the TestApiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-test-api',
  templateUrl: 'test-api.html',
})
export class TestApiPage {

  arcotV6Form = <IArcotV6Form>{}; 
  virementForm = <IVirementForm>{};
  listeComptesAbonne = [];
  arcotclient = new ArcotClient()

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient) {
    this.arcotV6Form.codeLangue = "en";
    this.arcotV6Form.loginV3 = "144IICD1D"
  }

  ionViewDidLoad() {}

  checkLogin() {
    this.http.get('http://localhost:8080/checkLogin',{
      withCredentials : true,
    }).subscribe(res => {
      var sessionId = res.toString();
      this.arcotV6Form.login=v3.c("144IICD1D",sessionId.substring(8,24))
      this.http.post<IArcotV6Form>('http://localhost:8080/checkLogin',this.arcotV6Form,{
        withCredentials : true,
      }).subscribe(res => {
        if (res.login == null)
          console.log(res)
        else{
          this.arcotV6Form = res
          console.log(this.arcotV6Form)
        }
      })
    })
  }

  sendSMS() {
    this.http.post<IArcotV6Form>('http://localhost:8080/sendSMS',this.arcotV6Form,{
      withCredentials : true,
    }).subscribe(res => {
      if (res.login == null)
          console.log(res)
        else{
          this.arcotV6Form = res
          console.log(this.arcotV6Form)
        }
    })
  }

  verifySMS() {
    this.http.post<IArcotV6Form>('http://localhost:8080/verifySMS',this.arcotV6Form,{
      withCredentials : true,
    }).subscribe(res => {
      if (res.login == null)
          console.log(res)
        else{
          this.arcotV6Form = res
          console.log(this.arcotV6Form)
        }
    })
  }

  passwordInput() {
    this.http.post<IArcotV6Form>('http://localhost:8080/passwordInput',this.arcotV6Form,{
      withCredentials : true,
    }).subscribe( res => {
      if (res.login == null)
          console.log(res)
        else{
          this.arcotV6Form = res
          console.log(this.arcotV6Form)
          this.arcotclient.prefClientTypes = ["Javascript"]
          this.initArcotClient(this.arcotclient,"",this.clientReady,"JavaScript")
          this.arcotclient.ImportArcotID(this.arcotV6Form.arcotId, "MEMORY", this.arcotV6Form.loginV3)
          var signedChallenge = this.arcotclient.SignChallengeEx2(this.arcotV6Form.challenge, "123456", this.arcotV6Form.loginV3, "", this.arcotV6Form.organizationName)
          this.arcotV6Form.signedChallenge = signedChallenge
        }
    })
  }

  checkPassword() {
    this.http.post<IArcotV6Form>('http://localhost:8080/checkPassword',this.arcotV6Form,{
      withCredentials : true,
    }).subscribe(res => {
      if (res.login == null)
          console.log(res)
        else{
          this.arcotV6Form = res
          console.log(this.arcotV6Form)
        }
    })
  }

  authenticated() {
    this.http.post<any>('http://localhost:8080/authenticated',this.arcotV6Form,{
      withCredentials : true,
    }).subscribe(res => {
      if (res.login == null)
      console.log(res)
    else{
      this.listeComptesAbonne = res
      console.log(this.listeComptesAbonne)
    }
    })
  }

  edit() {
    this.http.post<IVirementForm>('http://localhost:8080/edit',this.virementForm,{
      withCredentials : true,
    }).subscribe(res => {
      this.virementForm = res
      console.log(this.virementForm)
    })
  }

  initArcotClient(arcotClientOject, contextPath, clientReadyFunction, clientType) {
    var browserURL = window.location.pathname;
    var clientBaseURL = browserURL.substring(0, browserURL.indexOf(contextPath) + contextPath.length) + '/';
    arcotClientOject.setAttribute('clientBaseURL', clientBaseURL);
    arcotClientOject.setAttribute('clientType', clientType);
    arcotClientOject.setAttribute('clientReadyCallback', clientReadyFunction);
    if (!arcotClientOject.write('ArcotIDClient')) {
      alert('ERROR - ' + clientType + ' ArcotID client is not supported on this browser (lastError: ' + arcotClientOject.lastError + ')');
    }
  }

  clientReady() {}
}


