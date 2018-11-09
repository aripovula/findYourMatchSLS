import { Candidate } from './../models/candidate.model';
import { Component, OnInit } from '@angular/core';

import { DataService } from './../services/data.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})

export class AllUsersComponent implements OnInit {

  abc = 0;
  id = 'a21';
  constructor(private dataService: DataService) { }

  ngOnInit() {
  }

  onPostClicked() {
    const candidate = new Candidate(this.id, 'Ula B New 24', 'male', 'sports, arts, acting');
    this.dataService.post(candidate);
  }

  onGetAllClicked() {
    this.dataService.get('all');
  }

  onGetSingleClicked() {
    this.dataService.get('single');
  }

  deleteAUser() {
    this.dataService.delete(this.id);
  }

}
