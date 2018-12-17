import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UUID } from 'angular2-uuid';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { CognitoService } from './../services/cognito.service';
import { DataService } from './../services/data.service';
import { Candidate } from './../models/candidate.model';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  personalityTypes = ['rather sociable (extrovert)', 'rather on my own (introvert)'];
  characters = ['rather active (outdoor, sports)', 'rather lazy'];
  behavings = ['calm', 'impulsive'];
  interests = ['sports', 'politics', 'science', 'music', 'arts', 'literature'];
  genders = ['male', 'female'];
  smokers = ['smoker', 'non-smoker'];
  smokersFind = ['smoker', 'non-smoker', 'any'];
  musicgenres = ['pop', 'smooth jazz', 'club', 'soft rock', 'country', 'hard rock'];
  lovePets = ['yes', 'no', 'depends'];
  intentions = ['long-term relations', 'flirting', 'friendship'];
  sameAsMines = ['same characteristics as mine', 'different'];
  namesM = [{ name: 'Alexander', nname: 'Alex' }, { name: 'Benjamin', nname: 'Ben' },
    { name: 'Samuel', nname: 'Sam' }, { name: 'Thomas', nname: 'Tom' },
    { name: 'Matthew', nname: 'Matt' }, { name: 'Steven', nname: 'Steve' }];
  namesF = [{ name: 'JENNIFER', nname: 'Jenni' }, { name: 'SUSAN', nname: 'Suzi' },
    { name: 'DEBORAH', nname: 'Debra' }, { name: 'JESSICA', nname: 'Jessi' },
    { name: 'MELISSA', nname: 'Lisa' }, { name: 'PAMELA', nname: 'Pam' }];

  hobbies = ['painting', 'wood craft', 'baking', 'cooking', 'fishing', 'robotics', 'art design', 'biking'];
  myHobbies;

  photo = 'https://images.pexels.com/photos/255379/pexels-photo-255379.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500';
  hideFindForm = false;
  areChecklistsValid = true;
  isFormSubmitted = false;
  public loading = false;
  fymRequestID;
  fymResponseData;
  candidateForm;
  a = this.assignValues();

  constructor(
    private dataService: DataService,
    private cognitoService: CognitoService,
    private router: Router
  ) { this.loading = false; }

  assignRandom(array) {
    return array[this.getRandom(0, array.length - 1)];
  }

  getRandom(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

  randBool() {
    return Math.random() >= 0.5;
  }

  assignValues() {
    this.fymRequestID = UUID.UUID();
    // initial values of checkboxes
    const interestsSelf_Array = new FormArray([new FormControl(this.randBool()), new FormControl(this.randBool()),
    new FormControl(this.randBool()), new FormControl(this.randBool()), new FormControl(this.randBool()),
    new FormControl(this.randBool())]);

    const songGenreSelf_Array = new FormArray([new FormControl(this.randBool()), new FormControl(this.randBool()),
    new FormControl(this.randBool()), new FormControl(this.randBool()), new FormControl(this.randBool()),
    new FormControl(this.randBool())]);

    const interestsFind_Array = new FormArray([new FormControl(this.randBool()), new FormControl(this.randBool()),
    new FormControl(this.randBool()), new FormControl(this.randBool()), new FormControl(this.randBool()),
    new FormControl(this.randBool())]);
    const songGenreFind_Array = new FormArray([new FormControl(this.randBool()), new FormControl(this.randBool()),
    new FormControl(this.randBool()), new FormControl(this.randBool()), new FormControl(this.randBool()),
    new FormControl(this.randBool())]);

    const smokePref = this.assignRandom(this.smokers);
    const petPref = this.assignRandom(this.lovePets);
    const genderSf = this.cognitoService.cognitoUser.getUsername() === 'Ann' ? 'female' : 'male';
    const genderFd = this.cognitoService.cognitoUser.getUsername() === 'Ann' ? 'male' : 'female';
    const names = this.cognitoService.cognitoUser.getUsername() === 'Ann' ? this.namesF : this.namesM;
    const name = this.assignRandom(names);
    this.myHobbies = '';
    this.hobbies.forEach(element => {
      if (this.randBool()) { this.myHobbies = this.myHobbies + element + '; '; }
    });

    this.candidateForm = new FormGroup({
      firstName: new FormControl(name.name, [Validators.required, Validators.minLength(3)]),
      nickname: new FormControl(name.nname, [Validators.required, Validators.minLength(2)]),
      genderSelf: new FormControl(genderSf),
      isASmokerSelf: new FormControl(smokePref),
      personalityTypeSelf: new FormControl(this.assignRandom(this.personalityTypes)),
      characterSelf: new FormControl(this.assignRandom(this.characters)),
      behavingSelf: new FormControl(this.assignRandom(this.behavings)),
      interestsSelf: interestsSelf_Array,
      songGenreSelf: songGenreSelf_Array,
      lovePetsSelf: new FormControl(petPref),
      hobbiesSelf: new FormControl(this.myHobbies),
      genderFind: new FormControl(genderFd),
      isASmokerFind: new FormControl(smokePref),
      personalityTypeFind: new FormControl(this.assignRandom(this.personalityTypes)),
      characterFind: new FormControl(this.assignRandom(this.characters)),
      behavingFind: new FormControl(this.assignRandom(this.behavings)),
      interestsFind: interestsFind_Array,
      songGenreFind: songGenreFind_Array,
      lovePetsFind: new FormControl(petPref),
      intentions: new FormControl('long-term relations'),
      sameAsMineFind: new FormControl('different')
    });
  }

  onSameAsMineChange() {
    if (this.candidateForm.value.sameAsMineFind === 'different') {
      this.hideFindForm = false;
    } else {
      this.hideFindForm = true;
    }
    this.validateCBs();
  }

  validateCBs() {
    this.areChecklistsValid = true;
    if (
      !this.candidateForm.value.interestsSelf.toString().includes('true') ||
      !this.candidateForm.value.songGenreSelf.toString().includes('true')
    ) {
      this.areChecklistsValid = false;
    }
    if (this.hideFindForm === false) {
      if (
        !this.candidateForm.value.interestsFind.toString().includes('true') ||
        !this.candidateForm.value.songGenreFind.toString().includes('true')
      ) {
        this.areChecklistsValid = false;
      }
    }
    console.log('this.areChecklistsValid = ', this.areChecklistsValid);
  }

  onSubmit() {
    this.loading = true;
    const id = this.fymRequestID;
    const userName = this.cognitoService.cognitoUser.getUsername();
    const otherDetailsObj = {
      id,
      firstName: this.candidateForm.value.firstName,
      nickname: this.candidateForm.value.nickname,
      genderSelf: this.candidateForm.value.genderSelf,
      genderFind: this.candidateForm.value.genderFind,
      isASmokerSelf: this.candidateForm.value.isASmokerSelf,
      isASmokerFind: this.candidateForm.value.isASmokerFind,
      personalityTypeSelf: this.candidateForm.value.personalityTypeSelf,
      personalityTypeFind: this.candidateForm.value.personalityTypeFind,
      characterSelf: this.candidateForm.value.characterSelf,
      characterFind: this.candidateForm.value.characterFind,
      behavingSelf: this.candidateForm.value.behavingSelf,
      behavingFind: this.candidateForm.value.behavingFind,
      interestsSelf: this.candidateForm.value.interestsSelf.toString(),
      interestsFind: this.candidateForm.value.interestsFind.toString(),
      songGenreSelf: this.candidateForm.value.songGenreSelf.toString(),
      songGenreFind: this.candidateForm.value.songGenreFind.toString(),
      lovePetsSelf: this.candidateForm.value.lovePetsSelf,
      lovePetsFind: this.candidateForm.value.lovePetsFind,
      hobbiesSelf: this.candidateForm.value.hobbiesSelf,
      intentions: this.candidateForm.value.intentions
    };

    let criteriaSet = JSON.stringify(otherDetailsObj);
    criteriaSet = encodeURIComponent(criteriaSet);
    // criteriaSet.replace(/"/g, '-%-');
    // console.log('userName = ', userName);
    // console.log('otherDetails = ', otherDetails);
    // this.dataService.post(new Candidate(id, userName, otherDetails));

    this.dataService.get('single', this.fymRequestID, criteriaSet)
    .then((data) => {
      console.log('data11 =', data);
      this.fymResponseData = data;
      this.isFormSubmitted = true;
      this.loading = false;
    });
  }

  onConfirmModalClose() {
    this.isFormSubmitted = false;
    this.assignValues();
  }

  onMatchConfirm() {
    this.router.navigate(['/start']);
  }

}
