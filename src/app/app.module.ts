import { AuthGuard } from './services/authguard.service';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { CardComponent } from './components/card/card.component';
import { PlayerComponent } from './components/player/player.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegisterComponent } from './components/register/register.component';
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { PokemonSelectionComponent } from './components/pokemon-selection/pokemon-selection.component';
import { GameService } from './services/game.service';
import { environment } from './environment/environment';

import { AuthService } from './services/auth.service';
import { RouterModule } from '@angular/router';

import * as firebase from 'firebase/app';
import 'firebase/firestore';

@NgModule({
  declarations: [
    AppComponent,
    GameBoardComponent,
    CardComponent,
    PlayerComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    RegisterComponent,
    PokemonSelectionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SocialLoginModule,
    FlexLayoutModule,
    RouterModule,
  ],
  providers: [
    GameService,
    AuthGuard,
    AuthService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('991015289846-12llmt0clq7u6621njlvmf9lcomn9rqj.apps.googleusercontent.com')
          }
        ]
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
