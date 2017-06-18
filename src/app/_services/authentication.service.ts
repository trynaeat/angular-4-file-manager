import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {

  constructor(private http: Http) { }

  info = {
    loggedIn : localStorage.getItem('currentUser') ? true : false
  };

  getToken() {
    return JSON.parse(localStorage.getItem('currentUser')).token;
  }

  login(username: string, password: string) {
    let headers = new Headers({ 'Content-Type' : 'Application/json' });
    let options = new RequestOptions({ headers : headers });
    return this.http.post('/api/token', JSON.stringify({ username: username, password: password }), options)
      .map((response : Response) => {
        let user = response.json();
        if(user && user.token) {
          this.info.loggedIn = true;
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
      });
  }

  logout() {
    this.info.loggedIn = false;
    localStorage.removeItem('currentUser');
  }

}
