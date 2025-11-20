import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../../services/orders/orders.service';
import { Orders } from '../../shared/models/orders/orders.model';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.css']
})
export class AllOrdersComponent implements OnInit {

  orders: Orders[] = [];
  loading = true;

  constructor(
    private orderService: OrdersService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllOrders();
  }

  // Fetch all orders
  getAllOrders() {
    this.loading = true;
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
        console.log("Orders Loaded =", data);
        this.loading = false;
      },
      error: (err) => {
        console.error("Firestore Error:", err);
        this.toastr.error("Failed to load orders");
        this.loading = false;
      }
    });
  }

  // Cancel/Delete order with confirmation
  cancelOrder(orderId?: string) {
    if (!orderId) {
      this.toastr.error("Invalid Order ID");
      return;
    }

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
        this.orderService.deleteOrder(orderId)
          .then(() => {
            this.orders = this.orders.filter(o => o.id !== orderId);
            Swal.fire("Cancelled!", "Your order has been cancelled.", "success");
          })
          .catch(err => {
            console.error(err);
            Swal.fire("Error!", "Something went wrong!", "error");
          });
      }
    });
  }

}
