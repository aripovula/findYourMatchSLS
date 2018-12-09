import { Component} from '@angular/core';
import { NgForm } from '@angular/forms';
import { UUID } from 'angular2-uuid';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { DataService } from './../services/data.service';
import { Candidate } from './../models/candidate.model';
import { CandidateDetailed } from '../models/candidate_detailed.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  describemes = ['extravert', 'intravert', 'joyful', 'silent', 'calm', 'impulsive'];
  interests = ['sports', 'politics', 'science', 'music', 'arts', 'literature'];
  genders = ['male', 'female', 'other'];
  smokers = ['smoker', 'non-smoker'];
  smokersFind = ['smoker', 'non-smoker', 'any'];
  musicgenres = ['pop', 'smooth jazz', 'club', 'soft rock', 'country', 'hard rock'];
  lovePets = ['yes', 'no', 'depends'];
  intentions = ['long-term relations', 'flirting', 'friendship'];
  sameAsMines = ['same characteristics as mine', 'different'];
  hideFindForm = false;
  areChecklistsValid = true;

  // initial values of checkboxes
  descriptionSelf_Array = new FormArray([new FormControl(true), new FormControl(false), new FormControl(false),
  new FormControl(false), new FormControl(true), new FormControl(false)]);
  interestsSelf_Array = new FormArray([new FormControl(true), new FormControl(false), new FormControl(true),
  new FormControl(false), new FormControl(true), new FormControl(false)]);
  songGenreSelf_Array = new FormArray([new FormControl(false), new FormControl(true), new FormControl(true),
  new FormControl(true), new FormControl(false), new FormControl(false)]);

  descriptionFind_Array = new FormArray([new FormControl(true), new FormControl(false), new FormControl(false),
  new FormControl(false), new FormControl(true), new FormControl(false)]);
  interestsFind_Array = new FormArray([new FormControl(true), new FormControl(false), new FormControl(false),
  new FormControl(false), new FormControl(true), new FormControl(false)]);
  songGenreFind_Array = new FormArray([new FormControl(false), new FormControl(true), new FormControl(true),
  new FormControl(true), new FormControl(false), new FormControl(false)]);


  candidateForm = new FormGroup({
    firstName: new FormControl('Alexander', [Validators.required, Validators.minLength(3)]),
    nickname: new FormControl('Alex', [Validators.required, Validators.minLength(2)]),
    genderSelf: new FormControl('male'),
    isASmokerSelf: new FormControl('non-smoker'),
    descriptionSelf: this.descriptionSelf_Array,
    interestsSelf: this.interestsSelf_Array,
    songGenreSelf: this.songGenreSelf_Array,
    lovePetsSelf: new FormControl('depends'),
    hobbiesSelf: new FormControl('abc'),
    genderFind: new FormControl('female'),
    isASmokerFind: new FormControl('non-smoker'),
    descriptionFind: this.descriptionFind_Array,
    interestsFind: this.interestsFind_Array,
    songGenreFind: this.songGenreFind_Array,
    lovePetsFind: new FormControl('depends'),
    intentions: new FormControl('long-term relations'),
    sameAsMineFind: new FormControl('different')
  });

  constructor(private dataService: DataService) {}

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
      !this.candidateForm.value.descriptionSelf.toString().includes('true') ||
      !this.candidateForm.value.interestsSelf.toString().includes('true') ||
      !this.candidateForm.value.songGenreSelf.toString().includes('true')
    ) {
      this.areChecklistsValid = false;
    }
    if (this.hideFindForm === false) {
      if (
        !this.candidateForm.value.descriptionFind.toString().includes('true') ||
        !this.candidateForm.value.interestsFind.toString().includes('true') ||
        !this.candidateForm.value.songGenreFind.toString().includes('true')
      ) {
        this.areChecklistsValid = false;
      }
    }
    console.log('this.areChecklistsValid = ', this.areChecklistsValid);
  }

  onSubmit() {
    const id = UUID.UUID();
    const firstName = this.candidateForm.value.firstName;
    const otherDetails = {
      id,
      firstName,
      nickname: this.candidateForm.value.nickname,
      genderSelf: this.candidateForm.value.genderSelf,
      genderFind: this.candidateForm.value.genderFind,
      isASmokerSelf: this.candidateForm.value.isASmokerSelf,
      isASmokerFind: this.candidateForm.value.isASmokerFind,
      descriptionSelf: this.candidateForm.value.descriptionSelf.toString(),
      descriptionFind: this.candidateForm.value.descriptionFind.toString(),
      interestsSelf: this.candidateForm.value.interestsSelf.toString(),
      interestsFind: this.candidateForm.value.interestsFind.toString(),
      songGenreSelf: this.candidateForm.value.songGenreSelf.toString(),
      songGenreFind: this.candidateForm.value.songGenreFind.toString(),
      lovePetsSelf: this.candidateForm.value.lovePetsSelf,
      lovePetsFind: this.candidateForm.value.lovePetsFind,
      hobbiesSelf: this.candidateForm.value.hobbiesSelf,
      intentions: this.candidateForm.value.intentions
    };

    this.dataService.post(new Candidate(id, firstName, 'abc'));
  }

}
