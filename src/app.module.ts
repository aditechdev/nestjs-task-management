import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.STAGE
        ? [`.env.stage.${process.env.STAGE}`]
        : ['.env'],
      validationSchema: configValidationSchema,
    }),
    TasksModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('STAGE') === 'prod';
        const databaseURL = configService.get<string>('DATABASE_URL');

        console.log(`DEBUG CONNECTION process.env.STAGE  ${process.env.STAGE}`);

        console.log(`DEBUG CONNECTION IsPRODUCTION CHECK ${isProduction}`);
        console.log(`DEBUG CONNECTION databaseURL URL  ${databaseURL}`);

        return {
          type: 'postgres',
          url: databaseURL,
          ssl: isProduction,
          extra: {
            ssl: isProduction ? { rejectUnauthorized: false } : false,
          },
          autoLoadEntities: true,

          synchronize: true,
        };
      },
    }),

    AuthModule,
  ],
})
export class AppModule {}
