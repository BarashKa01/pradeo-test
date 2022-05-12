
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AndroidApp } from './android-app.entity';

@Injectable()
export class AndroidAppsService {
  constructor(
    @InjectRepository(AndroidApp)
    private androidAppRepository: Repository<AndroidApp>,
  ) {}

  create(androidApp: AndroidApp): Promise<AndroidApp> {
    return this.androidAppRepository.save(androidApp);
  }

  updateStatus(androidApp: AndroidApp): Promise<AndroidApp> {
    return this.androidAppRepository.save(androidApp);
  }

  findAllByUser(userId: string): Promise<AndroidApp[]> {
    return this.androidAppRepository.find({where: {user: userId}});
  }

  findAll(): Promise<AndroidApp[]> {
    return this.androidAppRepository.find();
  }

  findOne(id: string): Promise<AndroidApp> {
    return this.androidAppRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.androidAppRepository.delete(id);
  }
}