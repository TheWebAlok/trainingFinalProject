import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  DocumentReference
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Limination } from '../../shared/models/limination/limination.model';

@Injectable({
  providedIn: 'root'
})
export class LiminationService {

  private collectionName = 'limination'; // Use consistent collection name

  constructor(private firestore: Firestore) {}

  // Get all laminations
  getAllLimination(): Observable<Limination[]> {
    const colRef = collection(this.firestore, this.collectionName);
    return collectionData(colRef, { idField: 'id' }) as Observable<Limination[]>;
  }

  // Add new lamination
  addLimination(limination: Limination) {
    const colRef = collection(this.firestore, this.collectionName);
    return addDoc(colRef, {
      ...limination,
      createdAt: new Date()
    });
  }

  // Get single lamination by ID
  async getLiminationById(id: string): Promise<Limination | null> {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Limination;
    } else {
      return null;
    }
  }

  // Update lamination
  updateLimination(id: string, data: Limination) {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return updateDoc(docRef, { ...data });
  }

  // Delete lamination
  deleteLimination(id: string) {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return deleteDoc(docRef);
  }
}
