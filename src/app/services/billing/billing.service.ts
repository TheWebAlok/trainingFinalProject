import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  deleteDoc,
  CollectionReference,
  DocumentData
} from '@angular/fire/firestore';
import { Billing } from '../../shared/models/billing/billing.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillingService {
  private billingCollection: CollectionReference<DocumentData>;
  private dbPath = '/billings';

  constructor(private db: Firestore) {
    this.billingCollection = collection(this.db, this.dbPath);
  }

  getAllBillings(): Observable<Billing[]> {
    return collectionData(this.billingCollection, { idField: 'id' }) as Observable<Billing[]>;
  }

  saveBilling(billing: Billing): Promise<any> {
    return addDoc(this.billingCollection, billing);
  }

  deleteBilling(id: string): Promise<void> {
    const billingDoc = doc(this.db, `billings/${id}`);
    return deleteDoc(billingDoc);
  }
}
