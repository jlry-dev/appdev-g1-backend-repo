App Development Group 1 Backend repo.

```
File structure:
|- src/
    |- config/
    |   |- # configuartions (e.g database)
    |
    |- controllers/
    | |- # all controllers will exist here
    |
    |- errors/
    | |- # custom errors
    |
    |- lib/
    |   |- # utilities
    |
    |- middlewares/
    | |- # custom middlewares
    |
    |- models/
    |   |- # model classes
    |
    |- routes/
    | |- # all routers for different routes will be defined here
    |
    |- app.js  # the server configurations (e.g app-level middleware registration, route registration)
    |
    |- server.js #the server entry
```

# Environment variables

```
SERVER_BASE_URL

COURIER_AUTH_KEY
COURIER_TEMPLATE

DB_CONNECTION_STRING

PASSWORD_SALT

JWT_SECRET

<!--
# Dev variables (db connection pool)
DB_HOST
DB_NAME
DB_USER
DB_PORT
DB_PASSWORD
-->

```
