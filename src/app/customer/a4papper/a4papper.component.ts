import { Component, OnInit } from '@angular/core';
import { A4 } from '../../shared/models/A4/a4.model';
import { A4Service } from '../../services/A4/a4.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../shared/auth/auth.service';
import Swal from 'sweetalert2';
import { CartService } from '../../services/cart/cart.service';
import { NgxSpinnerModule } from 'ngx-spinner';

declare var Razorpay: any;

@Component({
  selector: 'app-a4papper',
  imports: [NgxSpinnerModule],
  templateUrl: './a4papper.component.html',
  styleUrl: './a4papper.component.css'
})
export class A4papperComponent implements OnInit {
  allA4: A4[] = [];
  userLoggedIn: boolean = false;

  constructor(
    private a4Service: A4Service,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
     private cartService: CartService,

  ) {}
  
  ngOnInit() {
    this.getAllA4();
        this.userLoggedIn = this.authService.getIsLoggedIn();

  }

  getAllA4() {
    this.a4Service.getActiveA4().subscribe(data => {
      this.allA4 = data;
    });
  }
addToCartHandler(item: any) {

  if (!this.authService.getIsLoggedIn()) {
    this.toastr.error("Please login first!");
    this.router.navigate(['/login']);
    return;
  }

  const user = {
    email: sessionStorage.getItem("email") || "",
    name: sessionStorage.getItem("name") || "Guest",
    uid: sessionStorage.getItem("uid") || "unknown"
  };

  if (!user.uid) {
    this.toastr.error("User not found. Please login again.");
    return;
  }

  const cartItem = {
    productId: item.id,
    name: item.name,
    price: item.price,
    image: item.imageUrl || 'assets/img/default-image.png',
    quantity: 1,
    uid: user.uid,
    status: true
  };

  this.cartService.addToCart(cartItem)
    .then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Added to cart'
      });
    })
    .catch((err) => {
      Swal.fire({
        icon: 'error',
        title: 'Failed to add to cart'
      });
      console.error("Cart error:", err);
    });

}
  // ---------------------- BUY NOW → RAZORPAY PAYMENT ----------------------
 async buyNow(item: any) {

  // ---------------------------
  //  CHECK LOGIN
  // ---------------------------
  if (!this.authService.getIsLoggedIn()) {
    this.toastr.error("Please login first!");
    this.router.navigate(['/login']);
    return;
  }

  const amount = item.price; // single product price

  // ---------------------------
  //  SHOW CONFIRMATION POPUP
  // ---------------------------
  Swal.fire({
    title: 'Buy Now?',
    text: `You are buying: ${item.name} | ₹${amount}`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Proceed to Payment',
  }).then((result) => {

    if (result.isConfirmed) {

      const options: any = {
        key: 'rzp_test_R7raQKFj1qN71z',
        amount: amount * 100,
        currency: 'INR',
        name: 'Maa Computer Press',
        description: 'Instant Buy',

        prefill: {
          name: this.authService.getName(),
          email: this.authService.getEmail(),
          contact: this.authService.getPhone()
        },

        theme: { color: '#3399cc' },

        handler: async (res: any) => {
          this.toastr.success("Payment Successful!");
          console.log("Payment Done:", res.razorpay_payment_id);

          // ------------------------------------
          //  SAVE ORDER IN FIRESTORE (Same Format)
          // ------------------------------------
          const orderData = {
            paymentId: res.razorpay_payment_id,
            date: new Date().toISOString(),

            customer: {
              name: this.authService.getName(),
              email: this.authService.getEmail(),
              phone: this.authService.getPhone(),
              address: this.authService.getAddress()
            },

            items: [
              {
                ...item,
                quantity: 1
              }
            ],

            subtotal: amount,
            discount: 0,
            finalAmount: amount
          };

          try {
            await this.cartService.saveOrder(orderData);

            // Redirect & pass data
            this.router.navigate(['/order/details'], {
              state: { order: orderData }
            });

          } catch (err) {
            console.error("Order Save Failed:", err);
            this.toastr.error("Failed to save order!");
          }
        }
      };

      const rzp = new Razorpay(options);

      rzp.on('payment.failed', (err: any) => {
        this.toastr.error("Payment Failed!");
        console.error(err);
      });

      rzp.open();
    }
  });
}

}
