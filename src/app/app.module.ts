import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './_directives/login/login.component';
import { HomeComponent } from './_directives/home/home.component';
import { PageNotFoundComponent } from './_directives/page-not-found/page-not-found.component';
import { AuthGuard } from './authGuard/auth.guard';
import { AuthenticationService } from './_services/authentication.service';
import { UserService } from './_services/user.service';
import { FileBrowserComponent } from './_directives/file-browser/file-browser.component';

const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Login' }
  },
  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Home' },
    canActivate: [ AuthGuard ]
  },
  {
    path: 'files',
    component: FileBrowserComponent,
    data: { title: 'Files' },
    canActivate: [ AuthGuard ]
  },
  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PageNotFoundComponent,
    HomeComponent,
    FileBrowserComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    HttpModule
  ],
  providers: [AuthGuard, AuthenticationService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
