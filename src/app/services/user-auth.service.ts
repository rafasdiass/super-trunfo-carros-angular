import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { api } from './api';

export class UserAuthService {
  static apiUrl = api.url;

  static login(http: HttpClient, credentials: { email: string; password: string }): Observable<any> {
    return http.post<any>(`${UserAuthService.apiUrl}/sessions`, credentials).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
      })
    );
  }

  static register(http: HttpClient, user: { name: string; email: string; password: string }): Observable<any> {
    return http.post<any>(`${UserAuthService.apiUrl}/users`, user);
  }

  static isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token !== null;
  }

  static logout(): void {
    localStorage.removeItem('token');
  }
}
