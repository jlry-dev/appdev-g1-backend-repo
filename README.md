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
SIGNUP_VERIFICATION_ROUTE 
ACCOUNT_RECOVERY_ROUTE

PORT

MOVIEDB_ACCESS_TOKEN
MOVIEDB_BASE_URL

EMAIL_USER
EMAIL_PASS

DB_CONNECTION_STRING

PASSWORD_SALT

JWT_SECRET

```
