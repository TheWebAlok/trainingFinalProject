import { getStorage } from 'firebase/storage';
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart/cart.service';
import { CartModel } from '../../shared/models/cart/cart.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../shared/auth/auth.service';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
declare var Razorpay: any;

@Component({
  selector: 'app-cart',
  imports: [CommonModule, NgxSpinnerModule],

  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: (CartModel & { id: string })[] = [];

  constructor(
    private cartService: CartService,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.cartService.getCartItems().subscribe((items) => {
      this.cartItems = items;
    });
  }

  getTotal(item: CartModel): number {
    return item.price * item.quantity;
  }

  getSubtotal(): number {
    return this.cartItems.reduce((acc, item) => acc + this.getTotal(item), 0);
  }

  async removeItem(cartItemId: string) {
    if (!this.authService.getIsLoggedIn()) {
      this.toastr.error("Please login first!");
      this.router.navigate(['/login']);
      return;
    }
    console.log("Deleting cart item with id:", cartItemId);
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This item will be removed from the cart.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!'
    });

    if (result.isConfirmed) {
      try {
        await this.cartService.removeFromCart(cartItemId);
        Swal.fire('Removed!', 'Item has been removed.', 'success');
      } catch (error) {
        Swal.fire('Error', 'Failed to remove item.', 'error');
        console.error('Error removing item:', error);
      }
    }
  }


  updateQuantity(item: CartModel & { id: string }, change: number) {
    const newQty = item.quantity + change;
    if (newQty < 1) return;

    this.cartService.updateQuantity(item.id, newQty)
      .catch(err => {
        Swal.fire('Error', 'Failed to update quantity.', 'error');
        console.error(err);
      });
  }

  async buyNow() {
    if (this.cartItems.length === 0) {
      Swal.fire('Empty Cart', 'Your cart is empty.', 'info');
      return;
    }

    const result = await Swal.fire({
      title: 'Confirm Purchase',
      text: 'Do you want to proceed to buy?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Proceed to Billing',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      this.router.navigate(['/billings']);
    }
  }
 proceedToPayment() {
  if (!this.authService.getIsLoggedIn()) {
    this.toastr.error("Please login first!");
    this.router.navigate(['/login']);
    return;
  }

  const subtotal = this.getSubtotal();
  const discount = subtotal * 0.20;
  const finalAmount = subtotal - discount;

  const options: any = {
    key: 'rzp_test_R7raQKFj1qN71z',
    amount: Math.round(finalAmount * 100),
    currency: 'INR',
    name: 'Maa Computer Press',
    description: 'Cart Purchase',

    prefill: {
      name: this.authService.getName(),
      email: this.authService.getEmail(),
      contact: this.authService.getPhone()
    },

    theme: { color: '#3399cc' },

    handler: async (res: any) => {
      this.toastr.success("Payment Successful!");

      const orderData = {
        paymentId: res.razorpay_payment_id,
        date: new Date().toISOString(),
        customer: {
          name: this.authService.getName(),
          email: this.authService.getEmail(),
          address: this.authService.getAddress(),
          mobile: this.authService.getPhone()
        },
        items: this.cartItems,
        subtotal: subtotal,
        discount: discount,
        finalAmount: finalAmount
      };

      try {
        await this.cartService.saveOrder(orderData);
        this.router.navigate(['/order/details'], {
          state: { order: orderData }
        });

      } catch (error) {
        console.error("Order Save Failed:", error);
        this.toastr.error("Failed to save order!");
      }
    }
  };

  const rzp1 = new Razorpay(options);

  rzp1.on('payment.failed', (err: any) => {
    this.toastr.error("Payment Failed!");
    console.error("Payment Failed:", err);
  });

  rzp1.open();
}


  async buySingleItem(item: CartModel & { id: string }) {
  if (!this.authService.getIsLoggedIn()) {
    this.toastr.error("Please login first!");
    this.router.navigate(['/login']);
    return;
  }

  const amount = item.price * item.quantity;

  Swal.fire({
    title: 'Buy This Item?',
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
        description: 'Buying Single Item',
        prefill: {
          name: this.authService.getName(),
          email: this.authService.getEmail(),
          contact: this.authService.getPhone()
        },
        theme: { color: '#3399cc' },

        handler: async (res: any) => {
          this.toastr.success("Payment Successful!");
          console.log("Payment Done:", res.razorpay_payment_id);

          // --------------------------
          // ⭐ SAVE ORDER IN FIRESTORE
          // --------------------------
          const orderData = {
            paymentId: res.razorpay_payment_id,
            date: new Date().toISOString(),

            customer: {
              name: this.authService.getName(),
              email: this.authService.getEmail(),
              phone: this.authService.getPhone(),
              address: this.authService.getAddress()
            },

            items: [item],  // 🔥 Single item purchase
            subtotal: amount,
            discount: 0,
            finalAmount: amount
          };

          try {
            await this.cartService.saveOrder(orderData);

            // Redirect to orders page
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
