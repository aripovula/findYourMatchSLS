import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.css']
})
export class SourceComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onFrontEndSourceClicked() {
    console.log('in onFrontEndSourceClicked');
    window.open('https://github.com/aripovula/findYourMatchSLS', '_blank');
  }

  onServerlessSourceClicked() {
    console.log('in onServerlessSourceClicked');
    window.open('https://github.com/aripovula/serverlessFramework', '_blank');
  }

}
