import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from './customer.model';
import { CustomerDto } from './customer.dto';

@Controller('customers')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) { }

    @Post()
    createCustomer(
        @Body('fullName') fullName: string,
        @Body('id') id: string,
        @Body('address') address: string,
        @Body('phone') phone: string,
        @Body('managerId') managerId: string,
    ): CustomerDto {
        const customer = this.customerService.createCustomer(fullName, id, address, phone, managerId);
        return new CustomerDto(customer);
    }

    @Get()
    getCustomers(): CustomerDto[] {
        return this.customerService.getCustomers().map(customer => new CustomerDto(customer));
    }

    @Get(':id')
    getCustomerById(@Param('id') id: string): CustomerDto {
        const customer = this.customerService.getCustomerById(id);
        return new CustomerDto(customer);
    }

    @Put(':id')
    updateCustomer(
        @Param('id') id: string,
        @Body('fullName') fullName: string,
        @Body('address') address: string,
        @Body('phone') phone: string,
    ): CustomerDto {
        const customer = this.customerService.updateCustomer(id, fullName, address, phone);
        return new CustomerDto(customer);
    }

    @Delete(':id')
    deleteCustomer(@Param('id') id: string): void {
        this.customerService.deleteCustomer(id);
    }
}
