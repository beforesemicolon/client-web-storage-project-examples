# Client Web Storage Project Examples

These examples use `client-web-storage` to build the same todo app in React
and Angular. Both apps use a shared local Express API.

Use Node.js 22.22.3 (or a later supported Node 22 or Node 24 LTS release).
Install each example with `npm ci` to use its checked-in dependency versions.

## Start the API

From the repository root, run:

```sh
cd server
npm ci
npm start
```

The API is available at `http://localhost:4500`. It writes demo todo data to
`server/db/todo.db.doc.json`. Use this server locally; it is not an
authenticated production service.

## Start a frontend

Open another terminal and run:

```sh
cd react # or: cd angular
npm ci
npm start
```

- React uses Vite at `http://localhost:3000`.
- Angular uses Angular CLI at `http://localhost:4200`.

Run `npm run build` in either frontend to build the example. Both examples
should let you create and complete a todo, then reload to see the saved
status.
