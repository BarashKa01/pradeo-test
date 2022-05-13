import { HttpService } from '@nestjs/axios';
import { Controller, Param, Post, Get, UseInterceptors, UploadedFile, Sse, MessageEvent, Delete, Put, Body, Response } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileTypeFilter } from 'src/utils/file.utils';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { AndroidApp } from './android-app.entity';
import { AndroidAppsService } from './android-apps.service';
import { renameAppwithHash } from 'src/utils/file.utils';
import { CheckAppEvent } from 'src/events/check-app-event.event';
import { from, interval, map, Observable, Observer, of, switchMap } from 'rxjs';
import { OnEvent } from '@nestjs/event-emitter';
import { AndroidAppDto } from './android-app.dto';


@Controller('android-apps')
export class AndroidAppsController {

  constructor(private readonly usersService: UsersService, private readonly androidAppsService: AndroidAppsService
    , private httpService: HttpService, private readonly checkAppEvent: CheckAppEvent) { }

  //Retrieve all apps from the user id, since no authentication system is used in this exercice
  @Get('/from_user/:id')
  findAllFromUser(@Param('id') id): Promise<AndroidApp[]> {
    return this.androidAppsService.findAllByUser(id);
  }

  @Post('create/:id')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './upload',
    }),
    fileFilter: fileTypeFilter,
  }))
  async createApp(@Param('id') userId, @UploadedFile() file: Express.Multer.File): Promise<AndroidApp | string> {

    //First, check if the user exist
    const relatedUser: User | null = await this.usersService.findOne(userId);

    if (relatedUser !== undefined && relatedUser !== null) {
      const newFilePath = await renameAppwithHash(file.filename);

      let newAndroidApp = new AndroidApp;

      newAndroidApp.name = file.originalname;
      newAndroidApp.hash = file.filename;
      newAndroidApp.is_verified = false;
      newAndroidApp.is_safe = false;
      newAndroidApp.comment = 'Renseignez un commentaire';
      newAndroidApp.user = relatedUser;

      newAndroidApp = await this.androidAppsService.create(newAndroidApp);

      if (newAndroidApp.id !== undefined && newAndroidApp.id !== null) {
        this.checkAppEvent.emitDoScan({ app: newAndroidApp, filePath: newFilePath });
        return newAndroidApp;
      }
      else {
        return "Something went wrong with this action, please try again";
      }
    }
    else {
      return "No user found, please try again or check the database"; //Message should be more generic to avoid hints
    }
  }

  @Put('/put')
  async putApp(@Body() putAndroidApp: AndroidAppDto): Promise<AndroidApp> {
    Response
    return await this.androidAppsService.update(putAndroidApp);
  }

  @Delete('delete/:id')
  async deleteApp(@Param('id') appId: string): Promise<any> {
    const id = String(appId);

    //Take the result of affected entity by deletion
    const result = await this.androidAppsService.remove(appId).then(response => { return response.affected });
    if (result === 0) {
      return { message: "0" };
    } else {
      return { message: "1" };
    }
  }

  @Sse('app-updated')
  @OnEvent('app.statusUpdated')
  sseAppUpdated(updatedApp: AndroidApp | null): Observable<MessageEvent> {

    let observableData: MessageEvent = null;

    //Construct the data to emit
    if (!(updatedApp === undefined) && !(updatedApp === null)) {
      observableData = { data: updatedApp };
      console.log("App updated"/*, observableData*/);
    } else {
      observableData = { data: "No app update" };
      console.log("No update", observableData);
    }

    return interval(5000).pipe(
      switchMap(() => of(observableData)),
      map((p) => ({
        data: {
          status: p.data,
        }
      }
      )),
    );
    //Data stay stucked on the 'else' condition (first call i suppose)
  }
}