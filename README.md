# This Repo is for testing passport session by redis
- https://dnlytras.com/snippets/redis-session
- https://dev.to/nestjs/setting-up-sessions-with-nestjs-passport-and-redis-210
- Notes: redis module version is 3.

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

### main.ts
```ts
// main.ts
import {ConfigService} from '@nestjs/config';
import {Logger} from '@nestjs/common';

import * as createRedisStore from 'connect-redis';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import * as passport from 'passport';
import * as session from 'express-session';
import {createClient} from 'redis';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // ... other stuff

  // Session
  const RedisStore = createRedisStore(session);
  const redisHost: string = configService.get('REDIS_HOST');
  const redisPort: number = configService.get('REDIS_PORT');
  const redisClient = createClient({
    host: redisHost,
    port: redisPort,
  });

  redisClient.on('error', (err) =>
    Logger.error('Could not establish a connection with redis. ' + err)
  );
  redisClient.on('connect', () =>
    Logger.verbose('Connected to redis successfully')
  );

  app.use(
    session({
      store: new RedisStore({client: redisClient as any}),
      secret: configService.get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'strict',
        secure: isProdEnv(env),
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
  // ---- Session

  // CSURF must be after cookie-parser & session
  app.use(csurf());
}

```

### package.json
```json
{
  // using version 3 instead for now
  "redis": "^3.1.2"
}
```
