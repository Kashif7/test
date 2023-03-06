import { Injectable } from '@nestjs/common';
import { Prisma, Employee } from '@prisma/client';
import { PrismaService } from '../db/prisma.service';
import { Meta } from './meta';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  async employee(
    userWhereUniqueInput: Prisma.EmployeeWhereUniqueInput,
  ): Promise<Employee> {
    return this.prisma.employee.findUniqueOrThrow({
      where: userWhereUniqueInput,
    });
  }

  async employees(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.EmployeeWhereUniqueInput;
    where?: Prisma.EmployeeWhereInput;
    orderBy?: Prisma.EmployeeOrderByWithRelationInput;
  }): Promise<[Meta, Employee[]]> {
    const { skip, take, cursor, where, orderBy } = params;

    const skipNo = skip === undefined ? undefined : +skip;
    const takeNo = take === undefined ? undefined : +take;

    const [total, employees] = await this.prisma.$transaction([
      this.prisma.employee.count(),
      this.prisma.employee.findMany({
        skip: skipNo,
        take: takeNo,
        cursor,
        where,
        orderBy,
      }),
    ]);

    return [
      {
        currentPage: Math.floor(
          skipNo === undefined || takeNo === undefined ? 1 : skipNo / takeNo,
        ),
        totalPages: Math.ceil(takeNo === undefined ? 1 : total / takeNo),
        size: employees.length,
      },
      employees,
    ];
  }

  isUserCreateInput(body: unknown): body is Prisma.UserCreateInput {
    const b = body as Prisma.UserCreateInput;

    return b.email !== undefined && b.password !== undefined;
  }

  async createEmployee(data: Prisma.EmployeeCreateInput): Promise<Employee> {
    return this.prisma.employee.create({
      data,
    });
  }

  async updateEmployee(params: {
    employeeId: number;
    data: Prisma.EmployeeUpdateInput;
  }): Promise<Employee> {
    const { employeeId, data } = params;
    await this.prisma.employee.findUniqueOrThrow({
      where: {
        id: employeeId,
      },
    });

    return this.prisma.employee.update({
      data,
      where: {
        id: employeeId,
      },
    });
  }

  async deleteEmployee(
    where: Prisma.EmployeeWhereUniqueInput,
  ): Promise<Employee> {
    return this.prisma.employee.delete({
      where,
    });
  }
}
