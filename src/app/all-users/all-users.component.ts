import { Component, OnInit } from '@angular/core';


import { Candidate } from './../models/candidate.model';
import { DataService } from './../services/data.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})

export class AllUsersComponent implements OnInit {

  public loading = false;
  users = [];
  abc = 0;
  id = '18';

  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    pager: {
      perPage: 100
    },
    columns: {
      id: {
        title: 'id',
        width: '10%'
      },
      userName: {
        title: 'User name',
        type: 'html'
      },
      criteriaSet: {
        title: 'Criteria set'
      }
    }

  };

  data = [];
  greetings = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.onGetAllClicked();
  }

  // onPostClicked() {
  //   const candidate = null; // new Candidate(this.id, 'Ann B 18', 'female', 'science, arts, acting');
  //   this.dataService.post(candidate).then(() => {
  //     this.onGetAllClicked();
  //   });
  // }

  onGetAllClicked() {
    this.loading = true;
    this.dataService.get('all', '0', null)
      .then((fromDB: Candidate[]) => {
        // this.users = fromDB;
        this.updateTableData(fromDB);
        this.loading = false;
      })
      .catch((error) => {
        console.log('error - ', error);
        this.loading = false;
      });
  }

  // onGetSingleClicked(id) {
  //   this.dataService.get('single', id)
  //     .then((fromDB: Candidate[]) => {
  //       this.updateTableData(fromDB);
  //     })
  //     .catch((error) => {
  //       console.log('error - ', error);
  //     });
  // }

  // onGetAudio1Clicked() {
  //   this.dataService.getAudio('initial')
  //     .then((fromDB: any) => {
  //       this.greetings = fromDB;
  //       console.log('this.greetings=', this.greetings);

  //     })
  //     .catch((error) => {
  //       console.log('error - ', error);
  //     });
  // }

  // onPlayAudioClicked(url) {
  //   new Audio(url).play();
  // }

  compareById(a, b) {
    const a1 = a.id * 1;
    const b1 = b.id * 1;
    if (a1 < b1) { return -1; }
    if (a1 > b1) { return 1; }
    return 0;
  }

  updateTableData(fromDB) {
    fromDB.sort(this.compareById);
    this.data = [];
    console.log('fromDB = ', fromDB);
    if (fromDB instanceof Array) {
      fromDB.map((DBitem) => {
        // const otherData = JSON.parse(DBitem.otherDetails.replace(/#%#/g, '"'));
        // console.log('otherData = ', otherData);
        const item = {
          id: DBitem.id,
          userName: DBitem.userName + '    ' + '<a target="_blank" href=' + 'https://' + DBitem.userImage + '>( see image )</a>',
          userImage: DBitem.userImage,
          criteriaSet: DBitem.criteriaSet
          // otherData.personalityTypeSelf + ', ' + otherData.characterSelf + ', ' + otherData.behavingSelf,
          // email: DBitem.userName.toLowerCase().replace(/\s/g, '') + '@soulmates.cafe'
        };
        this.data.push(item);
      });
    } else {
      const otherData = JSON.parse(fromDB.otherDetails.replace(/#%#/g, '"'));
      const item = {
        id: fromDB.id,
        userName: fromDB.userName,
        userImage: fromDB.userImage,
        criteriaSet: fromDB.criteriaSet
        // otherDetails: otherData.personalityTypeSelf + ', ' + otherData.characterSelf + ', ' + otherData.behavingSelf,
        // email: otherData.firstName.toLowerCase().replace(/\s/g, '') + '@soulmates.cafe'
      };
      this.data.push(item);
    }
  }

  // onDeleteClicked() {
  //   this.dataService.delete(this.id).then(() => {
  //     this.onGetAllClicked();
  //   });
  // }
}
