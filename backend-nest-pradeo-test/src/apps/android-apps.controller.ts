import { HttpService } from '@nestjs/axios';
import { Controller, Param, Post, Get, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, fileTypeFilter } from 'src/middleware/file-upload.middleware';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { AndroidApp } from './android-app.entity';
import { AndroidAppsService } from './android-apps.service';
import * as fs from 'fs/promises';
import * as FormData from 'form-data';
import { lastValueFrom } from 'rxjs';
import { basename, extname } from "path";

@Controller('android-apps')
export class AndroidAppsController {

  constructor(private readonly usersService: UsersService, private readonly androidAppsService: AndroidAppsService
    , private httpService: HttpService) { }

  //Retrieve all apps from the user id, since no authentication system is used in this exercice
  @Get(':id')
  findAllFromUser(@Param('id') id): string {
    return 'Find all Android apps';
  }

  @Post('create/:id')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './upload',
    }),
    fileFilter: fileTypeFilter,
  }))
  async createApp(@Param('id') id, @UploadedFile() file: Express.Multer.File): Promise<AndroidApp | string> {

    console.log(file);
    //return 'STOP';
    //First, check if the user exist
    const relatedUser: User | null = await this.usersService.findOne(id);

    if (relatedUser !== undefined && relatedUser !== null) {
      await this.checkApp(file);
      let newAndroidApp = new AndroidApp;
      newAndroidApp.name = file.originalname;
      newAndroidApp.hash = file.filename;
      newAndroidApp.is_safe = false;
      newAndroidApp.comment = '';
      newAndroidApp.user = relatedUser;

      newAndroidApp = await this.androidAppsService.create(newAndroidApp);

      if (newAndroidApp.id !== undefined && newAndroidApp.id !== null) {
        newAndroidApp.comment = "The application is successfuly uploaded, you can check the status in the store";
        return newAndroidApp;
      }
      else {
        //return "Something went wrong with this action, please try again";
      }
    }
    else {
      //return "No user found, please try again"; //Message should be more generic to avoid hints
    }
  }

  async checkApp(file: Express.Multer.File): Promise<boolean> {

    const formFile = await fs.readFile('./upload/Snaptube_v6.06.0.6065310_apkpure.com.apk');
    const form = new FormData();
    form.append('apikey', 'd73078b3aa5077a86a47dc62bf7585fff090e033fb0e534396b52438ff836daf');
    form.append('file', formFile, file.filename);



    const responseData = await lastValueFrom(this.httpService.post('https://www.virustotal.com/vtapi/v2/file/scan', form, {
      headers: {
        ...form.getHeaders(),
      },
      maxBodyLength: 33554432
    })
    );

    console.log(responseData);

    /*await fetch('https://www.virustotal.com/vtapi/v2/file/scan', {
      method: 'POST',
      headers: {Accept: 'text/plain', 'Content-Type': 'application/x-www-form-urlencoded'},
    })
      .then(response => response.json())
      .then(response => console.log(response))
      .catch(err => console.error(err));
      */

    return false;
  }
}