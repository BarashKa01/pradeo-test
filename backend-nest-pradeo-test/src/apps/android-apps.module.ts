
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AndroidAppsService } from './android-apps.service';
import { AndroidAppsController } from './android-apps.controller';
import { AndroidApp } from './android-app.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';
import { HttpModule } from '@nestjs/axios';
import { CheckAppEvent } from 'src/events/check-app-event.event';

@Module({
  imports: [TypeOrmModule.forFeature([AndroidApp, User]), HttpModule],
  providers: [AndroidAppsService, UsersService, CheckAppEvent],
  controllers: [AndroidAppsController],
})

export class AndroidAppsModule {}