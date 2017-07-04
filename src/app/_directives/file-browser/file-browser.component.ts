import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { UserService } from '../../_services/user.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { ModalComponent } from '../modal/modal.component';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { Pager } from '../pager/pager.component';
import * as _ from 'lodash';

@Component({
  selector: 'app-file-browser',
  templateUrl: './file-browser.component.html',
  styleUrls: ['./file-browser.component.css']
})
export class FileBrowserComponent implements OnInit {
  @ViewChild('fileInput') fileInput:ElementRef;
  @ViewChild('uploadModal') progressModal:ModalComponent;
  @ViewChild('editModal') editModal:ModalComponent;
  @ViewChild(ProgressBarComponent) progressBar:ProgressBarComponent;

  page = 1;
  size = 100;
  loading = true;
  files = [];
  selectedFile = {};

  pager = new Pager(3, this.userService, 'getFiles');

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
    this.pager.reset();
  }

  editFile(file: any) {
    this.selectedFile = _.cloneDeep(file);
    this.editModal.show();
  }

  submitEdit(file: any) {
    return this.userService.updateFile(file)
      .subscribe(
        data => {
          console.log('updated');
        },
        error => {
          console.log('Error updating file ' + error);
        },
        () => {
          this.editModal.hide();
          this.pager.reset();
        }
      )
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
          this.pager.reset();
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
            this.pager.reset();
          }
        )
    }
  }

}
