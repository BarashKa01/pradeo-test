import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { AndroidApp } from './apps/android-app.entity';
import { AndroidAppsModule } from './apps/android-apps.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [EventEmitterModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'pradeo_test',
      entities: [User, AndroidApp],
      synchronize: true,
      retryAttempts: 3
    }),
    UsersModule,
    AndroidAppsModule,
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {

  constructor(private connection: Connection) {
  }
}
