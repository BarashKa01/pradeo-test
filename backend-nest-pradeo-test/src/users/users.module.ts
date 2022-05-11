
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { AndroidAppsService } from 'src/apps/android-apps.service';
import { AndroidApp } from 'src/apps/android-app.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, AndroidApp])],
  providers: [UsersService, AndroidAppsService],
  controllers: [UsersController],
})

export class UsersModule {}