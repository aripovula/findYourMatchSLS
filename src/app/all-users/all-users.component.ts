import { Candidate } from './../models/candidate.model';
import { Component, OnInit } from '@angular/core';

import { DataService } from './../services/data.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})

export class AllUsersComponent implements OnInit {

  responseText1 = '';
  responseText2 = '';
  responseText3 = '';
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
    this.dataService.get('all')
      .then((data) => {
        console.log('data = ' + data);
        this.responseText3 = data[0].interests + ', ' + data[1].interests;
      })
      .catch((error) => {
        console.log('error - ', error);
      });
  }

  onGetSingleClicked() {
    this.dataService.get('single')
      .then((data) => {
        console.log('data = ' + data);

        this.responseText3 = data.toString();
      })
      .catch((error) => {
        console.log('error - ', error);
      });
  }

  onDeleteClicked() {
    this.dataService.delete('a21');
  }
}
