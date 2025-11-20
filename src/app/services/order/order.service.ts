import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Order } from '../../shared/models/order/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private fs: Firestore) {}

  // Add order (called from user buy)
  addOrder(order: Order): Promise<void> {
    const orderRef = collection(this.fs, 'orders');
    return addDoc(orderRef, order).then(() => {});
  }

  // Get all orders (for admin)
  getOrders(): Observable<Order[]> {
    const orderRef = collection(this.fs, 'orders');
    return collectionData(orderRef, { idField: 'id' }) as Observable<Order[]>;
  }
}
