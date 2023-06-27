import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { PokemonSelectionComponent } from './components/pokemon-selection/pokemon-selection.component';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { AuthGuard } from '../app/services/authguard.service';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'home/login', pathMatch: 'full' },
  { path: 'gameboard', component: GameBoardComponent, canActivate: [AuthGuard] },
  { path: 'pokeselection', component: PokemonSelectionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
