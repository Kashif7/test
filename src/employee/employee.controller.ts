import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';

function timeout(duration: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

@Controller('employees')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  @Get('/')
  async getEmployees(@Query() req) {
    console.log('COMES');
    const [meta, employees] = await this.employeeService.employees(req);

    await timeout(1000);

    return {
      status: 'success',
      meta,
      data: employees,
    };
  }

  @Get('/:id')
  async getEmployee(@Param() params: { id: string }) {
    try {
      const employee = await this.employeeService.employee({
        id: +params.id,
      });

      return {
        status: 'success',
        data: employee,
      };
    } catch (e) {
      throw new HttpException('Employee Not Found', HttpStatus.NOT_FOUND);
    }
  }

  @Post('/')
  async addEmployee(@Body() req) {
    console.log('request', req);
    await timeout(1000);

    return this.employeeService.createEmployee({
      ...req,
      photo:
        'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    });
  }

  @Patch('/:id')
  async updateEmployee(@Param() params: { id: string }, @Body() body) {
    try {
      const employee = await this.employeeService.updateEmployee({
        employeeId: +params.id,
        data: body,
      });

      await timeout(1000);

      return {
        status: 'success',
        data: employee,
      };
    } catch (e) {
      throw new HttpException('Employee Not Found', HttpStatus.NOT_FOUND);
    }
  }

  @Delete('/:id')
  async deleteEmployee(@Param() params: { id: string }, @Body() body) {
    try {
      await this.employeeService.deleteEmployee({
        id: +params.id,
      });

      await timeout(1000);

      return {
        status: 'success',
      };
    } catch (e) {
      throw new HttpException('Employee Not Found', HttpStatus.NOT_FOUND);
    }
  }
}
