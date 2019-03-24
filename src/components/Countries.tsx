import * as React from "react";
import { FunctionComponent, Fragment, useState } from "react";
import { getAllCountries$ } from "../api/restcountries";
import { RouteComponentProps } from "@reach/router";
import { StateStatus } from "../useFetch";
import { SimpleSuspense } from "../SimpleSuspense";
import { useDebounce } from "use-debounce";

export const Countries: FunctionComponent<RouteComponentProps> = () => {
  const [filter, setFilter] = useState("");
  const [filterValue] = useDebounce(filter, 400);

  return (
    <SimpleSuspense
      stream={getAllCountries$({ filter })}
      fallback={<strong>Loading...</strong>}
      maxDuration={0}
      params={[filterValue]}
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
