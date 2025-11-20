import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, updateDoc, deleteDoc, getDoc } from '@angular/fire/firestore';
import { Muhar } from '../../shared/models/muhar/muhar.model';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Observable, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MuharService {
  constructor(private firestore: Firestore, private cloudinary: CloudinaryService) {}

  // ✅ Add Muhar
  async addMuhar(muhar: Muhar, imageFile?: File) {
    let imageUrl = '';
    if (imageFile) {
      // Convert Observable → Promise using lastValueFrom
      const response: any = await lastValueFrom(this.cloudinary.uploadImage(imageFile));
      imageUrl = response.secure_url; // Cloudinary returns this field
    }

    const colRef = collection(this.firestore, 'muhar');
    return addDoc(colRef, { ...muhar, imageUrl, createdAt: Date.now() });
  }

  // ✅ Get All Muhars
  getAllMuhars(): Observable<Muhar[]> {
    const colRef = collection(this.firestore, 'muhar');
    return collectionData(colRef, { idField: 'id' }) as Observable<Muhar[]>;
  }

  // ✅ Get Single Muhar by ID
  async getMuharById(id: string): Promise<Muhar | null> {
    const docRef = doc(this.firestore, 'muhar', id);
    const snapshot = await getDoc(docRef);
    return snapshot.exists()
      ? ({ id: snapshot.id, ...snapshot.data() } as Muhar)
      : null;
  }

  // ✅ Update Muhar (with optional image)
  async updateMuhar(id: string, muhar: Partial<Muhar>, imageFile?: File) {
    const docRef = doc(this.firestore, 'muhar', id);

    if (imageFile) {
      const response: any = await lastValueFrom(this.cloudinary.uploadImage(imageFile));
      muhar.imageUrl = response.secure_url;
    }

    return updateDoc(docRef, muhar);
  }

  // ✅ Delete Muhar
  deleteMuhar(id: string) {
    const docRef = doc(this.firestore, 'muhar', id);
    return deleteDoc(docRef);
  }
}
