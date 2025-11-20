import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc, updateDoc, serverTimestamp, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ServicesBook } from '../../shared/models/servicesBook/services-book.model';

@Injectable({
  providedIn: 'root'
})
export class ServicesBookService {
  private collectionName = 'serviceBookings';

  constructor(private firestore: Firestore) {}

  addBooking(booking: ServicesBook, userId: string) {
    const ref = collection(this.firestore, this.collectionName);
    return addDoc(ref, {
      ...booking,
      userId: userId,
      createdAt: serverTimestamp()
    });
  }

  getUserBookings(userId: string): Observable<ServicesBook[]> {
    const ref = collection(this.firestore, this.collectionName);
    const q = query(ref, where('userId', '==', userId));
    return collectionData(q, { idField: 'id' }) as Observable<ServicesBook[]>;
  }


  getAllBookings(): Observable<ServicesBook[]> {
    const ref = collection(this.firestore, this.collectionName);
    return collectionData(ref, { idField: 'id' }) as Observable<ServicesBook[]>;
  }
  
  updateBooking(id: string, booking: Partial<ServicesBook>) {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return updateDoc(docRef, { ...booking });
  }
  
  deleteBooking(id: string) {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return deleteDoc(docRef);
  }
}
