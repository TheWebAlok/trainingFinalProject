import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../shared/auth/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports:[RouterLink, ],
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent {

  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService,) {

  }

  logout() {
    this.spinner.show()
    this.authService.clear()
    this.spinner.hide()
    this.toastr.success("Logout Successfull")
    this.router.navigateByUrl("/login")
  }


}
