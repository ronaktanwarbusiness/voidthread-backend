import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from '../../config/database.config';
import awsConfig from '../../config/aws.config';
import { AdminModule } from '../admin/admin.module';
import { Connection } from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, awsConfig],
      envFilePath: ['.env.local', '.env'],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
        connectionFactory: (connection: Connection) => {
          const logger = new Logger('MongoDB');
          if (connection.readyState === 1) {
            logger.log('MongoDB connected successfully');
          }
          connection.on('connected', () => {
            logger.log('MongoDB connected successfully');
          });
          connection.on('error', (error) => {
            logger.error(`MongoDB connection error: ${error}`);
          });
          return connection;
        },
      }),
    }),
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
