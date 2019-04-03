import * as React from "react";
import { FunctionComponent, Fragment, useState } from "react";
import { getAllCountries, getAllCountries$ } from "../api/restcountries";
import { RouteComponentProps } from "@reach/router";
import AjaxRespite, { repeatLastRequest } from "../AjaxRespite";
import { useDebounce } from "use-debounce";
import { createOptimisticResource } from "../createOptimisticResource";

const optimisticRequest$ = (filter: string) =>
  createOptimisticResource(getAllCountries$({ filter }));

const optimisticRequest = (filter: string) =>
  createOptimisticResource(getAllCountries({ filter }), () =>
    JSON.stringify(filter)
  );

export const Countries: FunctionComponent<RouteComponentProps> = () => {
  const [filter, setFilter] = useState("");
  const [filterValue] = useDebounce(filter, 400);

  return (
    <Fragment>
      <button onClick={() => repeatLastRequest()}>Refresh</button>
      <br />
      <input
        type="text"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="Type country name..."
      />
      <br />
      <AjaxRespite
        source={optimisticRequest$(filterValue)}
        // source={optimisticRequest(filterValue)}
        // source={getAllCountries$({filter: filterValue})}
        // source={getAllCountries({ filter: filterValue })}
        fallback={
          filter !== "" ? (
            <strong>Searching...</strong>
          ) : (
            <strong>Loading...</strong>
          )
        }
        params={[filterValue]}
        maxDuration={0}
        onSuccess={data => {
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
        onFailed={error => {
          if (error.status === 404) {
            return <strong>Country list is empty</strong>;
          }
          return <strong>PAGE ERROR! Status: {error.status}</strong>;
        }}
      />
    </Fragment>
  );
};
