import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { first } from 'rxjs/operators';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { PokemonService } from './pokemon.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = firebase.auth();

  constructor(
    private router: Router,
    private userService: UserService,
    private pokemonService: PokemonService
  ) {}

  getUser(): Promise<firebase.User | null> {
    return Promise.resolve(this.auth.currentUser);
  }

  login(credentials: { email: string; password: string }): Promise<firebase.auth.UserCredential> {
    return this.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
  }

  async register(user: { name: string; email: string; password: string }): Promise<firebase.auth.UserCredential> {
    const result = await this.auth.createUserWithEmailAndPassword(user.email, user.password);
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
  }

  isAuthenticated(): Observable<firebase.User | null> {
    return from(new Promise<firebase.User | null>((resolve, reject) => {
      this.auth.onAuthStateChanged((user) => {
        resolve(user);
      }, reject);
    }));
  }

  logout(): Promise<void> {
    return this.auth.signOut();
  }

  sendSignInLinkToEmail(email: string): Promise<void> {
    const actionCodeSettings = {
      url: 'https://supertrunfopokemon.web.app/gameboard',
      handleCodeInApp: true,
      dynamicLinkDomain: 'supertrunfopokemon.page.link'
    };

    return this.auth.sendSignInLinkToEmail(email, actionCodeSettings)
      .then(() => {
        window.localStorage.setItem('emailForSignIn', email);
      });
  }

  async confirmSignIn(url: string): Promise<void> {
    if (this.auth.isSignInWithEmailLink(url)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }

      if (email) {
        await this.auth.signInWithEmailLink(email, url);
        window.localStorage.removeItem('emailForSignIn');
        const user = this.auth.currentUser;
        if (user) {
          const player = await this.userService.getPlayer(user.uid);
          if (player) {
            this.router.navigate(['/gameboard', player.id]);
          } else {
            console.error('No player found with the given user UID.');
          }
        }
      } else {
        console.error('Invalid email');
      }
    }
  }
}
