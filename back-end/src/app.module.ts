import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { FileModule } from './file/file.module';
import { MulterModule } from '@nestjs/platform-express';
@Module({
  imports: [
    ConfigModule.forRoot(), 
    MulterModule.register(),
    FileModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule { }
