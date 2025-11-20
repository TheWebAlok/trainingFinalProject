import { Component } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  deleteDoc,
  doc
} from '@angular/fire/firestore';

import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AuthService } from '../../shared/auth/auth.service';
declare var Razorpay: any;

@Component({
  selector: 'app-billings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './billings.component.html',
  styleUrls: ['./billings.component.css']
})
export class BillingsComponent {

  billings: any[] = []; 
  newBilling = {
    name: '',
    mobile: '',
    address: '',
    location: '',
    pincode: ''
  };
  userLoggedIn: boolean = false;

  constructor(
    private firestore: Firestore,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    const billingsRef = collection(this.firestore, 'billings');
    collectionData(billingsRef, { idField: 'id' }).subscribe((data) => {
      this.billings = data;
    });
  }

  async addBilling() {
    if (!this.authService.getIsLoggedIn()) {
      this.toastr.error("Please login first!");
      this.router.navigate(['/login']);
      return;
    }

    const billingsRef = collection(this.firestore, 'billings');
    await addDoc(billingsRef, this.newBilling);

    Swal.fire('Success', 'Billing saved successfully!', 'success');

    this.newBilling = { name: '', mobile: '', address: '', location: '', pincode: '' };
  }

  async deleteBilling(id: string) {
    if (!this.authService.getIsLoggedIn()) {
      this.toastr.error("Please login first!");
      this.router.navigate(['/login']);
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes'
    });

    if (result.isConfirmed) {
      await deleteDoc(doc(this.firestore, 'billings', id));
      Swal.fire('Deleted!', '', 'success');
    }
  }

  proceedToPayment(bill: any) {
    if (!this.authService.getIsLoggedIn()) {
      this.toastr.error("Please login first!");
      this.router.navigate(['/login']);
      return;
    }

    var options = {
      "key": "rzp_test_R7raQKFj1qN71z",
      "amount": 50000, // amount in paise (₹500)
      "currency": "INR",
      "name": "Maa Computer Press",
      "description": "Test Transaction",
      "prefill": {
        "name": bill.name,
        "email": "test@example.com",
        "contact": bill.mobile
      },
      "theme": { "color": "#3399cc" },
      handler: (res: any) => {
        Swal.fire("Payment Successful!", "", "success");
        console.log("Payment Details: ", res);
      }
    };

    var rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', (err: any) => {
      Swal.fire("Payment Failed!", "", "error");
      console.error("Payment Error: ", err);
    });
    rzp1.open();
  }
}
