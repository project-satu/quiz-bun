import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ModulePackageModule } from './modules/module-package/module-package.module';
import { QuizModule } from './modules/quiz/quiz.module';
import { CategoryModule } from './modules/category/category.module';
import { MaterialModule } from './modules/material/material.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    CategoryModule,
    ModulePackageModule,
    MaterialModule,
    QuizModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
