import { Module } from '@nestjs/common';
import { GoogleModule, ShoesModule, SizesModule } from './modules';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as _entities from './domain/entities';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const entitiesArray = Object.values(_entities);
        return {
          type: 'postgres',
          host: config.getOrThrow('DB_HOST'),
          port: config.getOrThrow('DB_PORT'),
          username: config.getOrThrow('DB_USER'),
          password: config.getOrThrow('DB_PASSWORD'),
          database: config.getOrThrow('DB_NAME'),
          entities: entitiesArray,
          synchronize: true,
        };
      },
    }),

    GoogleModule,
    ShoesModule,
    SizesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
