import { Component } from '@angular/core';
import { Printer } from '../../shared/models/printer/printer.model';
import { PrinterService } from '../../services/printer/printer.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../services/cart/cart.service';
import { AuthService } from '../../shared/auth/auth.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

declare var Razorpay: any;

@Component({
  selector: 'app-printer',
  imports: [NgxSpinnerModule],
  templateUrl: './printer.component.html',
  styleUrl: './printer.component.css'
})
export class PrinterComponent {
  
  printers: Printer[] = [];
  loading = true;

  constructor(
    private printerService: PrinterService,
    private toastr: ToastrService,
    private router: Router,
    private cartService: CartService,
    private authService: AuthService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.loadPrinters();
  }

  // -----------------------------------------
  // LOAD PRINTERS WITH SPINNER
  // -----------------------------------------
  loadPrinters() {

    this.spinner.show();  // <-- Spinner Start
    this.loading = true;
    
    this.printerService.getPrinters().subscribe({
      next: (res: Printer[]) => {
        this.printers = res;
        this.loading = false;
        this.spinner.hide();  // <-- Spinner Stop
      },
      error: (err: any) => {
        console.error(err);
        this.toastr.error('Failed to load printers');
        this.loading = false;
        this.spinner.hide();  // <-- Stop even on error
      }
    });

  }

  // ------------------------------------------------
  // ADD TO CART
  // ------------------------------------------------
  addToCart(p: Printer) {

    if (!this.authService.getIsLoggedIn()) {
      this.toastr.error("Please login first!");
      this.router.navigate(['/login']);
      return;
    }

    const uid = sessionStorage.getItem("uid") || "";

    const cartItem = {
      productId: p.id,
      name: p.name,
      price: p.price,
      image: p.imageUrl,
      quantity: 1,
      uid: uid,
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
        Swal.fire({
          icon: "error",
          title: "Failed to add"
        });
        console.error(err);
      });
  }

  // ------------------------------------------------
  // BUY NOW + PAYMENT
  // ------------------------------------------------
  buyNow(p: Printer) {

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
      amount: p.price * 100,
      currency: "INR",
      name: "Maa Computer Press",
      description: p.name,
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.phone
      },
      theme: { color: "#0d6efd" },
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
