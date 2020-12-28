# UrlShortener

A simple api you can use to create short urls. Once you save the url, the server returns you a random short url.

Writing this will redirect you to the url that you saved.

```
localhost:3002/:short_url
```

### Setup
1. Generate RSA256 public private keys and place them in the `config` folder with file names `public.key` and `private.key`.
    - http://travistidwell.com/jsencrypt/demo/
2. Change directory to `api` and Install dependencies with `npm install`.
3. Run migrations and seed the Sqlite database with `npm migrate` and `npm seed`. Don't forget to install `sequelize-cli` globally using `npm install -g sequelize-cli`
4. Run the project with `npm start`.

### Tests
1. Run `npm run pretest` and `npm run pretest:seed` !!! IMPORTANT, otherwise the tests will fail
2. Run `npm test`
3. Run `npm run posttest` -> to remove the test sqlite database

### Tech stack
- NodeJS
- Express
- Sequelize
- Jest
- sqlite3

### How to use
Use with Postman or Insomnia.

| Path | Method | Params | Description |
| - | - | - | - |
| `/auth` | `POST` | `username, password` | Authenticate user, returns JWT token.  Jwt token can then be placed in `Authorization` header prefixed with `Bearer`|
| `/users` | `POST` | `username, password` | Create new user |
| `/urls` | `POST` | `url, short(optional)` | Create new url, must provide JWT |
| `/urls` | `PATCH` | `short, newShort` | Update a url, must provide JWT |
| `/urls/user` | `GET` | | User's saved urls, must provide JWT |
| `/:short` | `GET` | :short = url that a server returned | Redirect to the actual link|
| `/:short/stats` | `GET` | :short = url that a server returned | Link statistics |

### Tested on
- npm  ^6.14.9
- node ^v14.15.3
- GNU\Linux PopOS 20.10
