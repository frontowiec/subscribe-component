import * as React from "react";
import { FunctionComponent, Fragment, useState, useEffect } from "react";
import { getAllCountries$, IAllCountriesResponse } from "../api/restcountries";
import { RouteComponentProps } from "@reach/router";
import { StateStatus, useFetch } from "../useFetch";

interface IProps {
  status: StateStatus;
  maxDuration?: number;
  children: () => JSX.Element;
  fallback: JSX.Element;
}

const SimpleSuspense: FunctionComponent<IProps> = ({
  status,
  fallback,
  children,
  maxDuration = 0
}) => {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowFallback(true);
    }, maxDuration);
  }, []);

  if (status === StateStatus.Success) {
    return <Fragment>{children()}</Fragment>;
  }

  if (showFallback) {
    return fallback;
  }

  return null;
};

export const Countries: FunctionComponent<RouteComponentProps> = () => {
  const { status, data } = useFetch<IAllCountriesResponse[]>(
    getAllCountries$(),
    []
  );

  if (status === StateStatus.Failed) {
    return <strong>ERROR!</strong>;
  }

  return (
    <SimpleSuspense
      fallback={<strong>Loading...</strong>}
      status={status}
      maxDuration={100}
    >
      {() => (
        <ul>
          {data!.map(country => (
            <li key={country.name}>{country.name}</li>
          ))}
        </ul>
      )}
    </SimpleSuspense>
  );
};
