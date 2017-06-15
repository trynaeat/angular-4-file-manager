import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication.service';

import { User } from '../../_common/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private route : ActivatedRoute,
    private router : Router,
    private authenticationService : AuthenticationService
  ) { }

  ngOnInit() {
    // Reset login status
    this.authenticationService.logout();
  }

  model = new User('', '');

  submitted = false;

  onSubmit() {
    this.submitted = true;
    this.authenticationService.login(this.model.username, this.model.password)
      .subscribe(
        data => {
          this.router.navigate(['/']);
        },
        error => {
          console.log('login failure');
        }
      );
  }

}
