import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Card } from '../models/card.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private API_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeId/440?format=json';

  constructor(private http: HttpClient) { }

  fetchCards(): Observable<Card[]> {
    return this.http.get<any>(this.API_URL).pipe(
      map(response => this.extractCards(response))
    );
  }

  private extractCards(response: any): Card[] {
    const cards: Card[] = [];
    const results = response.Results;

    results.forEach((item: any) => {
      const card = new Card(
        item.Model_ID,
        item.Model_Name,
        `https://source.unsplash.com/400x300/?car,${item.Make_Name},${item.Model_Name}`,
        item.Vehicle_Speed,
        item.Vehicle_Power,
        item.Vehicle_Price,
        item.Model_Year
      );
      cards.push(card);
    });

    return cards;
  }
}
