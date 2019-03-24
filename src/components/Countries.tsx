import * as React from "react";
import { getAllCountries$, IAllCountriesResponse } from "../api/restcountries";
import { FunctionComponent } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { tap } from "rxjs/operators";
import { RouteComponentProps } from "@reach/router";

export const Countries: FunctionComponent<RouteComponentProps> = () => {
  const [countries, setCountries] = useState<IAllCountriesResponse[]>([]);
  const [isLoading, setLoader] = useState<boolean>(false);

  useEffect(() => {
    setLoader(true);
    const subscription$ = getAllCountries$()
      .pipe(
        tap(response => setCountries(response)),
        tap(() => setLoader(false))
      )
      .subscribe();

    return () => subscription$.unsubscribe();
  }, []);

  if (isLoading) {
    return <strong>Loading...</strong>;
  }

  return (
    <ul>
      {countries.map(country => (
        <li key={country.name}>{country.name}</li>
      ))}
    </ul>
  );
};
