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
  abc = 0;
  id = 'a18';

  settings = {
    columns: {
      userName: {
        title: 'User name'
      },
      otherDetails: {
        title: 'Other details'
      },
      email: {
        title: 'Email'
      }
    }
  };

  data = [];
  greetings = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.onGetAllClicked();
  }

  onPostClicked() {
    const candidate = null; // new Candidate(this.id, 'Ann B 18', 'female', 'science, arts, acting');
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

  onGetAudio1Clicked(id) {
    this.dataService.getAudio('initial', id)
      .then((fromDB: any) => {
        this.greetings = fromDB;
        console.log('this.greetings=', this.greetings);

      })
      .catch((error) => {
        console.log('error - ', error);
      });
  }

  onPlayAudioClicked(url) {
    new Audio(url).play();
  }

  updateTableData(fromDB) {
    this.data = [];
    console.log('fromDB = ', fromDB);
    if (fromDB instanceof Array) {
      fromDB.map((DBitem) => {
        const otherData = JSON.parse(DBitem.otherDetails.replace(/#%#/g, '"'));
        console.log('otherData = ', otherData);
        const item = {
          userName: otherData.firstName,
          otherDetails: otherData.personalityTypeSelf + ', ' + otherData.characterSelf + ', ' + otherData.behavingSelf,
          email: otherData.firstName.toLowerCase().replace(/\s/g, '') + '@soulmates.cafe'
        };
        this.data.push(item);
      });
    } else {
      const otherData = JSON.parse(fromDB.otherDetails.replace(/#%#/g, '"'));
      const item = {
        userName: otherData.firstName,
        otherDetails: otherData.personalityTypeSelf + ', ' + otherData.characterSelf + ', ' + otherData.behavingSelf,
        email: otherData.firstName.toLowerCase().replace(/\s/g, '') + '@soulmates.cafe'
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
