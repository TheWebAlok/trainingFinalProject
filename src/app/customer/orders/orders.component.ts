import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersService } from '../../services/orders/orders.service';
import { ToastrService } from 'ngx-toastr';
import { CloudinaryService } from '../../services/cloudinary/cloudinary.service';
import { AuthService } from '../../shared/auth/auth.service';
import { Router } from '@angular/router';
import { Order } from '../../shared/models/order/order.model';

declare var Razorpay: any;
declare var Swal: any;

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {

  orderData: Order = {
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

  ordersList: Order[] = [];
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

  // PICK FILE
  onFileSelected(event: any) {
    if (event.target.files?.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  // ---------------------------
  // SINGLE ITEM PAYMENT (Muhar, Printer...)
  // ---------------------------
  async buyNowItem(item: any) {
    if (!this.authService.getIsLoggedIn()) {
      this.toastr.error("Please login first!");
      return;
    }

    const user = {
      name: sessionStorage.getItem("name") || "Customer",
      email: sessionStorage.getItem("email") || "customer@example.com",
      phone: sessionStorage.getItem("phone") || "9999999999"
    };

    const amount = item.price;

    const options: any = {
      key: "rzp_test_R7raQKFj1qN71z",
      amount: amount * 100,
      currency: "INR",
      name: "Maa Computer Press",
      description: item.name || item.type,
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.phone
      },
      theme: { color: "#0d6efd" },
      handler: async (res: any) => {
        Swal.fire({
          icon: "success",
          title: "Payment Successful!"
        });

        console.log("Payment Success:", res);

        // SAVE ORDER IN FIRESTORE
        const orderData: Order = {
          customerName: user.name,
          email: user.email,
          mobile: user.phone,
          address: this.authService.getAddress() || '',
          productName: item.name || item.type,
          quantity: 1,
          price: amount,
          totalAmount: amount,
          paymentId: res.razorpay_payment_id,
          status: true,
          createdAt: new Date()
        };

        try {
          await this.orderService.addOrder(orderData);
          this.toastr.success("Order saved successfully!");
          this.router.navigate(['/order/details'], { state: { order: orderData } });
        } catch (err) {
          console.error("Order Save Failed:", err);
          this.toastr.error("Failed to save order!");
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.on("payment.failed", (err: any) => {
      Swal.fire({ icon: "error", title: "Payment Failed" });
      console.error(err);
    });
    rzp.open();
  }

  // ---------------------------
  // CUSTOM ORDER PAYMENT + IMAGE UPLOAD
  // ---------------------------
  async submitOrder(form: any) {
    if (form.invalid || !this.selectedFile) {
      this.toastr.error('Please fill all fields and upload an image.');
      return;
    }

    if (!this.authService.getIsLoggedIn()) {
      this.toastr.error("Please login first!");
      this.router.navigate(['/login']);
      return;
    }

    const amount = (this.orderData.price || 0) * (this.orderData.quantity || 1);

    const options: any = {
      key: 'rzp_test_R7raQKFj1qN71z',
      amount: amount * 100,
      currency: 'INR',
      name: 'Maa Computer Press',
      description: 'Custom Order Payment',
      prefill: {
        name: this.orderData.customerName,
        email: this.orderData.email,
        contact: this.orderData.mobile
      },
      theme: { color: '#3399cc' },
      handler: async (res: any) => {
        this.toastr.success("Payment Successful!");

        this.orderData.paymentId = res.razorpay_payment_id;
        this.orderData.totalAmount = amount;
        this.orderData.createdAt = new Date();
        this.orderData.status = true;

        try {
          await this.uploadAndSaveOrder();
          this.router.navigate(['/order/details'], { state: { order: this.orderData } });
        } catch (err) {
          console.error("Order Save Error:", err);
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.on("payment.failed", () => {
      this.toastr.error("Payment Failed");
    });
    rzp.open();
  }

  // UPLOAD IMAGE + SAVE ORDER TO FIRESTORE
  async uploadAndSaveOrder() {
    if (!this.selectedFile) throw new Error("No file selected!");

    return new Promise<void>((resolve, reject) => {
      this.cloudinary.uploadImage(this.selectedFile!).subscribe(
        async (res: any) => {
          this.orderData.imageUrl =
            res.secure_url || res.url || res.data?.secure_url || res.data?.url;

          if (!this.orderData.imageUrl) {
            this.toastr.error("Failed to get image URL from Cloudinary!");
            return reject("Cloudinary URL missing");
          }

          try {
            await this.orderService.addOrder(this.orderData);
            this.toastr.success("Order placed successfully!");
            this.resetForm();
            resolve();
          } catch (err) {
            console.error("Firestore Save Error:", err);
            this.toastr.error("Failed to save order to Firestore");
            reject(err);
          }
        },
        (err) => {
          console.error("Cloudinary Upload Error:", err);
          this.toastr.error("Image upload failed");
          reject(err);
        }
      );
    });
  }

  // FETCH ALL ORDERS
  getAllOrders() {
    this.orderService.getOrders().subscribe(
      (data: Order[]) => this.ordersList = data,
      (err) => this.toastr.error("Failed to load orders")
    );
  }

  // DELETE ORDER
  removeOrder(id: string) {
    this.orderService.deleteOrder(id)
      .then(() => this.toastr.info("Order removed."))
      .catch(err => this.toastr.error("Failed to remove order"));
  }

  // RESET FORM
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
