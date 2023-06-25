import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth) {}

  async login(credentials: { email: string; password: string }): Promise<firebase.auth.UserCredential> {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(credentials.email, credentials.password);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async register(user: { name: string; email: string; password: string }): Promise<firebase.auth.UserCredential> {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(user.email, user.password);
      if(result.user) {
        await result.user.updateProfile({
          displayName: user.name,
        });
      }
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  isAuthenticated(): Observable<firebase.User | null> {
    return this.afAuth.authState;
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
