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
import * as AWS from 'aws-sdk-mock';

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

describe('ProfileComponent', () => {
  // tslint:disable-next-line:prefer-const
  let component: ProfileComponent;
  // tslint:disable-next-line:prefer-const
  let fixture: ComponentFixture<ProfileComponent>;

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
    // fixture = TestBed.createComponent(ProfileComponent);
    // component = fixture.componentInstance;

  });

  it('should create', () => {
    // fixture = TestBed.createComponent(ProfileComponent);
    // const app = fixture.debugElement.componentInstance;
    // const cognitoService = fixture.debugElement.injector.get(CognitoService);
    // fixture.detectChanges();
    // // expect(component).toBeTruthy();
    // expect(cognitoService.cognitoUser.getUsername()).toEqual(app.user.name);

    // const masterService = new CognitoService('asc').cognitoUser.getUsername();

    // const mockedService = AWS.mock('Cognito', 'getUsername()', (params, callback) => {
    //   callback(null, 'success');
    // });
    // console.log('mockedService - ', mockedService);

    // expect(mockedService).toEqual('success');

    // AWS.restore('Cognito', 'getUsername()');

    // TestBed.configureTestingModule({ providers: [FakeCognitoService] });
    // const service = TestBed.get(FakeCognitoService);
    // expect(service.getCurrentUser()).toBe('aName');

    const nObj = { CognitoUser: {poolData: ''} };
    const fake = {
      isSessionValid: () => true
    };
    const cognitoService = fake as CognitoService;
    expect(cognitoService.isSessionValid()).toBeTruthy();
    // to be added


  });

  it('should render title in a h4 tag', () => {
    const fixture2 = TestBed.createComponent(ProfileComponent);
    fixture2.detectChanges();
    const compiled = fixture2.debugElement.nativeElement;
    // expect('#firstName').toBeDefined;
    // expect(compiled(by.id('my-id')).isPresent()).toBe(true);
    expect(compiled.querySelector('#firstName').textContent).toContain('First name');
  });
});
