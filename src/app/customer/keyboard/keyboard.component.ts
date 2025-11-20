import { Component } from '@angular/core';
import { Keyboard } from '../../shared/models/keyboard/keyboard.model';
import { KeyboardService } from '../../services/keyboard/keyboard.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { CartService } from '../../services/cart/cart.service';
import { AuthService } from '../../shared/auth/auth.service';
import { NgxSpinnerModule } from 'ngx-spinner';
declare var Razorpay: any;

@Component({
  selector: 'app-keyboard',
  imports: [NgxSpinnerModule],
  templateUrl: './keyboard.component.html',
  styleUrl: './keyboard.component.css'
})
export class KeyboardComponent {
  keyboards: Keyboard[] = [];

  constructor(
    private keyboardService: KeyboardService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  // In your component.ts file
  filterKeyboards(type: string): void {
    // Implement logic here to filter your keyboards array
    // based on the 'type' (e.g., 'Mechanical', 'Wireless', 'Gaming')
    console.log('Filtering by:', type);
    // Example: this.keyboards = this.allKeyboards.filter(k => k.type === type);
  }
  ngOnInit(): void {
    this.getAllKeyboards();
  }
  /** Fetch all keyboaACrds */
  getAllKeyboards(): void {
    this.keyboardService.getKeyboards().subscribe({
      next: (data: Keyboard[]) => this.keyboards = data,
      error: (err: any) => console.error('Error fetching keyboards:', err)
    });
  }

  addToCartHandler(item: Keyboard) {

    if (!this.authService.getIsLoggedIn()) {
      this.toastr.error("Please login first!");
      this.router.navigate(['/login']);
      return;
    }

    const user = {
      email: sessionStorage.getItem("email") || "",
      name: sessionStorage.getItem("name") || "",
      uid: sessionStorage.getItem("uid") || ""
    };

    const cartItem = {
      productId: item.id,
      name: item.name,
      price: item.price,
      image: item.imageUrl || 'assets/images/no-image.png',
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
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Failed to add to cart'
        });
      });
  }
  async buyNow(item: Keyboard) {

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

        // ---------------------------
        //  RAZORPAY OPTIONS
        // ---------------------------
        const options: any = {
          key: "rzp_test_R7raQKFj1qN71z",
          amount: amount * 100,
          currency: "INR",
          name: "Maa Computer Press",
          description: item.name,

          prefill: {
            name: this.authService.getName(),
            email: this.authService.getEmail(),
            contact: this.authService.getPhone(),
          },

          theme: { color: "#0d6efd" },

          handler: async (res: any) => {
            this.toastr.success("Payment Successful!");
            console.log("Payment Success:", res);

            // ---------------------------
            //  SAVE ORDER IN FIRESTORE
            // ---------------------------
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

              // PASS ORDER DETAILS TO NEXT PAGE
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
