import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [DbModule, UserModule, AuthModule, EmployeeModule],
})
export class AppModule {}
