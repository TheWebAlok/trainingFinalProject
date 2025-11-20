import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  serverTimestamp,
  CollectionReference,
  DocumentData,
  query,
  where,
  doc,
  docData,
  updateDoc,
  deleteDoc
} from '@angular/fire/firestore';
import { Services } from '../../shared/models/services/services.model';
import { Observable } from 'rxjs';
import { collectionData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AddServicesService {
  private servicesCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.servicesCollection = collection(this.firestore, 'services');
  }


  addService(service: Services) {
    return addDoc(this.servicesCollection, {
      ...service,
      createdAt: serverTimestamp(),
      status: true
    });
  }


  getAllServices(): Observable<Services[]> {
    const serviceRef = query(this.servicesCollection, where('status', '==', true));
    return collectionData(serviceRef, { idField: 'id' }) as Observable<Services[]>;
  }

  
  getSingleService(id: string): Observable<Services> {
    const docRef = doc(this.firestore, `services/${id}`);
    return docData(docRef, { idField: 'id' }) as Observable<Services>;
  }


  updateService(id: string, data: Partial<Services>) {
    const docRef = doc(this.firestore, `services/${id}`);
    return updateDoc(docRef, data);
  }

  
  deleteService(id: string) {
    const docRef = doc(this.firestore, `services/${id}`);
    return deleteDoc(docRef);
  }
}
