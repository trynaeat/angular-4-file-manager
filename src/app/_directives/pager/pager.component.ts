import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.css']
})
export class PagerComponent implements OnInit {

  @Input() pager: Pager;

  constructor() {
  }

  ngOnInit() {
  }

  onClickRight() {
    this.pager.getNextPage();
  }

  onClickLeft() {
    this.pager.getPreviousPage();
  }

}

export class Pager {

  public page = 1;
  public startIndex = 1;
  public data = [];
  public lastPage = false;
  public totalSize;
  constructor(
    public size: number,
    public service: any,
    /**
     * Function must have arguments:
     * 1: page (number)
     * 2: pageSize (number)
    */
    public fnName: string
  ) {}

  public reload(resetPaging: boolean) {
    if(resetPaging) {
      this.page = 1;
    }
    this.service[this.fnName](this.page, this.size).subscribe(data => {
      this.data = data.data;
      this.lastPage = data.lastPage;
      this.totalSize = data.totalSize;
      this.startIndex = ((this.page - 1) * this.size) + 1;
    });
  }

  public getNextPage() {
    if(!this.lastPage) {
      this.page = this.page + 1;
      this.service[this.fnName](this.page, this.size).subscribe(data => {
        this.data = data.data;
        this.lastPage = data.lastPage;
        this.totalSize = data.totalSize;
        this.startIndex = ((this.page - 1) * this.size) + 1;
      });
    }
  }

  public getPreviousPage() {
    if(this.page > 1) {
      this.page = this.page - 1;
      this.service[this.fnName](this.page, this.size).subscribe(data => {
        this.data = data.data;
        this.lastPage = data.lastPage;
        this.totalSize = data.totalSize;
        this.startIndex = ((this.page - 1) * this.size) + 1;
      });
    }
  }

}
