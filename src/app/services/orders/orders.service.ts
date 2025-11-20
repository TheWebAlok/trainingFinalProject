import { Injectable } from '@angular/core';
import {
  Firestore,
  CollectionReference,
  DocumentData,
  collection,
  addDoc,
  collectionData,
  doc,
  docData,
  deleteDoc,
  updateDoc,
  query,
  where
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Orders } from '../../shared/models/orders/orders.model';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private dbPath = '/orders';
  private ordersRef: CollectionReference<DocumentData>;

  constructor(private db: Firestore) {
    this.ordersRef = collection(this.db, this.dbPath);
  }

  addOrder(order: Orders) {
    order.createdAt = Date.now();
    return addDoc(this.ordersRef, { ...order });
  }

  // 🔥 User-specific Orders Filter
  getOrdersByEmail(email: string): Observable<Orders[]> {
    const q = query(this.ordersRef, where("customer.email", "==", email));

    return collectionData(q, { idField: 'id' }).pipe(
      map((orders: any[]) =>
        orders.map(order => ({
          ...order,
          createdAt: order.createdAt?.toDate ? order.createdAt.toDate() : order.createdAt
        }))
      )
    ) as Observable<Orders[]>;
  }

  getOrders(): Observable<Orders[]> {
    return collectionData(query(this.ordersRef), { idField: 'id' }).pipe(
      map((orders: any[]) =>
        orders.map(order => ({
          ...order,
          createdAt: order.createdAt?.toDate ? order.createdAt.toDate() : order.createdAt
        }))
      )
    ) as Observable<Orders[]>;
  }

  getSingleOrder(id: string) {
    return docData(doc(this.ordersRef, id), { idField: 'id' });
  }

  updateOrder(id: string, data: Partial<Orders>) {
    return updateDoc(doc(this.ordersRef, id), data);
  }

  deleteOrder(id: string) {
    return deleteDoc(doc(this.ordersRef, id));
  }
}
