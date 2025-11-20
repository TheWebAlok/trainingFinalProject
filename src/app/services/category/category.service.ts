import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, updateDoc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Category } from '../../shared/models/category/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private firestore: Firestore) { }

  addCategory(category: Category) {
    const categoryRef = collection(this.firestore, 'categories');
    return addDoc(categoryRef, category);
  }

  getAllCategories(): Observable<Category[]> {
    const categoryRef = collection(this.firestore, 'categories');
    return collectionData(categoryRef, { idField: 'id' }) as Observable<Category[]>;
  }

  async getSingleCategory(id: string) {
    const categoryDoc = doc(this.firestore, 'categories', id);
    const snapshot = await getDoc(categoryDoc);

    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    } else {
      throw new Error("Category not found");
    }
  }

  updateCategory(id: string, category: Category) {
    const categoryDocRef = doc(this.firestore, `categories/${id}`);
    return updateDoc(categoryDocRef, { ...category });
  }
  
  deleteCategory(id: string) {
    const categoryDocRef = doc(this.firestore, `categories/${id}`);
    return deleteDoc(categoryDocRef);
  }
}
