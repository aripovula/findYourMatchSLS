import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UUID } from 'angular2-uuid';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Candidate } from './../models/candidate.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements AfterViewInit {

  model;
  describemes = ['extravert', 'intravert', 'joyful', 'silent', 'calm', 'impulsive'];
  interests = ['sports', 'politics', 'science', 'music', 'arts', 'literature'];
  genders = ['male', 'female', 'other'];
  smokers = ['smoker', 'non-smoker'];
  musicgenres = ['pop', 'smooth jazz', 'club', 'soft rock', 'country', 'hard rock'];
  yesNos = ['yes', 'no'];
  intentions = ['long-term relations', 'flirting', 'friendship'];

  // @ViewChild('f') profileForm: NgForm;

  candidateForm = new FormGroup({
    firstName: new FormControl('Alexander', [Validators.required, Validators.minLength(3)]),
    nickname: new FormControl('Alex', [Validators.required, Validators.minLength(2)]),
    genderSelf: new FormControl('male'),
    isASmokerSelf: new FormControl('non-smoker')
  });

  constructor() {
    this.model = new Candidate(UUID.UUID(), 'Alexander', 'Alex', 'male', 'female', false, false,
     '', '', '', '', '', '', false, false, '', '');
  }

  ngAfterViewInit() {
    // this.profileForm.form.patchValue({
    //   fullname: 'Full Name',
    //   address: 'abcd 1234'
    // });
  }


  onSubmit() {
    console.log('Submitted - ViewChild');
    console.log(this.candidateForm);
    console.log('model =', this.model);
    this.candidateForm.reset();
    // this.candidateForm.form.patchValue({
    //   fullname: 'Full Name',
    //   address: 'abcd 1234'
    // });
  }

}
