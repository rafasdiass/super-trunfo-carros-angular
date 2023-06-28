import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { GameService } from '../../services/game.service';
import { switchMap, take } from 'rxjs/operators';
import { Player } from 'src/app/models/player.model';
import { of, from } from 'rxjs';
import { PokemonService } from '../../services/pokemon.service';
import { Router } from '@angular/router';
import { Card } from '../../models/card.model';


@Component({
  selector: 'app-pokemon-selection',
  templateUrl: './pokemon-selection.component.html',
  styleUrls: ['./pokemon-selection.component.scss']
})
export class PokemonSelectionComponent implements OnInit {
  pokemon: Card[] = []; // assumindo que pokemon é uma lista de Cards
  user: Player | null = null;

  constructor(
    private authService: AuthService,
    private gameService: GameService,
    private userService: UserService,
    private pokemonService: PokemonService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.isAuthenticated().pipe(
      take(1),
      switchMap((user: any) => {
        if (user && user.uid) {
          console.log('User is authenticated with UID:', user.uid);
          this.user = user;
          return this.userService.getPlayer(user.uid);
        } else {
          console.log('User is not authenticated');
          return of(null);
        }
      }),
      switchMap((player: Player | null) => {
        if (player && player.cards.length === 0) {
          console.log('Player exists but has no cards');
          return from(this.pokemonService.getRandomPokemon(5)).pipe(
            switchMap(pokemon => {
              console.log('Fetched random Pokemon:', pokemon);
              player.cards = pokemon;
              this.userService.setPlayer(player);
              console.log('Player updated with new cards:', player);
              return of(pokemon);
            })
          );
        } else if (player) {
          console.log('Player exists and has cards:', player);
          return of(player.cards);
        } else {
          console.log('Player does not exist');
          return of([]);
        }
      })
    ).subscribe((pokemon: any) => {
      console.log('Subscribe:', pokemon);
    });
  }

  navigateToGameBoard() {
    this.router.navigate(['/gameboard']);
  }
}
