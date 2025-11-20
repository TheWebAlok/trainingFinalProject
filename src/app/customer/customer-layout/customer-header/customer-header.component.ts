import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../shared/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-customer-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './customer-header.component.html',
  styleUrls: ['./customer-header.component.css']
})
export class CustomerHeaderComponent implements OnInit {

  isLoggedIn: boolean = false;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.checkLogin();
  }

  logout(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to logout!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.clear();
        this.checkLogin();
        this.cdr.detectChanges();
        this.toastr.success("Logout Successful");
        this.router.navigateByUrl("/login");

        Swal.fire(
          'Logged Out!',
          'You have been successfully logged out.',
          'success'
        );
      }
    });
  }

  checkLogin(): void {
    const loggedIn = this.authService.getIsLoggedIn(); // returns boolean
    const email = this.authService.getEmail();
    this.isLoggedIn = loggedIn && email !== null; // just use boolean directly
  }
}
