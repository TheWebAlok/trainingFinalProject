import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Order } from '../../shared/models/order/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private fs: Firestore) {}

  // SAVE ORDER IN FIRESTORE
  addOrder(order: Order): Promise<DocumentReference> {
    const orderRef = collection(this.fs, 'orders');
    return addDoc(orderRef, order);  // <-- return actual promise
  }

  // FETCH ORDERS
  getOrders(): Observable<Order[]> {
    const orderRef = collection(this.fs, 'orders');
    return collectionData(orderRef, { idField: 'id' }) as Observable<Order[]>;
  }
}
