import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { UserService } from '../../_services/user.service';
import { AuthenticationService } from '../../_services/authentication.service';

@Component({
  selector: 'app-file-browser',
  templateUrl: './file-browser.component.html',
  styleUrls: ['./file-browser.component.css']
})
export class FileBrowserComponent implements OnInit {
  @ViewChild('fileInput') fileInput:ElementRef;

  page = 1;
  size = 100;
  loading = true;
  files = [];

  constructor(
    private userService : UserService,
    private authService : AuthenticationService
  ) { }

  ngOnInit() {
    this.page = 1;
    this.size = 100;
    this.loading = true;
    this.getFiles(this.page, this.size)
      .subscribe(
        data => {
          this.files = data;
          this.loading = false;
        },
        error => {
          console.log('Error getting files ' + error);
        }
      )
  }

  getFiles(page : number, size : number) {
    return this.userService.getFiles(page, size);
  }

  fileChangeSelect() {
    let event = new MouseEvent('click', {bubbles: true});
    this.fileInput.nativeElement.dispatchEvent(event);
  }

  fileChange(event) {
    let fileList: FileList = event.target.files;
    if(fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append('uploadFile', file, file.name);
      this.userService.postFiles(formData)
        .subscribe(
          data => {
            console.log('success');
          },
          error => {
            console.log('error');
          }
        )
    }
  }

}
