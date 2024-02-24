import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ConfigService } from '@nestjs/config';
import RedisStore from 'connect-redis';
import * as session from "express-session"
import * as passport from "passport"
import * as Redis from 'redis';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const redisClient = Redis.createClient({
    host: configService.get<string>('REDIS_HOST'),
    port: configService.get<number>('REDIS_PORT'),
  });

  // session을 위한 redisStore 생성
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      saveUninitialized: false,
      secret: configService.get<string>('SESSION_SECRET'),
      resave: false,
      // cookie settings
      cookie: {
        // sameSite: true,
        httpOnly: true,
        maxAge: 60000,
      },
    }),
  ),
  app.use(passport.initialize())
  app.use(passport.session())

  await app.listen(3000)
}
bootstrap()
