import { ajax } from "rxjs/ajax";
import { stringify } from "query-string";

export interface IAllCountriesResponse {
  region: string;
  name: string;
  nativeName: string;
  population: string;
  capital: string;
  currencies: [];
}

export const getAllCountries$ = (params: object) => {
  return ajax.getJSON<IAllCountriesResponse[]>(
    `http://localhost:5000/api/conuntries?${stringify(params)}`,
    {
      "X-RapidAPI-Key": "d32bcf4994msh24f571cc203f7f7p1be16bjsnced8eb1bd370"
    }
  );
};

export const getAllCountries = (params: object) => {
  return ajax
    .getJSON<IAllCountriesResponse[]>(
      `http://localhost:5000/api/conuntries?${stringify(params)}`,
      {
        "X-RapidAPI-Key": "d32bcf4994msh24f571cc203f7f7p1be16bjsnced8eb1bd370"
      }
    )
    .toPromise();
};
