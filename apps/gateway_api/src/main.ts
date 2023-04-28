import { NestFactory } from '@nestjs/core';
import { GatewayApiModule } from './gateway_api.module';
import {ConfigService} from "@nestjs/config";
import * as session from "express-session";
import * as passport from "passport";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(GatewayApiModule);

  const configService = app.get(ConfigService);
  app.use(session({
    cookie: {
      maxAge: 60000 * 24
    },
    secret: "dadudadudaduda",
    resave: false,
    saveUninitialized: false
  }));
  app.use(passport.initialize());
  app.use(passport.session())

  const config = new DocumentBuilder()
      .setTitle('IviClone API')
      .setDescription('API')
      .setVersion('1.0.0')
      .build()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  app.setGlobalPrefix('api')
  await app.listen(configService.get('API_PORT'), () => console.log(`GateWay запущен на порту ${configService.get('API_PORT')}`));
}
bootstrap();
