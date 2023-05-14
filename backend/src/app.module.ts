import { Module } from '@nestjs/common';
import { BasesModule } from './bases/bases.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivitiesModule } from './activities/activities.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        ENV_NAME: Joi.string().default('dev'),
        API_DOC: Joi.string().default('FALSE'),
        APP_LOGGER: Joi.string().default('dev'),
        APP_PORT: Joi.number().required(),
        APP_HOST: Joi.string().default('localhost'),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_HOST: Joi.string().required(),
        WEATHER_API_KEY: Joi.string().required(),
      }),
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        autoLoadEntities: true,
        // never use in production!
        synchronize: configService.get('ENV_NAME') !== 'prod' ? true : false,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    BasesModule,
    ActivitiesModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
