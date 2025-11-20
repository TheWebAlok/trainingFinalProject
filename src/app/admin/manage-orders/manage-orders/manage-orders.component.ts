import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order/order.service';
import { ToastrService } from 'ngx-toastr';
import { Order } from '../../../shared/models/order/order.model';

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css']
})
export class ManageOrdersComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getOrders().subscribe({
      next: (data) => (this.orders = data),
      error: () => this.toastr.error('Failed to load orders')
    });
  }
}
