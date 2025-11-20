import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, updateDoc, getDoc, CollectionReference, DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Printer } from '../../shared/models/printer/printer.model';

@Injectable({
  providedIn: 'root'
})
export class PrinterService {

  private printerCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.printerCollection = collection(this.firestore, 'printers');
  }

  // ✅ Add new printer
  addPrinter(printer: Printer) {
    return addDoc(this.printerCollection, {
      ...printer,
      createdAt: new Date()
    });
  }

  // ✅ Fetch all printers
  getPrinters(): Observable<Printer[]> {
    return collectionData(this.printerCollection, { idField: 'id' }) as Observable<Printer[]>;
  }

  // ✅ Fetch single printer by ID (for edit/view)
  async getPrinterById(id: string): Promise<Printer | undefined> {
    const docRef = doc(this.firestore, `printers/${id}`);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as Printer) : undefined;
  }

  // ✅ Update printer
  updatePrinter(id: string, data: Partial<Printer>) {
    const docRef = doc(this.firestore, `printers/${id}`);
    return updateDoc(docRef, data);
  }

  // ✅ Delete printer
  deletePrinter(id: string) {
    const docRef = doc(this.firestore, `printers/${id}`);
    return deleteDoc(docRef);
  }
}
