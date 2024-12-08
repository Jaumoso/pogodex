import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Trainer } from '../shared/Trainer';
import { catchError, Observable } from 'rxjs';
import { baseURL } from '../shared/baseURL';

@Injectable({
  providedIn: 'root',
})
export class TrainerService {
  constructor(private readonly http: HttpClient) {}

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

  getTrainerData(id: string): Observable<Trainer> {
    return this.http.get<Trainer>(`${baseURL}/trainer/${id}`).pipe(
      catchError((error) => {
        console.error(
          `Error in TrainerService -> GET ${baseURL}/trainer/:id`,
          error
        );
        throw error;
      })
    );
  }
}
