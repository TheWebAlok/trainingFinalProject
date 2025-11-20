
import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { User } from '../../shared/models/user/user.model';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  constructor(private firestore: Firestore) { }

  registerUser(user: User) {
    const userRef = collection(this.firestore, 'users');
    return addDoc(userRef, user);
  }
}
