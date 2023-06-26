import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { NgModule } from '@angular/core';
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
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegisterComponent } from './components/register/register.component';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { PokemonSelectionComponent } from './components/pokemon-selection/pokemon-selection.component';

const firebaseConfig = {
  apiKey: "AIzaSyBE2gfpsz8oZBOE61mn4RpdNjT9qdkrhDI",
  authDomain: "supertrunfopokemon.firebaseapp.com",
  projectId: "supertrunfopokemon",
  storageBucket: "supertrunfopokemon.appspot.com",
  messagingSenderId: "991015289846",
  appId: "1:991015289846:web:ac91cc4c3ed086aa76fdd7",
  measurementId: "G-1VL1XMK8KL"
};

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
    FlexLayoutModule,
    BrowserAnimationsModule,
    MatCardModule,
    HttpClientModule,
    FormsModule,
    SocialLoginModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
  ],
  providers: [
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
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
