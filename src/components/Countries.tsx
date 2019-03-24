import * as React from "react";
import {FunctionComponent} from "react";
import {getAllCountries$, IAllCountriesResponse} from "../api/restcountries";
import {RouteComponentProps} from "@reach/router";
import {StateStatus, useFetch} from "../useFetch";

export const Countries: FunctionComponent<RouteComponentProps> = () => {
  const { status, data } = useFetch<IAllCountriesResponse[]>(
    getAllCountries$(),
    []
  );

  if (status === StateStatus.In_progress) {
    return <strong>Loading...</strong>;
  }

  if(status === StateStatus.Success) {
    return (
      <ul>
        {data!.map(country => (
          <li key={country.name}>{country.name}</li>
        ))}
      </ul>
    );
  }

  return <strong>ERROR!</strong>;
};
