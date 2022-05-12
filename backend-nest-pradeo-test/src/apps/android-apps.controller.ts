import { HttpService } from '@nestjs/axios';
import { Controller, Param, Post, Get, UseInterceptors, UploadedFile, Sse, MessageEvent } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileTypeFilter } from 'src/utils/file-upload.utils';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { AndroidApp } from './android-app.entity';
import { AndroidAppsService } from './android-apps.service';
import { renameAppwithHash } from 'src/utils/file-upload.utils';
import { CheckAppEvent } from 'src/events/check-app-event.event';
import { interval, map, Observable } from 'rxjs';
import { OnEvent } from '@nestjs/event-emitter';


@Controller('android-apps')
export class AndroidAppsController {

  constructor(private readonly usersService: UsersService, private readonly androidAppsService: AndroidAppsService
    , private httpService: HttpService, private readonly checkAppEvent: CheckAppEvent) {}

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
  async createApp(@Param('id') id, @UploadedFile() file: Express.Multer.File): Promise<AndroidApp | string> {

    //First, check if the user exist
    const relatedUser: User | null = await this.usersService.findOne(id);

    if (relatedUser !== undefined && relatedUser !== null) {
      const newFilePath = await renameAppwithHash(file.filename);

      let newAndroidApp = new AndroidApp;

      newAndroidApp.name = file.originalname;
      newAndroidApp.hash = file.filename;
      newAndroidApp.is_verified = false;
      newAndroidApp.is_safe = false;
      newAndroidApp.comment = '';
      newAndroidApp.user = relatedUser;

      newAndroidApp = await this.androidAppsService.create(newAndroidApp);

      if (newAndroidApp.id !== undefined && newAndroidApp.id !== null) {
        this.checkAppEvent.emitDoScan({app: newAndroidApp, filePath: newFilePath});

        newAndroidApp.comment = "The application is successfuly uploaded, you can check the status in the store";
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

  @Sse('app-updated')
  @OnEvent('app.statusUpdated')
  sseAppUpdated(updatedApp: AndroidApp | null): Observable<MessageEvent> {
    //return interval(1000).pipe(map((_) => ({ data: {message: 'updateBoolean'} } )));
    console.log("TRIGGEREEEEEED");
    if(updatedApp !== undefined && updatedApp !== null) {
      console.log("update SSE triggered");
      return interval(2000).pipe(map((_) => ({ data: updatedApp } as MessageEvent)),
      );
    } else {
      console.log("Waiting for trigger");
      return interval(2000).pipe(map((_) => ({ data: {message: "waiting..."} } as MessageEvent)),
      );
    }
  }
}