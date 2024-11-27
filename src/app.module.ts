import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ModulePackageModule } from './modules/module-package/module-package.module';
import { QuizModule } from './modules/quiz/quiz.module';

@Module({
  imports: [
    ModulePackageModule,
    QuizModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
