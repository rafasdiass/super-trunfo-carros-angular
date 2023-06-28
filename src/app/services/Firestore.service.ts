import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) { }

  getDocument(collection: string, docId: string): Observable<any> {
    return this.firestore.collection(collection).doc(docId).valueChanges();
  }

  setDocument(collection: string, docId: string, data: any): Promise<void> {
    return this.firestore.collection(collection).doc(docId).set(data);
  }

  updateDocument(collection: string, docId: string, data: any): Promise<void> {
    return this.firestore.collection(collection).doc(docId).update(data);
  }

  deleteDocument(collection: string, docId: string): Promise<void> {
    return this.firestore.collection(collection).doc(docId).delete();
  }
}
