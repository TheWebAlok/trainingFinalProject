import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private dbPath = "cart";

  constructor(private firestore: Firestore) { }

  addToCart(item: any) {
    const cartRef = collection(this.firestore, this.dbPath);
    return addDoc(cartRef, item);
  }

  getCartItems(): Observable<any[]> {
    const cartRef = collection(this.firestore, this.dbPath);
    return collectionData(cartRef, { idField: 'id' }) as Observable<any[]>;
  }

  removeFromCart(id: string) {
    const docRef = doc(this.firestore, `${this.dbPath}/${id}`);
    return deleteDoc(docRef);
  }

  updateQuantity(id: string, quantity: number) {
    const docRef = doc(this.firestore, `${this.dbPath}/${id}`);
    return updateDoc(docRef, { quantity });
  }

  //Firestore Save Order Function
  saveOrder(order: any) {
    const orderRef = collection(this.firestore, 'orders');
    return addDoc(orderRef, order);
  }

}
