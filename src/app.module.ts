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

        return {
          type: 'postgres',
          url: databaseURL,
          ssl: requiresSSL,
          extra: {
            ssl: requiresSSL ? { rejectUnauthorized: false } : false,
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
