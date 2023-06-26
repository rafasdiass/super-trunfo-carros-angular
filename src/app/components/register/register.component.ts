import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SocialAuthService, GoogleLoginProvider } from 'angularx-social-login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerEmail: string = '';
  registerPassword: string = '';
  registerName: string = '';
  registerPassword2: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

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
      alert('Usuário criado com sucesso!');
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
}
