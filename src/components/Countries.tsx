import * as React from "react";
import { FunctionComponent, Fragment, useState } from "react";
import { getAllCountries$ } from "../api/restcountries";
import { RouteComponentProps } from "@reach/router";
import { AjaxRespite } from "../AjaxRespite";
import { useDebounce } from "use-debounce";

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
      <AjaxRespite
        source={getAllCountries$({ filter })}
        fallback={
          filterValue !== "" ? (
            <strong>Searching...</strong>
          ) : (
            <strong>Loading...</strong>
          )
        }
        maxDuration={0}
        params={[filterValue]}
        optimisticMode={true}
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
