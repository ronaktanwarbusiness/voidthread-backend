import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { createClient } from 'redis';
import { RedisStore } from 'connect-redis';
import session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  // const allowedOrigins = process.env.ALLOWED_ORIGINS
  //   ? process.env.ALLOWED_ORIGINS.split(',')
  //   : ['http://localhost:3001', 'http://localhost:3000'];

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setGlobalPrefix('api/v1');

  const redisClient = createClient({
    socket: {
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
    },
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
  });
  redisClient.on('error', (err) => {
    console.error('Redis Error:', err);
  });

  redisClient.on('connect', () => {
    console.log('Redis connecting...');
  });

  redisClient.on('ready', () => {
    console.log('Redis ready');
  });

  await redisClient
    .connect()
    .then(() => console.log('Redis connected'))
    .catch((err) => console.error('Redis connection error:', err));

  const redisStore = new RedisStore({ client: redisClient });

  app.use(
    session({
      store: redisStore,
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false, // ⬅️ false is better — don't store empty sessions
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'PROD',
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'lax', // ⬅️ add this — needed for cross-origin cookie sending
      },
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}
bootstrap();
