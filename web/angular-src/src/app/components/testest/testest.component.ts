import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-testest',
  templateUrl: './testest.component.html',
  styleUrls: ['./testest.component.scss']
})
export class TestestComponent implements OnInit {

  constructor(private authService: AuthService) { }
  users: any;
  ngOnInit() {
    this.authService.getpostList().subscribe(users => {
      this.users = users;
    });
  }
}
