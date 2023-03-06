import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  providers: [EmployeeService],
  controllers: [EmployeeController],
  imports: [DbModule],
})
export class EmployeeModule {}
