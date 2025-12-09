import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { OrdersService } from '../../services/orders/orders.service';
import { MyAccountService } from '../../services/myAccount/my-account.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../shared/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterModule
  ],
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {

  userData: any = null;
  activeTab: string = 'profile';
  orders: any[] = [];

  profileForm = { name: '', phone: '', address: '' };
  passwordForm = { oldPassword: '', newPassword: '', confirmPassword: '' };

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,

    private ordersService: OrdersService,
    private myAccountService: MyAccountService
  ) { }

  ngOnInit() {
    this.checkLogin();

    this.userData = {
      uid: sessionStorage.getItem('uid'),
      name: sessionStorage.getItem('name'),
      email: sessionStorage.getItem('email'),
      phone: sessionStorage.getItem('phone'),
      address: sessionStorage.getItem('address'),
      isLogged: sessionStorage.getItem('isLogged')
    };

    this.profileForm.name = this.userData.name || '';
    this.profileForm.phone = this.userData.phone || '';
    this.profileForm.address = this.userData.address || '';

    this.ordersService.getOrders().subscribe(data => {
      this.orders = data.filter(o => o.email === this.userData.email);
    });
  }

  isLoggedIn: boolean = false;



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
  updateProfile() {
    this.myAccountService.updateProfile(this.userData.uid, {
      name: this.profileForm.name,
      phone: this.profileForm.phone,
      address: this.profileForm.address
    }).then(() => {
      sessionStorage.setItem('name', this.profileForm.name);
      sessionStorage.setItem('phone', this.profileForm.phone);
      sessionStorage.setItem('address', this.profileForm.address);

      alert('Profile updated successfully!');
    }).catch(err => {
      alert('Error updating profile: ' + err);
    });
  }

  changePassword() {
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      alert('New password and confirm password do not match!');
      return;
    }

    this.myAccountService.changePassword(this.passwordForm.newPassword)
      .then(() => {
        alert('Password updated successfully!');
        this.passwordForm = { oldPassword: '', newPassword: '', confirmPassword: '' };
      })
      .catch(err => {
        alert('Error changing password: ' + err);
      });
  }
  deleteOrder(orderId?: string) {
    if (!orderId) {
      this.toastr.error("Invalid Order ID");
      return;
    }
    this.ordersService.deleteOrder(orderId).then(() => {
      this.orders = this.orders.filter(o => o.id !== orderId);
      this.toastr.success("Order deleted successfully");
    }).catch(err => {
      console.error("Delete Error:", err);
      this.toastr.error("Failed to delete order");
    });
  }

  goToLogin() { this.router.navigate(['/login']); }
  goToRegister() { this.router.navigate(['/register']); }

}
