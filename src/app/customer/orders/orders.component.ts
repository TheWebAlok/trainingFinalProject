import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersService } from '../../services/orders/orders.service';
import { Orders } from '../../shared/models/orders/orders.model';
import { ToastrService } from 'ngx-toastr';
import { CloudinaryService } from '../../services/cloudinary/cloudinary.service';
import { AuthService } from '../../shared/auth/auth.service';
import { Router } from '@angular/router';
import { WeddingCard } from '../../shared/models/weddingCard/wedding-card.model';

declare var Razorpay: any;

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {

  orderData: Orders = {
    customerName: '',
    email: '',
    mobile: '',
    address: '',
    productName: '',
    quantity: 1,
    price: 0,
    status: true,
    createdAt: new Date()
  };

  ordersList: Orders[] = [];
  weddingCard: WeddingCard[] = [];
  selectedFile: File | null = null;

  constructor(
    private orderService: OrdersService,
    private cloudinary: CloudinaryService,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router,


  ) {
    this.getAllOrders();
  }


  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }


  submitOrder(form: any) {
    if (form.invalid || !this.selectedFile) {
      this.toastr.error('Please fill all fields and upload image.');
      return;
    }
    if (!this.authService.getIsLoggedIn()) {
      this.toastr.error("Please login first!");
      this.router.navigate(['/login']);
      return;
    }

    const amount = (this.orderData.price || 0) * (this.orderData.quantity || 1) * 100;

    const options: any = {
      key: 'rzp_test_R7raQKFj1qN71z',
      amount: amount,
      currency: 'INR',
      name: 'Maa Computer Press',
      description: 'Order Payment',
      prefill: {
        name: this.orderData.customerName,
        email: this.orderData.email,
        contact: this.orderData.mobile
      },
      theme: { color: '#3399cc' },
      handler: (response: any) => {
        this.orderData.totalAmount = amount / 100;
        this.orderData.paymentId = response.razorpay_payment_id;
        this.orderData.status = true;
        this.orderData.createdAt = new Date();

        this.toastr.success('Payment Successful');
        this.router.navigate(["/order/details"])
        this.uploadAndSaveOrder();
      }
    };

    const rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', () => {
      this.toastr.error('Payment Failed');
    });
    rzp1.open();
  }


  uploadAndSaveOrder() {
    if (!this.selectedFile) return;
    
    this.cloudinary.uploadImage(this.selectedFile).subscribe(
      (res: any) => {
        this.orderData.imageUrl = res.secure_url;
        this.orderService.addOrder(this.orderData).then(() => {
          this.toastr.success('Order placed successfully!');
          this.resetForm();
        });
      },
      () => {
        this.toastr.error('Image upload failed');
      }
    );
  }

  getAllOrders() {
    this.orderService.getOrders().subscribe(
      (data: Orders[]) => {
        this.ordersList = data;
      },
      () => {
        this.toastr.error('Failed to load orders');
      }
    );
  }
  removeOrder(id: string) {
    this.orderService.deleteOrder(id);
    this.toastr.info('Order removed.');
  }
  resetForm() {
    this.orderData = {
      customerName: '',
      email: '',
      mobile: '',
      address: '',
      productName: '',
      quantity: 1,
      price: 0,
      status: true,
      createdAt: new Date()
    };
    this.selectedFile = null;
  }
}
