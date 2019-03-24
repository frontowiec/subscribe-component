import * as React from "react";
import { FunctionComponent, Fragment, useState } from "react";
import { getAllCountries$ } from "../api/restcountries";
import { RouteComponentProps } from "@reach/router";
import { StateStatus } from "../useFetch";
import { SimpleSuspense } from "../SimpleSuspense";

export const Countries: FunctionComponent<RouteComponentProps> = () => {
  const [filter, setFilter] = useState("");
  return (
    <SimpleSuspense
      stream={getAllCountries$()}
      fallback={<strong>Loading...</strong>}
    >
      {({ status, data }) => {
        if (status === StateStatus.Failed) {
          return <strong>ERROR!</strong>;
        }

        return (
          <Fragment>
            <input
              type="text"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              placeholder="Type country name..."
            />
            <ul>
              {data.map(country => (
                <li key={country.name}>{country.name}</li>
              ))}
            </ul>
          </Fragment>
        );
      }}
    </SimpleSuspense>
  );
};
