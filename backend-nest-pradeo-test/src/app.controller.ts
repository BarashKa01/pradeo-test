import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('popo')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('lolo')
  getHello(): string {
    return this.appService.getHello();
  }
}