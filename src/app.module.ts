import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    TasksModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('STAGE') === 'prod';

        return {
          type: 'postgres',
          url: configService.get<string>('DATABASE_URL'),
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
