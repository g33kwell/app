import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the AuthenticationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthenticationProvider {

  private isLoggedIn: boolean = false;
  private isFingerEnabled: boolean = false;

  constructor(public http: HttpClient) {
    console.log('Hello AuthenticationProvider Provider');
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
    this.isFingerEnabled = false;
  }

  disabedFinger() {
    this.isFingerEnabled = false;
  }

  checkFinger() {
    return this.isFingerEnabled;
  }

}
