import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../../services/orders/orders.service';
import { Auth, user } from '@angular/fire/auth';
import Swal from 'sweetalert2';   // <-- RIGHT PLACE

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  orders: any[] = [];
  loading = true;

  constructor(
    private orderService: OrdersService,
    private auth: Auth
  ) {}

  ngOnInit(): void {

    user(this.auth).subscribe(currentUser => {

      if (!currentUser) {
        console.error("❌ User not logged in");
        this.loading = false;
        return;
      }

      const email = currentUser.email;
      console.log("🔥 Firebase Email =", email);

      this.orderService.getOrdersByEmail(email!).subscribe({
        next: (data) => {
          console.log("🔥 Orders Loaded =", data);
          this.orders = data;
          this.loading = false;
        },
        error: (err) => {
          console.error("Firestore Error:", err);
          this.loading = false;
        }
      });

    });

  }

  // ✅ Cancel Order Function
  cancelOrder(orderId: string) {

    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to cancel this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Cancel it!"
    }).then(result => {

      if (result.isConfirmed) {

        this.orderService.deleteOrder(orderId).then(() => {

          Swal.fire("Cancelled!", "Your order has been cancelled.", "success");

          // Remove cancelled order from UI
          this.orders = this.orders.filter(o => o.id !== orderId);

        }).catch(err => {
          console.error(err);
          Swal.fire("Error!", "Something went wrong!", "error");
        });

      }
    });
  }

}
