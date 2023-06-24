import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SocialAuthService, GoogleLoginProvider } from 'angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(private authService: AuthService, private socialAuthService: SocialAuthService) {}

  loginEmail: string = '';
  loginPassword: string = '';
  registerEmail: string = '';
  registerPassword: string = '';
  registerName: string = '';
  registerPassword2: string = '';
  isLoginView: boolean = true;

  onLoginSubmit(): void {
    this.authService.login({ email: this.loginEmail, password: this.loginPassword }).subscribe(
      (response) => {
        console.log('Login bem-sucedido:', response);
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      },
      (error) => {
        console.error('Ocorreu um erro ao fazer login:', error);
      }
    );
  }

  onRegisterSubmit(): void {
    this.authService.register({
      name: this.registerName,
      email: this.registerEmail,
      password: this.registerPassword2,
    }).subscribe(
      (response) => {
        console.log('Registro bem-sucedido:', response);
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      },
      (error) => {
        console.error('Ocorreu um erro ao fazer o registro:', error);
      }
    );
  }

  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((user) => {
      console.log('Usuário do Google:', user);
    });
  }

  onPassword2Blur(): void {
    if (this.registerPassword !== this.registerPassword2) {
      alert('As senhas não coincidem. Por favor, verifique e tente novamente.');
    }
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
