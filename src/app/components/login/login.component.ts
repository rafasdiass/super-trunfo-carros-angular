import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SocialAuthService, GoogleLoginProvider } from 'angularx-social-login';
import { Router } from '@angular/router';
import { GameBoardComponent } from '../game-board/game-board.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginEmail: string = '';
  loginPassword: string = '';

  constructor(
    private authService: AuthService,
    private socialAuthService: SocialAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('LoginComponent iniciado');
  }

  async onLoginSubmit(): Promise<void> {
    try {
      const response = await this.authService.login({ email: this.loginEmail, password: this.loginPassword });
      console.log('Login bem-sucedido:', response);
      this.router.navigate(['/gameboard']);
      console.log('chamou a rota:', response);
    } catch (error) {
      console.error('Ocorreu um erro ao fazer login:', error);
    }
  }

  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((user) => {
      console.log('Usuário do Google:', user);
    });
  }
}
