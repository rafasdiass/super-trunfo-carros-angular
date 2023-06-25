import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SocialAuthService, GoogleLoginProvider } from 'angularx-social-login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private socialAuthService: SocialAuthService,
    private router: Router
  ) {}

  loginEmail: string = '';
  loginPassword: string = '';
  registerEmail: string = '';
  registerPassword: string = '';
  registerName: string = '';
  registerPassword2: string = '';
  isLoginView: boolean = true;

  async onLoginSubmit(): Promise<void> {
    try {
      const response = await this.authService.login({ email: this.loginEmail, password: this.loginPassword });
      console.log('Login bem-sucedido:', response);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Ocorreu um erro ao fazer login:', error);
    }
  }

  async onRegisterSubmit(): Promise<void> {
    if (this.registerPassword !== this.registerPassword2) {
      alert('As senhas não coincidem. Por favor, verifique e tente novamente.');
      return;
    }
    try {
      const response = await this.authService.register({
        name: this.registerName,
        email: this.registerEmail,
        password: this.registerPassword,
      });
      console.log('Registro bem-sucedido:', response);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Ocorreu um erro ao fazer o registro:', error);
    }
  }

  onPassword2Blur(): void {
    if (this.registerPassword !== this.registerPassword2) {
      alert('As senhas não coincidem. Por favor, verifique e tente novamente.');
    }
  }

  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((user) => {
      console.log('Usuário do Google:', user);
    });
  }

  toggleView(): void {
    this.isLoginView = !this.isLoginView;
  }

  onFlip(): void {
    const flip = document.querySelector('.flip');
    flip?.classList.add('rotate');
    setTimeout(() => {
      flip?.classList.remove('rotate');
    }, 500);
  }
}
