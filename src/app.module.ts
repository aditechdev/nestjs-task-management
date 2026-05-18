import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';
import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: !!process.env.RAILWAY_ENVIRONMENT,
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
        const isInternalRailway = databaseURL?.includes('.railway.internal');
        const requiresSSL = isProduction && !isInternalRailway;

        console.log(
          `Database: ${isInternalRailway ? 'railway-internal' : 'external'}, ssl=${requiresSSL}`,
        );

        return {
          type: 'postgres',
          url: databaseURL,
          ...(requiresSSL && {
            ssl: true,
            extra: { ssl: { rejectUnauthorized: false } },
          }),
          autoLoadEntities: true,
          synchronize: true,
          retryAttempts: 5,
          retryDelay: 2000,
        };
      },
    }),
    AuthModule,
  ],
})
export class AppModule {}
