import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CartService } from '../../services/cart/cart.service';
import { AddProductService } from '../../services/addProduct/add-product.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../shared/auth/auth.service';

declare var Razorpay: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  products: any[] = [];
  userLoggedIn: boolean = false;
  
  constructor(
    private productService: AddProductService,
    private cartService: CartService,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.userLoggedIn = this.authService.getIsLoggedIn();
    this.getAllProducts();
  }

  getAllProducts() {
    this.productService.getAllProducts().subscribe(
      (res: any[]) => {
        this.products = res;
      },
      (err) => {
        console.error("Error fetching products:", err);
      }
    );
  }
  addToCartHandler(product: any) {
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
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl || 'assets/img/default-image.png',
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

 async proceedToPayment(product: any) {

  // 1️⃣ Login Check
  if (!this.authService.getIsLoggedIn()) {
    this.toastr.error("Please login first to proceed with payment!");
    this.router.navigate(['/login']);
    return;
  }

  // 2️⃣ User Details
  const user = {
    name: sessionStorage.getItem("name") || "Customer",
    email: sessionStorage.getItem("email") || "customer@example.com",
    mobile: sessionStorage.getItem("phone") || "9999999999"
  };

  const amount = product.price;

  // 3️⃣ Razorpay Options
  const options: any = {
    key: "rzp_test_R7raQKFj1qN71z",
    amount: amount * 100,
    currency: "INR",
    name: "Maa Computer Press",
    description: product.name,

    prefill: {
      name: user.name,
      email: user.email,
      contact: user.mobile
    },

    theme: { color: "#3399cc" },

    // 4️⃣ Payment Success Handler
    handler: async (res: any) => {
      this.toastr.success("Payment Successful");
      console.log("Payment Done:", res);

      // ------------------------
      //  SAVE ORDER IN FIRESTORE
      // ------------------------
      const orderData = {
        paymentId: res.razorpay_payment_id,
        date: new Date().toISOString(),

        customer: {
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          address: this.authService.getAddress()
        },

        items: [
          {
            ...product,
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

  // 5️⃣ Razorpay Instance
  const rzp1 = new Razorpay(options);

  // 6️⃣ Payment Failed Handler
  rzp1.on("payment.failed", (err: any) => {
    this.toastr.error("Payment Failed");
    console.error(err);
  });

  // 7️⃣ Open Payment
  rzp1.open();
}


}
