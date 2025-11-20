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
  buyNow(item: any) {
      this.spinner.show();     //  Hide spinner on error also
      
    if (!this.authService.getIsLoggedIn()) {
      this.toastr.error("Please login first!");
      this.router.navigate(['/login']);
      return;
    }
      this.spinner.hide();     //  Hide spinner on error also
      
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
