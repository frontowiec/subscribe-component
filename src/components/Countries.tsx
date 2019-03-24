import * as React from "react";
import { FunctionComponent, Fragment, useState } from "react";
import { getAllCountries$ } from "../api/restcountries";
import { RouteComponentProps } from "@reach/router";
import { FetchStatus } from "../useFetch";
import { SimpleSuspense } from "../SimpleSuspense";
import { useDebounce } from "use-debounce";

enum CountriesFetchState {
  Initial,
  In_progress,
  Success,
  Failed
}

export const Countries: FunctionComponent<RouteComponentProps> = () => {
  const [filter, setFilter] = useState("");
  const [filterValue] = useDebounce(filter, 400);

  return (
    <Fragment>
      <input
        type="text"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="Type country name..."
      />
      <br />
      <SimpleSuspense
        source={getAllCountries$({ filter })}
        fallback={<strong>Loading...</strong>}
        maxDuration={0}
        params={[filterValue]}
      >
        {({ status, data, error }) => {
          // todo: try to use useReducer for simplicity
          if (status === FetchStatus.Failed && error.status === 404) {
            return <strong>Country list is empty</strong>;
          }

          if (status === FetchStatus.Failed) {
            return <strong>PAGE ERROR! Status: {error.status}</strong>;
          }

          if (filter !== "" && data.length === 0) {
            return <strong>No results for {filter}</strong>;
          }

          return (
            <ul>
              {data.map(country => (
                <li key={country.name}>{country.name}</li>
              ))}
            </ul>
          );
        }}
      </SimpleSuspense>
    </Fragment>
  );
};
