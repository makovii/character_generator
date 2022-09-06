import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as env from 'env-var';
import * as express from 'express';

async function run(): Promise<void> {
  const PORT = env.get('PORT').required().asIntPositive() || 3000;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  //app.use(express.static(`${__dirname}/images`));
  app.useStaticAssets(join(__dirname, '..', 'images'));
  //express.static()

  await app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
}

run();
