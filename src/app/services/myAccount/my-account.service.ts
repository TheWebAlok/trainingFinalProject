import { Injectable } from '@angular/core';
import { Firestore, doc, updateDoc, getDoc } from '@angular/fire/firestore';
import { Auth, updatePassword } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class MyAccountService {

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) { }

  async updateProfile(userId: string, data: any): Promise<void> {
    const userRef = doc(this.firestore, `users/${userId}`);

    await updateDoc(userRef, data);
  }

  async getUser(userId: string): Promise<any> {
    const userRef = doc(this.firestore, `users/${userId}`);

    const snap = await getDoc(userRef);

    return snap.exists() ? snap.data() : null;
  }

  async changePassword(newPassword: string): Promise<void> {
    if (this.auth.currentUser) {
      await updatePassword(this.auth.currentUser, newPassword);
    } else {
      throw new Error("No logged-in user found");
    }
  }
}
