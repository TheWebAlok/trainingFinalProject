import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Contact } from '../../shared/models/contact/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  constructor(private firestore: Firestore) { }

  addContact(contact: Contact) {
    const contactRef = collection(this.firestore, 'contacts');
    return addDoc(contactRef, contact);
  }
}
