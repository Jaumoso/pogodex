import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseURL } from '../shared/baseURL';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly http: HttpClient) {}

  trainerLogin(username: string, password: string): Observable<any> {
    return this.http
      .post(`${baseURL}/auth/login`, {
        username: username,
        password: password,
      })
      .pipe(
        catchError((error) => {
          console.error(
            `Error in TrainerService -> POST ${baseURL}/trainer/login`,
            error
          );
          throw error;
        })
      );
  }

  trainerRegister(username: string, password: string): Observable<any> {
    return this.http
      .post(`${baseURL}/trainer/register`, {
        username: username,
        password: password,
      })
      .pipe(
        catchError((error) => {
          console.error(
            `Error in TrainerService -> POST ${baseURL}/trainer/register`,
            error
          );
          throw error;
        })
      );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('pogodex_token');
  }

  setSession(token: string) {
    localStorage.setItem('pogodex_token', token);
  }

  closeSession(): void {
    localStorage.removeItem('pogodex_token');
  }
}
