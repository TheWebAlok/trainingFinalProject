import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Mouse } from '../../shared/models/mouse/mouse.model';

@Injectable({
  providedIn: 'root'
})
export class MouseService {
  private miceCollection;

  constructor(private firestore: Firestore) {
    this.miceCollection = collection(this.firestore, 'mouse');
  }

  addMouse(mouse: Mouse) {
    mouse.createdAt = new Date();
    return addDoc(this.miceCollection, mouse);
  }

  getAllMice(): Observable<Mouse[]> {
    return collectionData(this.miceCollection, { idField: 'id' }) as Observable<Mouse[]>;
  }

  updateMouse(id: string, updated: Partial<Mouse>) {
    const mouseDoc = doc(this.firestore, `mouse/${id}`);
    return updateDoc(mouseDoc, updated);
  }

  deleteMouse(id: string) {
    const mouseDoc = doc(this.firestore, `mouse/${id}`);
    return deleteDoc(mouseDoc);
  }
}
