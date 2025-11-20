import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  CollectionReference,
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { Keyboard } from '../../shared/models/keyboard/keyboard.model';

@Injectable({
  providedIn: 'root',
})
export class KeyboardService {
  private keyboardCollection: CollectionReference;

  constructor(private firestore: Firestore) {
    this.keyboardCollection = collection(this.firestore, 'keyboards');
  }

  //  Add new keyboard
  addKeyboard(keyboard: Keyboard) {
    return addDoc(this.keyboardCollection, {
      ...keyboard,
      createdAt: new Date(),
    });
  }

  //  Get all keyboards
  getKeyboards(): Observable<Keyboard[]> {
    return collectionData(this.keyboardCollection, { idField: 'id' }) as Observable<Keyboard[]>;
  }

  //  Get a single keyboard by ID
  getKeyboardById(id: string): Observable<Keyboard> {
    const docRef = doc(this.firestore, `keyboards/${id}`);
    return from(
      getDoc(docRef).then((snapshot) => {
        return { id: snapshot.id, ...(snapshot.data() as Keyboard) };
      })
    );
  }

  //  Update keyboard
  updateKeyboard(id: string, data: Partial<Keyboard>) {
    const docRef = doc(this.firestore, `keyboards/${id}`);
    return updateDoc(docRef, data);
  }

  //  Delete keyboard
  deleteKeyboard(id: string) {
    const docRef = doc(this.firestore, `keyboards/${id}`);
    return deleteDoc(docRef);
  }
}
