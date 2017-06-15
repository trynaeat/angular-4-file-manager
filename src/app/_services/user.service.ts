import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

@Injectable()
export class UserService {

  constructor(private http: Http) { }

  private jwt() {
    // Create authorization header with jwt token
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(currentUser && currentUser.token) {
      let headers = new Headers({ 'Authorization' : 'JWT ' + currentUser.token });
      return new RequestOptions({ headers : headers });
    }
  }

}
