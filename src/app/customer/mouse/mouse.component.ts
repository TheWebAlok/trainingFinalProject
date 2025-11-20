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
  async buyNow(item: any) {

  // ---------------------------
  //  CHECK LOGIN
  // ---------------------------
  if (!this.authService.getIsLoggedIn()) {
    this.toastr.error("Please login first!");
    this.router.navigate(['/login']);
    return;
  }

  const amount = item.price;

  Swal.fire({
    title: "Buy Now?",
    text: `You are buying: ${item.name} | ₹${amount}`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Proceed to Payment",
  }).then((result) => {

    if (result.isConfirmed) {

      const options: any = {
        key: "rzp_test_R7raQKFj1qN71z",
        amount: amount * 100,
        currency: "INR",
        name: "Maa Computer Press",
        description: item.name,

        prefill: {
          name: this.authService.getName(),
          email: this.authService.getEmail(),
          contact: this.authService.getPhone()
        },

        theme: { color: "#0d6efd" },

        handler: async (res: any) => {
          this.toastr.success("Payment Successful");
          console.log("Payment Success:", res);

          // -----------------------------------
          //  SAVE ORDER IN FIRESTORE
          // -----------------------------------
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

            // Redirect to order details page
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

      rzp.on("payment.failed", (err: any) => {
        this.toastr.error("Payment Failed");
        console.error(err);
      });

      rzp.open();
    }
  });
}

}
