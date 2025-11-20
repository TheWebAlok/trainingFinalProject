import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
declare var Razorpay: any;   // 👈 Razorpay declare karna zaroori hai

@Component({
  selector: 'app-payment',
  imports: [FormsModule],
 
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
constructor(private toastr: ToastrService) {

  }


  amount: any
  
  submit() {
    var options = {
      "key": "rzp_test_R7raQKFj1qN71z", // Enter the Key ID generated from the Dashboard
      "amount": this.amount * 100, // Amount is in currency subunits.
      "currency": "INR",
      "name": "Maa Computers", //your business name
      "description": "Test Transaction",
      //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      // "handler": function (response) {
      //   alert(response.razorpay_payment_id);
      //   alert(response.razorpay_order_id);
      //   alert(response.razorpay_signature)
      // },
      "prefill": {
        "name": "Gaurav Kumar", //your customer's name
        "email": "gaurav.kumar@example.com",
        "contact": "+919876543210"  //Provide the customer's phone number for better conversion rates 
      },
      "theme": {
        "color": "#3399cc"
      },
      handler: ((res: any) => {
        this.toastr.success("Payment Successfull")
        console.log("payment Done");
      })
    };
    var rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', (any: any) => {
      this.toastr.error("Payment Failed")
    });
    rzp1.open();
  }
  
}
