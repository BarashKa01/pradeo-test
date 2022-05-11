import { Controller, Get, Param } from '@nestjs/common';
import { AndroidApp } from 'src/apps/android-app.entity';
import { AndroidAppsService } from 'src/apps/android-apps.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller()
export class UsersController {

  constructor (private readonly usersService: UsersService, private readonly androidAppsService: AndroidAppsService) {
    this.isUsersFixturesShouldBeLoaded();
  }

  async isUsersFixturesShouldBeLoaded(): Promise<void> {
    let result = await this.usersService.findAll();
    if (result.length === 0) {
      this.launchUsersFixtures();
    }
  }

  launchUsersFixtures() {
    console.log('Seeding users in the database...')
    for(let i = 0; i < 2; ++i) {
      let newUser = new User();
      newUser.first_name = "User "+i;
      newUser.last_name = "Dupont";
      this.usersService.create(newUser);
    }
    console.log('Database seeded with users')
  }

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get('user/:id')
  async findOne(@Param('id') id): Promise<User> {
    return await this.usersService.findOne(id);
  }

  @Get('user/:id/secure-store')
  async getApplicationStore(@Param('id') id): Promise<AndroidApp[]> {
    //console.log('controller reached');
    return await this.androidAppsService.findAllByUser(id);
  }
}
