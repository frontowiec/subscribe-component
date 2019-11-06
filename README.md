This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## About

In this project I try find way to reduce boilerplate code and simplify data fetching in react.

## Usage

Eample

```typescript jsx
import { ajax } from "rxjs/ajax";
import { DataResolver, createOptimisticResource } from "lib";

const getUsers = () => {
  return ajax.getJSON<{ users: User[] }>("https://some-fake-api.com/users");
};

const usersResource$ = createOptimisticResource(getUsers());

const Users = () => {
  return (
    <DataResolver
      source={usersResource$}
      fallback={<strong>Loading data...</strong>}
      maxDuration={300}
      onSuccess={data => (
        <ul>
          {data.users.map(user => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
      onFailed={err => <pre>{JSON.stringify(err, null, 2)}</pre>}
    />
  );
};
```
