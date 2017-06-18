import { Component } from '@angular/core';
import { AuthenticationService } from './_services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private authenticationService : AuthenticationService,
    private route : ActivatedRoute,
    private router : Router
  )
  { }

  title = 'Test App';
  info = this.authenticationService.info;

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
