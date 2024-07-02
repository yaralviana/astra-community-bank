import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { Manager } from './manager.model';
import { ManagerDto } from './manager.dto';
import { CustomerDto } from 'src/customer/customer.dto';
import { AccountDto } from 'src/account/account.dto';
import { CustomerService } from 'src/customer/customer.service'
import { AccountService } from 'src/account/account.service'

@Controller('managers')
export class ManagerController {
    constructor(
        private readonly managerService: ManagerService,
        private readonly customerService: CustomerService,
        private readonly accountService: AccountService,
    ) { }
    @Post()
    createManager(
        @Body('fullName') fullName: string,
    ): ManagerDto {
        const manager = this.managerService.createManager(fullName);
        return new ManagerDto(manager);
    }

    @Get()
    getManagers(): ManagerDto[] {
        return this.managerService.getManagers().map(manager => new ManagerDto(manager));
    }

    @Get(':id')
    getManagerById(@Param('id') id: string): ManagerDto {
        const manager = this.managerService.getManagerById(id);
        return new ManagerDto(manager);
    }

    @Put(':id')
    updateManager(
        @Param('id') id: string,
        @Body('fullName') fullName: string,
    ): ManagerDto {
        const manager = this.managerService.updateManager(id, fullName);
        return new ManagerDto(manager);
    }

    @Delete(':id')
    deleteManager(@Param('id') id: string): void {
        this.managerService.deleteManager(id);
    }

    @Post(':managerId/customers')
    addCustomer(
        @Param('managerId') managerId: string,
        @Body('fullName') fullName: string,
        @Body('id') id: string,
        @Body('address') address: string,
        @Body('phone') phone: string,
    ): CustomerDto {
        const manager = this.managerService.getManagerById(managerId);
        if (!manager) {
            throw new Error('Gerente não encontrado');
        }
        const customer = this.customerService.createCustomer(fullName, id, address, phone, managerId);
        manager.addCustomer(customer);
        return new CustomerDto(customer);
    }

    @Delete(':managerId/customers/:customerId')
    removeCustomer(
        @Param('managerId') managerId: string,
        @Param('customerId') customerId: string,
    ): void {
        const manager = this.managerService.getManagerById(managerId);
        if (!manager) {
            throw new Error('Gerente não encontrado');
        }
        const customer = this.customerService.getCustomerById(customerId);
        if (!customer) {
            throw new Error('Cliente não encontrado');
        }
        manager.removeCustomer(customer);
        this.customerService.deleteCustomer(customerId);
    }

    @Post(':managerId/customers/:customerId/accounts')
    openAccount(
        @Param('managerId') managerId: string,
        @Param('customerId') customerId: string,
        @Body('type') type: string,
        @Body('extra') extra: number,
    ): AccountDto {
        const manager = this.managerService.getManagerById(managerId);
        if (!manager) {
            throw new Error('Gerente não encontrado');
        }
        const customer = this.customerService.getCustomerById(customerId);
        if (!customer) {
            throw new Error('Cliente não encontrado');
        }
        if (extra <= 0) {
            throw new Error('O depósito deve ser maior que 0');
        }
        const account = this.accountService.createAccount(customer, type, extra);
        manager.openAccount(customer, account);
        return new AccountDto(account);
    }

    @Delete(':managerId/customers/:customerId/accounts/:accountType')
    closeAccount(
        @Param('managerId') managerId: string,
        @Param('customerId') customerId: string,
        @Param('accountType') accountType: string,
    ): void {
        const manager = this.managerService.getManagerById(managerId);
        if (!manager) {
            throw new Error('Gerente não encontrado');
        }
        const customer = this.customerService.getCustomerById(customerId);
        if (!customer) {
            throw new Error('Cliente não encontrado');
        }
        const account = this.accountService.getAccountById(customerId, accountType);
        if (!account) {
            throw new Error('Conta não encontrada');
        }
        manager.closeAccount(customer, account);
        this.accountService.deleteAccount(customerId, accountType);
    }

    @Put(':managerId/customers/:customerId/accounts/:accountType')
    changeAccountType(
        @Param('managerId') managerId: string,
        @Param('customerId') customerId: string,
        @Param('accountType') accountType: string,
        @Body('newType') newType: string,
    ): AccountDto {
        const manager = this.managerService.getManagerById(managerId);
        if (!manager) {
            throw new Error('Gerente não encontrado');
        }
        const customer = this.customerService.getCustomerById(customerId);
        if (!customer) {
            throw new Error('Cliente não encontrado');
        }
        const account = this.accountService.getAccountById(customerId, accountType);
        if (!account) {
            throw new Error('Conta não encontrada');
        }
        manager.changeAccountType(customer, account, newType);
        account.type = newType;
        return new AccountDto(account);
    }

    @Get(':managerId/customers')
    getCustomers(@Param('managerId') managerId: string): CustomerDto[] {
        const manager = this.managerService.getManagerById(managerId);
        if (!manager) {
            throw new Error('Gerente não encontrado');
        }
        return manager.customers.map(customer => new CustomerDto(customer));
    }

    @Get(':managerId/customers/:customerId/accounts')
    getAccounts(@Param('managerId') managerId: string, @Param('customerId') customerId: string): AccountDto[] {
        const manager = this.managerService.getManagerById(managerId);
        if (!manager) {
            throw new Error('Gerente não encontrado');
        }
        const customer = this.customerService.getCustomerById(customerId);
        if (!customer) {
            throw new Error('Cliente não encontrado');
        }
        return customer.accounts.map(account => new AccountDto(account));
    }
}

