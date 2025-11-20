import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MuharService } from '../../services/muhar/muhar.service';
import { ToastrService } from 'ngx-toastr';
import { Muhar } from '../../shared/models/muhar/muhar.model';
import { CartService } from '../../services/cart/cart.service';
import { AuthService } from '../../shared/auth/auth.service';
import Swal from 'sweetalert2';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

declare var Razorpay: any;

@Component({
  selector: 'app-muhar',
  standalone: true,
  imports: [
    CommonModule,
    NgxSpinnerModule
  ],
  templateUrl: './muhar.component.html',
  styleUrls: ['./muhar.component.css']
})
export class MuharComponent {

  muhars: Muhar[] = [];
  loading = true;

  constructor(
    private muharService: MuharService,
    private toastr: ToastrService,
    private cartService: CartService,
    private authService: AuthService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.loadMuhars();
  }

  // -----------------------------
  // LOAD ALL MUHAR
  // -----------------------------
  loadMuhars() {
    this.spinner.show();

    this.muharService.getAllMuhars().subscribe({
      next: (data) => {
        this.muhars = data;
        this.loading = false;
        this.spinner.hide();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error("Failed to load Muhar data.");
        this.loading = false;
        this.spinner.hide();
      }
    });
  }

  // -----------------------------
  // ADD TO CART
  // -----------------------------
  addToCart(m: Muhar) {
    if (!this.authService.getIsLoggedIn()) {
      this.toastr.error("Please login first!");
      return;
    }

    const uid = sessionStorage.getItem("uid") || "";

    const cartItem = {
      uid: uid,
      productId: m.id,
      name: m.type,
      price: m.price,
      image: m.imageUrl,
      quantity: 1,
      status: true
    };

    this.cartService.addToCart(cartItem)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Added to Cart"
        });
      })
      .catch(err => {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Failed to add to cart"
        });
      });
  }

  // -----------------------------
  // BUY NOW PAYMENT
  // -----------------------------
  buyNow(m: Muhar) {
    if (!this.authService.getIsLoggedIn()) {
      this.toastr.error("Please login first!");
      return;
    }

    const user = {
      name: sessionStorage.getItem("name") || "Customer",
      email: sessionStorage.getItem("email") || "customer@example.com",
      phone: sessionStorage.getItem("phone") || "9999999999"
    };

    const options = {
      key: "rzp_test_R7raQKFj1qN71z",
      amount: m.price * 100,
      currency: "INR",
      name: "Maa Computer Press",
      description: m.type,
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.phone
      },
      theme: {
        color: "#0d6efd"
      },
      handler: (res: any) => {
        Swal.fire({
          icon: "success",
          title: "Payment Successful!"
        });
        console.log("Payment Success:", res);
      }
    };

    const rzp = new Razorpay(options);

    rzp.on("payment.failed", (err: any) => {
      Swal.fire({
        icon: "error",
        title: "Payment Failed"
      });
      console.error(err);
    });

    rzp.open();
  }

}
