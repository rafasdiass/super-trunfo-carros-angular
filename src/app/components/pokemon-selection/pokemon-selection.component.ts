import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { GameService } from '../../services/game.service';
import { switchMap, take } from 'rxjs/operators';
import { Player } from 'src/app/models/player.model';
import { of, from } from 'rxjs'; // Importe 'from' também
import { PokemonService } from '../../services/pokemon.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pokemon-selection',
  templateUrl: './pokemon-selection.component.html',
  styleUrls: ['./pokemon-selection.component.scss']
})
export class PokemonSelectionComponent implements OnInit {
  pokemon: any;
  user: any;

  constructor(
    private authService: AuthService,
    private gameService: GameService,
    private userService: UserService,
    private pokemonService: PokemonService,
    private router: Router // Injetando o serviço Router
  ) { }

  ngOnInit(): void {
    this.authService.isAuthenticated().pipe(
      take(1),
      switchMap((user: any) => {
        if (user && user.uid) {
          this.user = user;
          return this.userService.getPlayer(user.uid);
        } else {
          return of(null); // Alterado de [] para null
        }
      }),
      switchMap((player: Player | null) => {
        if (player && player.cards.length === 0) {
          // Use from() para converter Promise em Observable
          return from(this.pokemonService.getRandomPokemon(5)).pipe(
            switchMap(pokemon => {
              player.cards = pokemon;
              this.userService.setPlayer(player);
              return of(pokemon);
            })
          );
        } else if (player) {
          return of(player.cards);
        } else {
          return of([]);
        }
      })
    ).subscribe((pokemon: any) => {
      // Agora pokemon contém a lista de Pokemon do usuário
      // Faça algo com o jogo aqui
    });
  }

  navigateToGameBoard() {
    this.router.navigate(['/gameboard']);
  }
}
