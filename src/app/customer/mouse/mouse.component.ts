import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MouseService } from '../../services/mouse/mouse.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart/cart.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../shared/auth/auth.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

declare var Razorpay: any;

@Component({
  selector: 'app-mouse',
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule],
  templateUrl: './mouse.component.html',
  styleUrl: './mouse.component.css'
})
export class MouseComponent {

  mice: any[] = [];
  loading = true;

  constructor(
    private mouseService: MouseService,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService,
    private cartService: CartService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.getAllMice();
  }

  getAllMice() {
    this.spinner.show();

    this.mouseService.getAllMice().subscribe({
      next: (res: any) => {
        this.mice = res;
        this.loading = false;
        this.spinner.hide();
      },
      error: (err) => {
        console.error('Error fetching mice:', err);
        this.toastr.error("Failed to load mouse data");
        this.loading = false;
        this.spinner.hide();
      }
    });
  }

  // ADD TO CART
  addToCartHandler(item: any) {
    if (!this.authService.getIsLoggedIn()) {
      this.toastr.error("Please login first!");
      this.router.navigate(['/login']);
      return;
    }

    const uid = sessionStorage.getItem("uid") || "";

    const cartItem = {
      productId: item.id,
      name: item.name,
      price: item.price,
      image: item.imageUrl || 'assets/images/no-image.png',
      quantity: 1,
      uid: uid,
      status: true
    };

    this.cartService.addToCart(cartItem)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Added to cart'
        });
      })
      .catch(err => {
        Swal.fire({
          icon: 'error',
          title: 'Failed to add'
        });
        console.error(err);
      });
  }

  // BUY NOW
  buyNow(item: any) {

    if (!this.authService.getIsLoggedIn()) {
      this.toastr.error("Please login first!");
      this.router.navigate(['/login']);
      return;
    }

    const user = {
      name: sessionStorage.getItem("name") || "Customer",
      email: sessionStorage.getItem("email") || "customer@example.com",
      phone: sessionStorage.getItem("phone") || "9999999999"
    };

    const options = {
      key: "rzp_test_R7raQKFj1qN71z",
      amount: item.price * 100,
      currency: "INR",
      name: "Maa Computer Press",
      description: item.name,
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.phone
      },
      theme: { color: "#0d6efd" },
      handler: (res: any) => {
        this.toastr.success("Payment Successful");
        console.log("Payment Success:", res);
      }
    };

    const rzp = new Razorpay(options);

    rzp.on("payment.failed", (err: any) => {
      this.toastr.error("Payment Failed");
      console.error(err);
    });

    rzp.open();
  }
}
