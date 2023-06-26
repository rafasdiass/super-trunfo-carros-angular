import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

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

  async sendSignInLinkToEmail(email: string): Promise<void> {
    const actionCodeSettings = {
      url: 'https://supertrunfopokemon.web.app/gameboard',
      handleCodeInApp: true,
      dynamicLinkDomain: 'supertrunfopokemon.page.link'
    };

    return this.afAuth.sendSignInLinkToEmail(email, actionCodeSettings)
      .then(() => {
        window.localStorage.setItem('emailForSignIn', email);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async confirmSignIn(url: string): Promise<void> {
    try {
      if (await this.afAuth.isSignInWithEmailLink(url)) {
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
          email = window.prompt('Please provide your email for confirmation');
        }

        if (email) {
          await this.afAuth.signInWithEmailLink(email, url);
          window.localStorage.removeItem('emailForSignIn');

          // Redirecionar para 'gameboard' após a confirmação bem-sucedida
          this.router.navigate(['/gameboard']);
        } else {
          console.error('Invalid email');
        }
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
