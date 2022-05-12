import { Injectable } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { AndroidApp } from "src/apps/android-app.entity";
import { AndroidAppsService } from "src/apps/android-apps.service";
import { performScan, checkReport } from "src/utils/virus-total.utils";

@Injectable()
export class CheckAppEvent {
    constructor(private eventEmitter: EventEmitter2, private androidAppService: AndroidAppsService) { }

    emitDoScan(payload: Object) {
        this.eventEmitter.emit('app.doScan', payload)
    }

    emitCheckReport(payload: Object) {
        this.eventEmitter.emit('app.checkReport', payload)
    }

    emitUpdateStatus(payload: Object) {
        this.eventEmitter.emit('app.updateStatus', payload)
    }

    emitStatusUpdated(payload: Object) {
        this.eventEmitter.emit('app.statusUpdated', payload)
    }

    @OnEvent('app.doScan')
    performScan(payload: any) {
        
        setTimeout(async () => {
            console.log('Scanning on going...')
            const reportId = await performScan(payload.filePath)
            payload.reportId = reportId;
            //console.log(payload);
            this.emitCheckReport(payload);
        }, 15000);
    }

    @OnEvent('app.checkReport')
    checkReport(payload: any) {

        setTimeout(async () => {
            console.log("Checking report....");
            const appScore = await checkReport(payload.reportId)
            if (appScore === 0) {
                payload.app.is_safe = true;
            } else {
                payload.app.is_safe = false;
            }
            payload.app.is_verified = true;
            this.emitUpdateStatus(payload.app);
        }, 15000);
    }

    @OnEvent('app.updateStatus')
    async updateAppStatus(checkedApp: AndroidApp) {
       await this.androidAppService.updateStatus(checkedApp);
       console.log("updated in Database");
       const updateOnGoing: boolean = true;
        //handled in the "app controller" route
        this.emitStatusUpdated(checkedApp);
    }
}