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
) {}

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
buyNow(item: Keyboard) {

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
