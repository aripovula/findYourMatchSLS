import { Component, OnInit } from '@angular/core';

import { DataService } from './../services/data.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})

export class AllUsersComponent implements OnInit {

  abc = 0;
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers() {
    this.dataService.get('all');
  }

  deleteAUser(id) {
    this.dataService.delete(id);
  }

}
