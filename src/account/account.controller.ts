import { Controller, Get, Put, Post, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AccountService } from './account.service';
import { CustomerService } from 'src/customer/customer.service';
import { AccountDto } from './account.dto';

@Controller('accounts')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly customerService: CustomerService,
  ) {}

  @Post()
  async createAccount(
    @Body('customerId') customerId: string,
    @Body('type') type: string,
    @Body('extra') extra: number,
  ): Promise<AccountDto> {
    try {
      const customer = await this.customerService.getCustomerById(customerId);
      if (!customer) {
        throw new HttpException('Cliente não encontrado', HttpStatus.NOT_FOUND);
      }
      const account = await this.accountService.createAccount(customer, type, extra);
      return new AccountDto(account);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':customerId/:type')
  async getAccountById(
    @Param('customerId') customerId: string,
    @Param('type') type: string,
  ): Promise<AccountDto> {
    try {
      const account = await this.accountService.getAccountById(customerId, type);
      if (!account) {
        throw new HttpException('Conta não encontrada', HttpStatus.NOT_FOUND);
      }
      return new AccountDto(account);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':customerId/:type')
  async deleteAccount(
    @Param('customerId') customerId: string,
    @Param('type') type: string,
  ): Promise<void> {
    try {
      await this.accountService.deleteAccount(customerId, type);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':customerId/:type')
  async updateAccountType(
    @Param('customerId') customerId: string,
    @Param('type') type: string,
    @Body('newType') newType: string,
  ): Promise<AccountDto> {
    try {
      const account = await this.accountService.getAccountById(customerId, type);
      if (!account) {
        throw new HttpException('Conta não encontrada', HttpStatus.NOT_FOUND);
      }
      account.type = newType;
      return new AccountDto(account);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
