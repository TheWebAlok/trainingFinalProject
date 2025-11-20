import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, query, where, doc, docData, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { A4 } from '../../shared/models/A4/a4.model';

@Injectable({
  providedIn: 'root'
})
export class A4Service {
  private firestore = inject(Firestore);

  // Add new A4 paper
  addA4(a4: A4) {
    const a4Ref = collection(this.firestore, 'a4papers');
    return addDoc(a4Ref, {
      ...a4,
      createdAt: new Date(),
      status: a4.status ?? true
    });
  }

  // Get A4 by ID
  getA4ById(id: string): Observable<A4> {
    const a4DocRef = doc(this.firestore, `a4papers/${id}`);
    return docData(a4DocRef, { idField: 'id' }) as Observable<A4>;
  }

  // Get all A4 papers
  getAllA4(): Observable<A4[]> {
    const a4Ref = collection(this.firestore, 'a4papers');
    return collectionData(a4Ref, { idField: 'id' }) as Observable<A4[]>;
  }

  // Get only active A4 papers
  getActiveA4(): Observable<A4[]> {
    const a4Ref = collection(this.firestore, 'a4papers');
    const q = query(a4Ref, where('status', '==', true));
    return collectionData(q, { idField: 'id' }) as Observable<A4[]>;
  }

  // Update A4 paper by ID
  updateA4(id: string, updatedData: Partial<A4>) {
    const a4DocRef = doc(this.firestore, `a4papers/${id}`);
    return updateDoc(a4DocRef, { ...updatedData });
  }

  // Delete A4 paper by ID
  deleteA4(id: string) {
    const a4DocRef = doc(this.firestore, `a4papers/${id}`);
    return deleteDoc(a4DocRef);
  }
}
