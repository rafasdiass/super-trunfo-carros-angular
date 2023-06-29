import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserCredential } from '@firebase/auth-types';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { first } from 'rxjs/operators';
import { PokemonService } from './pokemon.service';
import firebase from 'firebase/compat/app';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private userService: UserService,
    private pokemonService: PokemonService
  ) {}

  async getUser(): Promise<firebase.User | null> {
    return this.afAuth.currentUser;
  }

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
      if (result.user) {
        await result.user.updateProfile({
          displayName: user.name,
        });

        const initialPokemon = await this.pokemonService.getRandomPokemon(5);
        console.log(initialPokemon); // Log the initialPokemon for debugging

        await this.userService.setPlayer({
          id: result.user.uid,
          name: user.name,
          cards: initialPokemon
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
          const user = await this.afAuth.currentUser;
          if (user) {
            const player = await this.userService.getPlayer(user.uid).pipe(first()).toPromise();
            if (player) { // Verifica se o player é null
              this.router.navigate(['/gameboard', player.id]);
            } else {
              console.error('No player found with the given user UID.');
            }
          }
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
