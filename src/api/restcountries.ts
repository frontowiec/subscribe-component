import { ajax } from "rxjs/ajax";
import { startWith, tap } from "rxjs/operators";

export interface IAllCountriesResponse {
  region: string;
  name: string;
  nativeName: string;
  population: string;
  capital: string;
  currencies: [];
}

let response: any;

export const getAllCountries$ = () => {
  if (!response) {
    return ajax
      .getJSON<IAllCountriesResponse[]>(
        "http://localhost:5000/api/conuntries",
        {
          "X-RapidAPI-Key": "d32bcf4994msh24f571cc203f7f7p1be16bjsnced8eb1bd370"
        }
      )
      .pipe(tap(r => (response = r)));
  }

  return ajax
    .getJSON<IAllCountriesResponse[]>(
      "http://localhost:5000/api/conuntries",
      {
        "X-RapidAPI-Key": "d32bcf4994msh24f571cc203f7f7p1be16bjsnced8eb1bd370"
      }
    )
    .pipe(
      startWith(response),
      tap(r => (response = r))
    );
};
