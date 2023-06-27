import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { GameService } from '../../services/game.service';
import { switchMap, take } from 'rxjs/operators';
import { Player } from 'src/app/models/player.model';
import { of } from 'rxjs';
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
          return this.userService.getUserPokemon(user.uid);
        } else {
          return of([]);
        }
      }),
      switchMap((pokemon: any) => {
        if (pokemon.length === 0) {
          return this.pokemonService.getRandomPokemon(5)
            .then(pokemon => {
              this.pokemon = pokemon;
              this.userService.setUserPokemon(this.user.uid, pokemon);
              return pokemon;
            });
        } else {
          this.pokemon = pokemon;
          return of(pokemon);
        }
      })
    ).subscribe((pokemon: any) => {
      // Agora pokemon contém a lista de Pokemon do usuário
      // Faça algo com o jogo aqui
    });
  }

  selectPokemon(pokemon: any) {
    // Lógica para selecionar um Pokémon
  }

  navigateToGameBoard() {
    this.router.navigate(['/gameboard']);
  }
}
