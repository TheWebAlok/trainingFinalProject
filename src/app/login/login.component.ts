import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../shared/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';

import { UserService } from '../../app/services/user/user.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, NgxSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {


  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService

  ) { }


  login = {
    email: '',
    password: ''
  }


  submit() {
    this.userService.login(this.login.email, this.login.password)
  }
}
