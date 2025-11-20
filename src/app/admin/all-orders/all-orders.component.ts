import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../../services/orders/orders.service';
import { Orders } from '../../shared/models/orders/orders.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-all-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.css']
})
export class AllOrdersComponent implements OnInit {

  orders: Orders[] = [];

  constructor(
    private ordersService: OrdersService,
    private toastr: ToastrService
  ) { }

  ngOnInit(){
    this.getAllOrders();
  }
  
  getAllOrders() {
    this.ordersService.getOrders().subscribe(
      (res: Orders[]) => {
        this.orders = res;
        console.log("Orders Loaded:", this.orders);
        this.toastr.success("Orders Loaded Successfully");
      },
      (err: any) => {
        console.error("Error:", err);
        this.toastr.error("Failed to load orders");
      }
    );
  }
  deleteOrder(orderId?: string) {
    if (!orderId) {
      this.toastr.error("Invalid Order ID");
      return;
    }
    this.ordersService.deleteOrder(orderId).then(() => {
      this.orders = this.orders.filter(o => o.id !== orderId);
      this.toastr.success("Order deleted successfully");
    }).catch(err => {
      console.error("Delete Error:", err);
      this.toastr.error("Failed to delete order");
    });
  }

}
