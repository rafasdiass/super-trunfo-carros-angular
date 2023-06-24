import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserAuthService } from './user-auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return UserAuthService.login(this.http, credentials);
  }

  register(user: { name: string; email: string; password: string }): Observable<any> {
    return UserAuthService.register(this.http, user);
  }

  isAuthenticated(): boolean {
    return UserAuthService.isAuthenticated();
  }

  logout(): void {
    UserAuthService.logout();
  }
}
