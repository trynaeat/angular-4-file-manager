import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

  progress$ = null;
  progressObserver = null;
  progress = null;
  constructor(private http: Http) {
    this.progress$ = Observable.create(observer => {
      this.progressObserver = observer;
    });
  }

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

  deleteFile(id: string) {
    return this.http.delete('/api/file/' + id, this.jwt())
      .map((response : Response) => {
        let body = response.json();
        return body || {};
      });
  }

  postFiles(formData: FormData) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(currentUser && currentUser.token) {
      return Observable.create(observer => {
        let xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    observer.next(JSON.parse(xhr.response));
                    observer.complete();
                } else {
                    observer.error(xhr.response);
                }
            }
        };

        xhr.upload.onprogress = (event) => {
          this.progress = Math.round(event.loaded / event.total * 100);
          this.progressObserver.next(this.progress);
        }

        xhr.open('POST', '/api/file', true);
        xhr.setRequestHeader('Authorization', 'JWT ' + currentUser.token);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.send(formData);
      });
    }

  }

}
