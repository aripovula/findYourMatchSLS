import { Component, OnInit } from '@angular/core';


import { Candidate } from './../models/candidate.model';
import { DataService } from './../services/data.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})

export class AllUsersComponent implements OnInit {

  users = [];
  responseText1 = '';
  responseText2 = '';
  responseText3 = '';
  abc = 0;
  id = 'a14';

  settings = {
    columns: {
      id: {
        title: 'ID'
      },
      name: {
        title: 'Full Name'
      },
      username: {
        title: 'User Name'
      },
      email: {
        title: 'Email'
      }
    }
  };

  data = [
    {
      id: 1,
      name: 'Leanne Graham',
      username: 'Bret',
      email: 'Sincere@april.biz'
    },
    // ... other rows here
    {
      id: 11,
      name: 'Nicholas DuBuque',
      username: 'Nicholas.Stanton',
      email: 'Rey.Padberg@rosamond.biz'
    }
  ];

  constructor(private dataService: DataService) { }

  ngOnInit() {
  }

  onPostClicked() {
    const candidate = new Candidate(this.id, 'Ula B New 24', 'male', 'sports, arts, acting');
    this.dataService.post(candidate);
  }

  onGetAllClicked() {
    this.dataService.get('all', '0')
      .then((data: Candidate[]) => {
        this.users = data;
        console.log('data = ' + this.users);
        // this.responseText3 = this.users[0].interests + ', ' + this.users[1].interests;
      })
      .catch((error) => {
        console.log('error - ', error);
      });
  }

  onGetSingleClicked(id) {
    this.dataService.get('single', id)
      .then((data: Candidate[]) => {
        console.log('data = ' + data);
        this.users = [];
        this.users.push(data);

        // this.responseText3 = data.toString();
      })
      .catch((error) => {
        console.log('error - ', error);
      });
  }

  onDeleteClicked() {
    this.dataService.delete(this.id);
  }
}
