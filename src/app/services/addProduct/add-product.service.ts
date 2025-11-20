import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  doc,
  deleteDoc,
  updateDoc,
  getDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from '../../shared/models/addProduct/add-product.model';

@Injectable({
  providedIn: 'root'
})
export class AddProductService {
  private productCollection;

  constructor(private firestore: Firestore) {
    this.productCollection = collection(this.firestore, 'product');
  }

  addProduct(product: Product) {
    return addDoc(this.productCollection, product);
  }

  getAllProducts(): Observable<Product[]> {
    return collectionData(this.productCollection, { idField: 'id' }) as Observable<Product[]>;
  }

  deleteProduct(id: string) {
    const productDoc = doc(this.firestore, `product/${id}`);
    return deleteDoc(productDoc);
  }

  async getSingleProduct(id: string): Promise<Product | null> {
    const productDoc = doc(this.firestore, `product/${id}`);
    const snapshot = await getDoc(productDoc);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...(snapshot.data() as Product) };
    }
    return null;
  }

  updateProduct(id: string, product: Partial<Product>) {
    const productDoc = doc(this.firestore, `product/${id}`);
    return updateDoc(productDoc, product);
  }
}
