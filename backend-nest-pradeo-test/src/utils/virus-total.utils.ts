import * as fs from 'fs/promises';
import * as FormData from 'form-data';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';


export const renameAppwithHash = async (fileHashedName: string): Promise<string> => {
    const oldPath = './upload/' + fileHashedName;
    const newPath = './upload/' + fileHashedName + ".apk";
    await fs.rename(oldPath, newPath);
    return newPath;
}

export const performScan = async (filePath: string): Promise<string> => {

    let httpService = new HttpService();

    const formFile = await fs.readFile(filePath);
    const form = new FormData();
    form.append('apikey', 'd73078b3aa5077a86a47dc62bf7585fff090e033fb0e534396b52438ff836daf');
    form.append('file', formFile, 'maliciousAPK');

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

export const checkReport = async (reportId: string): Promise<number> => {

    const url = `https://www.virustotal.com/api/v3/files/${reportId}`

    let httpService = new HttpService();
    const reportResponse = await lastValueFrom(httpService.get(url, {
      headers: {
        Accept: 'application/json',
        'x-apikey': 'd73078b3aa5077a86a47dc62bf7585fff090e033fb0e534396b52438ff836daf'
      }
    }));

    const appReputation: number = reportResponse.data.data.attributes.reputation;
    return appReputation;
}

