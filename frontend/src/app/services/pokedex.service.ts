import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { Collection } from '../shared/Collection';
import { baseURL } from '../shared/baseURL';

@Injectable({
  providedIn: 'root',
})
export class PokedexService {
  constructor(private readonly http: HttpClient) {}

  getPokedexData(trainerId: string): Observable<Collection[]> {
    return this.http.get<Collection[]>(`${baseURL}/pokedex/${trainerId}`).pipe(
      catchError((error) => {
        console.error(
          `Error in PokedexService -> GET ${baseURL}/pokedex/:id`,
          error
        );
        throw error;
      })
    );
  }

  savePokedexData(pokemon: Collection): Observable<Collection> {
    return this.http
      .post<Collection>(`${baseURL}/pokedex/${pokemon.trainerId}`, pokemon)
      .pipe(
        catchError((error) => {
          console.error(
            `Error in PokedexService -> POST ${baseURL}/pokedex/:id`,
            error
          );
          throw error;
        })
      );
  }
}
