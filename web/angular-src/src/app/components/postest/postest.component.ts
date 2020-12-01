import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-postest',
  templateUrl: './postest.component.html',
  styleUrls: ['./postest.component.scss']
})
export class PostestComponent implements OnInit {

  constructor(private authService: AuthService) { }
  whatmsg: any;
  ngOnInit() {
    this.authService.getpostList().subscribe(whatmsg => {
      this.whatmsg = whatmsg;
      console.log(this.whatmsg);
    });
  }

}
