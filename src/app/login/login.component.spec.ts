import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { WebcamModule } from 'ngx-webcam';
import { FormsModule } from '@angular/forms';
import { ImageUploadModule } from 'angular2-image-upload';
import { NgxLoadingModule } from 'ngx-loading';
import { APP_BASE_HREF } from '@angular/common';

import { AppComponent } from '../app.component';
import { LoginComponent } from '../login/login.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { AllUsersComponent } from '../all-users/all-users.component';
import { DataService } from '../services/data.service';
import { CognitoService } from '../services/cognito.service';
import { FindMatchFormComponent } from '../find-match-form/find-match-form.component';
import { AuthGuard } from '../services/auth-guard.service';
import { HomeComponent } from '../home/home.component';
import { StartComponent } from '../start/start.component';
import { ProfileComponent } from '../profile/profile.component';
import { SourceComponent } from '../source/source.component';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'start', component: StartComponent, canActivate: [AuthGuard] },
  { path: 'all_users_admin_only', component: AllUsersComponent, canActivate: [AuthGuard] },
  { path: 'source', component: SourceComponent, canActivate: [AuthGuard] },

  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: '/not-found' }
];

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        LoginComponent,
        NotFoundComponent,
        AllUsersComponent,
        FindMatchFormComponent,
        HomeComponent,
        StartComponent,
        ProfileComponent,
        SourceComponent,
      ],
      imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpModule,
        RouterModule.forRoot(
          appRoutes
        ),
        Ng2SmartTableModule,
        WebcamModule,
        FormsModule,
        ImageUploadModule.forRoot(),
        NgxLoadingModule.forRoot({})
      ],
      providers: [CognitoService, DataService, AuthGuard,
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
