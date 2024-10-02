import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './events/redis-io.adapter';
import { TrpcRouter } from './trpc/trpc.router'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Uncomment these lines to use the Redis adapter:
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  app.enableCors();
  app.get(TrpcRouter).applyMiddleware(app);

  await app.listen(4000);
}
bootstrap();
