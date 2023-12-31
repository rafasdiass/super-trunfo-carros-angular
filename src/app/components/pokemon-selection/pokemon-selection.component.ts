import { Component, OnInit } from '@angular/core';
import { Card } from '../../models/card.model';
import { GameService } from '../../services/game.service';
import { Player } from '../../models/player.model';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { switchMap, take } from 'rxjs/operators';
import { of, from } from 'rxjs';
import { PokemonService } from '../../services/pokemon.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-pokemon-selection',
  templateUrl: './pokemon-selection.component.html',
  styleUrls: ['./pokemon-selection.component.scss']
})
export class PokemonSelectionComponent implements OnInit {
  pokemon: Card[] = [];
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
      switchMap((user: User | null) => {
        if (user && user.uid) {
          console.log('User is authenticated with UID:', user.uid);
          return from(this.userService.getPlayer(user.uid));
        } else {
          console.log('User is not authenticated');
          return of(null);
        }
      }),
      switchMap((player: Player | null) => {
        if (player && player.cards.length === 0) {
          console.log('Player exists but has no cards');
          return from(this.pokemonService.getRandomPokemon(5)).pipe(
            tap(pokemon => {
              player!.cards = pokemon;
              this.userService.setPlayer(player!);
              console.log('Player updated with new cards:', player);
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
    )
    .subscribe((pokemonCards: Card[] | null) => {
      console.log('Type of pokemonCards:', typeof pokemonCards);
      console.log('Is pokemonCards an array:', Array.isArray(pokemonCards));
      if (pokemonCards !== null) {
        this.pokemon = pokemonCards;
        console.log('Subscribe:', pokemonCards);
      }
    });
  }

  navigateToGameBoard() {
    const player = new Player('player1', 'Player 1', this.pokemon);

    this.userService.setPlayer(player).then(() => {
      // Passamos 'player' diretamente aqui
      this.gameService.initializeGame().then(() => {
        this.router.navigate(['/gameboard']);
      }).catch(error => {
        console.error('Error initializing game:', error);
      });
    }).catch(error => {
      console.error('Error saving player:', error);
    });
  }



}
