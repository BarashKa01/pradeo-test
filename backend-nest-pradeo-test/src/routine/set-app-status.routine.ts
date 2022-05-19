import { Injectable } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { Interval } from "@nestjs/schedule";
import { AndroidAppsService } from "src/apps/android-apps.service";
import {VirusTotalUtils} from "src/utils/virus-total.utils";

@Injectable()
export class SetAppStatus {
    constructor(private eventEmitter: EventEmitter2, private androidAppService: AndroidAppsService, private virusTotalUtils: VirusTotalUtils) { }

    emitStatusUpdated(payload: Object) {
        this.eventEmitter.emit('app.statusUpdated', payload)
    }

    //Main check routine
    @Interval(15000)
    async setAppStatus() {
        const date = Date.now();
        console.log(date, " Routine start...");

        let appToScan = await this.androidAppService.findToScan();
        let appForReport = await this.androidAppService.findForReport();

        // Checking app waiting for report
        if (appForReport !== undefined && appForReport !== null) {
            console.log('Checking report of application ', appForReport.id);

            const appScore = await this.virusTotalUtils.checkReport(appForReport.report_id);
            //Take the last data of the object from DB, in case of editing
            appForReport = await this.androidAppService.findOne(appForReport.id.toString());

            //Then update
            if (appForReport !== undefined && appForReport !== null) {
                if (appScore === 0) {
                    appForReport.is_safe = true;
                } else {
                    appForReport.is_safe = false;
                }
                appForReport.is_verified = true;

                await this.androidAppService.update(appForReport);
                console.log("Application "+appForReport.id+" verified in Database");
            }
            this.emitStatusUpdated(appForReport);

            //Else check app waiting for scanning
        } else if (appToScan !== undefined && appToScan !== null) {

            //Call virus total API for scan and retrieve the report hash (MD5 one)
            const filePath = './upload/' + appToScan.hash + ".apk";

            console.log('Scan on going for application '+appToScan.id)
            const reportId = await this.virusTotalUtils.performScan(filePath, appToScan.hash);

            if (reportId !== undefined && reportId !== null) {
                //Take the last data of the object from DB, in case of editing
                appToScan = await this.androidAppService.findOne(appToScan.id.toString());
                
                appToScan.report_id = reportId;
                appToScan.on_upload = false;

                await this.androidAppService.update(appToScan);
                console.log("Application"+appToScan.id+" report in Database");

            } else {
                console.error("Failed to get report for this application hash : " + appToScan.hash);
            }
        } else {
            console.log("All applications status up to date");
        }


    }
}