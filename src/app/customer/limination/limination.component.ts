import { Component } from '@angular/core';
import { Limination } from '../../shared/models/limination/limination.model';
import { LiminationService } from '../../services/limination/limination.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../services/cart/cart.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../shared/auth/auth.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
declare var Razorpay: any;

@Component({
  selector: 'app-limination',
  imports: [NgxSpinnerModule],
  templateUrl: './limination.component.html',
  styleUrl: './limination.component.css'
})
export class LiminationComponent {
  laminations: Limination[] = [];
  loading = true;

  constructor(
    private liminationService: LiminationService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
        private spinner: NgxSpinnerService
        
  ) {}

  ngOnInit(): void {
    this.getAllLaminations();
  }

  // Fetch all lamination services
  getAllLaminations() {
      this.spinner.show();     //  Hide spinner on error also
      
  this.liminationService.getAllLimination().subscribe({
    next: (res) => {
      this.laminations = res;
      this.loading = false;
      this.spinner.hide();     // Hide spinner once loaded
    },
    error: (err) => {
      console.error("Error fetching laminations:", err);
      this.toastr.error("Failed to load lamination services!");
      this.loading = false;
      this.spinner.hide();     //  Hide spinner on error also
    },
  });
}


  // ADD TO CART
  addToCartHandler(item: any) {
      this.spinner.show();     //  Hide spinner on error also
      
    if (!this.authService.getIsLoggedIn()) {
      this.toastr.error("Please login first!");
      this.router.navigate(['/login']);
      return;
    }
      this.spinner.hide();     //  Hide spinner on error also
      

    const user = {
      email: sessionStorage.getItem("email") || "",
      name: sessionStorage.getItem("name") || "",
      uid: sessionStorage.getItem("uid") || ""
    };

    const cartItem = {
      productId: item.id,
      name: item.serviceName,
      price: item.price,
      image: item.image || 'assets/images/no-image.png',
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
      .catch(err => {
        Swal.fire({
          icon: 'error',
          title: 'Failed to add'
        });
        console.error(err);
      });
  }

  // BUY NOW
  // buyNow(item: any) {
  //   if (!this.authService.getIsLoggedIn()) {
  //     this.toastr.error("Please login first!");
  //     this.router.navigate(['/login']);
  //     return;
  //   }

  //   this.router.navigate(['/buy'], {
  //     queryParams: {
  //       id: item.id,
  //       name: item.serviceName,
  //       price: item.price,
  //       image: item.image
  //     }
  //   });
  // }
  async buyNow(item: any) {
  this.spinner.show();  // Spinner Start

  // ---------------------------
  //  CHECK LOGIN
  // ---------------------------
  if (!this.authService.getIsLoggedIn()) {
    this.spinner.hide();
    this.toastr.error("Please login first!");
    this.router.navigate(['/login']);
    return;
  }

  this.spinner.hide(); // Home Page Ready

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
          this.spinner.show();
          this.toastr.success("Payment Successful!");
          console.log("Payment Success:", res);

          // ----------------------------------------
          //  SAVE ORDER IN FIRESTORE (Same Format)
          // ----------------------------------------
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
            this.spinner.hide();

            // REDIRECT TO ORDER DETAILS PAGE
            this.router.navigate(['/order/details'], {
              state: { order: orderData }
            });

          } catch (err) {
            this.spinner.hide();
            console.error("Order Save Failed:", err);
            this.toastr.error("Failed to save order!");
          }
        }
      };

      const rzp = new Razorpay(options);

      rzp.on("payment.failed", (err: any) => {
        this.spinner.hide();
        this.toastr.error("Payment Failed");
        console.error(err);
      });

      rzp.open();
    }
  });
}

}
