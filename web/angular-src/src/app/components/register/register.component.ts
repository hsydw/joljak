import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  name: string;
  email: string;
  username: string;
  password1: string;
  password2: string;
  password: string;
  age: number;

  constructor(
    private validateService: ValidateService,
    private flashMessage: FlashMessagesService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onRegisterSubmit() {

    // 패스워드 값이 같은지 확인
    if (this.password1 !== this.password2) {
      console.log('패스워드가 다릅니다...');
      this.flashMessage.show('패스워드가 다릅니다. 다시 입력하세요', { cssClass: 'alert-danger', timeout: 3000 });
      return false;
    }

    // UI 에서 입력한 사용자 등록정보를 이용하여 user 객체 생성
    const user = {
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.password1,
      age: this.age
    };

    // 모든 필드 입력 검사
    if (!this.validateService.validateRegister(user)) {
      console.log('모든 필드들을 채워주세요...');
      this.flashMessage.show('모든 필드들을 채워주세요', { cssClass: 'alert-danger', timeout: 3000 });
      return false;
    }

    // 이메일 주소 유효성 검사
    if (!this.validateService.validateEmail(user.email)) {
      console.log('유효한 이메일주소를 입력하세요...');
      this.flashMessage.show('유효한 이메일주소를 입력하세요', { cssClass: 'alert-danger', timeout: 3000 });
      return false;
    }

    // Register User 사용자 등록
    this.authService.registerUser(user).subscribe(data => {
      if (data.success) {
        this.flashMessage.show(data.msg, { cssClass: 'alert-success', timeout: 3000 });
        this.router.navigate(['/login']);
      } else {
        this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 3000 });
        this.router.navigate(['/register']);
      }
    });

  }
}
