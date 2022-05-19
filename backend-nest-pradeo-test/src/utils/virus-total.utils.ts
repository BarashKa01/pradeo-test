import * as fs from 'fs/promises';
import * as FormData from 'form-data';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AndroidAppsService } from 'src/apps/android-apps.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VirusTotalUtils {

  private readonly ApiKey = 'd73078b3aa5077a86a47dc62bf7585fff090e033fb0e534396b52438ff836daf';

  constructor(private readonly androidAppsService: AndroidAppsService) { };

  public async performScan(filePath: string, fileHash: string): Promise<string> {

    if ((fileHash !== undefined && fileHash !== null) && (filePath !== undefined && filePath !== null)) {
      let httpService = new HttpService();

      const formFile = await fs.readFile(filePath);
      const form = new FormData();
      form.append('apikey', this.ApiKey);
      form.append('file', formFile, 'sampleFile');

      if (await this.setAppOnUpload(fileHash)) {
        const scanResponse = await lastValueFrom(httpService.post('https://www.virustotal.com/vtapi/v2/file/scan', form, {
          headers: {
            ...form.getHeaders(),
          },
          maxBodyLength: 33554432
        })
        );

        const reportIdentifier = scanResponse.data.md5
        return reportIdentifier;
      }
    }
  }

  public async checkReport(reportId: string): Promise<number | void> {

    if (reportId !== undefined && reportId !== null) {

      const url = `https://www.virustotal.com/api/v3/files/${reportId}`

      let httpService = new HttpService();
      const reportResponse = await lastValueFrom(httpService.get(url, {
        headers: {
          Accept: 'application/json',
          'x-apikey': this.ApiKey
        }
      }));

      const appReputation: number = reportResponse.data.data.attributes.reputation;
      return appReputation;
    }
    return null;
  }

  //Mark the app as upload on going to not be triggered in the main routine
  private async setAppOnUpload(fileHash: string): Promise<boolean> {

    const app = await this.androidAppsService.findOneByFileHash(fileHash);

    if (app !== undefined && app !== null) {
      app.on_upload = true;
      if ((await this.androidAppsService.update(app)).on_upload) {
        return true
      }
    }
    return false;
  }
}



