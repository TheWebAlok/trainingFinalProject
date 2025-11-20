import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrdersService } from '../../services/orders/orders.service';
import { MyAccountService } from '../../services/myAccount/my-account.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [CommonModule
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
    private ordersService: OrdersService,
    private myAccountService: MyAccountService
  ) { }

  ngOnInit() {
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
  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
  goToLogin() { this.router.navigate(['/login']); }
  goToRegister() { this.router.navigate(['/register']); }

}
