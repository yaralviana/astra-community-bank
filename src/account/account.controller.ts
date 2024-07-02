import { Controller, Get, Put, Post, Delete, Param, Body } from '@nestjs/common';
import { AccountService } from './account.service';
import { CustomerService } from 'src/customer/customer.service';
import { AccountDto } from './account.dto';

@Controller('accounts')
export class AccountController {
    constructor(
        private readonly accountService: AccountService,
        private readonly customerService: CustomerService,
    ) { }

    @Post()
    createAccount(
        @Body('customerId') customerId: string,
        @Body('type') type: string,
        @Body('extra') extra: number,
    ): AccountDto {
        const customer = this.customerService.getCustomerById(customerId);
        if (!customer) {
            throw new Error('Cliente não encontrado');
        }
        const account = this.accountService.createAccount(customer, type, extra);
        return new AccountDto(account);
    }
    @Get(':customerId/:type')
    getAccountById(
        @Param('customerId') customerId: string,
        @Param('type') type: string,
    ): AccountDto {
        const account = this.accountService.getAccountById(customerId, type);
        if (!account) {
            throw new Error('Conta não encontrada');
        }
        return new AccountDto(account);
    }
    @Delete(':customerId/:type')
    deleteAccount(
        @Param('customerId') customerId: string,
        @Param('type') type: string,
    ): void {
        this.accountService.deleteAccount(customerId, type);
    }

    @Put(':customerId/:type')
    updateAccountType(
        @Param('customerId') customerId: string,
        @Param('type') type: string,
        @Body('newType') newType: string,
    ): AccountDto {
        const account = this.accountService.getAccountById(customerId, type);
        if (!account) {
            throw new Error('Conta não encontrada');
        }
        account.type = newType;
        return new AccountDto(account);
    }
}