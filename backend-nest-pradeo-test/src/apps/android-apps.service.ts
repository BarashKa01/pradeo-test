
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';
import { deleteAppFromHash } from 'src/utils/file.utils';
import { DeleteResult, Not, Repository } from 'typeorm';
import { AndroidApp } from './android-app.entity';

@Injectable()
export class AndroidAppsService {
  constructor(
    @InjectRepository(AndroidApp)
    private androidAppRepository: Repository<AndroidApp>,
  ) { }

  create(androidApp: AndroidApp): Promise<AndroidApp> {
    return this.androidAppRepository.save(androidApp);
  }

  update(androidApp: AndroidApp): Promise<AndroidApp> {
    return this.androidAppRepository.save(androidApp);
  }

  findAllByUser(userId: string): Promise<AndroidApp[]> {
    return this.androidAppRepository.find({ where: { user: userId } });
  }

  findAll(): Promise<AndroidApp[]> {
    return this.androidAppRepository.find();
  }

  findOne(id: string): Promise<AndroidApp> {
    return this.androidAppRepository.findOne(id);
  }

  findOneByFileHash(fileHash: string): Promise<AndroidApp> {
    return this.androidAppRepository.findOne(null, {where: {
      hash: fileHash
    }});
  }

  //Pick the first app to scan
  findToScan(): Promise<AndroidApp> {
    return this.androidAppRepository.findOne(null, {where: {
    is_verified: false, report_id: '', on_upload: false
  }});
  }
  //Pick the first app with report_id to check
  findForReport(): Promise<AndroidApp> {
    return this.androidAppRepository.findOne(null, {where: {
      is_verified: false, report_id: Not(''), on_upload: false
    }});
  }

  async remove(id: string): Promise<DeleteResult> {

    const appToDelete = await this.findOne(id);
    if (appToDelete !== undefined && appToDelete !== null) {
      const isFileDeleted = await deleteAppFromHash(appToDelete.hash);
      if (isFileDeleted) {
        console.log("File successfully deleted");
      } else {
        console.error("File not found error, deleting entity only");
      }
      return await this.androidAppRepository.delete(id);
    }
  }

}