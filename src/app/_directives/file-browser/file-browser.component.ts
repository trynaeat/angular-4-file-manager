import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { UserService } from '../../_services/user.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { ModalComponent } from '../modal/modal.component';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';

@Component({
  selector: 'app-file-browser',
  templateUrl: './file-browser.component.html',
  styleUrls: ['./file-browser.component.css']
})
export class FileBrowserComponent implements OnInit {
  @ViewChild('fileInput') fileInput:ElementRef;
  @ViewChild(ModalComponent) progressModal:ModalComponent;
  @ViewChild(ProgressBarComponent) progressBar:ProgressBarComponent;

  page = 1;
  size = 100;
  loading = true;
  files = [];

  constructor(
    private userService : UserService,
    private authService : AuthenticationService
  ) {
    this.userService.progress$.subscribe(
      data => {
        this.progressBar.setProgress(data);
      }
    )
  }

  ngOnInit() {
    this.page = 1;
    this.size = 100;
    this.loading = true;
    this.progressBar.setProgress(0);
    this.getFiles(this.page, this.size);
  }

  getFiles(page : number, size : number) {
    return this.userService.getFiles(page, size)
    .subscribe(
      data => {
        this.files = data;
        this.loading = false;
      },
      error => {
        console.log('Error getting files ' + error);
      }
    );
  }

  deleteFile(id: string) {
    return this.userService.deleteFile(id)
      .subscribe(
        data => {
          console.log('deleted');
        },
        error => {
          console.log('Error deleting file ' + error);
        },
        () => {
          this.getFiles(this.page, this.size);
        }
      )
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
      this.progressModal.show();
      this.userService.postFiles(formData)
        .subscribe(
          data => {
            console.log('success');
          },
          error => {
            console.log('error');
          },
          () => {
            console.log('finally');
            this.progressModal.hide();
            this.progressBar.setProgress(0);
            this.getFiles(this.page, this.size);
          }
        )
    }
  }

}
