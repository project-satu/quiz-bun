import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ModulePackageModule } from './modules/module-package/module-package.module';
import { QuizModule } from './modules/quiz/quiz.module';
import { CategoryModule } from './modules/category/category.module';
import { MaterialModule } from './modules/material/material.module';
import { TagModule } from './modules/tag/tag.module';

@Module({
  imports: [
    CategoryModule,
    TagModule,
    ModulePackageModule,
    MaterialModule,
    QuizModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
