import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { CustomerService } from '../../domain/services/customer.service';
import { CustomerDto } from '../dto/customer.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async createCustomer(
    @Body('fullName') fullName: string,
    @Body('id') id: string,
    @Body('address') address: string,
    @Body('phone') phone: string,
    @Body('managerId') managerId: string,
  ): Promise<CustomerDto> {
    try {
      const customer = await this.customerService.createCustomer(fullName, id, address, phone, managerId);
      return new CustomerDto(customer);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async getCustomers(): Promise<CustomerDto[]> {
    try {
      const customers = await this.customerService.getCustomers();
      return customers.map(customer => new CustomerDto(customer));
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async getCustomerById(@Param('id') id: string): Promise<CustomerDto> {
    try {
      const customer = await this.customerService.getCustomerById(id);
      if (!customer) {
        throw new HttpException('Cliente não encontrado', HttpStatus.NOT_FOUND);
      }
      return new CustomerDto(customer);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async updateCustomer(
    @Param('id') id: string,
    @Body('fullName') fullName: string,
    @Body('address') address: string,
    @Body('phone') phone: string,
  ): Promise<CustomerDto> {
    try {
      const customer = await this.customerService.updateCustomer(id, fullName, address, phone);
      if (!customer) {
        throw new HttpException('Cliente não encontrado', HttpStatus.NOT_FOUND);
      }
      return new CustomerDto(customer);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async deleteCustomer(@Param('id') id: string): Promise<void> {
    try {
      await this.customerService.deleteCustomer(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}