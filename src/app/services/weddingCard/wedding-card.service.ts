import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { WeddingCard } from '../../shared/models/weddingCard/wedding-card.model';

@Injectable({
  providedIn: 'root'
})
export class WeddingCardService {

  private dbPath = 'weddingCards';

  constructor(private firestore: Firestore) { }


  addWeddingCard(card: WeddingCard) {
    const weddingCardRef = collection(this.firestore, this.dbPath);
    return addDoc(weddingCardRef, card);
  }


  getAllWeddingCards(): Observable<WeddingCard[]> {
    const weddingCardRef = collection(this.firestore, this.dbPath);
    return collectionData(weddingCardRef, { idField: 'id' }) as Observable<WeddingCard[]>;
  }


  async getSingleWeddingCard(id: string): Promise<WeddingCard> {
    const docRef = doc(this.firestore, `${this.dbPath}/${id}`);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      throw new Error('Wedding Card not found');
    }

  const data = snapshot.data() as Omit<WeddingCard, 'id'>;
return { id: snapshot.id, ...data };

   
  }

  updateWeddingCard(id: string, data: Partial<WeddingCard>) {
    const docRef = doc(this.firestore, `${this.dbPath}/${id}`);
    return updateDoc(docRef, data);
  }

  deleteWeddingCard(id: string) {
    const docRef = doc(this.firestore, `${this.dbPath}/${id}`);
    return deleteDoc(docRef);
  }
}
