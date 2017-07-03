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
    console.log('paging right');
    this.pager.getNextPage();
  }

  onClickLeft() {
    console.log('paging left');
    this.pager.getPreviousPage();
  }

}

export class Pager {

  public page = 1;
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

  public reset() {
    this.page = 1;
    this.service[this.fnName](1, this.size).subscribe(data => {
      this.data = data.data;
      this.lastPage = data.lastPage;
      this.totalSize = data.totalSize;
    });
  }

  public getNextPage() {
    if(!this.lastPage) {
      this.page = this.page + 1;
      this.service[this.fnName](this.page, this.size).subscribe(data => {
        this.data = data.data;
        this.lastPage = data.lastPage;
        this.totalSize = data.totalSize;
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
      });
    }
  }

}
