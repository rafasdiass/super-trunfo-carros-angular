import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      take(1),
      map((user) => {
        if (user) {
          return true; // O usuário está autenticado, permitir o acesso à rota
        } else {
          this.router.navigate(['/home/login']); // Redirecionar para a página de login
          return false; // O usuário não está autenticado, negar o acesso à rota
        }
      })
    );
  }
}
