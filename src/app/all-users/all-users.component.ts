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

  data = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.onGetAllClicked();
  }

  onPostClicked() {
    const candidate = new Candidate(this.id, 'Ula B New 24', 'male', 'sports, arts, acting');
    this.dataService.post(candidate).then(() => {
      this.onGetAllClicked();
    });
  }

  onGetAllClicked() {
    this.dataService.get('all', '0')
      .then((fromDB: Candidate[]) => {
        // this.users = fromDB;
        this.updateTableData(fromDB);
      })
      .catch((error) => {
        console.log('error - ', error);
      });
  }

  onGetSingleClicked(id) {
    this.dataService.get('single', id)
      .then((fromDB: Candidate[]) => {
        this.updateTableData(fromDB);
      })
      .catch((error) => {
        console.log('error - ', error);
      });
  }

  updateTableData(fromDB) {
    this.data = [];
    console.log('fromDB = ', fromDB);
    if (fromDB instanceof Array) {
      fromDB.map((DBitem) => {
        const item = {
          id: DBitem.id,
          name: DBitem.name,
          username: DBitem.name,
          email: DBitem.name.toLowerCase().replace(/\s/g, '') + '@aripov.info'
        };
        this.data.push(item);
      });
    } else {
      const item = {
        id: fromDB.id,
        name: fromDB.name,
        username: fromDB.name,
        email: fromDB.name.toLowerCase().replace(/\s/g, '') + '@aripov.info'
      };
      this.data.push(item);
    }
  }

  onDeleteClicked() {
    this.dataService.delete(this.id).then(() => {
      this.onGetAllClicked();
    });
  }
}
