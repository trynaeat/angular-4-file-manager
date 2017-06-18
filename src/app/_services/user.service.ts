import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

  constructor(private http: Http) { }

  private jwt(search?) {
    // Create authorization header with jwt token
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(currentUser && currentUser.token) {
      let headers = new Headers({ 'Authorization' : 'JWT ' + currentUser.token });
      if(search) {
        return new RequestOptions({ headers : headers, search : search });
      } else {
        return new RequestOptions({ headers : headers });
      }
    }
  }

  getFiles(page: number, size: number) {
    return this.http.get('/api/files', this.jwt('page=' + page + '&size=' + size))
      .map((response : Response) => {
        let body = response.json();
        return body || [];
      });
  }

  postFiles(formData: FormData) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(currentUser && currentUser.token) {
      let headers = new Headers();
      headers.append('Authorization', 'JWT ' + currentUser.token);
      headers.append('Accept', 'application/json');
      let options = new RequestOptions({ headers : headers });
      return this.http.post('/api/upload', formData, options)
        .map(res => res.json())
    }

  }

}
