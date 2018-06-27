import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage'

/*
  Generated class for the AuthenticationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthenticationProvider {

  private isLoggedIn: boolean = false;
  private isFingerEnabled: boolean = false;

  constructor(private storage:Storage) {
    this.storage.get('isFingerEnabled').then(val => this.isFingerEnabled = val)
  }

  login() {
    this.isLoggedIn = true;
  }

  logout() {
    this.isLoggedIn = false;
  }

  authenticated() : boolean {
    return this.isLoggedIn;
  }

  enableFinger() {
    this.storage.set('isFingerEnabled',true)
    return true;
  }

  disabedFinger() {
    this.storage.set('isFingerEnabled',false)
    return false;
  }

  checkFinger() {
    this.storage.get('isFingerEnabled').then(val => this.isFingerEnabled = val)
    return this.isFingerEnabled;
  }

}
