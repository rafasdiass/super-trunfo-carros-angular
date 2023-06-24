import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GameBoardComponent } from './components/game-board/game-board.component'; // Importe o GameBoardComponent
import { NavbarComponent } from './components/navbar/navbar.component';
const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'gameboard', component: GameBoardComponent }, // Adicione esta linha
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'navbar', redirectTo: '/navbar', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
