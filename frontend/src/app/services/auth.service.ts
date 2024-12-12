import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseURL } from '../shared/baseURL';
import { BehaviorSubject, catchError, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly http: HttpClient) {}
  private readonly tokenKey = 'pogodex_token';

  private readonly loggedInSubject = new BehaviorSubject<boolean>(
    this.isLoggedIn()
  );
  loggedIn$ = this.loggedInSubject.asObservable();

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

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  setSession(token: string) {
    localStorage.setItem(this.tokenKey, token);
    this.loggedInSubject.next(true);
  }

  closeSession(): void {
    localStorage.removeItem(this.tokenKey);
    this.loggedInSubject.next(false);
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded: { exp: number } = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp < now;
    } catch (error) {
      return true; // Treat invalid tokens as expired
    }
  }
}
